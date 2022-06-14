<script>
   import { TextInput,Button,NumberInput } from '@svelteuidev/core';
  import {LedAnimation,HSV} from "../../build/Animations";
  
  var led = new LedAnimation("test");
  var fps;
  var anim;
  var timer;
  var c1;
  var c2;

  function send()
  {
    led.colors=[];
    led.setAnimation(anim).setFPS(fps).setTimer(timer).addHtmlColors(c1,c2);
    window.send("Serial.send","/argb "+led.getCommand());
  }
</script>
//https://betterdiscord.app/plugins
<NumberInput bind:value={anim}  description="Animation"/>
<NumberInput bind:value={fps}  description="FPS"/>
<NumberInput bind:value={timer} description="Time"/>
<input type="color" on:change={(ev)=>{c1=ev.target.value}} style="height:50px"/>
<input type="color" on:change={(ev)=>{c2=ev.target.value}} style="height:50px"/>
<Button on:click={send} ></Button>
<style>

</style>