<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import NavBar from '$lib/components/NavBar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { page } from '$app/stores';

	let { children } = $props();
	const isAdmin = $derived($page.url.pathname.startsWith('/admin'));
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if !isAdmin}
	<NavBar />
{/if}

<div class="">
	{@render children()}
</div>

{#if !isAdmin}
	<Footer />
{/if}
