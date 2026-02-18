<script>
	import {
		Github,
		Globe,
		Linkedin,
		Cpu,
		Code2,
		Rocket,
		ExternalLink,
		ChevronRight,
		Terminal,
		Sparkles
	} from 'lucide-svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	const developers = [
		{
			name: 'Sathasivam',
			role: 'Lead Architect',
			image:
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
			portfolio: 'https://satha-portfolio.pages.dev',
			github: '#',
			linkedin: '#',
			skills: ['SvelteKit', 'Tailwind CSS', 'Cloudflare'],
			color: 'from-purple-500 to-indigo-600'
		},
		{
			name: 'Vimalraj',
			role: 'Senior Developer',
			image:
				'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop',
			portfolio: 'https://vimal-portfolio.pages.dev',
			github: '#',
			linkedin: '#',
			skills: ['UI/UX', 'JavaScript', 'Node.js'],
			color: 'from-pink-500 to-rose-600'
		},
		{
			name: 'Santhosh',
			role: 'Full Stack Dev',
			image:
				'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop',
			portfolio: 'https://santhosh-portfolio.pages.dev',
			github: '#',
			linkedin: '#',
			skills: ['Backend', 'PostgreSQL', 'API Design'],
			color: 'from-blue-500 to-cyan-600'
		}
	];
	// Custom Svelte Icon Component
	const SvelteIcon = {
		view: () => `
			<svg width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><title>file_type_svelte</title><path d="M26.47,5.7A8.973,8.973,0,0,0,14.677,3.246L7.96,7.4a7.461,7.461,0,0,0-3.481,5.009,7.686,7.686,0,0,0,.8,5.058,7.358,7.358,0,0,0-1.151,2.8,7.789,7.789,0,0,0,1.4,6.028,8.977,8.977,0,0,0,11.794,2.458L24.04,24.6a7.468,7.468,0,0,0,3.481-5.009,7.673,7.673,0,0,0-.8-5.062,7.348,7.348,0,0,0,1.152-2.8A7.785,7.785,0,0,0,26.47,5.7" style="fill:#ff3e00"/><path d="M14.022,26.64A5.413,5.413,0,0,1,8.3,24.581a4.678,4.678,0,0,1-.848-3.625,4.307,4.307,0,0,1,.159-.61l.127-.375.344.238a8.76,8.76,0,0,0,2.628,1.274l.245.073-.025.237a1.441,1.441,0,0,0,.271.968,1.63,1.63,0,0,0,1.743.636,1.512,1.512,0,0,0,.411-.175l6.7-4.154a1.366,1.366,0,0,0,.633-.909,1.407,1.407,0,0,0-.244-1.091,1.634,1.634,0,0,0-1.726-.622,1.509,1.509,0,0,0-.413.176l-2.572,1.584a4.934,4.934,0,0,1-1.364.582,5.415,5.415,0,0,1-5.727-2.06A4.678,4.678,0,0,1,7.811,13.1,4.507,4.507,0,0,1,9.9,10.09l6.708-4.154a4.932,4.932,0,0,1,1.364-.581A5.413,5.413,0,0,1,23.7,7.414a4.679,4.679,0,0,1,.848,3.625,4.272,4.272,0,0,1-.159.61l-.127.375-.344-.237a8.713,8.713,0,0,0-2.628-1.274l-.245-.074.025-.237a1.438,1.438,0,0,0-.272-.968,1.629,1.629,0,0,0-1.725-.622,1.484,1.484,0,0,0-.411.176l-6.722,4.14a1.353,1.353,0,0,0-.631.908,1.394,1.394,0,0,0,.244,1.092,1.634,1.634,0,0,0,1.726.621,1.538,1.538,0,0,0,.413-.175l2.562-1.585a4.9,4.9,0,0,1,1.364-.581,5.417,5.417,0,0,1,5.728,2.059,4.681,4.681,0,0,1,.843,3.625A4.5,4.5,0,0,1,22.1,21.905l-6.707,4.154a4.9,4.9,0,0,1-1.364.581" style="fill:#fff"/></svg>`
	};

	const TailwindIcon = {
		view: () => `
			<svg width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><title>file_type_tailwind</title><path d="M9,13.7q1.4-5.6,7-5.6c5.6,0,6.3,4.2,9.1,4.9q2.8.7,4.9-2.1-1.4,5.6-7,5.6c-5.6,0-6.3-4.2-9.1-4.9Q11.1,10.9,9,13.7ZM2,22.1q1.4-5.6,7-5.6c5.6,0,6.3,4.2,9.1,4.9q2.8.7,4.9-2.1-1.4,5.6-7,5.6c-5.6,0-6.3-4.2-9.1-4.9Q4.1,19.3,2,22.1Z" style="fill:#44a8b3"/></svg>`
	};

	const CloudflareIcon = {
		view: () => `
			<svg width="24" height="24" viewBox="0 -70 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
				<g>
					<g transform="translate(0.000000, -1.000000)">
						<path d="M202.3569,50.394 L197.0459,48.27 C172.0849,104.434 72.7859,70.289 66.8109,86.997 C65.8149,98.283 121.0379,89.143 160.5169,91.056 C172.5559,91.639 178.5929,100.727 173.4809,115.54 L183.5499,115.571 C195.1649,79.362 232.2329,97.841 233.7819,85.891 C231.2369,78.034 191.1809,85.891 202.3569,50.394 Z" fill="#FFFFFF"></path>
						<path d="M176.332,109.3483 C177.925,104.0373 177.394,98.7263 174.739,95.5393 C172.083,92.3523 168.365,90.2283 163.585,89.6973 L71.17,88.6343 C70.639,88.6343 70.108,88.1033 69.577,88.1033 C69.046,87.5723 69.046,87.0413 69.577,86.5103 C70.108,85.4483 70.639,84.9163 71.701,84.9163 L164.647,83.8543 C175.801,83.3233 187.486,74.2943 191.734,63.6723 L197.046,49.8633 C197.046,49.3313 197.577,48.8003 197.046,48.2693 C191.203,21.1823 166.772,0.9993 138.091,0.9993 C111.535,0.9993 88.697,17.9953 80.73,41.8963 C75.419,38.1783 69.046,36.0533 61.61,36.5853 C48.863,37.6473 38.772,48.2693 37.178,61.0163 C36.647,64.2033 37.178,67.3903 37.71,70.5763 C16.996,71.1073 0,88.1033 0,109.3483 C0,111.4723 0,113.0663 0.531,115.1903 C0.531,116.2533 1.593,116.7843 2.125,116.7843 L172.614,116.7843 C173.676,116.7843 174.739,116.2533 174.739,115.1903 L176.332,109.3483 Z" fill="#F4811F"></path>
						<path d="M205.5436,49.8628 L202.8876,49.8628 C202.3566,49.8628 201.8256,50.3938 201.2946,50.9248 L197.5766,63.6718 C195.9836,68.9828 196.5146,74.2948 199.1706,77.4808 C201.8256,80.6678 205.5436,82.7918 210.3236,83.3238 L229.9756,84.3858 C230.5066,84.3858 231.0376,84.9168 231.5686,84.9168 C232.0996,85.4478 232.0996,85.9788 231.5686,86.5098 C231.0376,87.5728 230.5066,88.1038 229.4436,88.1038 L209.2616,89.1658 C198.1076,89.6968 186.4236,98.7258 182.1746,109.3478 L181.1116,114.1288 C180.5806,114.6598 181.1116,115.7218 182.1746,115.7218 L252.2826,115.7218 C253.3446,115.7218 253.8756,115.1908 253.8756,114.1288 C254.9376,109.8798 255.9996,105.0998 255.9996,100.3188 C255.9996,72.7008 233.1616,49.8628 205.5436,49.8628" fill="#FAAD3F"></path>
					</g>
				</g>
			</svg>`
	};
	const LucideIcon = {
		view: () => `
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="lucide-logo">
				<path d="M14 12C14 9.79086 12.2091 8 10 8C7.79086 8 6 9.79086 6 12C6 16.4183 9.58172 20 14 20C18.4183 20 22 16.4183 22 12C22 8.446 20.455 5.25285 18 3.05557" stroke="#fff" />
				<path d="M10 12C10 14.2091 11.7909 16 14 16C16.2091 16 18 14.2091 18 12C18 7.58172 14.4183 4 10 4C5.58172 4 2 7.58172 2 12C2 15.5841 3.57127 18.8012 6.06253 21" stroke="#F56565" />
			</svg>`
	};
</script>

<svelte:head>
	<title>The Devs | Triode Team | INCEPTRA '26</title>
	<meta
		name="description"
		content="Meet the creative minds behind Inceptra '26. The Triode Devs team dedicated to building high-performance web experiences."
	/>
</svelte:head>

<div class="min-h-screen bg-[#0a080c] font-['Lexend'] text-white">
	<!-- Background Effects -->
	<div class="pointer-events-none fixed inset-0 overflow-hidden">
		<div
			class="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#8c2bee] opacity-20 blur-[150px]"
		></div>
		<div
			class="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-[#ee2b8c] opacity-20 blur-[150px]"
		></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 mx-auto max-w-[1280px] px-6 pt-32 pb-24 md:px-20">
		<!-- Header -->
		<div class="mb-20 text-center" in:fly={{ y: 30, duration: 800 }}>
			<div
				class="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-bold tracking-widest text-[#8c2bee] uppercase backdrop-blur-md"
			>
				<Terminal size={14} />
				<span>The Engineering Team</span>
			</div>
			<h1 class="mb-6 text-5xl font-black tracking-tighter md:text-7xl">
				Meet <span class="bg-linear-to-r from-[#8c2bee] to-[#ee2b8c] bg-clip-text text-transparent"
					>Triode Devs</span
				>
			</h1>
			<p class="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl">
				The creative collective behind Inceptra '26. We push the boundaries of web development to
				create seamless digital experiences.
			</p>
		</div>

		<!-- Tech Stack -->
		<div
			class="mb-24 grid grid-cols-2 gap-4 md:flex md:justify-center md:gap-8"
			in:fade={{ delay: 400, duration: 800 }}
		>
			{#each [{ name: 'SvelteKit', icon: SvelteIcon, color: '' }, { name: 'Tailwind CSS', icon: TailwindIcon, color: '' }, { name: 'Cloudflare', icon: CloudflareIcon, color: '' }, { name: 'Lucide Icons', icon: LucideIcon, color: '' }] as tech}
				<div
					class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-6 py-4 backdrop-blur-xl transition-all hover:bg-white/10"
				>
					{#if typeof tech.icon === 'object'}
						{@html tech.icon.view()}
					{:else}
						<tech.icon size={20} class={tech.color} />
					{/if}
					<span class="text-sm font-bold">{tech.name}</span>
				</div>
			{/each}
		</div>

		<!-- Developers Grid -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3 hidden">
			{#each developers as dev, i}
				<div
					class="group relative"
					in:fly={{ y: 50, duration: 800, delay: 200 * i, easing: quintOut }}
				>
					<div
						class="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-2xl transition-all duration-500 hover:border-[#8c2bee]/50 hover:bg-white/10"
					>
						<!-- Glow Effect -->
						<div
							class="absolute top-0 left-1/2 h-full w-full -translate-x-1/2 bg-linear-to-b {dev.color} opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-10"
						></div>

						<!-- Image Container -->
						<div class="relative mb-6 aspect-square overflow-hidden rounded-[2.5rem]">
							<img
								src={dev.image}
								alt={dev.name}
								class="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
							/>
							<div
								class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							></div>
						</div>

						<!-- Content -->
						<div class="px-4 pb-4">
							<div class="mb-1 flex items-center justify-between">
								<span class="text-xs font-bold tracking-widest text-[#8c2bee] uppercase"
									>{dev.role}</span
								>
								<!-- Socials -->
								<div class="flex gap-3 opacity-40 transition-opacity group-hover:opacity-100">
									<a href={dev.github} class="hover:text-white"><Github size={16} /></a>
									<a href={dev.linkedin} class="hover:text-white"><Linkedin size={16} /></a>
								</div>
							</div>
							<h3 class="mb-4 text-3xl font-black tracking-tight">{dev.name}</h3>

							<!-- Skills -->
							<div class="mb-6 flex flex-wrap gap-2">
								{#each dev.skills as skill}
									<span
										class="rounded-lg bg-white/5 px-2.5 py-1 text-[10px] font-bold text-gray-400 group-hover:text-white"
									>
										{skill}
									</span>
								{/each}
							</div>

							<!-- CTA -->
							<a
								href={dev.portfolio}
								target="_blank"
								class="flex items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-black text-black transition-all hover:bg-[#8c2bee] hover:text-white active:scale-95"
							>
								<span>View Portfolio</span>
								<ExternalLink size={16} />
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Footer CTA -->
		<div class="mt-32 text-center" in:fade={{ delay: 1000 }}>
			<div class="inline-flex flex-col items-center gap-6">
				<div
					class="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#8c2bee] shadow-2xl shadow-[#8c2bee]/20"
				>
					<Rocket size={40} class="text-white" />
				</div>
				<h2 class="text-3xl font-black">Building the Future</h2>
				<p class="max-w-lg font-medium text-gray-400">
					We specialize in building high-end, high-performance web applications with a focus on
					cutting-edge design and user experience.
				</p>
				<a
					href="mailto:triodedevs@gmail.com"
					class="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-md transition-all hover:bg-white hover:text-black"
				>
					<span>Collaborate with Us</span>
					<ChevronRight size={18} />
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	/* Custom styles if needed, but Tailwind handles most */
	:global(body) {
		background-color: #0a080c;
	}
</style>
