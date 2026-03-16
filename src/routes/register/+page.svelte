<script>
	import Login from '$lib/components/Login.svelte';
	import UserRegistrations from '$lib/components/UserRegistrations.svelte';
	import { user, authLoaded } from '$lib/authStore';
	import { LogOut, User as UserIcon, XCircle, Calendar, MapPin } from 'lucide-svelte';
	import { auth } from '$lib/firebase';
	import { fade } from 'svelte/transition';

	let { data } = $props();

	function handleLogout() {
		auth.signOut();
	}
</script>

<svelte:head>
	<title>Registration Closed | INCEPTRA '26 | Trichy Engineering College</title>
	<meta
		name="description"
		content="Online registration for INCEPTRA '26 is now closed. Check your previous registrations or join us at Trichy Engineering College for the event."
	/>
</svelte:head>

<div class="min-h-screen bg-[#f7f6f8] pt-24 pb-12">
	{#if !$authLoaded}
		<div class="flex h-[60vh] items-center justify-center">
			<div
				class="h-12 w-12 animate-spin rounded-full border-4 border-[#8c2bee] border-t-transparent"
			></div>
		</div>
	{:else if !$user}
		<div in:fade class="flex flex-col gap-8">
			<!-- Registration Closed Message for Unauthenticated Users -->
			<div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
				<div
					class="rounded-[2.5rem] border border-red-100 bg-white p-8 text-center shadow-xl shadow-red-500/5 sm:p-12"
				>
					<div
						class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 sm:h-20 sm:w-20"
					>
						<XCircle size={40} />
					</div>
					<h2 class="text-2xl font-black text-gray-900 sm:text-3xl">
						Registration <span class="text-red-500">Closed</span>
					</h2>
					<p class="mx-auto mt-4 max-w-xl text-base font-medium text-gray-600 sm:text-lg">
						Online registrations for <span class="font-bold text-[#8c2bee]">INCEPTRA '26</span> have
						successfully concluded. Thank you for the overwhelming response!
					</p>
					<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<div
							class="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm font-bold text-gray-600"
						>
							<Calendar size={16} class="text-[#8c2bee]" /> March 17, 2026
						</div>
						<div
							class="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm font-bold text-gray-600"
						>
							<MapPin size={16} class="text-[#ee2b8c]" /> TEC Campus, Trichy
						</div>
					</div>
				</div>
			</div>
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

		<div class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8" in:fade>
			<div
				class="rounded-[2.5rem] border border-red-100 bg-white p-12 text-center shadow-xl shadow-red-500/5"
			>
				<div
					class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500"
				>
					<XCircle size={40} />
				</div>
				<h2 class="text-3xl font-black text-gray-900">
					Registration <span class="text-red-500">Closed</span>
				</h2>
				<p class="mx-auto mt-4 max-w-2xl text-lg font-medium text-gray-600">
					Online registrations for <span class="font-bold text-[#8c2bee]">INCEPTRA '26</span> have
					successfully concluded. Thank you for the overwhelming response!
				</p>
				<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<div
						class="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm font-bold text-gray-600"
					>
						<Calendar size={16} class="text-[#8c2bee]" /> March 17, 2026
					</div>
					<div
						class="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm font-bold text-gray-600"
					>
						<MapPin size={16} class="text-[#ee2b8c]" /> TEC Campus, Trichy
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

