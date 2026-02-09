<script>
	import { Cpu, Zap, Building, Radio, Settings, ArrowRight } from 'lucide-svelte';
	import cseBg from '$lib/assets/cse_bg.jpg';
	import eeeBg from '$lib/assets/eee_bg.jpg';
	import eceBg from '$lib/assets/ece_bg.jpg';
	import mechBg from '$lib/assets/mech_bg.jpg';
	import civilBg from '$lib/assets/civil_bg.jpg';

	const symposiumEvents = [
		{
			id: 'cse',
			dept: 'Computer Science & Engineering',
			icon: Cpu,
			color: 'text-blue-500',
			bg: 'bg-blue-50',
			image: cseBg,
			categories: [
				{
					title: 'Technical',
					items: ['Paper Presentation', 'Technical Quiz', 'Blind Code', 'Debugging']
				},
				{
					title: 'Non-Technical',
					items: ['Gaming', 'Connexion']
				}
			]
		},
		{
			id: 'eee',
			dept: 'Electrical & Electronics Engineering',
			icon: Zap,
			color: 'text-yellow-500',
			bg: 'bg-yellow-50',
			image: eeeBg,
			categories: [
				{
					title: 'Technical Symposium',
					items: [
						'Paperbestowment (Paper Presentation)',
						'Technical Brain Blast (Quiz)',
						'Circuit Debugging',
						'Trade Show (Project Expo)'
					]
				},
				{
					title: 'Non-Technical',
					items: ['Recreational Events']
				}
			],
			staff: ['Mr. M. Prasath, AP', 'Mr. C. Karthick, AP']
		},
		{
			id: 'ece',
			dept: 'Electronics & Communication',
			icon: Radio,
			color: 'text-purple-500',
			bg: 'bg-purple-50',
			image: eceBg,
			categories: [
				{
					title: 'Technical',
					items: ['Paper Tract', 'Flyer / Buzzcard', 'Fine Tune', 'Innovation Expo']
				},
				{
					title: 'Non-Technical',
					items: ['Connection', 'Free Fire']
				}
			]
		},
		{
			id: 'mech',
			dept: 'Mechanical & Mechatronics',
			icon: Settings,
			color: 'text-orange-500',
			bg: 'bg-orange-50',
			image: mechBg,
			categories: [
				{
					title: 'Technical',
					items: [
						'Paper Presentation (3D Printing, Robotics, AI, Drones)',
						'CAD Modeling',
						'Calibre',
						'Technical Quiz'
					]
				},
				{
					title: 'Non-Technical',
					items: ['Paper Events', 'Brushless Painting']
				}
			]
		},
		{
			id: 'civil',
			dept: 'Civil Engineering',
			icon: Building,
			color: 'text-emerald-500',
			bg: 'bg-emerald-50',
			image: civilBg,
			categories: [
				{
					title: 'Events',
					items: ['Bridge', 'Model Making', 'Poster', 'CAD Quest', 'Quiz']
				}
			]
		}
	];
</script>

<svelte:head>
	<title>Technical Symposium | INCEPTRA '26</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap"
		rel="stylesheet"
	/>
	<script src="https://cdn.tailwindcss.com"></script>
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
					class="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
				>
					<!-- Image Header -->
					<div class="group relative h-64 w-full overflow-hidden">
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

						<div class="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6">
							{#if dept.staff}
								<div class="flex flex-wrap gap-2">
									{#each dept.staff as staff}
										<span
											class="inline-block rounded-lg border border-gray-100 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600"
										>
											{staff}
										</span>
									{/each}
								</div>
							{/if}

							<a
								href="/register/{dept.id}"
								class="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#f8f6f7] py-3 text-sm font-bold text-[#141118] transition-colors hover:bg-[#8c2bee] hover:text-white"
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
