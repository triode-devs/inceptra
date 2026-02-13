<script>
	import { Sparkles, Target, Users, Trophy, Calendar, MapPin, ArrowRight } from 'lucide-svelte';
</script>

<svelte:head>
	<title>About INCEPTRA '26 | Our Mission & Vision | Trichy Engineering College</title>
	<meta
		name="description"
		content="Learn more about INCEPTRA '26 at Trichy Engineering College. Discover our legacy since 2010, mission to ignite minds, and the passionate team behind the biggest college fest in the region."
	/>
	<meta
		name="keywords"
		content="About Inceptra, TEC Fest History, College Fest Mission, Engineering Symposium Vision, Cultural Festival, Trichy Engineering College"
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://inceptra.pages.dev/about" />
	<meta property="og:title" content="About INCEPTRA '26 | Our Mission & Vision" />
	<meta
		property="og:description"
		content="Learn about INCEPTRA '26 at Trichy Engineering College. Our legacy, mission to ignite minds, and the team behind the biggest college fest in the region."
	/>
	<meta property="og:image" content="https://inceptra.pages.dev/og-image.jpg" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://inceptra.pages.dev/about" />
	<meta property="twitter:title" content="About INCEPTRA '26 | Our Mission & Vision" />
	<meta
		property="twitter:description"
		content="Learn about INCEPTRA '26 - our legacy, mission, and the team behind TEC's biggest college fest."
	/>
	<meta property="twitter:image" content="https://inceptra.pages.dev/og-image.jpg" />

	<link rel="canonical" href="https://inceptra.pages.dev/about" />
	<link
		href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="min-h-screen bg-[#f7f6f8] px-4 py-12 pt-20 font-['Lexend'] text-[#141118] md:px-8 lg:px-20"
>
	<div class="mx-auto max-w-[1280px]">
		<!-- Hero Section -->
		<div class="mb-16 text-center md:mb-24">
			<div
				class="mb-6 inline-flex items-center gap-2 rounded-full bg-[#8c2bee]/10 px-4 py-2 text-[#8c2bee]"
			>
				<Sparkles size={16} />
				<span class="text-xs font-bold tracking-widest uppercase">Est. 2010</span>
			</div>
			<h1 class="mb-6 text-4xl leading-tight font-black md:text-6xl">
				Igniting Minds, <br />
				<span class="bg-gradient-to-r from-[#8c2bee] to-[#ee2b8c] bg-clip-text text-transparent"
					>Celebrating Culture.</span
				>
			</h1>
			<p class="mx-auto max-w-3xl text-lg leading-relaxed text-[#756189] md:text-xl">
				INCEPTRA is not just a fest; it's a movement. Bringing together the brightest technical
				minds and the most vibrant artistic souls for a two-day extravaganza of innovation and
				entertainment.
			</p>
		</div>

		<!-- Stats Grid -->
		<div class="mb-20 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
			<div
				class="rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-transform hover:-translate-y-1"
			>
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"
				>
					<Calendar size={24} />
				</div>
				<h3 class="mb-1 text-3xl font-black">2</h3>
				<p class="text-sm font-medium text-gray-500">Days of Glory</p>
			</div>
			<div
				class="rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-transform hover:-translate-y-1"
			>
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600"
				>
					<Target size={24} />
				</div>
				<h3 class="mb-1 text-3xl font-black">30+</h3>
				<p class="text-sm font-medium text-gray-500">Unique Events</p>
			</div>
			<div
				class="rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-transform hover:-translate-y-1"
			>
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600"
				>
					<Users size={24} />
				</div>
				<h3 class="mb-1 text-3xl font-black">5000+</h3>
				<p class="text-sm font-medium text-gray-500">Attendees</p>
			</div>
			<div
				class="rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-transform hover:-translate-y-1"
			>
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600"
				>
					<Trophy size={24} />
				</div>
				<h3 class="mb-1 text-3xl font-black">₹2L+</h3>
				<p class="text-sm font-medium text-gray-500">Prize Pool</p>
			</div>
		</div>

		<!-- Mission & Vision -->
		<div class="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2">
			<div
				class="group relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white p-8 md:p-12"
			>
				<div
					class="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-bl-full bg-[#8c2bee]/5 transition-transform group-hover:scale-110"
				></div>
				<div class="relative z-10">
					<div
						class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8c2bee] text-white shadow-lg shadow-[#8c2bee]/20"
					>
						<Target size={32} />
					</div>
					<h2 class="mb-4 text-3xl font-black">Our Mission</h2>
					<p class="text-lg leading-relaxed text-gray-600">
						To create a platform where theoretical knowledge meets practical application. We strive
						to foster a competitive yet collaborative environment that encourages students to push
						the boundaries of technology and creativity.
					</p>
				</div>
			</div>

			<div
				class="group relative overflow-hidden rounded-[2.5rem] border border-gray-800 bg-[#141118] p-8 text-white md:p-12"
			>
				<div
					class="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-tr-full bg-[#ee2b8c]/10 transition-transform group-hover:scale-110"
				></div>
				<div class="relative z-10">
					<div
						class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ee2b8c] text-white shadow-lg shadow-[#ee2b8c]/20"
					>
						<Sparkles size={32} />
					</div>
					<h2 class="mb-4 text-3xl font-black">Our Vision</h2>
					<p class="text-lg leading-relaxed text-gray-300">
						To become the premier student-driven festival in the region, recognized for excellence
						in innovation, cultural diversity, and student leadership. We envision a community where
						every talent finds its spotlight.
					</p>
				</div>
			</div>
		</div>

		<!-- Image Grid / Legacy -->
		<div class="mb-24">
			<div class="mb-8 flex items-end justify-between">
				<div>
					<h2 class="mb-2 text-3xl font-black">The Legacy</h2>
					<p class="text-gray-500">Glimpses from previous years.</p>
				</div>
			</div>
			<div class="grid h-96 grid-cols-1 gap-4 md:h-[500px] md:grid-cols-3">
				<div class="group relative h-full overflow-hidden rounded-[2rem] md:col-span-2">
					<img
						src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2074&auto=format&fit=crop"
						alt="Concert Crowd"
						class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
					/>
					<div
						class="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-8"
					>
						<p class="text-xl font-bold text-white">Cultural Night 2025</p>
					</div>
				</div>
				<div class="grid h-full grid-rows-2 gap-4">
					<div class="group relative overflow-hidden rounded-[2rem]">
						<img
							src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop"
							alt="Tech Workshop"
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<div
							class="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-6"
						>
							<p class="font-bold text-white">Hackathon</p>
						</div>
					</div>
					<div class="group relative overflow-hidden rounded-[2rem]">
						<img
							src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop"
							alt="Art Gallery"
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<div
							class="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-6"
						>
							<p class="font-bold text-white">Art Expo</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- CTA Section -->
		<div
			class="relative overflow-hidden rounded-[3rem] border border-gray-100 bg-white p-8 text-center shadow-xl md:p-16"
		>
			<div
				class="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-[#8c2bee] via-[#ee2b8c] to-[#2b8cee]"
			></div>

			<div class="relative z-10 mx-auto max-w-2xl">
				<h2 class="mb-6 text-3xl font-black md:text-5xl">Ready to be part of history?</h2>
				<p class="mb-8 text-lg text-[#756189]">
					Join thousands of students from across the country for the most anticipated fest of the
					year.
				</p>
				<div class="flex flex-col justify-center gap-4 sm:flex-row">
					<button
						class="flex items-center justify-center gap-2 rounded-xl bg-[#8c2bee] px-8 py-4 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#8c2bee]/30"
					>
						Register Now <ArrowRight size={20} />
					</button>
					<button
						class="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-8 py-4 text-lg font-bold text-gray-700 transition-all hover:bg-gray-200"
					>
						View Schedule
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
