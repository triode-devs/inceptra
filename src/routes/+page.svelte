<script>
	import { onMount } from 'svelte';
	import {
		Calendar,
		PlayCircle,
		MapPin,
		ArrowRight,
		Clock,
		Plus,
		CheckCircle,
		Map,
		MessageCircle,
		Music
	} from 'lucide-svelte';
	import ParticleNetwork from '$lib/components/ParticleNetwork.svelte';

	import heroHighlight from '$lib/assets/hero_highlight.jpg';

	import symposiumBg from '$lib/assets/symposium_bg.png';
	import culturalBg from '$lib/assets/cultural_bg.png';
	import InfiniteMenu from '$lib/components/InfiniteMenu.svelte';

	// Import gallery images for the infinite menu
	const imageFiles = import.meta.glob('$lib/assets/compressed_gallery/*.{webp,png,jpg,jpeg}', {
		eager: true,
		import: 'default'
	});

	const galleryItems = Object.entries(imageFiles)
		.sort(() => Math.random() - 0.5)
		.slice(0, 10)
		.map(([path, url], index) => ({
			image: url,
			title: `MOMENT ${index + 1}`,
			description: 'Capturing the essence of Inceptra 2026.',
			link: '/gallery'
		}));

	let timeLeft = {
		days: '00',
		hours: '00',
		mins: '00',
		secs: '00'
	};

	onMount(() => {
		// Timer Logic
		const countDownDate = new Date('March 5, 2026 09:00:00').getTime();

		const interval = setInterval(() => {
			const now = new Date().getTime();
			const distance = countDownDate - now;

			if (distance < 0) {
				clearInterval(interval);
				timeLeft = { days: '00', hours: '00', mins: '00', secs: '00' };
				return;
			}

			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const secs = Math.floor((distance % (1000 * 60)) / 1000);

			timeLeft = {
				days: String(days).padStart(2, '0'),
				hours: String(hours).padStart(2, '0'),
				mins: String(mins).padStart(2, '0'),
				secs: String(secs).padStart(2, '0')
			};
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>INCEPTRA '26 | College Symposium & Cultural Festival | TEC</title>
	<meta
		name="description"
		content="INCEPTRA '26 at Trichy Engineering College. A massive 2-day event featuring Technical Symposiums and Cultural Festivals on March 5 & 6, 2026."
	/>
	<meta
		name="keywords"
		content="Inceptra 2026, College Symposium, Cultural Festival, Trichy Engineering College, TEC, Engineering Events, College Fest"
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://inceptra-tec.pages.dev/" />
	<meta property="og:title" content="INCEPTRA '26 | Innovation Meets Art" />
	<meta
		property="og:description"
		content="Join the ultimate college symposium and cultural festival. 2 days of tech, music, dance, and creativity."
	/>
	<meta property="og:image" content="/og-image.jpg" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:title" content="INCEPTRA '26 | College Symposium & Cultural Festival" />
	<meta
		property="twitter:description"
		content="Register now for the biggest college fest in Trichy! Technical and Cultural events await."
	/>

	<link
		href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap"
		rel="stylesheet"
	/>

	<!-- Structured Data -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Event",
			"name": "INCEPTRA '26",
			"startDate": "2026-03-05T09:00",
			"endDate": "2026-03-06T18:00",
			"eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
			"eventStatus": "https://schema.org/EventScheduled",
			"location": {
				"@type": "Place",
				"name": "Trichy Engineering College",
				"address": {
					"@type": "PostalAddress",
					"streetAddress": "Konalai",
					"addressLocality": "Trichy",
					"addressRegion": "TN",
					"addressCountry": "IN"
				}
			},
			"image": ["https://inceptra-tec.pages.dev/og-image.jpg"],
			"description": "The ultimate college symposium and cultural festival. Two days of tech, music, dance, and creativity.",
			"organizer": {
				"@type": "Organization",
				"name": "Trichy Engineering College",
				"url": "https://trichyengg.ac.in"
			}
		}
	</script>
</svelte:head>

<div
	class="relative flex h-auto min-h-screen w-full flex-col scroll-smooth pt-20 font-['Lexend'] text-[#141118]"
>
	<main class="flex-1 pb-20 md:pb-0">
		<ParticleNetwork />

		<!-- Added padding bottom for mobile nav spacing -->
		<!-- Hero Section -->
		<section class="relative overflow-hidden px-6 pt-12 pb-20 md:px-20">
			<div class="mx-auto max-w-[1280px]">
				<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
					<div
						class="flex flex-col items-center gap-6 text-center md:gap-8 lg:col-span-7 lg:items-start lg:text-left"
					>
						<div
							class="inline-flex w-fit items-center gap-2 rounded-full border border-[#8c2bee]/10 bg-[#8c2bee]/5 px-4 py-2 text-[#8c2bee]"
						>
							<Calendar size={16} />
							<span class="text-xs font-bold tracking-widest uppercase">March 5 & 6, 2026</span>
						</div>
						<h1
							class="text-4xl leading-[1.1] font-black tracking-tight text-[#141118] sm:text-5xl md:text-7xl"
						>
							<span
								class="mb-2 block text-2xl font-black tracking-[0.2em] text-[#8c2bee] uppercase sm:text-3xl"
								>Inceptra '26</span
							>
							Where <span class="text-[#8c2bee] italic">Innovation</span> Meets
							<span class="text-[#ee2b8c]">Art</span>.
						</h1>
						<p class="max-w-xl text-base font-medium text-[#5a4d6b] md:text-xl">
							Join us for INCEPTRA '26. The ultimate college symposium and cultural festival. Two
							days of tech, music, dance, and creativity.
						</p>
						<div class="flex w-full flex-wrap justify-center gap-4 lg:justify-start">
							<button
								onclick={() => {
									window.location.href = '/register';
								}}
								class="h-12 w-full rounded-xl bg-[#8c2bee] px-8 text-base font-bold text-white shadow-xl shadow-[#8c2bee]/30 transition-all hover:bg-[#8c2bee]/90 sm:w-auto md:h-14 md:px-10 md:text-lg"
							>
								Get Your Passes
							</button>
						</div>
					</div>
					<div class="relative mt-8 lg:col-span-5 lg:mt-0">
						<div
							class="group mx-auto aspect-square max-w-md rotate-3 overflow-hidden rounded-3xl shadow-2xl transition-transform duration-500 hover:rotate-0"
						>
							<!-- Image Background -->
							<img
								src={heroHighlight}
								alt="Festival Highlights"
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
							/>

							<!-- Gradient Overlay for Text Readability -->
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
							></div>

							<!-- Floating Info Card -->
							<div class="absolute right-0 bottom-0 left-0 p-6 md:p-8">
								<div
									class="glass-card rounded-2xl border border-white/20 p-6 text-white backdrop-blur-md"
								>
									<div class="flex items-start justify-between">
										<div>
											<p class="mb-1 text-sm font-medium tracking-wider text-[#8c2bee] uppercase">
												Headline Act
											</p>
											<h3 class="text-2xl font-bold">INCEPTRA '26</h3>
										</div>
										<div class="rounded-lg bg-white/10 p-2">
											<Music size={24} />
										</div>
									</div>
									<p class="mt-4 flex items-center gap-2 text-xs font-medium text-gray-200">
										<MapPin size={14} /> Auditorium • 9:00 AM
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Countdown Timer -->
		<section class="px-4 py-8 md:px-20 md:py-12">
			<div class="mx-auto max-w-[1280px]">
				<div
					class="relative z-10 rounded-[2rem] border border-[#f2f0f4] bg-white p-6 shadow-sm md:p-12"
				>
					<div class="flex flex-col items-center justify-between gap-8 lg:flex-row">
						<div class="text-center lg:text-left">
							<h3 class="text-3xl font-black text-[#141118]">Starts In...</h3>
							<p class="mt-1 font-medium text-[#5a4d6b]">Mark your calendars for March 5, 2026</p>
						</div>
						<div class="flex flex-wrap justify-center gap-3 md:gap-8">
							<div class="flex flex-col items-center gap-2">
								<div
									class="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#8c2bee]/10 bg-white shadow-sm md:h-24 md:w-24"
								>
									<span class="text-2xl font-black text-[#8c2bee] md:text-4xl">{timeLeft.days}</span
									>
								</div>
								<span
									class="text-[10px] font-bold tracking-widest text-[#141118] uppercase opacity-40 md:text-xs"
									>Days</span
								>
							</div>
							<div class="flex flex-col items-center gap-2">
								<div
									class="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ee2b8c]/10 bg-white shadow-sm md:h-24 md:w-24"
								>
									<span class="text-2xl font-black text-[#ee2b8c] md:text-4xl"
										>{timeLeft.hours}</span
									>
								</div>
								<span
									class="text-[10px] font-bold tracking-widest text-[#141118] uppercase opacity-40 md:text-xs"
									>Hours</span
								>
							</div>
							<div class="flex flex-col items-center gap-2">
								<div
									class="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2b8cee]/10 bg-white shadow-sm md:h-24 md:w-24"
								>
									<span class="text-2xl font-black text-[#2b8cee] md:text-4xl">{timeLeft.mins}</span
									>
								</div>
								<span
									class="text-[10px] font-bold tracking-widest text-[#141118] uppercase opacity-40 md:text-xs"
									>Mins</span
								>
							</div>
							<div class="flex flex-col items-center gap-2">
								<div
									class="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#f1c40f]/10 bg-white shadow-sm md:h-24 md:w-24"
								>
									<span class="text-2xl font-black text-[#f1c40f] md:text-4xl">{timeLeft.secs}</span
									>
								</div>
								<span
									class="text-[10px] font-bold tracking-widest text-[#141118] uppercase opacity-40 md:text-xs"
									>Secs</span
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Key Events -->
		<!-- Events Category Selection -->
		<section class="px-6 py-16 md:px-20 md:py-20" id="events">
			<div class="mx-auto max-w-[1280px]">
				<div class="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
					<div class="flex flex-col gap-2">
						<h2 class="text-3xl font-black tracking-tight text-[#141118] md:text-4xl">
							Explore Events
						</h2>
						<p class="font-medium text-[#5a4d6b]">
							Choose your vibe: Technical Innovation or Cultural Expression.
						</p>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
					<!-- Symposium Card -->
					<a
						href="/symposium"
						class="group relative overflow-hidden rounded-[2.5rem] bg-white transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#8c2bee]/20"
					>
						<div class="relative aspect-[3/4] overflow-hidden sm:aspect-[16/10] md:aspect-[16/9]">
							<div
								class="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
								style="background-image: url({symposiumBg});"
							></div>
							<div
								class="absolute inset-0 bg-gradient-to-t from-[#8c2bee]/90 via-[#8c2bee]/40 to-transparent opacity-90 transition-opacity group-hover:opacity-100"
							></div>
							<div
								class="absolute right-6 bottom-6 left-6 flex flex-col gap-2 text-white sm:right-8 sm:bottom-8 sm:left-8 md:right-10 md:bottom-10 md:left-10"
							>
								<div
									class="w-fit rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase backdrop-blur-md sm:px-4 sm:py-1.5 sm:text-xs"
								>
									Technical & Non-Technical
								</div>
								<h3 class="text-3xl font-black sm:text-4xl md:text-5xl">Symposium</h3>
								<p
									class="mt-1 max-w-md text-sm font-medium opacity-90 sm:mt-2 sm:text-base md:text-lg"
								>
									Workshops, Hackathons, Paper Presentations, and more technical marvels.
								</p>
								<div
									class="mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#8c2bee] transition-transform group-hover:scale-110 sm:h-12 sm:w-12"
								>
									<ArrowRight size={24} />
								</div>
							</div>
						</div>
					</a>

					<!-- Cultural Card -->
					<a
						href="/cultural"
						class="group relative overflow-hidden rounded-[2.5rem] bg-white transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#ee2b8c]/20"
					>
						<div class="relative aspect-[3/4] overflow-hidden sm:aspect-[16/10] md:aspect-[16/9]">
							<div
								class="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
								style="background-image: url({culturalBg});"
							></div>
							<div
								class="absolute inset-0 bg-gradient-to-t from-[#ee2b8c]/90 via-[#ee2b8c]/40 to-transparent opacity-90 transition-opacity group-hover:opacity-100"
							></div>
							<div
								class="absolute right-6 bottom-6 left-6 flex flex-col gap-2 text-white sm:right-8 sm:bottom-8 sm:left-8 md:right-10 md:bottom-10 md:left-10"
							>
								<div
									class="w-fit rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase backdrop-blur-md sm:px-4 sm:py-1.5 sm:text-xs"
								>
									Non-Technical
								</div>
								<h3 class="text-3xl font-black sm:text-4xl md:text-5xl">Cultural</h3>
								<p
									class="mt-1 max-w-md text-sm font-medium opacity-90 sm:mt-2 sm:text-base md:text-lg"
								>
									Music, Dance, Drama, Art Gallery, and spectacular performances.
								</p>
								<div
									class="mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#ee2b8c] transition-transform group-hover:scale-110 sm:h-12 sm:w-12"
								>
									<ArrowRight size={24} />
								</div>
							</div>
						</div>
					</a>
				</div>
			</div>
		</section>

		<!-- Location Section -->
		<section class="px-6 py-16 md:px-20 md:py-20" id="venue">
			<div class="mx-auto max-w-[1280px]">
				<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
					<div
						class="relative order-2 h-[300px] overflow-hidden rounded-3xl border border-[#f2f0f4] md:h-[450px] lg:order-1"
					>
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4380.835223092171!2d78.77260307547678!3d10.982829855351703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baafa469e37c771%3A0xd44017e1b9c97cee!2sTrichy%20Engineering%20College!5e1!3m2!1sen!2sin!4v1770649734989!5m2!1sen!2sin"
							width="100%"
							height="100%"
							style="border:0;"
							allowfullscreen=""
							referrerpolicy="no-referrer-when-downgrade"
							title="Trichy Engineering College Map"
						></iframe>
						<div
							class="glass-card absolute right-6 bottom-6 left-6 rounded-2xl p-4 text-white md:p-6"
						>
							<div class="flex items-center gap-4">
								<div class="rounded-xl bg-white/20 p-3">
									<Map size={24} />
								</div>
								<div>
									<h4 class="font-bold">Trichy Engineering College</h4>
									<p class="text-sm opacity-80">Konalai, Trichy, Tamil Nadu</p>
								</div>
							</div>
						</div>
					</div>
					<div class="order-1 flex flex-col gap-6 lg:order-2">
						<h2 class="text-3xl leading-tight font-black text-[#141118] md:text-4xl">
							Join the Vibe at our Main Campus.
						</h2>
						<p class="leading-relaxed font-medium text-[#5a4d6b]">
							Our campus is ready to host over 10,000 students this year. With state-of-the-art
							labs, a massive open-air theater, and food stalls from the best vendors in the city.
						</p>
						<ul class="flex flex-col gap-4">
							<li class="flex items-center gap-3">
								<CheckCircle class="text-[#8c2bee]" size={24} />
								<span class="font-medium">Free Wi-Fi across the entire venue</span>
							</li>
							<li class="flex items-center gap-3">
								<CheckCircle class="text-[#8c2bee]" size={24} />
								<span class="font-medium">Dedicated parking for all attendees</span>
							</li>
							<li class="flex items-center gap-3">
								<CheckCircle class="text-[#8c2bee]" size={24} />
								<span class="font-medium">24/7 Medical assistance and help desks</span>
							</li>
						</ul>
						<div class="pt-4">
							<a
								href="https://www.google.com/maps/dir/?api=1&destination=Trichy+Engineering+College,+Konalai,+Trichy"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex h-12 items-center justify-center rounded-xl bg-[#f2f0f4] px-8 font-bold text-[#141118] transition-all hover:bg-gray-200"
							>
								Get Directions
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Infinite Gallery Section -->
		<section class="relative h-[80vh] w-full overflow-hidden py-20">
			<div class="absolute top-10 left-1/2 z-20 -translate-x-1/2 text-center">
				<h2 class="mb-2 text-3xl font-black tracking-tight text-[#141118] md:text-5xl">
					GALLERY HIGHLIGHTS
				</h2>
				<p class="text-sm font-bold tracking-[0.3em] text-[#8c2bee] uppercase">
					Experience the Energy
				</p>
			</div>

			<div class="h-full w-full">
				<InfiniteMenu items={galleryItems} scale={1.2} />
			</div>

			<div class="absolute bottom-10 left-1/2 z-20 -translate-x-1/2">
				<a
					href="/gallery"
					class="group flex items-center gap-3 rounded-full border border-[#8c2bee]/20 bg-[#8c2bee]/5 px-8 py-4 font-bold text-[#8c2bee] backdrop-blur-md transition-all hover:bg-[#8c2bee]/10 hover:shadow-2xl hover:shadow-[#8c2bee]/20"
				>
					<span>View Full Gallery</span>
					<ArrowRight size={20} class="transition-transform group-hover:translate-x-1" />
				</a>
			</div>
		</section>
	</main>

	<!-- Floating Action Button - Adjusted to be above mobile nav -->
	<button
		class="fixed right-8 bottom-24 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#8c2bee] text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 md:bottom-8"
	>
		<MessageCircle size={24} />
	</button>
</div>

<style>
	.glass-card {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}
</style>
