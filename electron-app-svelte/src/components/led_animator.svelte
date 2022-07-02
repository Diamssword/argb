<script>
export var comps;
export var indexes=[];
export var nbLeds=17;
export var fps=30;
export var program=0;
import {animations,Emulation} from "../../build/AnimationsList";
var leds;
var emul = new Emulation();
$:if(nbLeds && !isNaN(nbLeds) && nbLeds>0)
    leds=Array(nbLeds).fill({hue:255,value:255,saturation:100});
    emul.emulVars.colors[0] = {hue:220,value:255,saturation:255};
    emul.emulVars.colors[1] = {hue:81,value:255,saturation:255};

var oldInterval;
$:if(fps || program)
{
    let obj= animations[0];
    for(let  d in animations)
    {
        if(animations[d].code==program)
        obj=animations[d];
    }
    if(oldInterval)
    clearInterval(oldInterval)
    oldInterval=setInterval(()=>{
        emul[obj.func](leds);
        leds=leds;
    },1000/fps);   
}
var parts=[];
$:if(leds)
{
    for(let k in comps)
    {
       
         let ob= indexes[k];
        if(ob)
        {  
            let d = [...leds]
        parts[k]=  d.splice(ob.start,ob.length);;
        }
        else
        parts[k]= leds;
    }
}

</script>
{#each comps as comp,i }
<svelte:component this={comp} leds={parts[i]}></svelte:component>    
{/each}