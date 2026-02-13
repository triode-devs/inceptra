<script>
	import {
		Music,
		Mic,
		Video,
		Users,
		User,
		Smile,
		Shirt,
		MessageSquare,
		ArrowRight,
		Ticket
	} from 'lucide-svelte';

	import culturalRulesData from '$lib/data/cultural-rules.json';
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { X, ClipboardList } from 'lucide-svelte';

	// Import local WebP images
	import grpDanceImg from '$lib/assets/events/grp-dance.webp';
	import soloDanceImg from '$lib/assets/events/solo-dance.webp';
	import singingImg from '$lib/assets/events/singing.webp';
	import mimeImg from '$lib/assets/events/mime.webp';
	import fashionImg from '$lib/assets/events/fashion.webp';
	import mimixImg from '$lib/assets/events/mimix.webp';

	const culturalEvents = [
		{
			id: 'danzera',
			name: 'Danzera',
			type: 'Group Dance',
			icon: Users,
			color: 'from-pink-500 to-rose-500',
			image: grpDanceImg
		},
		{
			id: 'sizzle-shake',
			name: 'Sizzle and Shake',
			type: 'Solo Dance',
			icon: User,
			color: 'from-violet-500 to-purple-500',
			image: soloDanceImg
		},
		{
			id: 'voice-vibes',
			name: 'Voice Vibes',
			type: 'Singing',
			icon: Mic,
			color: 'from-blue-500 to-cyan-500',
			image: singingImg
		},
		{
			id: 'rhythm-strings',
			name: 'Rhythm Strings',
			type: 'Instrumental Music',
			icon: Music,
			color: 'from-amber-400 to-orange-500',
			image:
				'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2000&auto=format&fit=crop'
		},
		{
			id: 'silent-symphony',
			name: 'Silent Symphony',
			type: 'MIME',
			icon: Smile,
			color: 'from-teal-400 to-emerald-500',
			image: mimeImg
		},
		{
			id: 'fashion-fiesta',
			name: 'Fashion Fiesta',
			type: 'Fashion Show',
			icon: Shirt,
			color: 'from-fuchsia-500 to-pink-500',
			image: fashionImg
		},
		{
			id: 'mimix',
			name: 'Mimix',
			type: 'Mimicry',
			icon: MessageSquare,
			color: 'from-indigo-500 to-blue-600',
			image: mimixImg
		},
		{
			id: 'cinebuzz',
			name: 'Cinebuzz',
			type: 'Short Film',
			icon: Video,
			color: 'from-red-500 to-orange-600',
			image:
				'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop'
		}
	];

	let selectedEventRules = $state(null);
	let isModalOpen = $state(false);

	function openRules(eventId) {
		const eventData = culturalRulesData.find((e) => e.id === eventId);
		if (eventData) {
			selectedEventRules = eventData;
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
	<title>Cultural Fest | INCEPTRA '26 | Music, Dance & Drama</title>
	<meta
		name="description"
		content="Get ready for the biggest Cultural Fest at INCEPTRA '26. Solo/Group Dance, Singing, Fashion Show, Short Film, and more."
	/>
	<meta
		name="keywords"
		content="Cultural Festival, College Dance Competition, Singing Competition, Fashion Show, Short Film Contest, MIME, College Fest Trichy"
	/>
</svelte:head>

<div
	class="min-h-screen bg-[#f7f6f8] px-4 pt-20 pt-24 pb-12 font-['Lexend'] text-[#141118] md:px-20 md:pt-32"
>
	<div class="mx-auto max-w-[1280px]">
		<!-- Header -->
		<div class="mb-16 text-center">
			<div
				class="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-[#ee2b8c]/20 bg-[#ee2b8c]/5 px-4 py-1.5 text-[#ee2b8c] backdrop-blur-sm"
			>
				<Music size={14} />
				<span class="text-xs font-bold tracking-widest uppercase">On Stage Events</span>
			</div>
			<h1 class="mb-6 text-4xl font-black tracking-tight md:text-6xl">
				Cultural <span
					class="bg-gradient-to-r from-[#ee2b8c] to-[#8c2bee] bg-clip-text text-transparent"
					>Fest</span
				>
			</h1>
			<p class="mx-auto max-w-2xl text-lg text-[#756189] md:text-xl">
				Unleash your creativity and set the stage on fire with music, dance, and drama.
			</p>
		</div>

		<!-- Events Grid -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each culturalEvents as event}
				<div
					class="group relative h-[400px] overflow-hidden rounded-[2rem] bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10"
				>
					<!-- Background Image -->
					<div
						class="absolute inset-0 h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
						style="background-image: url('{event.image}');"
					>
						<div
							class="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50"
						></div>
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
						></div>
					</div>

					<div class="relative flex h-full flex-col justify-end p-6 text-white">
						<!-- Icon -->
						<!-- Icon -->
						<div
							class="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md transition-transform duration-500 group-hover:scale-110"
						>
							<event.icon size={24} />
						</div>

						<!-- Badge -->
						<div
							class="mb-3 w-fit rounded-full bg-gradient-to-r {event.color} px-3 py-1 text-[10px] font-bold tracking-wider uppercase shadow-lg"
						>
							{event.type}
						</div>

						<h3 class="mb-2 text-2xl leading-tight font-black">{event.name}</h3>

						<div
							class="mt-4 grid grid-rows-[1fr] transition-all duration-500 md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr]"
						>
							<div class="overflow-hidden">
								<div class="flex flex-col gap-2 pb-2">
									<button
										onclick={() => openRules(event.id)}
										class="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-2.5 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
									>
										<ClipboardList size={14} />
										<span>Rules & Regulations</span>
									</button>
									<button
										class="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-xs font-bold text-black transition-all hover:bg-white/90 active:scale-95"
									>
										<Ticket size={14} />
										<span>Register Now</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Rules Modal -->
{#if isModalOpen && selectedEventRules}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
		transition:fade={{ duration: 200 }}
	>
		<!-- Backdrop -->
		<div class="absolute inset-0 bg-[#141118]/80 backdrop-blur-md" onclick={closeRules}></div>

		<!-- Modal Content -->
		<div
			class="relative max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl"
			transition:scale={{ duration: 400, start: 0.95, easing: quintOut }}
		>
			<div class="flex h-full max-h-[80vh] flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between border-b border-gray-100 p-6 md:p-8">
					<div>
						<h2 class="text-2xl font-black text-[#141118] md:text-3xl">
							{selectedEventRules.name}
						</h2>
						<p class="mt-1 text-sm font-bold tracking-widest text-[#8c2bee] uppercase">
							Rules & Regulations
						</p>
					</div>
					<button
						onclick={closeRules}
						class="rounded-full bg-gray-100 p-3 text-gray-500 transition-colors hover:bg-gray-200 hover:text-black"
					>
						<X size={24} />
					</button>
				</div>

				<!-- Rules List -->
				<div class="flex-1 overflow-y-auto bg-[#fdfcfd] p-6 md:p-8">
					<ul class="space-y-4">
						{#each selectedEventRules.rules as rule, i}
							<li class="group flex gap-4" transition:fly={{ y: 20, delay: i * 50, duration: 400 }}>
								<div
									class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8c2bee]/10 text-xs font-bold text-[#8c2bee]"
								>
									{i + 1}
								</div>
								<p class="text-base leading-relaxed font-medium text-[#5a4d6b]">{rule}</p>
							</li>
						{/each}
					</ul>
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
	</div>
{/if}
