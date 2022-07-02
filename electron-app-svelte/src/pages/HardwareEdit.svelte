<script>
    import { Button } from "@svelteuidev/core";
    import { ActionIcon } from "@svelteuidev/core";
    import Icon from "../components/icons.svelte";
    import { Hardware, TYPES,VirtualHardware,getCommand } from "../../build/Hardwares";
    import HardwareComp from "../components/hadware.svelte";
    var hardwares = [];
    var connections = [];

    window.send("hardware.request","individuals")
    window.receive("hardware.request",(res)=>{
     
        hardwares=res;
        if(hardwares.length==0)
        hardwares.push(new Hardware(0, "default0", 0, TYPES.fan));
        connections=[];
        for(let k =0;k<hardwares.length;k++)
        {
            if(hardwares[k].linkedBefore==true)
            {
                if(k-1>=0)
                connections[k-1]=true;
            }
        }
        connections= [...connections];
    })
    function save() {
        for (let k = 0; k < hardwares.length; k++) {
            var h = hardwares[k];
            if (connections[k - 1] == true) {
                h.linkedBefore = true;
            }
            if (connections[k] == true) {
                h.linkedAfter = true;
            }
            window.send("hardware.save",hardwares);
            window.send("vhardware.request");
        }
    }
    window.receive("vhardware.request",(res)=>{
    
       let temp=[];
        for(let d in res)
        {
            temp.push(new VirtualHardware("").fromObject(res[d]));
        }
        window.send("Serial.send",getCommand(temp));
        
    })
</script>

<div>
    {#each hardwares as hard, i}
        <HardwareComp bind:hardware={hardwares[i]} />
        {#if i < hardwares.length - 1}
            <div class="wrapper">
                <div class="first">
                    <ActionIcon variant="outline"  color="yellow"  on:click={() => {   connections[i] =  connections[i] == true ? false : true;  }} >
                        <Icon  name={connections[i] == true?"git-commit":"more-horizontal"} direction="e"/>
                    </ActionIcon>
                </div>
                <div class="second">
                    <hr/>
                </div>
            </div>
        {/if}
    {/each}
    <Button variant="outline"color="yellow" radius="xl" size="md"ripple 
    on:click={() => {hardwares = [ ...hardwares, new Hardware(hardwares.length,  "default" + hardwares.length,0, TYPES.fan),];}}>+</Button>
    <Button variant="outline" color="yellow" radius="xl" size="md"ripple on:click={save}>Save</Button>
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
