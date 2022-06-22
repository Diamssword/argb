<script>
	import { Button } from "@svelteuidev/core";
	
	import  SerialChat from '../components/serialChat.svelte'
	import  CreateAnimation from '../components/createAnimation.svelte'
	import  LedAnim from '../components/led_animator.svelte'
	
</script>
<SerialChat></SerialChat>
<CreateAnimation/>
<LedAnim></LedAnim>
	<Button variant="outline" color="yellow" radius="xl" size="md" ripple>
		Settings
	  </Button>