<script>
	import './layout.css';
	import NavBar from '$lib/components/NavBar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();
	const hideLayout = $derived($page.url.pathname.startsWith('/admin') || $page.url.pathname.startsWith('/ece'));

	// Register service worker for image caching
	onMount(() => {
		if (browser && 'serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/service-worker.js')
				.then((registration) => {
					console.log('Service Worker registered:', registration);
				})
				.catch((error) => {
					console.error('Service Worker registration failed:', error);
				});
		}
	});
</script>

<svelte:head>
	<!-- Favicon: static files served from /static, no JS needed so Google crawler can find them -->
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="apple-touch-icon" href="/og-image.png" />

	<!-- JSON-LD: Organization structured data so Google shows your logo in search -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: "INCEPTRA '26 – Trichy Engineering College",
		url: 'https://inceptra.trichyengg.ac.in',
		logo: {
			'@type': 'ImageObject',
			url: 'https://inceptra.trichyengg.ac.in/og-image.png',
			width: 1200,
			height: 630
		},
		sameAs: ['https://inceptra.trichyengg.ac.in']
	})}<\/script>`}
</svelte:head>

{#if !hideLayout}
	<NavBar />
{/if}

<!-- Prize Announcement Banner (fixed bottom) -->
{#if !hideLayout}
	<div class="prize-banner">
		<div class="prize-banner__track">
			{#each Array(3) as _}
				<span class="prize-banner__item">
					🏆 Participate &amp; Win Exciting Cash Prizes upto
					<strong>₹1 Lakh+</strong>
					&nbsp;&nbsp;✨&nbsp;&nbsp;
				</span>
				<span class="prize-banner__item prize-banner__item--cultural">
					🎭 Cultural Fest &mdash; Cash Prizes upto
					<strong>₹1 Lakh+</strong>
					&nbsp;&nbsp;🎶&nbsp;&nbsp;
				</span>
				<span class="prize-banner__item prize-banner__item--symposium">
					🔬 Symposium &mdash; Cash Prizes upto
					<strong>₹1 Lakh+</strong>
					&nbsp;&nbsp;💡&nbsp;&nbsp;
				</span>
				<span class="prize-banner__item prize-banner__item--hackathon">
					💻 Hackathon &mdash; Cash Prizes upto
					<strong>₹1 Lakh+</strong>
					&nbsp;&nbsp;🚀&nbsp;&nbsp;
				</span>
			{/each}
		</div>
	</div>
{/if}

<div class="">
	{@render children()}
</div>

{#if !hideLayout}
	<Footer />
{/if}

<style>
	.prize-banner {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: linear-gradient(90deg, #0f0c29, #302b63, #24243e);
		overflow: hidden;
		padding: 0.6rem 0;
		border-top: 1px solid rgba(255, 200, 0, 0.3);
		z-index: 9999;
		box-shadow: 0 -4px 24px rgba(255, 170, 0, 0.15);
	}

	/* Gradient fade masks on left & right edges */
	.prize-banner::before,
	.prize-banner::after {
		content: '';
		position: absolute;
		top: 0;
		width: 80px;
		height: 100%;
		z-index: 2;
		pointer-events: none;
	}
	.prize-banner::before {
		left: 0;
		background: linear-gradient(to right, #0f0c29, transparent);
	}
	.prize-banner::after {
		right: 0;
		background: linear-gradient(to left, #24243e, transparent);
	}

	.prize-banner__track {
		display: flex;
		white-space: nowrap;
		animation: ticker-scroll 28s linear infinite;
		will-change: transform;
	}

	.prize-banner__track:hover {
		animation-play-state: paused;
	}

	.prize-banner__item {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.82rem;
		font-weight: 500;
		letter-spacing: 0.03em;
		padding: 0 2.5rem;
		background: linear-gradient(90deg, #ffd700, #ffaa00, #ff8c00, #ffd700);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: shimmer-text 4s linear infinite;
	}

	.prize-banner__item strong {
		background: linear-gradient(90deg, #fff176, #ffd700, #fff176);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		font-weight: 800;
		font-size: 0.9rem;
	}

	/* Cultural – pink/purple accent */
	.prize-banner__item--cultural {
		background: linear-gradient(90deg, #ee2b8c, #c026a0, #8c2bee, #ee2b8c);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: shimmer-text 4s linear infinite;
	}
	.prize-banner__item--cultural strong {
		background: linear-gradient(90deg, #f9a8d4, #ee2b8c, #f9a8d4);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Symposium – blue/cyan accent */
	.prize-banner__item--symposium {
		background: linear-gradient(90deg, #60a5fa, #06b6d4, #818cf8, #60a5fa);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: shimmer-text 4s linear infinite;
	}
	.prize-banner__item--symposium strong {
		background: linear-gradient(90deg, #bae6fd, #60a5fa, #bae6fd);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Hackathon – emerald/teal accent */
	.prize-banner__item--hackathon {
		background: linear-gradient(90deg, #34d399, #059669, #2dd4bf, #34d399);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: shimmer-text 4s linear infinite;
	}
	.prize-banner__item--hackathon strong {
		background: linear-gradient(90deg, #a7f3d0, #34d399, #a7f3d0);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	@keyframes ticker-scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	@keyframes shimmer-text {
		0% {
			background-position: 0% center;
		}
		100% {
			background-position: 200% center;
		}
	}
</style>
