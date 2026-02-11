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

	const culturalEvents = [
		{
			name: 'Danzera',
			type: 'Group Dance',
			icon: Users,
			color: 'from-pink-500 to-rose-500',
			image:
				'https://images.unsplash.com/photo-1545959554-6b912e92a818?q=80&w=2000&auto=format&fit=crop'
		},
		{
			name: 'Sizzle and Shake',
			type: 'Solo Dance',
			icon: User,
			color: 'from-violet-500 to-purple-500',
			image:
				'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?q=80&w=2000&auto=format&fit=crop'
		},
		{
			name: 'Voice Vibes',
			type: 'Singing',
			icon: Mic,
			color: 'from-blue-500 to-cyan-500',
			image:
				'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2000&auto=format&fit=crop'
		},
		{
			name: 'Rhythm Strings',
			type: 'Instrumental Music',
			icon: Music,
			color: 'from-amber-400 to-orange-500',
			image:
				'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2000&auto=format&fit=crop'
		},
		{
			name: 'Silent Symphony',
			type: 'MIME',
			icon: Smile,
			color: 'from-teal-400 to-emerald-500',
			image:
				'https://images.unsplash.com/photo-1621360841013-c76bb87d81a9?q=80&w=2000&auto=format&fit=crop'
		},
		{
			name: 'Fashion Fiesta',
			type: 'Fashion Show',
			icon: Shirt,
			color: 'from-fuchsia-500 to-pink-500',
			image:
				'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop'
		},
		{
			name: 'Mimix',
			type: 'Mimicry',
			icon: MessageSquare,
			color: 'from-indigo-500 to-blue-600',
			image:
				'https://images.unsplash.com/photo-1527236438218-d82077ae1f85?q=80&w=2000&auto=format&fit=crop'
		},
		{
			name: 'Cinebuzz',
			type: 'Short Film',
			icon: Video,
			color: 'from-red-500 to-orange-600',
			image:
				'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop'
		}
	];
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
						<div
							class="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md transition-transform duration-500 group-hover:scale-110"
						>
							<svelte:component this={event.icon} size={24} />
						</div>

						<!-- Badge -->
						<div
							class="mb-3 w-fit rounded-full bg-gradient-to-r {event.color} px-3 py-1 text-[10px] font-bold tracking-wider uppercase shadow-lg"
						>
							{event.type}
						</div>

						<h3 class="mb-2 text-2xl leading-tight font-black">{event.name}</h3>

						<div
							class="mt-4 grid grid-rows-[0fr] transition-all duration-500 group-hover:grid-rows-[1fr]"
						>
							<div class="overflow-hidden">
								<button
									class="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black transition-transform active:scale-95"
								>
									<span>Register Now</span>
									<Ticket size={16} />
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
