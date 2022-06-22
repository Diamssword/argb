<script>
    import { TextInput, NumberInput } from "@svelteuidev/core";
    import { TYPES, Hadware } from "../../build/Hardwares";
    import FanLed from "../components/led_fan.svelte";
    import StripLed from "../components/led_strip.svelte";
    import LedAnimator from "./led_animator.svelte";
    var ledCount = 20;
    $:if(ledCount<1|| isNaN(ledCount))
    {
        let d = TYPES[type];
        if(d)
        ledCount=d.ledcount
    }
        
    var type = "fan";
    var displays = {
        fan: FanLed,
        strip: StripLed,
    };
</script>

<div class="row">
    <div>
        <TextInput description="Nom" />
        <select
            on:change={(e) => {
                console.log(e.target.value);
                type = e.target.value;
            }}>
            {#each Object.keys(TYPES) as comp}
                <option value={comp}>{TYPES[comp].name}</option>
            {/each}
        </select>
        <NumberInput bind:value={ledCount} />
    </div>
    <div>
        <LedAnimator comp={displays[type]} nbLeds={ledCount} />
    </div>
</div>

<style>
    .row {
        display: flex;
        flex-direction: row;
        overflow: auto;
    }
</style>
