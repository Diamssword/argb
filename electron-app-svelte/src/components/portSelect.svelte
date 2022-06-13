<script>
    import { NativeSelect } from "@svelteuidev/core";
    import Icons from './icons.svelte';
    var ports = [];
    var connected;
    var portsName = ["--Selectioner un port--"];
    var selected;

    $:if(selected)
    {
        if(selected)
            window.send("Serial.connect",selected);
    }
    window.send("Serial.ports");
   
    window.receive("Serial.ports", (res) => {
       
        var r = res.ports;
        ports=r;
        portsName = ["--Selectioner un port--"];
        for(let k in ports)
        {
            portsName.push({label:ports[k].path+":"+ports[k].friendlyName,value:ports[k].path});
        }
        if(res.selected)
        {
            selected = res.selected;
        }
        refresher = asyncwait();
    });
let refresher= asyncwait();
    async function asyncwait() {
		return;
	}
</script>


{#await refresher}
    <p>Chargement</p>
{:then ui} 
<div class="cont">
<NativeSelect
bind:value={selected}
data={portsName}
size="md"
placeholder="Pick one"
label="Port:"
/>  
<div class="icon" style="">
    {#if selected && selected != "--Selectioner un port--"}
<Icons name="download" direction="w" height="100%"></Icons>
{/if}
</div>
</div>
{/await}

<style>

.icon{
    width:20%; 
    padding:10px; 
    margin-top: 5%;    
}
.cont{
    width: 95%;
    float:left;
    display: flex;
}
</style>