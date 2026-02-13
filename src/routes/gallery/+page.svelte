<script>
	import Masonry from '$lib/components/Masonry.svelte';

	// Import all images from the gallery
	const imageFiles = import.meta.glob('$lib/assets/compressed_gallery/*.{webp,png,jpg,jpeg}', {
		eager: true,
		import: 'default'
	});

	// Process images into items
	let items = Object.entries(imageFiles).map(([path, url], index) => {
		const fileName = path.split('/').pop()?.split('.')[0] || '';
		return {
			id: fileName,
			img: url,
			fileName: fileName,
			// Random heights to create the masonry effect
			height: 600 + (index % 5) * 150 + Math.random() * 100,
			url: url
		};
	});

	// Randomize order
	items = items.sort(() => Math.random() - 0.5);

	// Move specific image to front
	const featuredIndex = items.findIndex((item) => item.fileName === '1O5A8950');
	if (featuredIndex !== -1) {
		const [featuredItem] = items.splice(featuredIndex, 1);
		items = [featuredItem, ...items];
	}
</script>

<svelte:head>
	<title>Gallery | INCEPTRA '26 | Photo Archive | Trichy Engineering College</title>
	<meta
		name="description"
		content="Browse through stunning moments from INCEPTRA '26 - Trichy Engineering College's premier symposium and cultural festival. Visual archives of technical events, cultural performances, and unforgettable memories."
	/>
	<meta
		name="keywords"
		content="Inceptra Gallery, College Fest Photos, TEC Event Photos, Symposium Gallery, Cultural Fest Photos, Trichy Events, Engineering College Gallery"
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://inceptra.pages.dev/gallery" />
	<meta property="og:title" content="Gallery | INCEPTRA '26 | Photo Archive" />
	<meta
		property="og:description"
		content="Browse stunning moments from INCEPTRA '26 - visual archives of technical events and cultural performances at Trichy Engineering College."
	/>
	<meta property="og:image" content="https://inceptra.pages.dev/og-image.jpg" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://inceptra.pages.dev/gallery" />
	<meta property="twitter:title" content="Gallery | INCEPTRA '26 | Photo Archive" />
	<meta
		property="twitter:description"
		content="Browse stunning moments from INCEPTRA '26 - visual archives of technical events and cultural performances."
	/>
	<meta property="twitter:image" content="https://inceptra.pages.dev/og-image.jpg" />

	<link rel="canonical" href="https://inceptra.pages.dev/gallery" />
</svelte:head>

<div class="min-h-screen bg-[#0a0a0b] text-white">
	<!-- Hero Section -->
	<div class="relative overflow-hidden pt-40 pb-20">
		<!-- Background Glows -->
		<div
			class="pointer-events-none absolute top-0 left-1/2 h-96 w-full max-w-4xl -translate-x-1/2 rounded-full bg-purple-600/10 blur-[120px]"
		></div>
		<div
			class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]"
		></div>

		<div class="relative z-10 mx-auto max-w-7xl px-6">
			<div class="flex flex-col items-center text-center">
				<div
					class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm"
				>
					<span class="relative flex h-2 w-2">
						<span
							class="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"
						></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
					</span>
					<span class="text-[10px] font-bold tracking-[0.2em] text-purple-300 uppercase"
						>Visual Archives</span
					>
				</div>

				<h1 class="mb-8 text-6xl leading-none font-black tracking-tighter md:text-8xl">
					THE <span
						class="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent"
						>MOMENTS</span
					>
				</h1>

				<p class="max-w-2xl text-lg leading-relaxed font-medium text-neutral-400 md:text-xl">
					A glimpse into the energy, innovation, and vibrant atmosphere of Inceptra 2026. Capturing
					stories that define our journey.
				</p>
			</div>
		</div>
	</div>

	<!-- Gallery Grid Section -->
	<section class="mx-auto max-w-[1600px] px-6 pb-40">
		{#if items.length > 0}
			<div class="min-h-[1000px] w-full">
				<Masonry
					{items}
					animateFrom="bottom"
					stagger={0.04}
					duration={0.8}
					colorShiftOnHover={true}
					hoverScale={0.97}
					blurToFocus={true}
				/>
			</div>
		{:else}
			<div
				class="flex flex-col items-center justify-center rounded-[40px] border border-white/5 bg-white/[0.01] p-32 backdrop-blur-sm"
			>
				<div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-neutral-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
				</div>
				<p class="font-semibold tracking-wide text-neutral-500">DEVELOPING MEMORIES...</p>
			</div>
		{/if}
	</section>
</div>

<style>
	:global(body) {
		background-color: #0a0a0b;
		cursor: default;
	}

	/* Prevent scroll bar from shifting layout if possible */
	:global(html) {
		overflow-y: scroll;
	}
</style>
