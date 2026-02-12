<script>
	import { onMount, tick } from 'svelte';
	import { gsap } from 'gsap';

	/**
	 * @typedef {Object} MasonryItem
	 * @property {string|number} id
	 * @property {string} img
	 * @property {number} height
	 * @property {string} [url]
	 */

	let {
		items = [],
		ease = 'power3.out',
		duration = 0.6,
		stagger = 0.05,
		animateFrom = 'bottom',
		scaleOnHover = true,
		hoverScale = 0.95,
		blurToFocus = true,
		colorShiftOnHover = false
	} = $props();

	let containerRef = $state();
	let width = $state(0);
	let columns = $state(1);
	let imagesReady = $state(false);
	let grid = $state([]);
	let hasMounted = false;

	const queries = [
		'(min-width:1500px)',
		'(min-width:1000px)',
		'(min-width:600px)',
		'(min-width:400px)'
	];
	const values = [5, 4, 3, 2];
	const defaultValue = 1;

	function updateColumns() {
		if (typeof window === 'undefined') return;
		const index = queries.findIndex((q) => window.matchMedia(q).matches);
		columns = index !== -1 ? values[index] : defaultValue;
	}

	async function preloadImages(urls) {
		await Promise.all(
			urls.map(
				(src) =>
					new Promise((resolve) => {
						const img = new Image();
						img.src = src;
						img.onload = img.onerror = () => resolve();
					})
			)
		);
	}

	function getInitialPosition(item) {
		if (!containerRef) return { x: item.x, y: item.y };
		const containerRect = containerRef.getBoundingClientRect();

		let direction = animateFrom;
		if (animateFrom === 'random') {
			const dirs = ['top', 'bottom', 'left', 'right'];
			direction = dirs[Math.floor(Math.random() * dirs.length)];
		}

		switch (direction) {
			case 'top':
				return { x: item.x, y: -200 };
			case 'bottom':
				return { x: item.x, y: window.innerHeight + 200 };
			case 'left':
				return { x: -200, y: item.y };
			case 'right':
				return { x: window.innerWidth + 200, y: item.y };
			case 'center':
				return {
					x: containerRect.width / 2 - item.w / 2,
					y: containerRect.height / 2 - item.h / 2
				};
			default:
				return { x: item.x, y: item.y + 100 };
		}
	}

	$effect(() => {
		if (items.length > 0) {
			preloadImages(items.map((i) => i.img)).then(() => (imagesReady = true));
		}
	});

	$effect(() => {
		updateColumns();
		const handlers = queries.map((q) => {
			const mql = window.matchMedia(q);
			const handler = () => updateColumns();
			mql.addEventListener('change', handler);
			return { mql, handler };
		});

		const ro = new ResizeObserver(([entry]) => {
			width = entry.contentRect.width;
		});
		if (containerRef) ro.observe(containerRef);

		return () => {
			handlers.forEach(({ mql, handler }) => mql.removeEventListener('change', handler));
			ro.disconnect();
		};
	});

	$effect(() => {
		if (!width || !items.length) return;

		const colHeights = new Array(columns).fill(0);
		const gap = 16;
		const totalGaps = (columns - 1) * gap;
		const columnWidth = (width - totalGaps) / columns;

		grid = items.map((child) => {
			const col = colHeights.indexOf(Math.min(...colHeights));
			const x = col * (columnWidth + gap);
			const height = child.height / 2; // Assuming height is provided in item
			const y = colHeights[col];

			colHeights[col] += height + gap;
			return { ...child, x, y, w: columnWidth, h: height };
		});

		// Calculate total height
		if (containerRef) {
			const maxHeight = Math.max(...colHeights);
			containerRef.style.height = `${maxHeight}px`;
		}
	});

	$effect(() => {
		if (!imagesReady || !grid.length || !containerRef) return;

		grid.forEach((item, index) => {
			const element = containerRef.querySelector(`[data-key="${item.id}"]`);
			if (!element) return;

			const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

			if (!hasMounted) {
				const start = getInitialPosition(item);
				gsap.fromTo(
					element,
					{
						opacity: 0,
						x: start.x,
						y: start.y,
						width: item.w,
						height: item.h,
						...(blurToFocus && { filter: 'blur(10px)' })
					},
					{
						opacity: 1,
						...animProps,
						...(blurToFocus && { filter: 'blur(0px)' }),
						duration: 0.8,
						ease: 'power3.out',
						delay: index * stagger
					}
				);
			} else {
				gsap.to(element, {
					...animProps,
					duration,
					ease,
					overwrite: 'auto'
				});
			}
		});

		hasMounted = true;
	});

	function handleMouseEnter(id, element) {
		if (scaleOnHover) {
			gsap.to(element, {
				scale: hoverScale,
				duration: 0.3,
				ease: 'power2.out'
			});
		}
		if (colorShiftOnHover) {
			const overlay = element.querySelector('.color-overlay');
			if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
		}
	}

	function handleMouseLeave(id, element) {
		if (scaleOnHover) {
			gsap.to(element, {
				scale: 1,
				duration: 0.3,
				ease: 'power2.out'
			});
		}
		if (colorShiftOnHover) {
			const overlay = element.querySelector('.color-overlay');
			if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
		}
	}
	let selectedImage = $state(null);

	function openLightbox(img) {
		selectedImage = img;
		tick().then(() => {
			gsap.fromTo(
				'.lightbox-overlay',
				{ opacity: 0 },
				{ opacity: 1, duration: 0.3, ease: 'power2.out' }
			);
			gsap.fromTo(
				'.lightbox-content',
				{ scale: 0.9, opacity: 0 },
				{ scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
			);
		});
	}

	function closeLightbox() {
		gsap.to('.lightbox-overlay', {
			opacity: 0,
			duration: 0.3,
			onComplete: () => (selectedImage = null)
		});
	}
</script>

<div bind:this={containerRef} class="relative w-full">
	{#each grid as item (item.id)}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			data-key={item.id}
			class="absolute box-content cursor-pointer"
			style="will-change: transform, width, height, opacity; left: 0; top: 0;"
			onclick={() => openLightbox(item.img)}
			onmouseenter={(e) => handleMouseEnter(item.id, e.currentTarget)}
			onmouseleave={(e) => handleMouseLeave(item.id, e.currentTarget)}
		>
			<div
				class="relative h-full w-full rounded-[10px] bg-cover bg-center shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)]"
				style="background-image: url({item.img});"
			>
				{#if colorShiftOnHover}
					<div
						class="color-overlay pointer-events-none absolute inset-0 rounded-[10px] bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0"
					></div>
				{/if}
			</div>
		</div>
	{/each}
</div>

{#if selectedImage}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="lightbox-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md md:p-10"
		onclick={closeLightbox}
	>
		<button
			class="absolute top-6 right-6 z-[110] rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20"
			onclick={closeLightbox}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
			>
		</button>

		<div class="lightbox-content relative max-h-full max-w-full overflow-hidden rounded-2xl">
			<img
				src={selectedImage}
				alt="Gallery focus"
				class="h-auto max-h-[90vh] w-auto max-w-full object-contain shadow-2xl"
			/>
		</div>
	</div>
{/if}
