<script>
   import { TextInput,Button,NumberInput } from '@svelteuidev/core';
  import {LedAnimation,HSV,setCurrent} from "../../build/Animations";
  
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
   // led.send();
   window.send("Animaion.setCurrent",led.toJson());
    window.send("Serial.send",led.setSave(true).getCommand());
  }
//https://betterdiscord.app/plugins
</script>
<NumberInput bind:value={anim}  description="Animation"/>
<NumberInput bind:value={fps}  description="FPS"/>
<NumberInput bind:value={timer} description="Time"/>
<input type="color" on:change={(ev)=>{c1=ev.target.value}} style="height:50px"/>
<input type="color" on:change={(ev)=>{c2=ev.target.value}} style="height:50px"/>
<Button on:click={send} ></Button>
<style>

</style>