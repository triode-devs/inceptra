<script>
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { 
		Trophy, 
		CheckCircle2, 
		XCircle, 
		Target, 
		Clock, 
		ArrowLeft,
		Zap,
		User,
		Building2
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let result = $state(null);
	let isLoading = $state(true);

	onMount(() => {
		const stored = localStorage.getItem('ece_quiz_last_result');
		if (stored) {
			result = JSON.parse(stored);
		}
		isLoading = false;
	});

	function formatDate(isoString) {
		return new Date(isoString).toLocaleString('en-IN', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Quiz Results | INCEPTRA '26</title>
</svelte:head>

<div class="fixed inset-0 -z-10 bg-slate-950 font-['Lexend'] text-white">
	<div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(140,43,238,0.1),transparent)]"></div>
	<div class="absolute top-0 left-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
</div>

<main class="relative flex min-h-screen flex-col items-center justify-center p-6 text-white">
	{#if isLoading}
		<div class="animate-pulse flex flex-col items-center gap-4">
			<Zap class="text-blue-500 animate-spin" size={48} />
			<p class="font-black tracking-widest uppercase text-xs">Loading Results...</p>
		</div>
	{:else if !result}
		<div class="max-w-md text-center" in:fly={{ y: 20 }}>
			<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 border border-white/10 text-slate-500">
				<Target size={40} />
			</div>
			<h1 class="text-2xl font-black">No Results Found</h1>
			<p class="mt-4 text-slate-400">Please complete the quiz first to view your detailed score.</p>
			<button 
				onclick={() => goto('/ece-quiz')}
				class="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 font-black transition-all hover:bg-blue-500 active:scale-95"
			>
				GO TO QUIZ
			</button>
		</div>
	{:else}
		<div 
			class="w-full max-w-2xl overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-3xl"
			in:scale={{ duration: 600, easing: elasticOut }}
		>
			<!-- Header -->
			<div class="bg-linear-to-br from-blue-600 to-indigo-700 p-8 md:p-12 text-center">
				<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
					<Trophy size={40} class="text-white" />
				</div>
				<h1 class="text-3xl font-black uppercase italic">Performance Report</h1>
				<p class="mt-1 font-bold opacity-80 uppercase tracking-widest text-[10px]">INCEPTRA '26 Technical Challenge</p>
			</div>

			<div class="p-8 md:p-12">
				<!-- User Info -->
				<div class="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="flex items-center gap-4 rounded-2xl bg-white/5 border border-white/5 p-4">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
							<User size={20} />
						</div>
						<div class="min-w-0">
							<p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Participant</p>
							<p class="font-black text-sm truncate">{result.user.name}</p>
						</div>
					</div>
					<div class="flex items-center gap-4 rounded-2xl bg-white/5 border border-white/5 p-4">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
							<Building2 size={20} />
						</div>
						<div class="min-w-0">
							<p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Institution</p>
							<p class="font-black text-sm truncate">{result.user.college}</p>
						</div>
					</div>
				</div>

				<!-- Stats Grid -->
				<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
					<div class="flex flex-col items-center rounded-3xl bg-white/5 p-6 border border-white/5">
						<span class="text-[9px] font-bold text-slate-500 uppercase mb-2">Total Score</span>
						<span class="text-3xl font-black text-blue-400">{result.mark}</span>
					</div>
					<div class="flex flex-col items-center rounded-3xl bg-white/5 p-6 border border-white/5">
						<span class="text-[9px] font-bold text-slate-500 uppercase mb-2">Accuracy</span>
						<span class="text-3xl font-black text-green-400">{Math.round((result.correct/20)*100)}%</span>
					</div>
					<div class="flex flex-col items-center rounded-3xl bg-white/5 p-6 border border-white/5">
						<span class="text-[9px] font-bold text-slate-500 uppercase mb-2">Correct</span>
						<span class="text-3xl font-black text-emerald-400">{result.correct}</span>
					</div>
					<div class="flex flex-col items-center rounded-3xl bg-white/5 p-6 border border-white/5">
						<span class="text-[9px] font-bold text-slate-500 uppercase mb-2">Attended</span>
						<span class="text-3xl font-black text-indigo-400">{result.attended}</span>
					</div>
				</div>

				<!-- Breakdown -->
				<div class="mt-8 space-y-3">
					<div class="flex justify-between items-center rounded-2xl bg-white/5 border border-white/5 px-6 py-4">
						<div class="flex items-center gap-3">
							<CheckCircle2 class="text-emerald-500" size={18} />
							<span class="text-sm font-bold text-slate-400">Right Answers</span>
						</div>
						<span class="font-black text-emerald-400">{result.correct}</span>
					</div>
					<div class="flex justify-between items-center rounded-2xl bg-white/5 border border-white/5 px-6 py-4">
						<div class="flex items-center gap-3">
							<XCircle class="text-red-500" size={18} />
							<span class="text-sm font-bold text-slate-400">Wrong Answers</span>
						</div>
						<span class="font-black text-red-400">{result.wrong}</span>
					</div>
					<div class="flex justify-between items-center rounded-2xl bg-white/5 border border-white/5 px-6 py-4">
						<div class="flex items-center gap-3">
							<Clock class="text-blue-400" size={18} />
							<span class="text-sm font-bold text-slate-400">Timestamp</span>
						</div>
						<span class="text-[10px] font-bold text-slate-400 uppercase">{formatDate(result.completedAt)}</span>
					</div>
				</div>

				<!-- Footer Actions -->
				<div class="mt-12 flex flex-col gap-4">
					<button 
						onclick={() => goto('/ece-quiz')}
						class="flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-white font-black text-black transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5"
					>
						<ArrowLeft size={20} /> BACK TO HOME
					</button>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		background: #020617;
	}
</style>
