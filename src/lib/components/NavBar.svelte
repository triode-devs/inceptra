<script>
	import { Sparkles, Menu, X, ArrowRight, Ticket, ChevronDown } from 'lucide-svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import tecLogo from '$lib/assets/tec svg.svg';

	let isMenuOpen = false;
	let isEventsOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<!-- Desktop Floating Island Nav -->
<div class="pointer-events-none fixed top-0 left-0 z-50 flex w-full justify-center p-6">
	<nav
		class="pointer-events-auto hidden w-full max-w-5xl items-center justify-between rounded-full border border-white/40 bg-white/70 px-2.5 py-2.5 shadow-2xl shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:bg-white/80 md:flex"
	>
		<!-- Logo -->
		<a href="/" class="group flex items-center gap-1.5 pr-6 pl-4 font-['Lexend']">
			<img src={tecLogo} alt="TEC Logo" class="mr-2 h-10 w-auto object-contain" />
			<span class="text-xl font-black tracking-tighter text-[#141118]">INCEPTRA</span>
			<span class="text-xl font-black tracking-tighter text-[#8c2bee]">26</span>
		</a>

		<!-- Center Links -->
		<div
			class="relative flex items-center gap-1 rounded-full border border-white/20 bg-white/50 px-2 py-1.5"
		>
			<!-- Events Dropdown Trigger -->
			<div class="group relative">
				<button
					class="flex items-center gap-1 rounded-full px-5 py-2 text-sm font-semibold text-[#756189] transition-all duration-300 hover:bg-white hover:text-[#141118] hover:shadow-sm"
				>
					Events <ChevronDown size={14} />
				</button>

				<!-- Dropdown Menu -->
				<div
					class="invisible absolute top-full left-0 mt-2 w-48 translate-y-2 transform opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
				>
					<div class="overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
						<a
							href="/symposium"
							class="block rounded-xl px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-[#8c2bee]/5 hover:text-[#8c2bee]"
						>
							Symposium
						</a>
						<a
							href="/cultural"
							class="block rounded-xl px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-[#ee2b8c]/5 hover:text-[#ee2b8c]"
						>
							Cultural
						</a>
					</div>
				</div>
			</div>

			{#each [{ name: 'Venue', link: '/#venue' }, { name: 'Gallery', link: '/gallery' }, { name: 'About', link: '/about' }] as item}
				<a
					href={item.link}
					class="rounded-full px-5 py-2 text-sm font-semibold text-[#756189] transition-all duration-300 hover:bg-white hover:text-[#141118] hover:shadow-sm"
				>
					{item.name}
				</a>
			{/each}
		</div>

		<!-- CTA -->
		<button
			class="flex items-center gap-2 rounded-full bg-[#141118] px-6 py-3 text-sm font-bold text-white shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl active:scale-95"
			on:click={() => {
				window.location.href = '/register';
			}}
		>
			<span>Get Passes</span>
			<Ticket size={16} />
		</button>
	</nav>
</div>

<!-- Mobile Dynamic Header -->
<header
	class="pointer-events-none fixed top-0 z-40 flex w-full items-center justify-between px-6 py-4 md:hidden"
>
	<a
		href="/"
		class="pointer-events-auto flex items-center gap-2 rounded-full border border-white/40 bg-white/80 px-4 py-2 shadow-lg shadow-black/5 backdrop-blur-lg"
	>
		<img src={tecLogo} alt="TEC Logo" class="h-6 w-auto object-contain" />
		
		<span class="text-sm font-bold tracking-wide">INCEPTRA </span>
		<span class="text-sm font-bold tracking-wide text-[#8c2bee]">26</span>
	</a>

	<button
		on:click={toggleMenu}
		class="pointer-events-auto rounded-full border border-white/40 bg-white/80 p-3 text-[#141118] shadow-lg backdrop-blur-lg transition-transform active:scale-90"
	>
		<Menu size={20} />
	</button>
</header>

<!-- Mobile Full Screen Menu Overlay -->
{#if isMenuOpen}
	<div
		class="fixed inset-0 z-50 flex flex-col bg-[#f7f6f8]/95 backdrop-blur-2xl md:hidden"
		transition:fade={{ duration: 200 }}
	>
		<!-- Header -->
		<div class="flex items-center justify-between p-6">
			<div class="flex items-center gap-2">
				<div class="rounded-lg bg-white p-2 shadow-sm">
					<img src={tecLogo} alt="TEC Logo" class="h-8 w-auto object-contain" />
				</div>
				<span class="text-xl font-black tracking-tight">MENU</span>
			</div>
			<button
				on:click={toggleMenu}
				class="rounded-full bg-white p-3 shadow-sm transition-colors hover:bg-gray-100"
			>
				<X size={24} />
			</button>
		</div>

		<!-- Links -->
		<nav class="flex flex-1 flex-col justify-center gap-6 px-8">
			{#each [{ name: 'Home', link: '/' }, { name: 'Symposium', link: '/symposium' }, { name: 'Cultural', link: '/cultural' }, { name: 'Gallery', link: '/gallery' }, { name: 'Venue', link: '/#venue' }, { name: 'About', link: '/about' }] as item, i}
				<a
					href={item.link}
					on:click={toggleMenu}
					class="group flex items-center gap-4 text-4xl font-black text-[#141118] transition-colors hover:text-[#8c2bee]"
					in:fly={{ y: 20, duration: 400, delay: 100 + i * 50, easing: quintOut }}
				>
					<span
						class="h-2 w-2 rounded-full bg-[#8c2bee] opacity-0 transition-opacity group-hover:opacity-100"
					></span>
					{item.name}
				</a>
			{/each}
		</nav>

		<!-- Footer CTA -->
		<div class="p-6 pb-12">
			<button
				class="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#141118] py-5 text-lg font-bold text-white shadow-xl transition-transform active:scale-95"
			>
				Get Your Passes <Ticket size={20} />
			</button>
		</div>
	</div>
{/if}
