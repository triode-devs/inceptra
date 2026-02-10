<script>
	import { page } from '$app/stores';
	import Register from '$lib/components/Register.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>Event Registration | INCEPTRA '26</title>
</svelte:head>

<Register deptId={$page.params.id} settings={data.settings} />
