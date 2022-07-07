<script>
    import Icons from "./icons.svelte";import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
    var ports = [];
    var selected;
    $: if (selected) {
        if (selected) window.send("Serial.connect", selected);
    }
    window.send("Serial.ports");

    window.receive("Serial.ports", (res) => {
        ports = res.ports;
        if (res.selected) {
            selected = res.selected;
            dispatch("connected",{port:selected,infos:ports[selected]});
        }
        
    });
 
</script>

<div>
    <select bind:value={selected}>
        <option >None</option>
        {#each ports as port}
            <option
                selected={selected == ports.path
                    ? "true"
                    : "false"}
                value={port.path}>{port.path + ":" + port.friendlyName}</option
            >
        {/each}
    </select>
    <div class="icon" style="">
        {#if selected && selected != "None"}
            <Icons name="download" direction="w" height="100%" />
        {/if}
    </div>
</div>

<style>
    .icon {
        width: 20%;
        padding: 10px;
        margin-top: 5%;
    }
    .cont {
        width: 95%;
        float: left;
        display: flex;
    }
</style>
