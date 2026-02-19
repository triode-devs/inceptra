<script>
	import Register from '$lib/components/Register.svelte';
	import Login from '$lib/components/Login.svelte';
	import UserRegistrations from '$lib/components/UserRegistrations.svelte';
	import { user, authLoaded } from '$lib/authStore';
	import { LogOut, User as UserIcon } from 'lucide-svelte';
	import { auth } from '$lib/firebase';
	import { fade } from 'svelte/transition';

	let { data } = $props();

	function handleLogout() {
		auth.signOut();
	}
</script>

<svelte:head>
	<title>Register for INCEPTRA '26 | Symposium & Cultural Events | Trichy Engineering College</title
	>
	<meta
		name="description"
		content="Register now for National Level Technical Symposium and Cultural events at INCEPTRA '26. Secure your entry for Hackathons, Paper Presentations, and Stage Performances at TEC."
	/>
	<meta
		name="keywords"
		content="Inceptra 2026 registration, college fest online registration, TEC symposium entry, cultural fest passes Trichy, engineering events registration"
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://inceptra.trichyengg.ac.in/register" />
	<meta property="og:title" content="Register for INCEPTRA '26 | Symposium & Cultural Events" />
	<meta
		property="og:description"
		content="Join 10,000+ students at Trichy Engineering College's premier festival. Register now for technical and cultural challenges."
	/>
	<meta property="og:image" content="https://inceptra.trichyengg.ac.in/og-image.png" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://inceptra.trichyengg.ac.in/register" />
	<meta
		property="twitter:title"
		content="Register for INCEPTRA '26 | Symposium & Cultural Events"
	/>
	<meta
		property="twitter:description"
		content="Secure your spot at INCEPTRA '26 - Trichy Engineering College's flagship National Level Fest."
	/>
	<meta property="twitter:image" content="https://inceptra.trichyengg.ac.in/og-image.png" />

	<link rel="canonical" href="https://inceptra.trichyengg.ac.in/register" />
</svelte:head>

<div class="min-h-screen bg-[#f7f6f8] pt-24 pb-12">
	{#if !$authLoaded}
		<div class="flex h-[60vh] items-center justify-center">
			<div
				class="h-12 w-12 animate-spin rounded-full border-4 border-[#8c2bee] border-t-transparent"
			></div>
		</div>
	{:else if !$user}
		<div in:fade>
			<Login />
		</div>
	{:else}
		<div class="mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
				<div class="flex items-center gap-3">
					<div
						class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#8c2bee]/10 text-[#8c2bee]"
					>
						{#if $user.photoURL}
							<img src={$user.photoURL} alt="Avatar" class="h-full w-full object-cover" />
						{:else}
							<UserIcon size={20} />
						{/if}
					</div>
					<div>
						<p class="text-xs font-bold tracking-widest text-gray-400 uppercase">Logged in as</p>
						<p class="text-sm font-black">{$user.displayName || $user.email}</p>
					</div>
				</div>
				<button
					onclick={handleLogout}
					class="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-xs font-bold text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
				>
					<LogOut size={14} /> Sign Out
				</button>
			</div>
		</div>

		<div class="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8" in:fade>
			<UserRegistrations userId={$user?.uid} />
		</div>

		<div in:fade>
			<Register settings={data.settings} userEmail={$user?.email} userId={$user?.uid} />
		</div>
	{/if}
</div>
