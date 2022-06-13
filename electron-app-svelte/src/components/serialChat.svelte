<script>
   import { TextInput,Button } from '@svelteuidev/core';
    
    var text;
  var msgs=[];

  function send()
  {
    window.send("Serial.send",text);
        text ="";
  }
  
 
    window.receive("Serial.receive", (res) => {
        msgs.push(res);
        msgs = msgs;
       console.log(res);
    });
let refresher= asyncwait();
    async function asyncwait() {
		return;
	}
</script>
{#each msgs as msg}
<p>{msg}</p>
{/each}

<TextInput bind:value={text}></TextInput><Button on:click={send} >ok</Button>
<style>

.icon{
    width:20%; 
    padding:10px; 
    margin-top: 5%;    
}
.cont{
    width: 95%;
    float:left;
    display: flex;
}
</style>