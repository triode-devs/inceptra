<script>
	import { onMount } from 'svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { 
		Trophy, 
		Medal, 
		Search, 
		RefreshCw, 
		LayoutGrid, 
		Clock, 
		Building2,
		ArrowLeft,
		Zap
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';

	const API_BASE_URL = 'https://ece-api.eruthukattu24.workers.dev';

	let leaderboard = $state([]);
	let isLoading = $state(true);
	let searchQuery = $state('');

	async function fetchLeaderboard() {
		isLoading = true;
		try {
			const res = await fetch(`${API_BASE_URL}/quiz/leaderboard?round=R1&limit=50`);
			const data = await res.json();
			if (data.success) {
				leaderboard = data.leaderboard;
			}
		} catch (e) {
			console.error('Failed to fetch leaderboard:', e);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		// Check session
		if (typeof window !== 'undefined' && sessionStorage.getItem('ece_session') !== 'active') {
			goto('/ece');
			return;
		}
		fetchLeaderboard();
	});

	let filteredLeaderboard = $derived(
		leaderboard.filter(entry => 
			entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			entry.college.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function formatDate(dateStr) {
		if (!dateStr) return 'N/A';
		const date = new Date(dateStr);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
</script>

<svelte:head>
	<title>Quiz Leaderboard | ECE Admin</title>
</svelte:head>

<div class="min-h-screen bg-[#fafafa] font-['Lexend'] text-zinc-900 pb-20">
	<!-- Top Navigation -->
	<header class="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-xl">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
			<div class="flex items-center gap-4">
				<button 
					onclick={() => goto('/ece')}
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 transition-all hover:bg-zinc-100 active:scale-95"
				>
					<LayoutGrid size={20} class="text-zinc-600" />
				</button>
				<div>
					<h1 class="text-lg font-black tracking-tight">Quiz Leaderboard</h1>
					<p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Round 1 (General ECE)</p>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<button 
					onclick={fetchLeaderboard}
					disabled={isLoading}
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all hover:bg-blue-100 disabled:opacity-50"
				>
					<RefreshCw size={18} class={isLoading ? 'animate-spin' : ''} />
				</button>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-3xl px-6 py-10">
		<!-- Search & Stats -->
		<div class="mb-8 flex flex-col gap-6 md:flex-row md:items-center">
			<div class="relative flex-1">
				<div class="absolute inset-y-0 left-4 flex items-center text-slate-400">
					<Search size={18} />
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search participants or colleges..."
					class="h-12 w-full rounded-2xl border border-zinc-100 bg-white pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 shadow-sm"
				/>
			</div>
			
			<div class="flex items-center gap-3 self-center rounded-2xl bg-zinc-900 px-6 py-3 text-white shadow-xl shadow-zinc-900/10">
				<Zap size={16} class="text-yellow-400" />
				<span class="text-xs font-bold uppercase tracking-widest">{leaderboard.length} Attempts</span>
			</div>
		</div>

		<!-- Leaderboard List -->
		<div class="space-y-3">
			{#if isLoading && leaderboard.length === 0}
				{#each Array(5) as _}
					<div class="h-24 w-full animate-pulse rounded-[2rem] bg-zinc-100"></div>
				{/each}
			{:else if filteredLeaderboard.length === 0}
				<div class="flex flex-col items-center justify-center py-20 text-center">
					<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-slate-300">
						<Search size={32} />
					</div>
					<h3 class="text-lg font-bold">No results found</h3>
					<p class="text-sm text-slate-400">Try adjusting your search query.</p>
				</div>
			{:else}
				{#each filteredLeaderboard as entry, i (entry.rank || i)}
					<div 
						class="group relative flex items-center gap-5 overflow-hidden rounded-[2rem] border border-white bg-white p-5 shadow-sm transition-all hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 active:scale-[0.98]"
						in:fly={{ y: 20, delay: i * 50, duration: 500 }}
					>
						<!-- Rank Indicator -->
						<div class="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl">
							{#if i === 0}
								<div class="absolute inset-0 bg-yellow-400 opacity-10"></div>
								<Trophy class="relative z-10 text-yellow-500" size={28} />
							{:else if i === 1}
								<div class="absolute inset-0 bg-slate-300 opacity-10"></div>
								<Medal class="relative z-10 text-slate-400" size={28} />
							{:else if i === 2}
								<div class="absolute inset-0 bg-amber-600 opacity-10"></div>
								<Medal class="relative z-10 text-amber-700" size={28} />
							{:else}
								<div class="absolute inset-0 bg-zinc-50"></div>
								<span class="relative z-10 text-lg font-black text-slate-400">#{entry.rank || i + 1}</span>
							{/if}
						</div>

						<div class="flex-1 min-w-0">
							<h3 class="line-clamp-1 text-base font-black text-zinc-900">{entry.name}</h3>
							<div class="mt-0.5 flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
								<Building2 size={12} class="shrink-0 text-slate-400" />
								<p class="truncate text-[10px] font-bold uppercase tracking-wider text-slate-500">{entry.college}</p>
							</div>
							<div class="mt-2 flex items-center gap-3">
								<div class="flex items-center gap-1.5 rounded-full bg-zinc-50 px-2.5 py-1">
									<Clock size={10} class="text-slate-400" />
									<span class="text-[9px] font-black text-slate-500 uppercase">{formatDate(entry.end_time)}</span>
								</div>
							</div>
						</div>

						<!-- Score -->
						<div class="flex flex-col items-end gap-1">
							<div class="text-3xl font-black tracking-tighter text-blue-600">
								{entry.mark}
							</div>
							<span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Points</span>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</main>
</div>

<style>
	:global(body) {
		background-color: #fafafa;
	}
</style>
