<script>
    import { Button } from "@svelteuidev/core";

    
    import AnimatorComp from "../components/animator.svelte";
    import {LedAnimation} from "../../build/Animations"
    import {VirtualHardware} from "../../build/Hardwares"
    var hardwares = [];
    var animations={};
    window.send("vhardware.request")
    window.receive("vhardware.request",(res)=>{
        
        fillAnimations(res)
        hardwares=[];
        for(let d in res)
        {
            hardwares.push(new VirtualHardware("").fromObject(res[d]));
        }
        
    })
    window.send("animations.request")
    window.receive("animations.request",(res)=>{
      if(res)
      {
        animations={};
        for(let d in res)
        {
            animations[d]=new LedAnimation("").fromObject(res[d]);
        }
        fillAnimations(hardwares);
      }
        
    })
    function sendTo(hard,pos)
    {
        
       console.log(animations[hard.name].setSave(true).getCommand(pos))
    window.send("Serial.send",animations[hard.name].setSave(true).getCommand(pos));
    }
    window.receive("Serial.receive",(res)=>{
        console.log(res)
    })
   function fillAnimations(hard)
   {
    for(let k in hard)
        {
            let d= hard[k];
            
            if(!animations[d.name])
            {
                animations[d.name]= new LedAnimation("default"+k);
            }
        }
}
function save(id)
{
    window.send("animation.save",{hardware:id,anim:animations[id]})
}
</script>

<div>
    {#each hardwares as hard, i}
    <h2 style="margin-left:10%">{hard.name}</h2>
        <AnimatorComp bind:hardware={hardwares[i]} bind:animation={animations[hard.name]}/>
        
    <Button variant="outline" color="yellow" radius="xl" size="md"ripple on:click={()=>{save(hard.name)}} >Save</Button>
     <Button variant="outline" color="yellow" radius="xl" size="md"ripple on:click={()=>{sendTo(hard,i)}} >Keep</Button>
        {#if i < hardwares.length - 1}
          <hr>
        {/if}
    {/each}
</div>

