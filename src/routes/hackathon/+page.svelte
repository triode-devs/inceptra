<script>
	import {
		Calendar,
		MapPin,
		Trophy,
		Users,
		Zap,
		CheckCircle2,
		ArrowRight,
		Code,
		Lightbulb
	} from 'lucide-svelte';
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>Project Tech Feast | National Level Hackathon | INCEPTRA '26</title>
	<meta
		name="description"
		content="Join Project Tech Feast, the flagship 24-hour National Level Hackathon at INCEPTRA '26, Trichy Engineering College. Build sustainable tech solutions for green energy."
	/>
	<meta
		name="keywords"
		content="National Level Hackathon, Project Tech Feast, Sustainable Tech Hackathon, Green Energy Challenge, INCEPTRA 2026 Hackathon, Trichy Engineering College events"
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://inceptra.trichyengg.ac.in/hackathon" />
	<meta
		property="og:title"
		content="Project Tech Feast | National Level Hackathon | INCEPTRA '26"
	/>
	<meta
		property="og:description"
		content="A 24-hour innovation challenge at TEC. Build the future of sustainable technology."
	/>
	<meta property="og:image" content="https://inceptra.trichyengg.ac.in/og-image.png" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://inceptra.trichyengg.ac.in/hackathon" />
	<meta
		property="twitter:title"
		content="Project Tech Feast | National Level Hackathon | INCEPTRA '26"
	/>
	<meta
		property="twitter:description"
		content="Join the 24-hour sustainable tech hackathon at INCEPTRA '26 (TEC)."
	/>
	<meta property="twitter:image" content="https://inceptra.trichyengg.ac.in/og-image.png" />

	<link
		href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap"
		rel="stylesheet"
	/>
	<link rel="canonical" href="https://inceptra.trichyengg.ac.in/hackathon" />
</svelte:head>

<div class="min-h-screen bg-[#f7f6f8] pt-24 pb-20 font-['Lexend'] text-[#141118]">
	<!-- Hero Section -->
	<div class="relative overflow-hidden px-6 pt-10 pb-20 md:px-20">
		<div class="mx-auto max-w-[1280px]">
			<div class="flex flex-col items-center text-center">
				<!-- Badge -->
				<div
					class="mb-6 hidden items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50 px-4 py-2"
				>
					<span class="relative flex h-2 w-2">
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
						></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
					</span>
					<span class="text-xs font-bold tracking-[0.2em] text-emerald-700 uppercase"
						>24-Hour Innovation Challenge</span
					>
				</div>

				<!-- Title -->
				<h1
					class="mb-6 text-5xl leading-none font-black tracking-tight text-[#141118] md:text-7xl lg:text-8xl"
				>
					PROJECT<br />
					<span
						class="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent"
						>TECH FEAST</span
					>
				</h1>

				<!-- Subtitle -->
				<p class="mb-4 text-xl font-bold text-[#141118] md:text-2xl">
					Sustainable Tech (Green Energy)
				</p>
				<p class="mx-auto max-w-3xl text-lg leading-relaxed font-medium text-[#5a4d6b] md:text-xl">
					Build innovative solutions for environmental challenges. Join innovators, developers, and
					sustainability enthusiasts for an intense 24-hour hackathon focused on creating a greener
					future.
				</p>

				<!-- CTA Buttons -->
				<div class="mt-10 flex flex-col gap-4 sm:flex-row">
					<a
						href="/register"
						class="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-600/30"
					>
						Register Now <ArrowRight size={20} />
					</a>
					<a
						href="#details"
						class="flex items-center justify-center gap-2 rounded-xl border border-emerald-600/20 bg-emerald-50 px-8 py-4 text-lg font-bold text-emerald-700 transition-all hover:bg-emerald-100"
					>
						View Details
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Event Details -->
	<section class="px-6 py-12 md:px-20" id="details">
		<div class="mx-auto max-w-[1280px]">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<!-- Date -->
				<div
					class="group rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
				>
					<div
						class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"
					>
						<Calendar size={28} />
					</div>
					<h3 class="mb-2 text-2xl font-black text-[#141118]">When</h3>
					<p class="text-lg font-bold text-[#5a4d6b]">March 18, 2026</p>
					<p class="mt-1 text-sm font-medium text-gray-400">24 hours non-stop</p>
				</div>

				<!-- Location -->
				<div
					class="group rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
				>
					<div
						class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600"
					>
						<MapPin size={28} />
					</div>
					<h3 class="mb-2 text-2xl font-black text-[#141118]">Where</h3>
					<p class="text-lg font-bold text-[#5a4d6b]">TEC Campus</p>
					<p class="mt-1 text-sm font-medium text-gray-400">Innovation Lab & Auditorium</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Theme & Tracks -->
	<section class="px-6 py-20 md:px-20">
		<div class="mx-auto max-w-[1280px]">
			<div class="mb-12 text-center md:mb-16">
				<h2 class="mb-4 text-3xl font-black tracking-tight text-[#141118] md:text-5xl">
					Innovation <span class="text-emerald-600">Tracks</span>
				</h2>
				<p class="mx-auto max-w-2xl text-lg font-medium text-[#5a4d6b]">
					Choose your focus area and build solutions that make a difference
				</p>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
				<!-- Track 1 -->
				<div
					class="rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-sm transition-all hover:shadow-md"
				>
					<div class="mb-6 text-emerald-600">
						<Zap size={40} />
					</div>
					<h3 class="mb-3 text-xl font-black text-[#141118]">Renewable Energy</h3>
					<p class="text-sm leading-relaxed font-medium text-[#5a4d6b]">
						Solar, wind, hydro power optimization and smart grid solutions
					</p>
				</div>

				<!-- Track 2 -->
				<div
					class="rounded-[2rem] border border-teal-100 bg-white p-8 shadow-sm transition-all hover:shadow-md"
				>
					<div class="mb-6 text-teal-600">
						<Code size={40} />
					</div>
					<h3 class="mb-3 text-xl font-black text-[#141118]">Energy Efficiency</h3>
					<p class="text-sm leading-relaxed font-medium text-[#5a4d6b]">
						IoT-based monitoring, smart homes, and consumption optimization
					</p>
				</div>

				<!-- Track 3 -->
				<div
					class="rounded-[2rem] border border-cyan-100 bg-white p-8 shadow-sm transition-all hover:shadow-md"
				>
					<div class="mb-6 text-cyan-600">
						<Lightbulb size={40} />
					</div>
					<h3 class="mb-3 text-xl font-black text-[#141118]">Carbon Reduction</h3>
					<p class="text-sm leading-relaxed font-medium text-[#5a4d6b]">
						Carbon tracking, offsetting platforms, and emission reduction tools
					</p>
				</div>

				<!-- Track 4 -->
				<div
					class="rounded-[2rem] border border-lime-100 bg-white p-8 shadow-sm transition-all hover:shadow-md"
				>
					<div class="mb-6 text-lime-600">
						<Users size={40} />
					</div>
					<h3 class="mb-3 text-xl font-black text-[#141118]">Sustainable Living</h3>
					<p class="text-sm leading-relaxed font-medium text-[#5a4d6b]">
						Waste management, recycling systems, and eco-friendly lifestyle apps
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- What to Expect -->
	<section class="px-6 py-20 md:px-20">
		<div class="mx-auto max-w-[1280px]">
			<div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
				<div>
					<h2 class="mb-8 text-3xl font-black tracking-tight text-[#141118] md:text-5xl">
						What to <span class="text-emerald-600">Expect</span>
					</h2>
					<div class="space-y-8">
						<div class="flex items-start gap-4">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"
							>
								<CheckCircle2 size={24} />
							</div>
							<div>
								<h4 class="mb-1 text-xl font-bold text-[#141118]">Mentorship from Experts</h4>
								<p class="text-sm font-medium text-[#5a4d6b]">
									Get guidance from sustainability and tech professionals throughout the event
								</p>
							</div>
						</div>

						<div class="flex items-start gap-4">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"
							>
								<CheckCircle2 size={24} />
							</div>
							<div>
								<h4 class="mb-1 text-xl font-bold text-[#141118]">Networking Opportunities</h4>
								<p class="text-sm font-medium text-[#5a4d6b]">
									Connect with like-minded innovators, developers, and sustainability enthusiasts
								</p>
							</div>
						</div>

						<div class="flex items-start gap-4">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"
							>
								<CheckCircle2 size={24} />
							</div>
							<div>
								<h4 class="mb-1 text-xl font-bold text-[#141118]">Prizes & Certificates</h4>
								<p class="text-sm font-medium text-[#5a4d6b]">
									Win cash prizes, internship opportunities, and recognition for your innovation
								</p>
							</div>
						</div>

						<div class="flex items-start gap-4">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"
							>
								<CheckCircle2 size={24} />
							</div>
							<div>
								<h4 class="mb-1 text-xl font-bold text-[#141118]">Workshops & Tech Talks</h4>
								<p class="text-sm font-medium text-[#5a4d6b]">
									Learn about cutting-edge sustainable technologies and best practices
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-xl md:p-12">
					<h3 class="mb-8 text-3xl font-black text-[#141118]">Team Guidelines</h3>
					<ul class="space-y-5">
						<li class="flex items-start gap-4">
							<div class="mt-1 h-2 w-2 rounded-full bg-emerald-500"></div>
							<span class="font-bold text-[#5a4d6b]">Teams of 2-4 members</span>
						</li>
						<li class="flex items-start gap-4">
							<div class="mt-1 h-2 w-2 rounded-full bg-emerald-500"></div>
							<span class="font-bold text-[#5a4d6b]">Open to all college students</span>
						</li>
						<li class="flex items-start gap-4">
							<div class="mt-1 h-2 w-2 rounded-full bg-emerald-500"></div>
							<span class="font-bold text-[#5a4d6b]">Bring your own laptops</span>
						</li>
						<li class="flex items-start gap-4">
							<div class="mt-1 h-2 w-2 rounded-full bg-emerald-500"></div>
							<span class="font-bold text-[#5a4d6b]">Internet & power provided</span>
						</li>
						<li class="flex items-start gap-4">
							<div class="mt-1 h-2 w-2 rounded-full bg-emerald-500"></div>
							<span class="font-bold text-[#5a4d6b]">No pre-built solutions allowed</span>
						</li>
						<li class="flex items-start gap-4">
							<div class="mt-1 h-2 w-2 rounded-full bg-emerald-500"></div>
							<span class="font-bold text-[#5a4d6b]">Use any technology stack</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="px-6 py-20">
		<div class="mx-auto max-w-[1280px]">
			<div class="relative overflow-hidden rounded-[3rem] bg-[#141118] p-12 text-center md:p-20">
				<div
					class="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-[100px]"
				></div>
				<div
					class="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-500/20 blur-[100px]"
				></div>

				<div class="relative z-10">
					<h2 class="mb-6 text-3xl font-black tracking-tight text-white md:text-5xl">
						Ready to Build the <span class="text-emerald-400">Future?</span>
					</h2>
					<p class="mx-auto mb-10 max-w-2xl text-lg font-medium text-gray-300">
						Join Project Tech Feast and create innovative solutions for a sustainable tomorrow
					</p>
					<a
						href="/register"
						class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-10 py-5 text-xl font-bold text-white shadow-xl shadow-emerald-600/30 transition-all hover:-translate-y-1 hover:shadow-2xl"
					>
						Register Your Team <ArrowRight size={24} />
					</a>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	:global(body) {
		background-color: #f7f6f8;
	}

	/* Prevent scroll bar from shifting layout */
	:global(html) {
		overflow-y: scroll;
	}
</style>
