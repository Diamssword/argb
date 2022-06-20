<script>
import LedFan from './led_fan.svelte'
import LedStrip from './led_strip.svelte'

import {animations,emulVars} from "../../build/AnimationsList";
var leds= Array(17).fill({hue:255,value:255,saturation:100});
emulVars.colors[0] = {hue:220,value:255,saturation:255};
emulVars.colors[1] = {hue:81,value:255,saturation:255};
export var fps =60;
var oldInterval;
$:if(fps)
{
    if(oldInterval)
    clearInterval(oldInterval)
    oldInterval=setInterval(()=>{
        animations[1].func(leds);
        leds=leds;
    },1000/fps);
}

</script>

<LedFan leds={leds}></LedFan>
<LedStrip leds={leds}></LedStrip>