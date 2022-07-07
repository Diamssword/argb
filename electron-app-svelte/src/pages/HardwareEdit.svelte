<script>
    import { Button, TextInput } from "@svelteuidev/core";
    import { ActionIcon } from "@svelteuidev/core";
    import Icon from "../components/icons.svelte";
    import {
        Hardware,
        TYPES,
        VirtualHardware,
        getCommand,
    } from "../../build/Hardwares";
    import PortSelect from "../components/portSelect.svelte";
    import HardwareComp from "../components/hadware.svelte";
    import { portal } from "@svelteuidev/composables";
    var profileID;
    var profileList = [];
    var hardwares = [];
    var vHardwares = [];
    var connections = [];

    $: if (profileID && profileList.length > 0) {
        
            window.send("hardware.request", profileID);
    }
    window.receive("hardware.request", (args) => {
        vHardwares = [];
        hardwares = [];
        connections = [];
        for (let d in args) {
            let a = new VirtualHardware("", "");
            vHard.fromObject(args[d]);
            vHardwares.push(a);

            hardwares.push(...vHard.composition);
            
        }
        for (let k = 0; k < hardwares.length; k++) {
            if (hardwares[k].linkedBefore == true) {
                if (k - 1 >= 0) connections[k - 1] = true;
            }
        }
        connections = [...connections];
        if (hardwares.length == 0)
            hardwares.push(new Hardware(0, "default0", 0, TYPES.fan));
    });
    window.send("hardware.profiles");
    window.receive("hardware.profiles", (args) => {
        profileList = args;
        if (profileList.length <= 0)
            window.send("hardware.editProfile", {operation: "new",name: "myHardware"});
        else
        {
            
            profileID = profileList[0];
        }
    });
    window.receive("hardware.editProfile", (args) => {
        if (args.operation == "new") {
            profileList.push(args.name);
            profileID = args.name;
        }
    });
function createProfile()
{
    window.send("hardware.editProfile", {
                operation: "new",
                name: "myHardware",
            });
}
    function save() {
        for (let k = 0; k < hardwares.length; k++) {
            var h = hardwares[k];
            if (connections[k - 1] == true) {
                h.linkedBefore = true;
            }
            window.send("hardware.save", hardwares);
            window.send("vhardware.request");
        }
    }
    window.receive("vhardware.request", (res) => {
        let temp = [];
        for (let d in res) {
            temp.push(new VirtualHardware("").fromObject(res[d]));
        }
        window.send("Serial.send", getCommand(temp));
    });
</script>

<h3>Profile</h3>
<select bind:value={profileID}>
    {#each profileList as prof}
        <option value={prof}>{prof}</option>
    {/each}
</select>
<Button variant="outline" color="yellow" radius="xl" size="md" ripple on:click={createProfile}>+New</Button>
<hr />
<TextInput description="Name" value={profileID}/>
Port:
<PortSelect />
<div>
    {#each hardwares as hard, i}
        <HardwareComp bind:hardware={hardwares[i]} />
        {#if i < hardwares.length - 1}
            <div class="wrapper">
                <div class="first">
                    <ActionIcon
                        variant="outline"
                        color="yellow"
                        on:click={() => {
                            connections[i] =
                                connections[i] == true ? false : true;
                        }}
                    >
                        <Icon
                            name={connections[i] == true
                                ? "git-commit"
                                : "more-horizontal"}
                            direction="e"
                        />
                    </ActionIcon>
                </div>
                <div class="second">
                    <hr />
                </div>
            </div>
        {/if}
    {/each}
    <Button
        variant="outline"
        color="yellow"
        radius="xl"
        size="md"
        ripple
        on:click={() => {
            hardwares = [
                ...hardwares,
                new Hardware(
                    hardwares.length,
                    "default" + hardwares.length,
                    0,
                    TYPES.fan
                ),
            ];
        }}>+</Button
    >
    <Button
        variant="outline"
        color="yellow"
        radius="xl"
        size="md"
        ripple
        on:click={save}>Save</Button
    >
</div>

<style>
    .wrapper {
        width: 100%;
        overflow: auto; /* so the size of the wrapper is alway the size of the longest content */
    }
    .first {
        float: left;
        width: 30px;
    }
    .second {
        margin-top: 12px;
    }
</style>
