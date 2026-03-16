<script>
	import { onMount } from 'svelte';
	import { fade, fly, slide, scale } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';
	import { 
		Timer, 
		CheckCircle2, 
		XCircle, 
		ChevronRight, 
		Trophy, 
		Loader2, 
		Zap,
		ShieldCheck,
		ArrowRight,
		User,
		Building2,
		Phone
	} from 'lucide-svelte';
	import { questions } from '$lib/data/quiz.js';
	import { goto } from '$app/navigation';

	const API_BASE_URL = 'https://ece-api.eruthukattu24.workers.dev';

	// --- QUIZ STATE ---
	let gameState = $state('landing'); // landing, auth, intro, quiz, finishing, result
	let selectedQuestions = $state([]);
	let currentIndex = $state(0);
	let answers = $state({}); // question index -> selected option
	let sessionId = $state(null);
	let startTime = $state(null);
	let isSubmitting = $state(false);

	// --- USER INFO ---
	let user = $state({
		name: '',
		college: '',
		phone: '',
		round: 'R1'
	});

	// --- TIMING ---
	let timeLeft = $state(1200); // 20 minutes in seconds
	let timerInterval;

	function startTimer() {
		timerInterval = setInterval(() => {
			if (timeLeft > 0) {
				timeLeft -= 1;
			} else {
				finishQuiz();
			}
		}, 1000);
	}

	function formatTime(seconds) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	function shuffleArray(array) {
		const newArr = [...array];
		for (let i = newArr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[newArr[i], newArr[j]] = [newArr[j], newArr[i]];
		}
		return newArr;
	}

	async function initQuiz() {
		if (!user.name || !user.college || !user.phone) return;
		
		isSubmitting = true;
		try {
			const res = await fetch(`${API_BASE_URL}/quiz/start`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...user,
					total_questions: 20
				})
			});
			const data = await res.json();
			
			if (data.success) {
				sessionId = data.session_id;
				startTime = data.start_time;
				selectedQuestions = shuffleArray(questions).slice(0, 20);
				gameState = 'quiz';
				startTimer();
			} else {
				alert(data.error || 'Failed to start quiz');
			}
		} catch (e) {
			console.error(e);
			alert('Network error. Check connection.');
		} finally {
			isSubmitting = false;
		}
	}

	async function recordAnswer(index, option) {
		answers[index] = option;
		const question = selectedQuestions[index];
		
		// Background sync
		try {
			fetch(`${API_BASE_URL}/quiz/${sessionId}/answer`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					question_no: index + 1,
					question_text: question.question_text,
					selected_option: option,
					correct_option: question.correct_option
				})
			});
		} catch (e) {
			console.warn('Silent sync failed');
		}
	}

	let result = $state(null);

	async function finishQuiz() {
		clearInterval(timerInterval);
		gameState = 'finishing';
		
		let correct = 0;
		let wrong = 0;
		
		selectedQuestions.forEach((q, i) => {
			if (answers[i]) {
				if (answers[i] === q.correct_option) {
					correct++;
				} else {
					wrong++;
				}
			}
		});

		const mark = (correct * 1) - (wrong * 0.25);
		const attended = Object.keys(answers).length;

		try {
			const res = await fetch(`${API_BASE_URL}/quiz/${sessionId}/submit`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					questions_attended: attended,
					correct_answers: correct,
					wrong_answers: wrong,
					mark: mark
				})
			});
			const data = await res.json();
			if (data.success) {
				result = { correct, wrong, attended, mark, total: 20 };
				gameState = 'result';
			}
		} catch (e) {
			console.error(e);
			alert('Submission failed. Your data is partially saved on server.');
		}
	}

	function next() {
		if (currentIndex < 19) currentIndex++;
	}

	function prev() {
		if (currentIndex > 0) currentIndex--;
	}
</script>

<svelte:head>
	<title>ECE Symposium Quiz | INCEPTRA '26</title>
</svelte:head>

<!-- Premium Background -->
<div class="fixed inset-0 -z-10 bg-slate-950 font-['Lexend'] text-white">
	<div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(140,43,238,0.1),transparent)]"></div>
	<div class="absolute top-0 left-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
	
	<!-- Glow Blobs -->
	<div class="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] animate-pulse rounded-full bg-blue-600/10 blur-[120px]"></div>
	<div class="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] animate-pulse rounded-full bg-[#ee2b8c]/10 blur-[120px]"></div>
</div>

<main class="relative flex min-h-screen flex-col items-center justify-center p-6 text-white overflow-hidden">
	{#if gameState === 'landing'}
		<div 
			class="flex max-w-2xl flex-col items-center text-center"
			in:fly={{ y: 30, duration: 1000 }}
		>
			<div class="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/20">
				<Zap size={40} class="text-white" />
			</div>
			<div class="flex items-center gap-2 text-[#8c2bee] mb-2">
				<div class="h-px w-8 bg-current opacity-30"></div>
				<span class="text-[10px] font-black tracking-widest uppercase">Department of ECE Presents</span>
				<div class="h-px w-8 bg-current opacity-30"></div>
			</div>
			<h1 class="text-5xl font-black tracking-tighter sm:text-7xl">INCEPTRA <span class="text-blue-500">'26</span></h1>
			<p class="mt-6 text-lg font-medium text-slate-400">Prove your excellence in the field of Electronics & Communication. 20 Questions. 20 Minutes. Infinite Glory.</p>
			
			<div class="mt-12 flex flex-wrap justify-center gap-4">
				<button 
					onclick={() => gameState = 'auth'}
					class="group relative flex h-16 items-center gap-3 overflow-hidden rounded-2xl bg-white px-10 font-black text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
				>
					START CHALLENGE
					<ArrowRight size={20} class="transition-transform group-hover:translate-x-1" />
				</button>
				<button 
					class="flex h-16 items-center rounded-2xl border border-white/10 bg-white/5 px-8 font-black transition-all hover:bg-white/10"
					onclick={() => goto('/')}
				>
					VIEW EVENTS
				</button>
			</div>
		</div>

	{:else if gameState === 'auth'}
		<div 
			class="w-full max-w-md"
			in:scale={{ duration: 500, start: 0.9, easing: quintOut }}
		>
			<div class="mb-8 text-center">
				<h2 class="text-3xl font-black">Registration</h2>
				<p class="text-sm font-medium text-slate-400 mt-2">Enter your details to initialize the quiz session.</p>
			</div>

			<div class="flex flex-col gap-4 rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-3xl shadow-2xl">
				<div class="space-y-4">
					<div class="relative">
						<User class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
						<input 
							type="text" 
							bind:value={user.name} 
							placeholder="Full Name"
							class="h-14 w-full rounded-2xl bg-white/5 border border-white/10 pl-12 pr-4 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
						/>
					</div>
					<div class="relative">
						<Building2 class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
						<input 
							type="text" 
							bind:value={user.college} 
							placeholder="College Name"
							class="h-14 w-full rounded-2xl bg-white/5 border border-white/10 pl-12 pr-4 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
						/>
					</div>
					<div class="relative">
						<Phone class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
						<input 
							type="tel" 
							bind:value={user.phone} 
							placeholder="Phone Number"
							class="h-14 w-full rounded-2xl bg-white/5 border border-white/10 pl-12 pr-4 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
						/>
					</div>
				</div>

				<button 
					onclick={initQuiz}
					disabled={!user.name || !user.college || !user.phone || isSubmitting}
					class="mt-4 flex h-14 items-center justify-center gap-2 rounded-2xl bg-blue-600 font-black transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2 class="animate-spin" size={20} />
						AUTHENTICATING...
					{:else}
						PROCEED <ChevronRight size={20} />
					{/if}
				</button>
			</div>
		</div>

	{:else if gameState === 'quiz'}
		<div class="w-full max-w-4xl px-4 py-8">
			<!-- Quiz Header -->
			<div class="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-blue-400">
						<Zap size={24} />
					</div>
					<div>
						<h3 class="text-sm font-black text-slate-400 uppercase tracking-widest">Question</h3>
						<div class="flex items-baseline gap-2">
							<span class="text-4xl font-black text-white">{currentIndex + 1}</span>
							<span class="text-lg font-bold text-slate-600">/ 20</span>
						</div>
					</div>
				</div>

				<div class="flex items-center gap-3 rounded-3xl bg-white/5 border border-white/10 px-6 py-3 backdrop-blur-md">
					<Timer size={20} class={timeLeft < 180 ? 'text-red-500 animate-pulse' : 'text-blue-400'} />
					<span class={`text-2xl font-black tabular-nums ${timeLeft < 180 ? 'text-red-500' : 'text-white'}`}>
						{formatTime(timeLeft)}
					</span>
				</div>
			</div>

			<!-- Question Card -->
			<div class="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-3xl md:p-12">
				<div class="mb-8">
					<h2 class="text-xl font-bold leading-relaxed sm:text-2xl md:text-3xl">
						{selectedQuestions[currentIndex].question_text}
					</h2>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					{#each ['A', 'B', 'C', 'D'] as opt}
						{@const optKey = `option_${opt.toLowerCase()}_text`}
						<button 
							onclick={() => recordAnswer(currentIndex, opt)}
							class={`group relative flex items-center gap-5 rounded-3xl border p-5 text-left transition-all active:scale-95
								${answers[currentIndex] === opt 
									? 'bg-blue-600 border-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.3)]' 
									: 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}
						>
							<div class={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-black transition-colors
								${answers[currentIndex] === opt ? 'bg-white text-blue-600' : 'bg-white/10 text-white group-hover:bg-white group-hover:text-black'}`}>
								{opt}
							</div>
							<span class="flex-1 text-sm font-bold leading-snug sm:text-base">
								{selectedQuestions[currentIndex][optKey]}
							</span>
						</button>
					{/each}
				</div>

				<div class="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
					<button 
						onclick={prev}
						disabled={currentIndex === 0}
						class="rounded-xl px-6 py-2 text-sm font-bold opacity-60 hover:opacity-100 disabled:opacity-20"
					>
						PREVIOUS
					</button>

					<div class="flex items-center gap-2">
						{#if currentIndex === 19}
							<button 
								onclick={finishQuiz}
								class="rounded-2xl bg-green-600 px-8 py-4 font-black text-white shadow-xl shadow-green-600/20 transition-all hover:bg-green-500 hover:scale-105 active:scale-95"
							>
								SUBMIT QUIZ
							</button>
						{:else}
							<button 
								onclick={next}
								class="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-black font-black text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
							>
								NEXT <ChevronRight size={20} />
							</button>
						{/if}
					</div>
				</div>
			</div>

			<!-- Mobile Progress -->
			<div class="mt-8 flex flex-wrap justify-center gap-2">
				{#each Array(20) as _, i}
					<button 
						onclick={() => currentIndex = i}
						class={`h-2.5 flex-1 rounded-full transition-all md:h-2
							${currentIndex === i ? 'bg-blue-500 scale-y-125' : answers[i] ? 'bg-white/40' : 'bg-white/10'}`}
					></button>
				{/each}
			</div>
		</div>

	{:else if gameState === 'finishing'}
		<div class="flex flex-col items-center gap-4">
			<Loader2 size={60} class="animate-spin text-blue-500" />
			<p class="text-xl font-bold tracking-widest animate-pulse">SECURING RESULTS...</p>
		</div>

	{:else if gameState === 'result'}
		<div 
			class="w-full max-w-lg overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-3xl"
			in:scale={{ duration: 600, easing: elasticOut }}
		>
			<div class="bg-linear-to-br from-blue-600 to-indigo-700 p-12 text-center">
				<div class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
					<Trophy size={48} class="text-white" />
				</div>
				<h2 class="text-4xl font-black italic uppercase italic">Well Done!</h2>
				<p class="mt-2 font-bold opacity-80 uppercase tracking-widest text-xs">Challenge Completed</p>
			</div>

			<div class="p-8 md:p-12">
				<div class="grid grid-cols-2 gap-4">
					<div class="flex flex-col items-center rounded-3xl bg-white/5 p-6 border border-white/5">
						<span class="text-xs font-bold text-slate-500 uppercase mb-2">Total Score</span>
						<span class="text-4xl font-black text-blue-400">{result.mark}</span>
					</div>
					<div class="flex flex-col items-center rounded-3xl bg-white/5 p-6 border border-white/5">
						<span class="text-xs font-bold text-slate-500 uppercase mb-2">Accuracy</span>
						<span class="text-4xl font-black text-green-400">{Math.round((result.correct/20)*100)}%</span>
					</div>
				</div>

				<div class="mt-8 space-y-4">
					<div class="flex justify-between items-center rounded-2xl bg-white/5 px-6 py-4">
						<div class="flex items-center gap-3">
							<CheckCircle2 class="text-green-500" size={18} />
							<span class="text-sm font-bold text-slate-400">Correct Answers</span>
						</div>
						<span class="font-black">{result.correct}</span>
					</div>
					<div class="flex justify-between items-center rounded-2xl bg-white/5 px-6 py-4">
						<div class="flex items-center gap-3">
							<XCircle class="text-red-500" size={18} />
							<span class="text-sm font-bold text-slate-400">Wrong Answers</span>
						</div>
						<span class="font-black">{result.wrong}</span>
					</div>
				</div>

				<button 
					onclick={() => location.reload()}
					class="mt-12 w-full h-16 rounded-2xl bg-white font-black text-black transition-all hover:scale-105 active:scale-95"
				>
					CLOSE SESSION
				</button>
			</div>
		</div>
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		background: #020617;
	}
	@keyframes pulse-glow {
		0%, 100% { opacity: 0.1; transform: scale(1); }
		50% { opacity: 0.2; transform: scale(1.1); }
	}
	.animate-pulse {
		animation: pulse-glow 4s ease-in-out infinite;
	}
</style>
