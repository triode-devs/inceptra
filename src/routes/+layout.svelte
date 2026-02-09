<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import NavBar from '$lib/components/NavBar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<NavBar />
<div class="">
	{@render children()}
</div>
<Footer />
