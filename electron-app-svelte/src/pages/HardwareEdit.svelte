<script>
import { Button } from '@svelteuidev/core';

import Hardware from '../components/hadware.svelte'
var hardwares =[];
hardwares.push({});
</script>
<div>
    {#each hardwares as hard}
    <Hardware {...hard}></Hardware>    
    {/each}
    <Button variant="outline" color="yellow" radius="xl" size="md" ripple on:click={()=>{hardwares=[...hardwares,{}]}}>+</Button>
</div>