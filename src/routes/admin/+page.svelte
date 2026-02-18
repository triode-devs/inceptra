<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { adminUser } from '$lib/adminAuth';

	onMount(() => {
		// If the user reaches this component, it means they are logged in according to the layout logic
		// (because layout only renders children if $adminUser is truthy)
		// However, double check and redirect.
		if ($adminUser) {
			goto('/admin/registrations');
		}
	});
</script>

<div class="flex h-[50vh] items-center justify-center">
	<div class="flex animate-pulse flex-col items-center">
		<div class="mb-4 h-12 w-12 rounded-full bg-gray-200"></div>
		<div class="h-4 w-32 rounded bg-gray-200"></div>
	</div>
</div>
