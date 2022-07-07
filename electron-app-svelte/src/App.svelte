<script>
	import { fns,SvelteUIProvider, Switch,Button } from "@svelteuidev/core";
	import { AppShell, Navbar, Header} from '@svelteuidev/core';
	import  General from './pages/General.svelte'
	import  Hardware from './pages/HardwareEdit.svelte'
	import  Animator from './pages/AnimatorEdit.svelte'
	let isDark = true;
	let opened = true;
	function toggleTheme() {
		isDark = !isDark;
	}
	function toggleOpened() {
		opened = !opened;
	}
	var pages = {
		"general":General,
		"hardware":Hardware,
		"animator":Animator
	}
	var currentPage ="animator";
</script>
<SvelteUIProvider withGlobalStyles themeObserver={isDark ? 'dark' : 'light'}>
	<AppShell
	override={{
		main: { bc: isDark ? fns.themeColor('dark', 8) : fns.themeColor('gray', 0) }
	}}>
<Navbar
slot="navbar"
hidden={!opened}
width={{ base: 300 }}
override={{ p: 'xsdPX' }}
>
Profile: 
<select>
	<option>+new</option>
</select>
<Button variant="outline" color="yellow" radius="xl" size="md" ripple on:click={()=>{currentPage="general"}}>General</Button>
<Button variant="outline" color="yellow" radius="xl" size="md" ripple on:click={()=>{currentPage="animator"}}>Animator</Button>
<Button variant="outline" color="yellow" radius="xl" size="md" ripple on:click={()=>{currentPage="hardware"}}>Hardware</Button>

</Navbar>
<Header slot="header" height={60} override={{ p: '$mdPX' }}>
	<div class="left-aligned">
		<Switch checked={true} on:change={toggleTheme} />
		</div>
</Header>
  
<main>
	<svelte:component this={pages[currentPage]}/>
</main>
</AppShell>
</SvelteUIProvider>
<style>
.left-aligned{
	float: bottom;
}
</style>
