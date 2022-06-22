<script>
export var comp;
export var nbLeds=17;
import {animations,Emulation} from "../../build/AnimationsList";
var leds;
var emul = new Emulation();
$:if(nbLeds)
    leds=Array(nbLeds).fill({hue:255,value:255,saturation:100});
    emul.emulVars.colors[0] = {hue:220,value:255,saturation:255};
    emul.emulVars.colors[1] = {hue:81,value:255,saturation:255};
export var fps =20;
var oldInterval;
$:if(fps)
{
    if(oldInterval)
    clearInterval(oldInterval)
    oldInterval=setInterval(()=>{
        emul[animations[1].func](leds);
        leds=leds;
    },1000/fps);
}

</script>
<svelte:component this={comp} leds={leds}></svelte:component>