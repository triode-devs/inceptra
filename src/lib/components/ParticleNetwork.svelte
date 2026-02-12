<script>
	import { onMount, onDestroy } from 'svelte';

	let canvas;
	let container;
	let pna;

	// Helper functions
	const getLimitedRandom = function (min, max, roundToInteger) {
		var number = Math.random() * (max - min) + min;
		if (roundToInteger) {
			number = Math.round(number);
		}
		return number;
	};

	const returnRandomArrayitem = function (array) {
		return array[Math.floor(Math.random() * array.length)];
	};

	class Particle {
		constructor(parent, x, y) {
			this.network = parent;
			this.canvas = parent.canvas;
			this.ctx = parent.ctx;
			this.particleColor = returnRandomArrayitem(this.network.options.particleColors);
			this.radius = getLimitedRandom(1.5, 2.5);
			this.opacity = 0;
			this.x = x || Math.random() * this.canvas.width;
			this.y = y || Math.random() * this.canvas.height;
			this.velocity = {
				x: (Math.random() - 0.5) * parent.options.velocity,
				y: (Math.random() - 0.5) * parent.options.velocity
			};
		}

		update() {
			if (this.opacity < 1) {
				this.opacity += 0.01;
			} else {
				this.opacity = 1;
			}
			// Change dir if outside map
			if (this.x > this.canvas.width + 100 || this.x < -100) {
				this.velocity.x = -this.velocity.x;
			}
			if (this.y > this.canvas.height + 100 || this.y < -100) {
				this.velocity.y = -this.velocity.y;
			}

			// Update position
			this.x += this.velocity.x;
			this.y += this.velocity.y;
		}

		draw() {
			// Draw particle
			this.ctx.beginPath();
			this.ctx.fillStyle = this.particleColor;
			this.ctx.globalAlpha = this.opacity;
			this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			this.ctx.fill();
		}
	}

	class ParticleNetwork {
		constructor(parent) {
			this.options = {
				velocity: 1, // the higher the faster
				density: 15000, // the lower the denser
				netLineDistance: 200,
				netLineColor: '#756189',
				particleColors: ['#6a22b3', '#b3206a', '#4a3f57'] // Darker variants of the theme colors
			};
			this.canvas = parent.canvas;
			this.ctx = parent.ctx;
			this.particles = [];
			this.createIntervalId = null;
			this.animationFrame = null;
			this.interactionParticle = null;

			this.init();
		}

		init() {
			// Create particle objects
			this.createParticles(true);

			// Update canvas
			this.animationFrame = requestAnimationFrame(this.update.bind(this));

			this.bindUiActions();
		}

		createParticles(isInitial) {
			// Initialise / reset particles
			this.particles = [];
			var quantity = (this.canvas.width * this.canvas.height) / this.options.density;

			if (isInitial) {
				var counter = 0;
				if (this.createIntervalId) clearInterval(this.createIntervalId);
				this.createIntervalId = setInterval(
					function () {
						if (counter < quantity - 1) {
							// Create particle object
							this.particles.push(new Particle(this));
						} else {
							clearInterval(this.createIntervalId);
						}
						counter++;
					}.bind(this),
					250
				);
			} else {
				// Create particle objects
				for (var i = 0; i < quantity; i++) {
					this.particles.push(new Particle(this));
				}
			}
		}

		createInteractionParticle() {
			// Add interaction particle
			this.interactionParticle = new Particle(this);
			this.interactionParticle.velocity = {
				x: 0,
				y: 0
			};
			this.particles.push(this.interactionParticle);
			return this.interactionParticle;
		}

		removeInteractionParticle() {
			// Find it
			var index = this.particles.indexOf(this.interactionParticle);
			if (index > -1) {
				// Remove it
				this.interactionParticle = undefined;
				this.particles.splice(index, 1);
			}
		}

		update() {
			if (this.canvas) {
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.ctx.globalAlpha = 1;

				// Draw connections
				for (var i = 0; i < this.particles.length; i++) {
					for (var j = this.particles.length - 1; j > i; j--) {
						var distance,
							p1 = this.particles[i],
							p2 = this.particles[j];

						// check very simply if the two points are even a candidate for further measurements
						distance = Math.min(Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y));
						if (distance > this.options.netLineDistance) {
							continue;
						}

						// the two points seem close enough, now let's measure precisely
						distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
						if (distance > this.options.netLineDistance) {
							continue;
						}

						this.ctx.beginPath();
						this.ctx.strokeStyle = this.options.netLineColor;
						this.ctx.globalAlpha =
							((this.options.netLineDistance - distance) / this.options.netLineDistance) *
							p1.opacity *
							p2.opacity;
						this.ctx.lineWidth = 0.7;
						this.ctx.moveTo(p1.x, p1.y);
						this.ctx.lineTo(p2.x, p2.y);
						this.ctx.stroke();
					}
				}

				// Draw particles
				for (var i = 0; i < this.particles.length; i++) {
					this.particles[i].update();
					this.particles[i].draw();
				}

				if (this.options.velocity !== 0) {
					this.animationFrame = requestAnimationFrame(this.update.bind(this));
				}
			} else {
				cancelAnimationFrame(this.animationFrame);
			}
		}

		bindUiActions() {
			// Mouse / touch event handling
			this.spawnQuantity = 3;
			this.mouseIsDown = false;
			this.touchIsMoving = false;

			this.onMouseMove = function (e) {
				if (!this.interactionParticle) {
					this.createInteractionParticle();
				}
				const rect = this.canvas.getBoundingClientRect();
				this.interactionParticle.x = e.clientX - rect.left;
				this.interactionParticle.y = e.clientY - rect.top;
			}.bind(this);

			this.onTouchMove = function (e) {
				// e.preventDefault(); // Removed to allow scrolling
				this.touchIsMoving = true;
				if (!this.interactionParticle) {
					this.createInteractionParticle();
				}
				const rect = this.canvas.getBoundingClientRect();
				this.interactionParticle.x = e.changedTouches[0].clientX - rect.left;
				this.interactionParticle.y = e.changedTouches[0].clientY - rect.top;
			}.bind(this);

			this.onMouseDown = function (e) {
				this.mouseIsDown = true;
				var counter = 0;
				var quantity = this.spawnQuantity;
				var intervalId = setInterval(
					function () {
						if (this.mouseIsDown) {
							if (counter === 1) {
								quantity = 1;
							}
							for (var i = 0; i < quantity; i++) {
								if (this.interactionParticle) {
									this.particles.push(
										new Particle(this, this.interactionParticle.x, this.interactionParticle.y)
									);
								}
							}
						} else {
							clearInterval(intervalId);
						}
						counter++;
					}.bind(this),
					50
				);
			}.bind(this);

			this.onTouchStart = function (e) {
				// e.preventDefault(); // Removed to allow scrolling
				const rect = this.canvas.getBoundingClientRect();
				setTimeout(
					function () {
						if (!this.touchIsMoving) {
							for (var i = 0; i < this.spawnQuantity; i++) {
								this.particles.push(
									new Particle(
										this,
										e.changedTouches[0].clientX - rect.left,
										e.changedTouches[0].clientY - rect.top
									)
								);
							}
						}
					}.bind(this),
					200
				);
			}.bind(this);

			this.onMouseUp = function (e) {
				this.mouseIsDown = false;
			}.bind(this);

			this.onMouseOut = function (e) {
				this.removeInteractionParticle();
			}.bind(this);

			this.onTouchEnd = function (e) {
				// e.preventDefault(); // Removed to allow scrolling
				this.touchIsMoving = false;
				this.removeInteractionParticle();
			}.bind(this);

			// Binding listeners to window to ensure smooth interaction even if mouse leaves canvas or elements are on top
			window.addEventListener('mousemove', this.onMouseMove);
			window.addEventListener('touchmove', this.onTouchMove, { passive: true });
			window.addEventListener('mousedown', this.onMouseDown);
			window.addEventListener('touchstart', this.onTouchStart, { passive: true });
			window.addEventListener('mouseup', this.onMouseUp);
			// window.addEventListener('mouseout', this.onMouseOut); // Mouseout on window is tricky, often fires when entering child elements
			window.addEventListener('touchend', this.onTouchEnd);
		}

		unbindUiActions() {
			window.removeEventListener('mousemove', this.onMouseMove);
			window.removeEventListener('touchmove', this.onTouchMove);
			window.removeEventListener('mousedown', this.onMouseDown);
			window.removeEventListener('touchstart', this.onTouchStart);
			window.removeEventListener('mouseup', this.onMouseUp);
			// window.removeEventListener('mouseout', this.onMouseOut);
			window.removeEventListener('touchend', this.onTouchEnd);
		}

		destroy() {
			if (this.createIntervalId) clearInterval(this.createIntervalId);
			if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
			this.unbindUiActions();
		}
	}

	class ParticleNetworkAnimation {
		constructor() {
			this.container = container;
			this.canvas = canvas;
			this.sizeCanvas();
			this.ctx = this.canvas.getContext('2d');
			this.particleNetwork = new ParticleNetwork(this);

			this.bindUiActions();
		}

		bindUiActions() {
			let oldWidth = this.container.offsetWidth;

			this.resizeHandler = function () {
				const newWidth = this.container.offsetWidth;
				// Ignore resize if width hasn't changed (handles mobile address bar show/hide)
				if (oldWidth === newWidth) return;

				oldWidth = newWidth;
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.sizeCanvas();
				this.particleNetwork.createParticles();
			}.bind(this);
			window.addEventListener('resize', this.resizeHandler);
		}

		sizeCanvas() {
			this.canvas.width = this.container.offsetWidth;
			this.canvas.height = this.container.offsetHeight;
		}

		destroy() {
			if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
			if (this.particleNetwork) this.particleNetwork.destroy();
		}
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			pna = new ParticleNetworkAnimation();
		}
	});

	onDestroy(() => {
		if (pna) {
			pna.destroy();
		}
	});
</script>

<div class="particle-network-animation" bind:this={container}>
	<canvas bind:this={canvas}></canvas>
	<div class="glow glow-1"></div>
	<div class="glow glow-2"></div>
	<div class="glow glow-3"></div>
</div>

<style>
	.particle-network-animation {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 100vh;
		background-color: #fdfcfd;
		z-index: -1;
		pointer-events: none; /* Let clicks pass through, but we bind window events for interaction */
	}

	.particle-network-animation::before {
		display: none;
	}

	.glow {
		z-index: -1;
		position: fixed;
		top: 50%;
		left: 50%;
		background-image: radial-gradient(circle closest-side, rgba(140, 43, 238, 0.08), transparent);
	}

	.glow-1 {
		width: 150vw;
		height: 150vh;
		margin-top: -75vh;
		margin-left: -75vw;
		animation: glow-1-move 25s linear infinite both;
	}

	@keyframes glow-1-move {
		from {
			transform: translate(-100%, 100%);
		}
		to {
			transform: translate(100%, -100%);
		}
	}

	.glow-2 {
		width: 100vw;
		height: 100vh;
		margin-top: -50vh;
		margin-left: -50vw;
		animation: glow-2-move 25s linear 8.33s infinite both;
	}

	@keyframes glow-2-move {
		from {
			transform: translate(-100%, 0%);
		}
		to {
			transform: translate(100%, 100%);
		}
	}

	.glow-3 {
		width: 120vw;
		height: 120vh;
		margin-top: -60vh;
		margin-left: -60vw;
		animation: glow-3-move 25s linear 16.66s infinite both;
	}

	@keyframes glow-3-move {
		from {
			transform: translate(100%, 100%);
		}
		to {
			transform: translate(0%, -100%);
		}
	}
</style>
