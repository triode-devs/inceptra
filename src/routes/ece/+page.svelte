<script>
	import { ECE_ADMIN_PASS } from '$lib/index';
	import { goto } from '$app/navigation';
	import { Lock, ArrowRight, ShieldCheck, Sparkles, Trophy } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let password = $state('');
	let error = $state(false);
	let isAuthenticating = $state(false);
	let isLoggedIn = $state(false);

	onMount(() => {
		if (typeof window !== 'undefined' && sessionStorage.getItem('ece_session') === 'active') {
			isLoggedIn = true;
		}
	});

	function handleLogin(e) {
		e.preventDefault();
		isAuthenticating = true;
		error = false;

		setTimeout(() => {
			if (password === ECE_ADMIN_PASS) {
				sessionStorage.setItem('ece_session', 'active');
				isLoggedIn = true;
			} else {
				error = true;
				password = '';
			}
			isAuthenticating = false;
		}, 800);
	}
</script>

<svelte:head>
	<title>ECE Admin Login | INCEPTRA '26</title>
</svelte:head>

<div class="fixed inset-0 flex items-center justify-center bg-slate-50 font-['Lexend']">
	<!-- Dynamic Background -->
	<div class="absolute inset-0 -z-10 overflow-hidden">
		<div class="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-100 opacity-50 blur-[120px]"></div>
		<div class="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-100 opacity-50 blur-[120px]"></div>
	</div>

	<div 
		class="w-full max-w-md px-6"
		in:fly={{ y: 20, duration: 800 }}
	>
		<div class="mb-8 text-center">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xl shadow-zinc-900/20">
				<ShieldCheck size={32} />
			</div>
			<div class="flex items-center justify-center gap-2 text-[#8c2bee] mb-1">
				<Sparkles size={14} />
				<span class="text-[10px] font-black tracking-widest uppercase">Restricted Access</span>
			</div>
			<h1 class="text-3xl font-black tracking-tight text-zinc-900">ECE <span class="text-blue-600">Admin</span></h1>
			<p class="mt-2 text-sm font-medium text-slate-500">Please enter the security password to continue.</p>
		</div>

		{#if !isLoggedIn}
			<form 
				onsubmit={handleLogin}
				class="relative flex flex-col gap-4 rounded-3xl border border-white bg-white/70 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-xl"
				in:fly={{ y: 20, duration: 500 }}
			>
				<div class="relative">
					<div class="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400">
						<Lock size={20} />
					</div>
					<input
						type="password"
						bind:value={password}
						placeholder="Security Password"
						required
						class="h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/50 pl-12 pr-4 text-sm font-bold tracking-widest text-zinc-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300 placeholder:tracking-normal"
					/>
				</div>

				{#if error}
					<p in:fade class="text-center text-xs font-bold text-red-500">Access Denied: Invalid Security Key</p>
				{/if}

				<button
					type="submit"
					disabled={isAuthenticating}
					class="group relative mt-2 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-zinc-900 font-bold text-white transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-70"
				>
					{#if isAuthenticating}
						<div class="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
					{:else}
						<span>Authenticate</span>
						<ArrowRight size={18} class="transition-transform group-hover:translate-x-1" />
					{/if}
				</button>
			</form>
		{:else}
			<div 
				class="grid grid-cols-1 gap-4"
				in:fly={{ y: 20, duration: 500 }}
			>
				<button 
					onclick={() => goto('/ece/all')}
					class="group flex h-24 items-center justify-between rounded-3xl border border-white bg-white/70 px-8 shadow-xl shadow-slate-200/40 backdrop-blur-xl transition-all hover:bg-blue-600 hover:text-white active:scale-95"
				>
					<div class="flex flex-col items-start translate-x-0 transition-transform group-hover:translate-x-2">
						<h2 class="text-xl font-black">Students</h2>
						<p class="text-[10px] font-bold uppercase tracking-widest opacity-60">Directory & Records</p>
					</div>
					<ArrowRight size={24} class="opacity-20 group-hover:opacity-100" />
				</button>

				<button 
					onclick={() => goto('/ece/home')}
					class="group flex h-24 items-center justify-between rounded-3xl border border-white bg-white/70 px-8 shadow-xl shadow-slate-200/40 backdrop-blur-xl transition-all hover:bg-zinc-900 hover:text-white active:scale-95"
				>
					<div class="flex flex-col items-start translate-x-0 transition-transform group-hover:translate-x-2">
						<h2 class="text-xl font-black">Events</h2>
						<p class="text-[10px] font-bold uppercase tracking-widest opacity-60">Attendance Hub</p>
					</div>
					<ArrowRight size={24} class="opacity-20 group-hover:opacity-100" />
				</button>

				<button 
					onclick={() => goto('/ece/quiz')}
					class="group flex h-24 items-center justify-between rounded-3xl border border-white bg-white/70 px-8 shadow-xl shadow-slate-200/40 backdrop-blur-xl transition-all hover:bg-purple-600 hover:text-white active:scale-95"
				>
					<div class="flex flex-col items-start translate-x-0 transition-transform group-hover:translate-x-2">
						<h2 class="text-xl font-black">Quiz</h2>
						<p class="text-[10px] font-bold uppercase tracking-widest opacity-60">Leaderboard & Results</p>
					</div>
					<Trophy size={24} class="opacity-20 group-hover:opacity-100" />
				</button>
			</div>
		{/if}

		<p class="mt-8 text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase">
			&copy; 2026 Inceptra Festival Committee
		</p>
	</div>
</div>
