<script>
    import { TextInput, NumberInput } from "@svelteuidev/core";
    import { VirtualHardware } from "../../build/Hardwares";
    import { animations} from "../../build/AnimationsList";
    import FanLed from "../components/led_fan.svelte";
    import StripLed from "../components/led_strip.svelte";
    import LedAnimator from "./led_animator.svelte";
import { LedAnimation } from "../../build/Animations";
    export var hardware = new VirtualHardware("name");
    export var animation = new LedAnimation("default");
    var ledCount=0;
    var indexes=[];
    var types=[];
    $: if (hardware) {
        types=[]
        indexes=[];
        ledCount=0;
        for(let k in hardware.composition)
        {
            types.push(displays[hardware.composition[k].simulation]);
            indexes.push({start:ledCount,length:hardware.composition[k].ledcount})
            ledCount+= hardware.composition[k].ledcount
        }
    }
    var displays = {
        round: FanLed,
        strip: StripLed,
    };
</script>

<div class="row">
    <div>
        <TextInput description="Nom" bind:value={hardware.name} />
        <select
        on:change={(e) => {
           animation.animation = e.target.value;
            
        }}
    >
    {#each Object.keys(animations) as comp}
    <option value={animations[comp].code}>{animations[comp].name}</option>
{/each}
    </select>
        
        <NumberInput bind:value={animation.fps}  description="FPS"/>
     
        <NumberInput bind:value={ledCount} />
    </div>
    <div>
        <LedAnimator
            comps={types}
            fps={animation.fps}
            program={animation.animation}
            indexes={indexes}
            nbLeds={ledCount}
        />
    </div>
</div>

<style>
    .row {
        display: flex;
        flex-direction: row;
        overflow: auto;
    }
</style>
