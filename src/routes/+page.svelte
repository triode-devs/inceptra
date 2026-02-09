<script>
	import { onMount } from 'svelte';
	import {
		Calendar,
		PlayCircle,
		MapPin,
		ArrowRight,
		Clock,
		Plus,
		CheckCircle,
		Map,
		MessageCircle
	} from 'lucide-svelte';

	let timeLeft = {
		days: '00',
		hours: '00',
		mins: '00',
		secs: '00'
	};

	onMount(() => {
		// Timer Logic
		const countDownDate = new Date('March 5, 2026 09:00:00').getTime();

		const interval = setInterval(() => {
			const now = new Date().getTime();
			const distance = countDownDate - now;

			if (distance < 0) {
				clearInterval(interval);
				timeLeft = { days: '00', hours: '00', mins: '00', secs: '00' };
				return;
			}

			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const secs = Math.floor((distance % (1000 * 60)) / 1000);

			timeLeft = {
				days: String(days).padStart(2, '0'),
				hours: String(hours).padStart(2, '0'),
				mins: String(mins).padStart(2, '0'),
				secs: String(secs).padStart(2, '0')
			};
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>INCEPTRA '26 | College Symposium & Cultural Festival</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="relative flex h-auto min-h-screen w-full flex-col scroll-smooth bg-[#f7f6f8] font-['Lexend'] text-[#141118] pt-20"
>
	<main class="flex-1 pb-20 md:pb-0">
		<!-- Added padding bottom for mobile nav spacing -->
		<!-- Hero Section -->
		<section class="relative overflow-hidden px-6 pt-12 pb-20 md:px-20">
			<div class="mx-auto max-w-[1280px]">
				<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
					<div
						class="flex flex-col items-center gap-6 text-center md:gap-8 lg:col-span-7 lg:items-start lg:text-left"
					>
						<div
							class="inline-flex w-fit items-center gap-2 rounded-full bg-[#8c2bee]/10 px-4 py-2 text-[#8c2bee]"
						>
							<Calendar size={16} />
							<span class="text-xs font-bold tracking-widest uppercase">March 5 & 6, 2026</span>
						</div>
						<h1 class="text-4xl leading-[1.1] font-black tracking-tight sm:text-5xl md:text-7xl">
							Where <span class="text-[#8c2bee] italic">Innovation</span> Meets
							<span class="text-[#ee2b8c]">Art</span>.
						</h1>
						<p class="max-w-xl text-base text-[#756189] md:text-xl">
							Join us for INCEPTRA '26. The ultimate college symposium and cultural festival. Two
							days of tech, music, dance, and creativity.
						</p>
						<div class="flex w-full flex-wrap justify-center gap-4 lg:justify-start">
							<button
							    onclick={() => {
							        window.location.href = '/register';
							    }}
								class="h-12 w-full rounded-xl bg-[#8c2bee] px-8 text-base font-bold text-white shadow-xl shadow-[#8c2bee]/30 transition-all hover:bg-[#8c2bee]/90 sm:w-auto md:h-14 md:px-10 md:text-lg"
							>
								Get Your Passes
							</button>
						</div>
					</div>
					<div class="relative mt-8 lg:col-span-5 lg:mt-0">
						<div
							class="mx-auto aspect-square max-w-md rotate-3 overflow-hidden rounded-3xl shadow-2xl transition-transform duration-500 hover:rotate-0"
						>
							<div class="hero-gradient flex h-full w-full flex-col justify-end p-6 md:p-8">
								<div class="glass-card rounded-2xl p-6 text-white">
									<p class="mb-1 text-sm font-medium opacity-80">Headline Act</p>
									<h3 class="text-2xl font-bold">The Electric Symphony</h3>
									<p class="mt-2 flex items-center gap-1 text-xs">
										<MapPin size={12} /> Main Stadium, 6:00 PM
									</p>
								</div>
							</div>
							<div
								class="hero-gradient absolute inset-0 z-[-1] scale-110 opacity-30 blur-3xl"
							></div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Countdown Timer -->
		<section class="px-4 py-8 md:px-20 md:py-12">
			<div class="mx-auto max-w-[1280px]">
				<div class="rounded-[2rem] border border-[#f2f0f4] bg-white p-6 shadow-sm md:p-12">
					<div class="flex flex-col items-center justify-between gap-8 lg:flex-row">
						<div class="text-center lg:text-left">
							<h3 class="text-2xl font-bold">Starts In...</h3>
							<p class="text-[#756189]">Mark your calendars for March 5, 2026</p>
						</div>
						<div class="flex flex-wrap justify-center gap-3 md:gap-8">
							<div class="flex flex-col items-center gap-2">
								<div
									class="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#8c2bee]/20 bg-[#8c2bee]/10 md:h-24 md:w-24"
								>
									<span class="text-2xl font-black text-[#8c2bee] md:text-4xl">{timeLeft.days}</span
									>
								</div>
								<span class="text-[10px] font-bold tracking-widest uppercase opacity-60 md:text-xs"
									>Days</span
								>
							</div>
							<div class="flex flex-col items-center gap-2">
								<div
									class="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ee2b8c]/20 bg-[#ee2b8c]/10 md:h-24 md:w-24"
								>
									<span class="text-2xl font-black text-[#ee2b8c] md:text-4xl"
										>{timeLeft.hours}</span
									>
								</div>
								<span class="text-[10px] font-bold tracking-widest uppercase opacity-60 md:text-xs"
									>Hours</span
								>
							</div>
							<div class="flex flex-col items-center gap-2">
								<div
									class="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2b8cee]/20 bg-[#2b8cee]/10 md:h-24 md:w-24"
								>
									<span class="text-2xl font-black text-[#2b8cee] md:text-4xl">{timeLeft.mins}</span
									>
								</div>
								<span class="text-[10px] font-bold tracking-widest uppercase opacity-60 md:text-xs"
									>Mins</span
								>
							</div>
							<div class="flex flex-col items-center gap-2">
								<div
									class="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#f1c40f]/20 bg-[#f1c40f]/10 md:h-24 md:w-24"
								>
									<span class="text-2xl font-black text-[#f1c40f] md:text-4xl">{timeLeft.secs}</span
									>
								</div>
								<span class="text-[10px] font-bold tracking-widest uppercase opacity-60 md:text-xs"
									>Secs</span
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Key Events -->
		<!-- Events Category Selection -->
		<section class="px-6 py-16 md:px-20 md:py-20" id="events">
			<div class="mx-auto max-w-[1280px]">
				<div class="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
					<div class="flex flex-col gap-2">
						<h2 class="text-3xl font-black tracking-tight md:text-4xl">Explore Events</h2>
						<p class="text-[#756189]">
							Choose your vibe: Technical Innovation or Cultural Expression.
						</p>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
					<!-- Symposium Card -->
					<a
						href="/symposium"
						class="group relative overflow-hidden rounded-[2.5rem] bg-white transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#8c2bee]/20"
					>
						<div class="relative aspect-[16/10] overflow-hidden md:aspect-[16/9]">
							<div
								class="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
								style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuA66Iqws8H7dBN7Z92PTKEaOeC3UPNbvZWY_L4v71D7eX1GtHcA_y6wlpb5fzSqr_yjQlRtuKpVskmzmeiFmC7HLe4vejDWXVxaFFsLsakAtpxX7tIJ2aJUFgU6otUb_8eFRBqFjvjAc65UKZFclzOM4vpaTbmztbIles8fV_LRPwwByeT4W4YSA8_ZWvFImcKE9VjHm9Xq94RBZIhcCxMMAoASsJYeYABCNmVbOTtSnFmUsVYq1BhbVbGS6tFF2OwbiZvbCH6RvLw");'
							></div>
							<div
								class="absolute inset-0 bg-gradient-to-t from-[#8c2bee]/90 via-[#8c2bee]/40 to-transparent opacity-90 transition-opacity group-hover:opacity-100"
							></div>
							<div
								class="absolute right-6 bottom-6 left-6 flex flex-col gap-2 text-white md:right-10 md:bottom-10 md:left-10"
							>
								<div
									class="w-fit rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase backdrop-blur-md"
								>
									Technical & Non-Technical
								</div>
								<h3 class="text-3xl font-black md:text-5xl">Symposium</h3>
								<p class="mt-2 max-w-md text-sm font-medium opacity-90 md:text-lg">
									Workshops, Hackathons, Paper Presentations, and more technical marvels.
								</p>
								<div
									class="mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#8c2bee] transition-transform group-hover:scale-110"
								>
									<ArrowRight size={24} />
								</div>
							</div>
						</div>
					</a>

					<!-- Cultural Card -->
					<a
						href="/cultural"
						class="group relative overflow-hidden rounded-[2.5rem] bg-white transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#ee2b8c]/20"
					>
						<div class="relative aspect-[16/10] overflow-hidden md:aspect-[16/9]">
							<div
								class="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
								style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBjz1-9PkVhhhtoHstidqUbbrN8VI_gmiewcAHM-uUYE3JBqPkW80QjeWaFFoxu8T8qaHvpo3Py-fihPkVw8EL_UUKCm05ot6Ij0SqRkEIsD1MCyUfbfph6kcHkXyihZ3vNV4HPnPFUt_QX4lP-LZjjGBF46GyaTgdC_e7X190xLEjtQngk2dF-zBtEwvjw6HE6oReW_IUQmhhjvut5CeK-xPaiQJ9UD6kOwFmj0vLYkSgvmML8KBbLcWzsl_YCTldTzG3N2j8lkFc");'
							></div>
							<div
								class="absolute inset-0 bg-gradient-to-t from-[#ee2b8c]/90 via-[#ee2b8c]/40 to-transparent opacity-90 transition-opacity group-hover:opacity-100"
							></div>
							<div
								class="absolute right-6 bottom-6 left-6 flex flex-col gap-2 text-white md:right-10 md:bottom-10 md:left-10"
							>
								<div
									class="w-fit rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase backdrop-blur-md"
								>
									Non-Technical
								</div>
								<h3 class="text-3xl font-black md:text-5xl">Cultural</h3>
								<p class="mt-2 max-w-md text-sm font-medium opacity-90 md:text-lg">
									Music, Dance, Drama, Art Gallery, and spectacular performances.
								</p>
								<div
									class="mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#ee2b8c] transition-transform group-hover:scale-110"
								>
									<ArrowRight size={24} />
								</div>
							</div>
						</div>
					</a>
				</div>
			</div>
		</section>

		<!-- Location Section -->
		<section class="px-6 py-16 md:px-20 md:py-20" id="venue">
			<div class="mx-auto max-w-[1280px]">
				<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
					<div
						class="relative order-2 h-[300px] overflow-hidden rounded-3xl border border-[#f2f0f4] md:h-[450px] lg:order-1"
					>
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4380.835223092171!2d78.77260307547678!3d10.982829855351703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baafa469e37c771%3A0xd44017e1b9c97cee!2sTrichy%20Engineering%20College!5e1!3m2!1sen!2sin!4v1770649734989!5m2!1sen!2sin"
							width="100%"
							height="100%"
							style="border:0;"
							allowfullscreen=""
							referrerpolicy="no-referrer-when-downgrade"
							title="Trichy Engineering College Map"
						></iframe>
						<div
							class="glass-card absolute right-6 bottom-6 left-6 rounded-2xl p-4 text-white md:p-6"
						>
							<div class="flex items-center gap-4">
								<div class="rounded-xl bg-white/20 p-3">
									<Map size={24} />
								</div>
								<div>
									<h4 class="font-bold">Trichy Engineering College</h4>
									<p class="text-sm opacity-80">Konalai, Trichy, Tamil Nadu</p>
								</div>
							</div>
						</div>
					</div>
					<div class="order-1 flex flex-col gap-6 lg:order-2">
						<h2 class="text-3xl leading-tight font-black md:text-4xl">
							Join the Vibe at our Main Campus.
						</h2>
						<p class="leading-relaxed text-[#756189]">
							Our campus is ready to host over 10,000 students this year. With state-of-the-art
							labs, a massive open-air theater, and food stalls from the best vendors in the city.
						</p>
						<ul class="flex flex-col gap-4">
							<li class="flex items-center gap-3">
								<CheckCircle class="text-[#8c2bee]" size={24} />
								<span class="font-medium">Free Wi-Fi across the entire venue</span>
							</li>
							<li class="flex items-center gap-3">
								<CheckCircle class="text-[#8c2bee]" size={24} />
								<span class="font-medium">Dedicated parking for all attendees</span>
							</li>
							<li class="flex items-center gap-3">
								<CheckCircle class="text-[#8c2bee]" size={24} />
								<span class="font-medium">24/7 Medical assistance and help desks</span>
							</li>
						</ul>
						<div class="pt-4">
							<button
								class="h-12 rounded-xl bg-[#f2f0f4] px-8 font-bold transition-all hover:bg-gray-200"
							>
								Get Directions
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	</main>

	<!-- Floating Action Button - Adjusted to be above mobile nav -->
	<button
		class="fixed right-8 bottom-24 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#8c2bee] text-white shadow-2xl transition-transform hover:scale-110 active:scale-95 md:bottom-8"
	>
		<MessageCircle size={24} />
	</button>
</div>

<style>
	/* Custom Utilities that can't be easily handled by Tailwind CDN classes alone */
	.hero-gradient {
		background: linear-gradient(135deg, #8c2bee 0%, #ee2b8c 50%, #2b8cee 100%);
	}

	.glass-card {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}
</style>
