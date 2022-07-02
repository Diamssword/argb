<script>
    import { TextInput, NumberInput } from "@svelteuidev/core";
    import { TYPES, Hardware } from "../../build/Hardwares";
    import FanLed from "../components/led_fan.svelte";
    import StripLed from "../components/led_strip.svelte";
    import LedAnimator from "./led_animator.svelte";
    export var hardware ;
    var ledCount = hardware.ledcount;
    $: if (ledCount != undefined) {
        if (ledCount < 1 || isNaN(ledCount)) {
            let d = hardware.type;
           
            if (d) 
            {
                hardware.ledcount = d.ledcount;
                ledCount=d.ledcount;
                
            }
        } else
         hardware.ledcount = ledCount;
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
                hardware.simulation = e.target.value;
                hardware= hardware;
            }}
        >
            {#each Object.keys(TYPES) as comp}
                <option value={TYPES[comp].simulation}>{TYPES[comp].name}</option>
            {/each}
        </select>
        <NumberInput bind:value={ledCount} />
    </div>
    <div>
        <LedAnimator
            comps={[displays[hardware.simulation]]}
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
