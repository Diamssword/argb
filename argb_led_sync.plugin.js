/**
 * @name ARGBLedSync
 * @author Diamssword
 * @authorId 278543574059057154
 * @version 0.1
 * @description Adds a Clear Button to the Server List and the Mentions Popout
 * @invite  
 * @donate https://www.paypal.me/MircoWittrien
 * @patreon https://www.patreon.com/MircoWittrien
 * @website https://mwittrien.github.io/
 * @source https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/ReadAllNotificationsButton/
 * @updateUrl https://mwittrien.github.io/BetterDiscordAddons/Plugins/ReadAllNotificationsButton/ReadAllNotificationsButton.plugin.js
 */

const fs = require("fs");
const os = require("os");
const path =require('path');
const tempFile = path.join(os.tmpdir(),"ARGBLedSync.txt");
 module.exports = (_ => {
	const config = {
		"info": {
			"name": "ARGBLedSync",
			"author": "Diamssword",
			"version": "0.1",
			"description": "Send a argb instruction when a new mentions is received"
		}
	};

	return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
		getName () {return config.info.name;}
		getAuthor () {return config.info.author;}
		getVersion () {return config.info.version;}
		getDescription () {return `The Library Plugin needed for ${config.info.name} is missing. Open the Plugin Settings to download it. \n\n${config.info.description}`;}
		
		downloadLibrary () {
			require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
				if (!e && b && r.statusCode == 200) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => BdApi.showToast("Finished downloading BDFDB Library", {type: "success"}));
				else BdApi.alert("Error", "Could not download BDFDB Library Plugin. Try again later or download it manually from GitHub: https://mwittrien.github.io/downloader/?library");
			});
		}
		
		load () {
			if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {pluginQueue: []});
			if (!window.BDFDB_Global.downloadModal) {
				window.BDFDB_Global.downloadModal = true;
				BdApi.showConfirmationModal("Library Missing", `The Library Plugin needed for ${config.info.name} is missing. Please click "Download Now" to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onCancel: _ => {delete window.BDFDB_Global.downloadModal;},
					onConfirm: _ => {
						delete window.BDFDB_Global.downloadModal;
						this.downloadLibrary();
					}
				});
			}
			if (!window.BDFDB_Global.pluginQueue.includes(config.info.name)) window.BDFDB_Global.pluginQueue.push(config.info.name);
		}
		start () {this.load();
        
        
        }
		stop () {}
		getSettingsPanel () {
			let template = document.createElement("template");
			template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${config.info.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
			template.content.firstElementChild.querySelector("a").addEventListener("click", this.downloadLibrary);
			return template.content.firstElementChild;
		}
	} : (([Plugin, BDFDB]) => {
		var _this;
		var blacklist, clearing;
		var numberOfMessages=0;
		
		
	
		return class ARGBLedSync extends Plugin {
			onLoad () {
				_this = this;
				
				this.defaults = {
					general: {
						addClearButton:		{value: true, 	description: "Add a 'Clear Mentions' button to the recent mentions popout"},
						confirmClear:		{value: false, 	description: "Ask for your confirmation before clearing reads"}
					},
					batch: {
                        mentions:				{value: true, 	description: "unread Mentions"},
						guilds:				{value: true, 	description: "unread Servers"},
						muted:				{value: false, 	description: "muted unread Servers"},
						dms:				{value: true, 	description: "unread DMs"}
					}
				};
				
				this.patchedModules = {
					after: {
						Guilds: "type",
						RecentMentions: "default",
						RecentsHeader: "default"
					}
				};
				
				this.css = `
					${BDFDB.dotCN.messagespopouttabbar} {
						flex: 1 0 auto;
					}
					${BDFDB.dotCN.messagespopoutcontrols} {
						display: flex;
					}
					${BDFDB.dotCN.messagespopoutcontrols} > * {
						margin-left: 10px;
					}
					${BDFDB.dotCN._readallnotificationsbuttonframe} {
						height: 24px;
						margin-bottom: 10px;
					}
					${BDFDB.dotCN._readallnotificationsbuttonframe}:active {
						transform: translateY(1px);
					}
					${BDFDB.dotCN._readallnotificationsbuttoninner} {
						height: 24px;
					}
					${BDFDB.dotCN._readallnotificationsbuttonbutton} {
						border-radius: 4px;
						height: 24px;
						font-size: 12px;
						line-height: 1.3;
						white-space: nowrap;
						cursor: pointer;
					}
				`;
			}
            writeFile(count)
            {
                try{
					let res=JSON.stringify({count:count});
                    var msg = "DiscordPings:"+res+"\n";
                if(!fs.existsSync(tempFile))
                {
                    fs.writeFileSync(tempFile,msg);
                   
                }
                else
                {
                fs.appendFileSync(tempFile,msg);
                }
            }catch{}
                
            }
			onStart () {
				let loadedBlacklist = BDFDB.DataUtils.load(this, "blacklist");
				this.saveBlacklist(!BDFDB.ArrayUtils.is(loadedBlacklist) ? [] : loadedBlacklist);

				this.forceUpdateAll();
                function getGuilds() {
                    return BDFDB.LibraryModules.FolderStore.getFlattenedGuilds().map(g => g.id).filter(n => n);
                }
                var settings= this.settings;
              
               var $=this;
               function check()
               {
             
                var oldNumber = numberOfMessages;
                numberOfMessages=0;
                getGuilds().forEach((v)=>{
                    
                    numberOfMessages+=BDFDB.LibraryModules.UnreadGuildUtils.getMentionCount(v)
                })
                BDFDB.LibraryModules.ChannelStore.getSortedPrivateChannels().map(c => c.id).forEach((v)=>{
                    numberOfMessages+=  BDFDB.LibraryModules.UnreadChannelUtils.getMentionCount(v)
                })
                if(numberOfMessages>oldNumber)
                {
                    $.writeFile(numberOfMessages-oldNumber);
                }
                setTimeout(check,500)
               }
               check()
               
			}
			
			onStop () {
                clearTimeout();
				this.forceUpdateAll();
			}

			getSettingsPanel (collapseStates = {}) {
				let settingsPanel, settingsItems = [];
				
				settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.CollapseContainer, {
					title: "Settings",
					collapseStates: collapseStates,
					children: Object.keys(this.defaults.general).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
						type: "Switch",
						plugin: this,
						keys: ["general", key],
						label: this.defaults.general[key].description,
						value: this.settings.general[key]
					})).concat(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsPanelList, {
						title: "Enable colorChangeFor:",
						first: false,
						last: true,
						children: Object.keys(this.defaults.batch).map(key => BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsSaveItem, {
							type: "Switch",
							plugin: this,
							keys: ["batch", key],
							label: this.defaults.batch[key].description,
							value: this.settings.batch[key]
						}))
					}))
				}));
				
				settingsItems.push(BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.CollapseContainer, {
					title: "Server Black List",
					collapseStates: collapseStates,
					children: [
						BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsGuildList, {
							className: BDFDB.disCN.marginbottom20,
							disabled: BDFDB.DataUtils.load(this, "blacklist"),
							onClick: disabledGuilds => this.saveBlacklist(disabledGuilds)
						}),
						BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsItem, {
							type: "Button",
							color: BDFDB.LibraryComponents.Button.Colors.GREEN,
							label: "Enable for all Servers",
							onClick: _ => this.batchSetGuilds(settingsPanel, collapseStates, true),
							children: BDFDB.LanguageUtils.LanguageStrings.ENABLE
						}),
						BDFDB.ReactUtils.createElement(BDFDB.LibraryComponents.SettingsItem, {
							type: "Button",
							color: BDFDB.LibraryComponents.Button.Colors.PRIMARY,
							label: "Disable for all Servers",
							onClick: _ => this.batchSetGuilds(settingsPanel, collapseStates, false),
							children: BDFDB.LanguageUtils.LanguageStrings.DISABLE
						})
					]
				}));
				
				return settingsPanel = BDFDB.PluginUtils.createSettingsPanel(this, settingsItems);
			}

			onSettingsClosed () {
				if (this.SettingsUpdated) {
					delete this.SettingsUpdated;
					this.forceUpdateAll();
				}
			}
		
			forceUpdateAll () {
				BDFDB.PatchUtils.forceAllUpdates(this);
				BDFDB.GuildUtils.rerenderAll();
			}
			
			processGuilds (e) {
				//let [children, index] = BDFDB.ReactUtils.findParent(e.returnvalue, {name: "UnreadDMs"});
				//if (index > -1) children.splice(index + 1, 0, BDFDB.ReactUtils.createElement(ReadAllButtonComponent, {}));
			}

			processRecentMentions (e) {
              
			}

			processRecentsHeader (e) {
			
			}
			
			batchSetGuilds (settingsPanel, collapseStates, value) {
				if (!value) {
					for (let id of BDFDB.LibraryModules.FolderStore.getFlattenedGuildIds()) blacklist.push(id);
					this.saveBlacklist(BDFDB.ArrayUtils.removeCopies(blacklist));
				}
				else this.saveBlacklist([]);
				BDFDB.PluginUtils.refreshSettingsPanel(this, settingsPanel, collapseStates);
			}
			
			saveBlacklist (savedBlacklist) {
				blacklist = savedBlacklist;
				BDFDB.DataUtils.save(savedBlacklist, this, "blacklist");
			}
		};
	})(window.BDFDB_Global.PluginUtils.buildPlugin(config));
})();