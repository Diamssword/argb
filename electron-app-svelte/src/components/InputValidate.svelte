<script>
import { Button } from "@svelteuidev/core";
export var text="+";
</script>
<div class="container">
<div class="element">
    <slot></slot>
</div>
<div class="element">
<Button variant="outline" color="yellow" radius="xs" size="md" ripple on:click >{text}</Button>
</div>
</div>
<style>
.element {
  display: inline-block;
 
  
}
</style>