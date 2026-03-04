<script>
	import { Instagram, Youtube, LayoutGrid } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	// The media data array loaded from script to populate the social wall
	const mediaFeeds = [
		{
			id: 1,
			type: 'instagram-reel',
			url: 'https://www.instagram.com/reel/DVay9f4Edxj/embed',
			title: 'Inceptra 26 Teaser'
		},
		{
			id: 2,
			type: 'instagram',
			url: 'https://www.instagram.com/p/DVLQciSE9V2/embed',
			title: 'Inceptra Event Launch'
		}
	];
</script>

<svelte:head>
	<title>Social Media & Videos | INCEPTRA '26 | Trichy Engineering College</title>
	<meta
		name="description"
		content="Watch the latest promotional videos, Instagram posts, and reels from INCEPTRA '26 at TEC."
	/>
</svelte:head>

<div
	class="min-h-screen bg-[#f7f6f8] px-4 pt-24 pb-20 font-['Lexend'] text-[#141118] md:px-20 md:pt-32"
>
	<div class="mx-auto max-w-[1280px]">
		<!-- Header -->
		<div class="mb-16 text-center">
			<div
				class="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-[#8c2bee]/20 bg-[#8c2bee]/5 px-4 py-1.5 text-[#8c2bee] backdrop-blur-sm"
			>
				<LayoutGrid size={14} />
				<span class="text-xs font-bold tracking-widest uppercase">Our Social Wall</span>
			</div>

			<h1 class="mb-6 text-4xl font-black tracking-tight md:text-6xl">
				Connect With <span
					class="bg-gradient-to-r from-[#8c2bee] to-[#ee2b8c] bg-clip-text text-transparent"
					>Inceptra</span
				>
			</h1>

			<p class="mx-auto max-w-2xl text-lg text-[#756189] md:text-xl">
				Watch our latest announcements, event promos, and behind-the-scenes action on YouTube and
				Instagram.
			</p>
		</div>

		<!-- Masonry/Grid for Media -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each mediaFeeds as item, i}
				<div
					in:fade={{ delay: i * 100, duration: 600 }}
					class="group relative overflow-hidden rounded-[2rem] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
				>
					<!-- Card Header -->
					<div class="flex items-center justify-between border-b border-gray-100 p-5">
						<div class="flex items-center gap-3">
							{#if item.type === 'youtube'}
								<div
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600"
								>
									<Youtube size={20} />
								</div>
								<span class="font-bold text-gray-800">YouTube Video</span>
							{:else}
								<div
									class="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600"
								>
									<Instagram size={20} />
								</div>
								<span class="font-bold text-gray-800"
									>Instagram {item.type === 'instagram-reel' ? 'Reel' : 'Post'}</span
								>
							{/if}
						</div>
					</div>

					<!-- iFrame Embed -->
					<div
						class="relative w-full overflow-hidden bg-gray-50"
						style="padding-bottom: {item.type === 'youtube'
							? '56.25%'
							: '120%'}; min-height: {item.type === 'youtube' ? 'auto' : '500px'}"
					>
						{#if item.type === 'youtube'}
							<iframe
								src={item.url}
								class="absolute top-0 left-0 h-full w-full border-0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowfullscreen
								title={item.title}
							></iframe>
						{:else}
							<iframe
								src={item.url}
								class="absolute top-0 left-0 h-full w-full border-0"
								allowtransparency="true"
								title={item.title}
								scrolling="no"
								frameborder="0"
							></iframe>
						{/if}
					</div>

					<div class="border-t border-gray-50 p-5">
						<p class="truncate text-sm font-semibold text-gray-600">{item.title}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: #f7f6f8;
	}
</style>
