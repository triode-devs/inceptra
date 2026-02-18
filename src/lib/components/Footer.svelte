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
		<div
			class="grid grid-cols-2 gap-8 border-b border-white/10 pb-12 text-center lg:grid-cols-4 lg:gap-12 lg:pb-16 lg:text-left"
		>
			<!-- Brand Section -->
			<div class="col-span-2 flex flex-col items-center gap-6 lg:col-span-1 lg:items-start">
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
				<div class="flex justify-center gap-4 lg:justify-start">
					<a
						href="https://www.instagram.com/trichyenggcollege?igsh=YjN5Nm9wYWRiZW9u"
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
				<ul class="flex flex-col items-center gap-4 text-gray-400 lg:items-start">
					{#each [{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }, { name: 'Symposium', url: '/symposium' }, { name: 'Cultural', url: '/cultural' }] as link}
						<li>
							<a href={link.url} class="transition-colors hover:text-[#ee2b8c]">{link.name}</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Developers -->
			<div>
				<h3 class="mb-6 text-lg font-bold">Devs</h3>
				<ul class="flex flex-col items-center gap-4 text-gray-400 lg:items-start">
					<li>
						<a
							href="https://satha-portfolio.pages.dev"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center gap-2 transition-all hover:translate-x-1 hover:text-[#8c2bee]"
						>
							<span
								class="h-1.5 w-1.5 rounded-full bg-[#8c2bee] opacity-0 transition-opacity group-hover:opacity-100"
							></span>
							<span class="font-bold">Sathasivam</span>
						</a>
					</li>
					<li>
						<a
							href="https://vimal-portfolio.pages.dev"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center gap-2 transition-all hover:translate-x-1 hover:text-[#8c2bee]"
						>
							<span
								class="h-1.5 w-1.5 rounded-full bg-[#8c2bee] opacity-0 transition-opacity group-hover:opacity-100"
							></span>
							<span class="font-bold">Vimalraj</span>
						</a>
					</li>
					<li>
						<a
							href="https://santhosh-portfolio.pages.dev"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center gap-2 transition-all hover:translate-x-1 hover:text-[#8c2bee]"
						>
							<span
								class="h-1.5 w-1.5 rounded-full bg-[#8c2bee] opacity-0 transition-opacity group-hover:opacity-100"
							></span>
							<span class="font-bold">Santhosh</span>
						</a>
					</li>
				</ul>
			</div>

			<!-- Contact Info -->
			<div class="col-span-2 lg:col-span-1">
				<h3 class="mb-6 text-lg font-bold">Contact Us</h3>
				<ul class="flex flex-col items-center gap-6 text-gray-400 lg:items-start">
					<li class="flex items-start justify-center gap-4 lg:justify-start">
						<MapPin size={20} class="mt-1 shrink-0 text-[#8c2bee]" />
						<span>Trichy Engineering College,<br />Konalai, Trichy,<br />Tamil Nadu</span>
					</li>
					<li class="flex items-center justify-center gap-4 lg:justify-start">
						<Mail size={20} class="shrink-0 text-[#8c2bee]" />
						<a href="mailto:info@trichyengg.ac.in" class="hover:text-white">info@trichyengg.ac.in</a
						>
					</li>
					<li class="flex items-center justify-center gap-4 lg:justify-start">
						<Phone size={20} class="shrink-0 text-[#8c2bee]" />
						<a href="tel:+919876543210" class="hover:text-white">+91 99441 03066</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div
			class="flex flex-col items-center justify-between gap-6 pt-10 text-sm text-gray-500 md:flex-row"
		>
			<p>&copy; 2026 Inceptra Festival Committee. All Rights Reserved.</p>
			<div class=" items-center gap-1 flex">
				<span>Made with</span>
				<Heart size={14} class="fill-red-500 text-red-500" />
				<span
					>by <a
						href="/devs"
						class="font-bold text-[#8c2bee] hover:underline">Triode Devs</a
					></span
				>
			</div>
		</div>
	</div>
</footer>
