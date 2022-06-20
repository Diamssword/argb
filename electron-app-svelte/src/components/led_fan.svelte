<script>
    import {HSVtoRGB} from '../../build/ColorsUtil'
        //code utilisé = https://codepen.io/Cthulahoop/pen/XbZWJq
    export var leds = [];
    var pSizeRatio=leds.length*0.15;
    var led_dom = [];
    $:if(leds)
    {
        refreshRender();
    }
    
    function refreshRender(){
        
        for (var i in led_dom) {
            var rg = HSVtoRGB(leds[i])
            var colorStr =
            rg.r +
                "," +
                rg.g +
                "," +
                rg.b;
            var color = "rgb(" + colorStr + ")";
            var colorAlpha = "rgba(" + colorStr + ",0.4)";
            led_dom[i].style.background = color;
            led_dom[i].style.boxShadow =`0px -${5/pSizeRatio}px ${30/pSizeRatio}px ${20/pSizeRatio}px ${colorAlpha},0px -${30/pSizeRatio}px ${30/pSizeRatio}px ${10/pSizeRatio}px ${colorAlpha}`; 
        }
    }

</script>

<div class="leds">
    <div class="strip container"  style="--m: {leds.length}; --tan: 0.41">
        
        {#each leds as _,i}
        
            <div class="led" style="--i: {i}" bind:this={led_dom[i]}/>
        {/each}
    </div>
</div>

<style>
   

    .strip {
        display: flex;
        margin: 20% auto;
        /* height: 100%; */
    }

    .led {
        flex: 0 0 auto;
        width: 5px;
        height: 5px;
        margin: 1px;
        border-radius: 8px;
        mix-blend-mode: screen;
    }

    .container {
  --d: 1.5em; /* image size */
  --rel: 1; /* how much extra space we want between images, 1 = one image size */
  --r: calc(.5*(1 + var(--rel))*var(--d)/var(--tan)); /* circle radius */
  --s: calc(2*var(--r) + var(--d)); /* container size */
  position: relative;
  width: var(--s); height: var(--s);
 
}

.container div {
    flex: 0 0 auto;
        width: 5px;
        height: 5px;
        margin: 1px;
        border-radius: 8px;
        mix-blend-mode: screen;
  position: absolute;
  top: 50%; left: 50%;
  --az: calc(var(--i)*1turn/var(--m));
  transform: 
    rotate(var(--az)) 
    translate(var(--r))
    rotate(calc(-1*var(--az)))
}

</style>
