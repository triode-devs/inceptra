<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { gsap } from 'gsap';

	let {
		dotSize = 16,
		gap = 32,
		baseColor = '#5227FF',
		activeColor = '#5227FF',
		proximity = 150,
		speedTrigger = 100,
		shockRadius = 250,
		shockStrength = 5,
		maxSpeed = 5000,
		resistance = 750,
		returnDuration = 1.5,
		className = '',
		style = ''
	} = $props();

	let wrapperRef = $state();
	let canvasRef = $state();
	let dots = [];
	let pointer = {
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		speed: 0,
		lastTime: 0,
		lastX: 0,
		lastY: 0
	};

	const hexToRgb = (hex) => {
		const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
		if (!m) return { r: 0, g: 0, b: 0 };
		return {
			r: parseInt(m[1], 16),
			g: parseInt(m[2], 16),
			b: parseInt(m[3], 16)
		};
	};

	let baseRgb = $derived(hexToRgb(baseColor));
	let activeRgb = $derived(hexToRgb(activeColor));

	let circlePath;

	const throttle = (func, limit) => {
		let lastCall = 0;
		return function (...args) {
			const now = performance.now();
			if (now - lastCall >= limit) {
				lastCall = now;
				func.apply(this, args);
			}
		};
	};

	function buildGrid() {
		if (!wrapperRef || !canvasRef) return;

		const { width, height } = wrapperRef.getBoundingClientRect();
		const dpr = window.devicePixelRatio || 1;

		canvasRef.width = width * dpr;
		canvasRef.height = height * dpr;
		canvasRef.style.width = `${width}px`;
		canvasRef.style.height = `${height}px`;
		const ctx = canvasRef.getContext('2d');
		if (ctx) ctx.scale(dpr, dpr);

		const cols = Math.floor((width + gap) / (dotSize + gap));
		const rows = Math.floor((height + gap) / (dotSize + gap));
		const cell = dotSize + gap;

		const gridW = cell * cols - gap;
		const gridH = cell * rows - gap;

		const extraX = width - gridW;
		const extraY = height - gridH;

		const startX = extraX / 2 + dotSize / 2;
		const startY = extraY / 2 + dotSize / 2;

		dots = [];
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				const cx = startX + x * cell;
				const cy = startY + y * cell;
				dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
			}
		}
	}

	let rafId;
	function draw() {
		if (!canvasRef) return;
		const ctx = canvasRef.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

		const proxSq = proximity * proximity;
		const { x: px, y: py } = pointer;

		for (const dot of dots) {
			const ox = dot.cx + dot.xOffset;
			const oy = dot.cy + dot.yOffset;
			const dx = dot.cx - px;
			const dy = dot.cy - py;
			const dsq = dx * dx + dy * dy;

			let fillStyle = baseColor;
			if (dsq <= proxSq) {
				const dist = Math.sqrt(dsq);
				const t = 1 - dist / proximity;
				const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
				const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
				const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
				fillStyle = `rgb(${r},${g},${b})`;
			}

			ctx.save();
			ctx.translate(ox, oy);
			ctx.fillStyle = fillStyle;
			if (circlePath) {
				ctx.fill(circlePath);
			} else {
				ctx.beginPath();
				ctx.arc(0, 0, dotSize / 4, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.restore();
		}

		rafId = requestAnimationFrame(draw);
	}

	function handleMove(e) {
		const now = performance.now();
		const dt = pointer.lastTime ? now - pointer.lastTime : 16;
		const dx = e.clientX - pointer.lastX;
		const dy = e.clientY - pointer.lastY;
		let vx = (dx / dt) * 1000;
		let vy = (dy / dt) * 1000;
		let speed = Math.hypot(vx, vy);

		if (speed > maxSpeed) {
			const scale = maxSpeed / speed;
			vx *= scale;
			vy *= scale;
			speed = maxSpeed;
		}

		pointer.lastTime = now;
		pointer.lastX = e.clientX;
		pointer.lastY = e.clientY;
		pointer.vx = vx;
		pointer.vy = vy;
		pointer.speed = speed;

		if (!canvasRef) return;
		const rect = canvasRef.getBoundingClientRect();
		pointer.x = e.clientX - rect.left;
		pointer.y = e.clientY - rect.top;

		for (const dot of dots) {
			const dist = Math.hypot(dot.cx - pointer.x, dot.cy - pointer.y);
			if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
				dot._inertiaApplied = true;
				gsap.killTweensOf(dot);

				const pushX = (dot.cx - pointer.x) * 0.5 + vx * 0.02;
				const pushY = (dot.cy - pointer.y) * 0.5 + vy * 0.02;

				// Fallback since InertiaPlugin might not be available
				gsap.to(dot, {
					xOffset: pushX,
					yOffset: pushY,
					duration: 0.3,
					ease: 'power2.out',
					onComplete: () => {
						gsap.to(dot, {
							xOffset: 0,
							yOffset: 0,
							duration: returnDuration,
							ease: 'elastic.out(1,0.75)',
							onComplete: () => {
								dot._inertiaApplied = false;
							}
						});
					}
				});
			}
		}
	}

	function handleClick(e) {
		if (!canvasRef) return;
		const rect = canvasRef.getBoundingClientRect();
		const cx = e.clientX - rect.left;
		const cy = e.clientY - rect.top;

		for (const dot of dots) {
			const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
			if (dist < shockRadius && !dot._inertiaApplied) {
				dot._inertiaApplied = true;
				gsap.killTweensOf(dot);
				const falloff = Math.max(0, 1 - dist / shockRadius);
				const pushX = (dot.cx - cx) * shockStrength * falloff;
				const pushY = (dot.cy - cy) * shockStrength * falloff;

				gsap.to(dot, {
					xOffset: pushX,
					yOffset: pushY,
					duration: 0.4,
					ease: 'power2.out',
					onComplete: () => {
						gsap.to(dot, {
							xOffset: 0,
							yOffset: 0,
							duration: returnDuration,
							ease: 'elastic.out(1,0.75)',
							onComplete: () => {
								dot._inertiaApplied = false;
							}
						});
					}
				});
			}
		}
	}

	onMount(() => {
		if (typeof window !== 'undefined' && window.Path2D) {
			circlePath = new Path2D();
			circlePath.arc(0, 0, dotSize / 4, 0, Math.PI * 2);
		}

		buildGrid();

		const throttledMove = throttle(handleMove, 16);

		window.addEventListener('mousemove', throttledMove, { passive: true });
		window.addEventListener('click', handleClick);

		let ro;
		if ('ResizeObserver' in window) {
			ro = new ResizeObserver(buildGrid);
			ro.observe(wrapperRef);
		} else {
			window.addEventListener('resize', buildGrid);
		}

		rafId = requestAnimationFrame(draw);

		return () => {
			window.removeEventListener('mousemove', throttledMove);
			window.removeEventListener('click', handleClick);
			cancelAnimationFrame(rafId);
			if (ro) ro.disconnect();
			else window.removeEventListener('resize', buildGrid);
		};
	});
</script>

<div
	class="pointer-events-none absolute inset-0 h-full w-full overflow-hidden opacity-30 {className}"
	{style}
>
	<div bind:this={wrapperRef} class="relative h-full w-full">
		<canvas bind:this={canvasRef} class="absolute inset-0 h-full w-full"></canvas>
	</div>
</div>
