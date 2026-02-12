<script>
	import {
		Sparkles,
		Instagram,
		Linkedin,
		Facebook,
		Youtube,
		Mail,
		MapPin,
		Phone,
		ArrowRight,
		Heart
	} from 'lucide-svelte';
	import tecLogo from '$lib/assets/tec svg.svg';
</script>

<footer class="relative overflow-hidden bg-[#141118] pt-20 pb-10 font-['Lexend'] text-white">
	<!-- Decorative Gradient Blur -->
	<div
		class="pointer-events-none absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8c2bee] opacity-20 blur-[100px]"
	></div>

	<div class="mx-auto max-w-[1280px] px-6 md:px-20">
		<div class="grid grid-cols-1 gap-12 border-b border-white/10 pb-16 lg:grid-cols-4">
			<!-- Brand Section -->
			<div class="flex flex-col gap-6 lg:col-span-1">
				<div class="flex items-center gap-2">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-1 text-white shadow-lg"
					>
						<img src={tecLogo} alt="TEC Logo" class="h-full w-full object-contain" />
					</div>
					<span class="text-2xl font-black tracking-tighter">INCEPTRA</span>
				</div>
				<p class="leading-relaxed text-gray-400">
					The biggest cultural and technical festival of the year. Join us to celebrate innovation,
					art, and creativity.
				</p>
				<div class="flex gap-4">
					<a
						href="https://www.instagram.com/trichyenggcollege"
						target="_blank"
						rel="noopener noreferrer"
						class="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-[#8c2bee] hover:text-white hover:shadow-lg hover:shadow-[#8c2bee]/20"
					>
						<Instagram size={18} />
					</a>
					<a
						href="https://www.facebook.com/trichyenggcollege.fb/"
						target="_blank"
						rel="noopener noreferrer"
						class="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-[#8c2bee] hover:text-white hover:shadow-lg hover:shadow-[#8c2bee]/20"
					>
						<Facebook size={18} />
					</a>
					<a
						href="https://in.linkedin.com/school/trichy-engineering-college/"
						target="_blank"
						rel="noopener noreferrer"
						class="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-[#8c2bee] hover:text-white hover:shadow-lg hover:shadow-[#8c2bee]/20"
					>
						<Linkedin size={18} />
					</a>
					<a
						href="https://www.youtube.com/@trichyenggcollege"
						target="_blank"
						rel="noopener noreferrer"
						class="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-[#8c2bee] hover:text-white hover:shadow-lg hover:shadow-[#8c2bee]/20"
					>
						<Youtube size={18} />
					</a>
				</div>
			</div>

			<!-- Quick Links -->
			<div>
				<h3 class="mb-6 text-lg font-bold">Quick Links</h3>
				<ul class="flex flex-col gap-4 text-gray-400">
					{#each [{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }, { name: 'Symposium', url: '/symposium' }, { name: 'Cultural', url: '/cultural' }, { name: 'Register', url: '/register' }] as link}
						<li>
							<a href={link.url} class="transition-colors hover:text-[#ee2b8c]">{link.name}</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Contact Info -->
			<div>
				<h3 class="mb-6 text-lg font-bold">Contact Us</h3>
				<ul class="flex flex-col gap-6 text-gray-400">
					<li class="flex items-start gap-4">
						<MapPin size={20} class="mt-1 shrink-0 text-[#8c2bee]" />
						<span>Trichy Engineering College,<br />Konali, Trichy,<br />Tamil Nadu</span>
					</li>
					<li class="flex items-center gap-4">
						<Mail size={20} class="shrink-0 text-[#8c2bee]" />
						<a href="mailto:info@trichyengg.ac.in" class="hover:text-white">info@trichyengg.ac.in</a
						>
					</li>
					<li class="flex items-center gap-4">
						<Phone size={20} class="shrink-0 text-[#8c2bee]" />
						<a href="tel:+919876543210" class="hover:text-white">+91 99441 03066</a>
					</li>
				</ul>
			</div>

			<!-- Newsletter -->
			<div>
				<h3 class="mb-6 text-lg font-bold">Stay Updated</h3>
				<p class="mb-4 text-sm text-gray-400">
					Subscribe to our newsletter for the latest updates and announcements.
				</p>
				<form class="flex flex-col gap-3">
					<input
						type="email"
						placeholder="Enter your email"
						class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 transition-all outline-none focus:border-[#8c2bee] focus:bg-white/10"
					/>
					<button
						class="flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-95"
					>
						Subscribe <ArrowRight size={16} />
					</button>
				</form>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div
			class="flex flex-col items-center justify-between gap-6 pt-10 text-sm text-gray-500 md:flex-row"
		>
			<p>&copy; 2026 Inceptra Festival Committee. All Rights Reserved.</p>
			<div class="flex items-center gap-6">
				<a href="/" class="hover:text-white">Privacy Policy</a>
				<a href="/" class="hover:text-white">Terms of Service</a>
				<a href="/" class="hover:text-white">Cookies</a>
			</div>
			<div class="flex items-center gap-1">
				<span>Made with</span>
				<Heart size={14} class="fill-red-500 text-red-500" />
				<span
					>by <a
						href="https://triode-portfolio.pages.dev/"
						target="_blank"
						rel="noopener noreferrer"
						class="font-bold text-[#8c2bee] hover:underline">Triode Devs</a
					></span
				>
			</div>
		</div>
	</div>
</footer>
