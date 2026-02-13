<script>
	import './layout.css';
	import favicon from '$lib/assets/tec svg.svg';
	import NavBar from '$lib/components/NavBar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();
	const isAdmin = $derived($page.url.pathname.startsWith('/admin'));

	// Register service worker for image caching
	onMount(() => {
		if (browser && 'serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/service-worker.js')
				.then((registration) => {
					console.log('Service Worker registered:', registration);
				})
				.catch((error) => {
					console.error('Service Worker registration failed:', error);
				});
		}
	});
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
