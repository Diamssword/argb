"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCurrent = exports.getCurrent = exports.init = void 0;
var Animations_1 = require("./Animations");
var storage_1 = require("./storage");
var electron_1 = require("electron");
var store = new storage_1.StorageInstance("temp", "temp");
var hardwareStore = new storage_1.StorageInstance("temp", "temp");
function init(window) {
    store = new storage_1.StorageInstance("profile");
    hardwareStore = new storage_1.StorageInstance("hardwares");
    electron_1.ipcMain.on("hardware.save", function (ev, args) {
        hardwareStore.set(args.name, args.hard);
    });
    electron_1.ipcMain.on("hardware.request", function (ev, args) {
        var d = hardwareStore.get(args);
        if (!d)
            d = [];
        ev.reply("hardware.request", d);
    });
    electron_1.ipcMain.on("hardware.profiles", function (ev, args) {
        var d = hardwareStore.getAll();
        if (!d)
            d = {};
        ev.reply("hardware.profiles", Object.keys(d));
    });
    electron_1.ipcMain.on("hardware.editProfile", function (ev, args) {
        var pr = args.name;
        var op = args.operation;
        if (op == "new") {
            var i = 1;
            while (hardwareStore.get(pr + "" + i)) {
                i++;
            }
            hardwareStore.set(pr + "" + i, []);
            ev.reply("hardware.editProfile", { operation: "new", name: pr + "" + i });
        }
        else if (op == "rename") {
            var a = hardwareStore.get(pr);
            var b = hardwareStore.get(args.rename);
            if (a && !b) {
                hardwareStore.delete(pr);
                hardwareStore.set(args.rename, a);
            }
            else {
                ev.reply("hardware.editProfile", { operation: "rename", error: "CANT" });
            }
        }
        else if (op == "delete") {
            hardwareStore.delete(pr);
        }
    });
    electron_1.ipcMain.on("vhardware.request", function (ev, args) {
        ev.reply("vhardware.request");
    });
    electron_1.ipcMain.on("animation.save", function (ev, args) {
        var anim = store.get("animations");
        if (anim == undefined)
            anim = {};
        anim[args.hardware] = args.anim;
        store.set("animations", anim);
    });
    electron_1.ipcMain.on("animations.request", function (ev, args) {
        var d = store.get("animations");
        if (!d) {
            d = {};
        }
        ev.reply("animations.request", d);
    });
}
exports.init = init;
/*export function getHardwareList()
{
var d : unknown =store.get("hardware");

let res:VirtualHardware[]= [] ;
if(d != null)
{
    let h = d as Hardware[];
    var lastIndex=-1;
    for(var k=0;k< h.length;k++)
    {
        if(h[k].linkedBefore==true)
        {
            if(!res[lastIndex])
            {
            res[lastIndex]= new VirtualHardware(h[k].name);
            }
            res[lastIndex].addHardware(h[k])
        }
        else
        {
            lastIndex++;
            res[lastIndex] = new VirtualHardware(h[k].name);
            res[lastIndex].addHardware(h[k]);
           
        }
    
    }
}
    return res;
}
*/
function getCurrent() {
    var str = store.get("current");
    return new Animations_1.LedAnimation("d").formJson(str);
}
exports.getCurrent = getCurrent;
function setCurrent(animation) {
    store.set("current", animation);
}
exports.setCurrent = setCurrent;
