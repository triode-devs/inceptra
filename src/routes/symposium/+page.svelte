<script>
	import { ArrowRight, ClipboardList, X, Cpu, Radio, Settings } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { symposiumData } from '$lib/data/data';

	let selectedDeptRules = $state(null);
	let isModalOpen = $state(false);

	const symposiumEvents = symposiumData;

	function openRules(dept) {
		if (dept.hasRules) {
			selectedDeptRules = dept.rulesData;
			isModalOpen = true;
			document.body.style.overflow = 'hidden';
		}
	}

	function closeRules() {
		isModalOpen = false;
		document.body.style.overflow = 'auto';
	}
</script>

<svelte:head>
	<title>Technical Symposium | INCEPTRA '26 | TEC</title>
	<meta
		name="description"
		content="Explore Technical Symposium events at INCEPTRA '26. Paper presentations, coding challenges, project expos, and more across all engineering departments."
	/>
	<meta
		name="keywords"
		content="Technical Symposium, Engineering Events, CSE Events, EEE Events, ECE Events, Mechanical Events, Civil Events, Paper Presentation"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="min-h-screen bg-[#f7f6f8] px-4 py-12 font-['Lexend'] text-[#141118] md:px-20">
	<div class="mx-auto max-w-[1280px] pt-20">
		<!-- Header -->
		<div class="animate-fade-in-up mb-12 text-center">
			<div
				class="mb-4 inline-flex items-center gap-2 rounded-full bg-[#8c2bee]/10 px-4 py-2 text-[#8c2bee]"
			>
				<span class="text-xs font-bold tracking-widest uppercase">Department Events</span>
			</div>
			<h1 class="mb-4 text-4xl font-black md:text-5xl">Technical Symposium</h1>
			<p class="mx-auto mb-8 max-w-2xl text-lg text-[#756189]">
				Showcase your technical prowess in a series of challenges designed by our core engineering
				departments.
			</p>

			<a
				href="/register"
				class="inline-flex items-center gap-2 rounded-xl bg-[#8c2bee] px-8 py-3 font-bold text-white shadow-lg shadow-[#8c2bee]/20 transition-transform hover:-translate-y-1"
			>
				<span>Register for Symposium</span>
				<ArrowRight size={20} />
			</a>
		</div>

		<!-- Events Grid -->
		<div class="animate-fade-in grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each symposiumEvents as dept}
				<div
					class="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
				>
					<!-- Image Header -->
					<div class="relative h-64 w-full overflow-hidden">
						<div
							class="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
						></div>
						<img
							src={dept.image}
							alt={dept.dept}
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
						/>
					</div>

					<div class="flex flex-1 flex-col p-6">
						<h3 class="min-h-[3.5rem] text-xl leading-tight font-black text-gray-800">
							{dept.dept}
						</h3>

						<div class="flex-1 space-y-6 pt-6">
							{#each dept.categories as cat}
								<div>
									<h4 class="mb-3 text-xs font-bold tracking-widest text-gray-400 uppercase">
										{cat.title}
									</h4>
									<ul class="space-y-3">
										{#each cat.items as item}
											<li class="flex items-start gap-2 text-sm font-medium text-gray-600">
												<span
													class="mt-1.5 h-1.5 w-1.5 rounded-full {dept.bg
														.replace('bg-', 'bg-')
														.replace('50', '400')} shrink-0"
												></span>
												<span class="leading-snug">{item}</span>
											</li>
										{/each}
									</ul>
								</div>
							{/each}
						</div>

						<div class="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6">
							{#if dept.staff}
								<div class="mb-2 flex flex-wrap gap-2">
									{#each dept.staff as staff}
										<span
											class="inline-block rounded-lg border border-gray-100 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600"
										>
											{staff}
										</span>
									{/each}
								</div>
							{/if}

							{#if dept.hasRules}
								<button
									onclick={() => openRules(dept)}
									class="flex w-full items-center justify-center gap-2 rounded-xl border border-[#8c2bee]/20 bg-[#8c2bee]/5 py-3 text-sm font-bold text-[#8c2bee] transition-all hover:bg-[#8c2bee]/10 active:scale-95"
								>
									<ClipboardList size={18} />
									<span>Rules & Regulations</span>
								</button>
							{/if}

							<a
								href="/register/{dept.id}"
								class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f8f6f7] py-3 text-sm font-bold text-[#141118] transition-colors hover:bg-[#8c2bee] hover:text-white"
							>
								Register Now <ArrowRight size={16} />
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Rules Modal -->
{#if isModalOpen && selectedDeptRules}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
		transition:fade={{ duration: 200 }}
	>
		<!-- Backdrop -->
		<div class="absolute inset-0 bg-[#141118]/80 backdrop-blur-md" onclick={closeRules}></div>

		<!-- Modal Content -->
		<div
			class="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-2xl"
			transition:scale={{ duration: 400, start: 0.95, easing: quintOut }}
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-gray-100 p-6 md:p-8">
				<div>
					<h2 class="text-2xl font-black text-[#141118] md:text-3xl">
						{selectedDeptRules.department}
					</h2>
					<p class="mt-1 text-sm font-bold tracking-widest text-[#8c2bee] uppercase">
						Symposium Rules & Regulations
					</p>
				</div>
				<button
					onclick={closeRules}
					class="rounded-full bg-gray-100 p-3 text-gray-500 transition-colors hover:bg-gray-200 hover:text-black"
				>
					<X size={24} />
				</button>
			</div>

			<!-- Body -->
			<div class="flex-1 overflow-y-auto bg-[#fdfcfd] p-6 md:p-8">
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
					<!-- General Instructions -->
					<div class="rounded-2xl border border-[#8c2bee]/10 bg-[#8c2bee]/5 p-6 lg:col-span-2">
						<h3 class="mb-4 flex items-center gap-2 text-lg font-black text-[#141118]">
							<Settings size={20} class="text-[#8c2bee]" />
							General Instructions
						</h3>
						<ul class="grid grid-cols-1 gap-4 md:grid-cols-2">
							{#each Object.entries(selectedDeptRules.general_instructions) as [key, value]}
								<li class="flex items-start gap-3">
									<div
										class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8c2bee] text-[10px] font-bold text-white"
									>
										!
									</div>
									<p class="text-sm font-medium text-[#5a4d6b]">{value}</p>
								</li>
							{/each}
						</ul>
					</div>

					<!-- Technical Events -->
					<div class="space-y-6">
						<h3 class="flex items-center gap-2 text-xl font-black text-[#141118]">
							<Cpu size={24} class="text-[#8c2bee]" />
							Technical Events
						</h3>
						{#each selectedDeptRules.technical_events as event}
							<div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
								<h4 class="mb-3 text-lg font-bold text-[#8c2bee]">{event.event_name}</h4>
								<ul class="space-y-2">
									{#each event.rules as rule}
										<li class="flex gap-2 text-sm text-[#5a4d6b]">
											<span class="text-[#8c2bee]">•</span>
											{rule}
										</li>
									{/each}
								</ul>
							</div>
						{/each}
					</div>

					<!-- Non-Technical Events -->
					<div class="space-y-6">
						<h3 class="flex items-center gap-2 text-xl font-black text-[#141118]">
							<Radio size={24} class="text-[#ee2b8c]" />
							Non-Technical Events
						</h3>
						{#each selectedDeptRules.non_technical_events as event}
							<div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
								<h4 class="mb-3 text-lg font-bold text-[#ee2b8c]">{event.event_name}</h4>
								<ul class="space-y-2">
									{#each event.rules as rule}
										<li class="flex gap-2 text-sm text-[#5a4d6b]">
											<span class="text-[#ee2b8c]">•</span>
											{rule}
										</li>
									{/each}
								</ul>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Footer -->
			<div class="border-t border-gray-100 bg-white p-6 md:p-8">
				<button
					onclick={closeRules}
					class="w-full rounded-2xl bg-[#141118] py-4 text-center font-bold text-white shadow-xl transition-all hover:bg-black active:scale-95"
				>
					Got it, Thanks!
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in {
		animation: fadeInUp 0.6s ease-out forwards;
	}
	.animate-fade-in-up {
		animation: fadeInUp 0.6s ease-out forwards;
	}
</style>
