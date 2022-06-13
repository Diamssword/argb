<script>
	import { fns,SvelteUIProvider, Switch,Button } from "@svelteuidev/core";
	import { AppShell, Navbar, Header} from '@svelteuidev/core';
	import  Serial from './components/portSelect.svelte'
	import  SerialChat from './components/serialChat.svelte'
	import  CreateAnimation from './components/createAnimation.svelte'
	export let name;
	let isDark = true;
	let opened = true;
	function toggleTheme() {
		isDark = !isDark;
	}
	function toggleOpened() {
		opened = !opened;
	}
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
	override={{ p: 'xsdPX' }}>

	<Serial></Serial>
</Navbar>
<Header slot="header" height={60} override={{ p: '$mdPX' }}>
</Header>
    <Switch checked={true} on:change={toggleTheme} />
    <Switch checked={true} on:change={toggleOpened} />
<main>
	<h1>Hello {name}!</h1>
<SerialChat></SerialChat>
<CreateAnimation/>
	<Button variant="outline" color="yellow" radius="xl" size="md" ripple>
		Settings
	  </Button>
</main>
</AppShell>
</SvelteUIProvider>
<style>

</style>
