<script>
    
    import { createEventDispatcher } from 'svelte';
    import { Badge } from '@svelteuidev/core';
    
const dispatch = createEventDispatcher();
    var ports = [];
    export var autoConnect=true;
    export var selected;
    $: if (selected) {
        if (selected) window.send("Serial.connect", selected);
    }
    window.send("Serial.ports");
    window.receive("Serial.ports", (res) => {
        ports = res.ports;
        if(autoConnect==false)
        {
            return;
        }
        if (res.selected) {
            selected = res.selected;
            if(selected == "None")
            dispatch("connected",{disconnect:true,infos:ports[selected]});
            else
            dispatch("connected",{port:selected,infos:ports[selected]});
        }
        
    });
    window.receive("Serial.state", (res) => {
        if(res.connected)
        {
            msg="Connected to "+res.connected
                iserr=false;
                if(res.connected == "None")
                dispatch("connected",{disconnect:true,infos:ports[selected]});
            else
            dispatch("connected",{port:res.connected,infos:ports[selected]});
        }
    });
    window.receive("Serial.error", (res) => {
        if(res.error=='open')
        {
            if(res.port=="None")
            {
                msg="Not connected"
                iserr=true;
            }
            else
            {
                msg="Can't connect to "+res.port
                iserr=true;
            }
        }
        else
        {
            msg="Error"
            iserr=true;
        }
        
    });
    var msg="Not connected"
    var iserr=true;
</script>
<div>
<div class="parent">
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
      <Badge color={iserr==true?"red":"green"} radius="xs" fullWidth="true">
        {msg}
      </Badge>
    </div>
</div>
</div>

<style>
    .parent{
        display: inline-block;
    }
    .icon {
       
       
        margin-top: -10px;
        margin-bottom: 30px;
    }
 
</style>
