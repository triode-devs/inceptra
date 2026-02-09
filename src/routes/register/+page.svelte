<script>
	import {
		Cpu,
		Zap,
		Building,
		Radio,
		Settings,
		User,
		Users,
		CheckCircle2,
		AlertCircle,
		ArrowRight,
		Sparkles,
		ChevronRight,
		Info,
		CreditCard,
		Wallet,
		QrCode
	} from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';

	let registrationType = 'symposium'; // 'symposium' | 'cultural'
	let submitted = false;

	// --- Data ---
	const symposiumData = [
		{
			id: 'cse',
			name: 'Computer Science',
			fullName: 'Computer Science & Engineering',
			icon: Cpu,
			color: 'text-blue-600',
			bg: 'bg-blue-50',
			events: {
				technical: ['Paper Presentation', 'Technical Quiz', 'Blind Code', 'Debugging'],
				nonTechnical: ['Gaming', 'Connexion']
			}
		},
		{
			id: 'eee',
			name: 'Electrical & Electronics',
			fullName: 'Electrical & Electronics Engineering',
			icon: Zap,
			color: 'text-yellow-600',
			bg: 'bg-yellow-50',
			events: {
				technical: ['Paperbestowment', 'Technical Brain Blast', 'Circuit Debugging', 'Trade Show'],
				nonTechnical: ['Recreational Events']
			}
		},
		{
			id: 'ece',
			name: 'Electronics & Comm',
			fullName: 'Electronics & Communication',
			icon: Radio,
			color: 'text-purple-600',
			bg: 'bg-purple-50',
			events: {
				technical: ['Paper Tract', 'Flyer / Buzzcard', 'Fine Tune', 'Innovation Expo'],
				nonTechnical: ['Connection', 'Free Fire']
			}
		},
		{
			id: 'mech',
			name: 'Mech & Mechatronics',
			fullName: 'Mechanical & Mechatronics',
			icon: Settings,
			color: 'text-orange-600',
			bg: 'bg-orange-50',
			events: {
				technical: ['Paper Presentation', 'CAD Modeling', 'Calibre', 'Technical Quiz'],
				nonTechnical: ['Paper Events', 'Brushless Painting']
			}
		},
		{
			id: 'civil',
			name: 'Civil Engineering',
			fullName: 'Civil Engineering',
			icon: Building,
			color: 'text-emerald-600',
			bg: 'bg-emerald-50',
			events: {
				technical: ['Bridge', 'Model Making', 'Poster', 'CAD Quest', 'Quiz'],
				nonTechnical: []
			}
		}
	];

	const culturalEvents = [
		'Danzera (Group Dance)',
		'Sizzle and Shake (Solo Dance)',
		'Voice Vibes (Singing)',
		'Rhythm Strings (Instrumental)',
		'Silent Symphony (MIME)',
		'Fashion Fiesta',
		'Mimix (Mimicry)',
		'Cinebuzz (Short Film)'
	];

	// --- Form State ---
	let formData = {
		name: '',
		id: '',
		phone: '',
		dept: '', // For Symposium
		events: {
			technical: [],
			nonTechnical: [],
			cultural: []
		}
	};

	// --- Logic ---
	let selectedDeptIndex = -1;
	$: selectedDept = selectedDeptIndex !== -1 ? symposiumData[selectedDeptIndex] : null;

	// Calculate Progress
	$: progress = (() => {
		let score = 0;
		if (formData.name) score += 20;
		if (formData.id) score += 20;
		if (formData.phone) score += 20;

		if (registrationType === 'symposium') {
			if (selectedDept) score += 20;
			if (isSymposiumValid) score += 20;
		} else {
			if (isCulturalValid) score += 40;
		}
		return score;
	})();

	function toggleTechEvent(event) {
		if (formData.events.technical.includes(event)) {
			formData.events.technical = formData.events.technical.filter((e) => e !== event);
		} else {
			if (selectedDept.id === 'civil') {
				if (formData.events.technical.length < 3)
					formData.events.technical = [...formData.events.technical, event];
			} else {
				if (formData.events.technical.length < 2)
					formData.events.technical = [...formData.events.technical, event];
			}
		}
	}

	function toggleNonTechEvent(event) {
		if (formData.events.nonTechnical.includes(event)) {
			formData.events.nonTechnical = formData.events.nonTechnical.filter((e) => e !== event);
		} else {
			if (formData.events.nonTechnical.length < 1)
				formData.events.nonTechnical = [...formData.events.nonTechnical, event];
		}
	}

	function toggleCulturalEvent(event) {
		if (formData.events.cultural.includes(event)) {
			formData.events.cultural = formData.events.cultural.filter((e) => e !== event);
		} else {
			formData.events.cultural = [...formData.events.cultural, event];
		}
	}

	// --- Validation ---
	$: isSymposiumValid = (() => {
		if (!selectedDept) return false;
		if (selectedDept.id === 'civil') {
			return formData.events.technical.length === 3;
		}
		return formData.events.technical.length === 2 && formData.events.nonTechnical.length === 1;
	})();

	$: isCulturalValid = formData.events.cultural.length > 0;

	$: isFormValid =
		(registrationType === 'symposium' ? isSymposiumValid : isCulturalValid) &&
		formData.name &&
		formData.phone;

	function handleSubmit() {
		if (isFormValid) {
			submitted = true;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function resetSelection() {
		formData.events = { technical: [], nonTechnical: [], cultural: [] };
		selectedDeptIndex = -1;
	}
</script>

<svelte:head>
	<title>Event Registration | INCEPTRA '26</title>
	<link
		href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
	<script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

<div class="min-h-screen bg-[#f8f6f7] pt-20 font-['Plus_Jakarta_Sans'] text-[#181115]">
	<div class="mx-auto max-w-[1200px] px-6 py-10 lg:px-40">
		{#if !submitted}
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
				<!-- LEFT COLUMN: FORM -->
				<div class="flex flex-col gap-6 lg:col-span-8">
					<!-- Header & Progress -->
					<div class="flex flex-col gap-4">
						<h1 class="text-4xl font-black tracking-tight">Join the Pulse of Inceptra</h1>
						<p class="text-lg text-[#896179]">
							Register for the ultimate college symposium and cultural festival.
						</p>

						<div class="mt-4 flex flex-col gap-2">
							<div class="flex items-center justify-between text-sm font-semibold">
								<span>Registration Progress</span>
								<span class="text-[#8c2bee]">{progress}% Complete</span>
							</div>
							<div class="h-2 w-full overflow-hidden rounded-full bg-[#e6dbe1]">
								<div
									class="h-full bg-[#8c2bee] transition-all duration-500"
									style="width: {progress}%;"
								></div>
							</div>
							<div
								class="flex items-center gap-2 text-xs font-bold tracking-widest text-[#896179] uppercase"
							>
								<span class={progress >= 20 ? 'text-[#8c2bee]' : ''}>Details</span>
								<ChevronRight size={14} />
								<span class={progress >= 60 ? 'text-[#8c2bee]' : ''}>Selection</span>
								<ChevronRight size={14} />
								<span class={progress === 100 ? 'text-[#8c2bee]' : ''}>Confirm</span>
							</div>
						</div>
					</div>

					<!-- Registration Form Card -->
					<div class="rounded-xl border border-[#f4f0f3] bg-white p-6 shadow-sm">
						<!-- Type Toggle -->
						<div class="mb-8 flex max-w-sm rounded-lg bg-[#f8f6f7] p-1">
							<button
								class="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all
                  {registrationType === 'symposium'
									? 'bg-white text-[#181115] shadow-sm'
									: 'text-[#896179] hover:text-[#181115]'}"
								on:click={() => {
									registrationType = 'symposium';
									resetSelection();
								}}
							>
								<Cpu size={16} class={registrationType === 'symposium' ? 'text-[#8c2bee]' : ''} />
								Symposium
							</button>
							<button
								class="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all
                  {registrationType === 'cultural'
									? 'bg-white text-[#181115] shadow-sm'
									: 'text-[#896179] hover:text-[#181115]'}"
								on:click={() => {
									registrationType = 'cultural';
									resetSelection();
								}}
							>
								<Sparkles
									size={16}
									class={registrationType === 'cultural' ? 'text-[#ee2b8c]' : ''}
								/>
								Cultural Fest
							</button>
						</div>

						<!-- Participant Fields -->
						<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
							<div class="flex flex-col gap-2">
								<label for="name" class="text-sm font-bold">Full Name</label>
								<input
									id="name"
									bind:value={formData.name}
									class="h-11 w-full rounded-lg border border-[#e6dbe1] bg-transparent px-4 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-[#8c2bee]"
									placeholder="John Doe"
									type="text"
								/>
							</div>
							<div class="flex flex-col gap-2">
								<label for="college-id" class="text-sm font-bold">College ID / Roll No</label>
								<input
									id="college-id"
									bind:value={formData.id}
									class="h-11 w-full rounded-lg border border-[#e6dbe1] bg-transparent px-4 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-[#8c2bee]"
									placeholder="2026CS101"
									type="text"
								/>
							</div>
							<div class="flex flex-col gap-2 md:col-span-2">
								<label for="phone" class="text-sm font-bold">Contact Number</label>
								<input
									id="phone"
									bind:value={formData.phone}
									class="h-11 w-full rounded-lg border border-[#e6dbe1] bg-transparent px-4 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-[#8c2bee]"
									placeholder="+91 98765 43210"
									type="tel"
								/>
							</div>
						</div>

						<!-- SYMPOSIUM SELECTION -->
						{#if registrationType === 'symposium'}
							<div in:fade>
								<h3 class="mb-4 flex items-center gap-2 text-lg font-bold">
									<Settings size={20} class="text-[#8c2bee]" />
									Select Department
								</h3>

								<!-- Dept Grid -->
								<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
									{#each symposiumData as dept, idx}
										<button
											class="flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all
                        {selectedDeptIndex === idx
												? `border-[#8c2bee] bg-[#8c2bee]/5`
												: 'border-transparent bg-[#f8f6f7] hover:border-[#8c2bee]/30'}
                      "
											on:click={() => {
												selectedDeptIndex = idx;
												formData.events = { technical: [], nonTechnical: [], cultural: [] };
											}}
										>
											<div class="rounded-lg bg-white p-2 shadow-sm {dept.color}">
												<svelte:component this={dept.icon} size={18} />
											</div>
											<span class="text-sm font-bold text-gray-700">{dept.name}</span>
											{#if selectedDeptIndex === idx}
												<CheckCircle2 size={16} class="ml-auto text-[#8c2bee]" />
											{/if}
										</button>
									{/each}
								</div>

								{#if selectedDept}
									<div class="mt-8 border-t border-[#f4f0f3] pt-6" transition:slide>
										<div class="mb-6 flex items-center justify-between">
											<h3 class="flex items-center gap-2 text-lg font-bold">
												<Cpu size={20} class="text-[#8c2bee]" />
												Event Selection
											</h3>
											<span
												class="rounded-full bg-[#8c2bee]/10 px-3 py-1 text-xs font-bold text-[#8c2bee]"
											>
												{selectedDept.id === 'civil' ? 'Select Any 3' : '2 Tech + 1 Non-Tech'}
											</span>
										</div>

										<!-- Tech Events -->
										<div class="mb-6">
											<p class="mb-3 text-xs font-bold tracking-widest text-[#896179] uppercase">
												Technical Events
											</p>
											<div class="grid grid-cols-1 gap-3">
												{#each selectedDept.events.technical as event}
													<label
														class="group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 bg-[#f8f6f7] p-4 transition-all
                            {formData.events.technical.includes(event)
															? 'border-[#8c2bee] bg-white'
															: 'border-transparent hover:border-[#8c2bee]/30'}
                          "
													>
														<input
															type="checkbox"
															class="h-5 w-5 rounded border-gray-300 text-[#8c2bee] focus:ring-[#8c2bee]"
															checked={formData.events.technical.includes(event)}
															on:change={() => toggleTechEvent(event)}
														/>
														<div class="flex-1">
															<div class="flex items-center gap-2">
																<span class="text-sm font-extrabold">{event}</span>
																<span
																	class="rounded-full bg-[#8c2bee]/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#8c2bee] uppercase"
																	>Technical</span
																>
															</div>
														</div>
													</label>
												{/each}
											</div>
										</div>

										<!-- Non-Tech Events -->
										{#if selectedDept.events.nonTechnical.length > 0}
											<div>
												<p class="mb-3 text-xs font-bold tracking-widest text-[#896179] uppercase">
													Non-Technical Events
												</p>
												<div class="grid grid-cols-1 gap-3">
													{#each selectedDept.events.nonTechnical as event}
														<label
															class="group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 bg-[#f8f6f7] p-4 transition-all
                              {formData.events.nonTechnical.includes(event)
																? 'border-[#ee2b8c] bg-white'
																: 'border-transparent hover:border-[#ee2b8c]/30'}
                            "
														>
															<input
																type="checkbox"
																class="h-5 w-5 rounded border-gray-300 text-[#ee2b8c] focus:ring-[#ee2b8c]"
																checked={formData.events.nonTechnical.includes(event)}
																on:change={() => toggleNonTechEvent(event)}
															/>
															<div class="flex-1">
																<div class="flex items-center gap-2">
																	<span class="text-sm font-extrabold">{event}</span>
																	<span
																		class="rounded-full bg-[#ee2b8c]/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#ee2b8c] uppercase"
																		>Non-Tech</span
																	>
																</div>
															</div>
														</label>
													{/each}
												</div>
											</div>
										{/if}

										<!-- Validation Warning -->
										{#if !isSymposiumValid && (formData.events.technical.length > 0 || formData.events.nonTechnical.length > 0)}
											<div
												class="mt-6 flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm font-medium text-orange-700"
											>
												<AlertCircle size={18} class="mt-0.5 shrink-0" />
												<span>
													{#if selectedDept.id === 'civil'}
														Please select exactly 3 events.
													{:else}
														Requirements not met. You need exactly <strong>2 Technical</strong> and
														<strong>1 Non-Technical</strong> event.
													{/if}
												</span>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						{/if}

						<!-- CULTURAL SELECTION -->
						{#if registrationType === 'cultural'}
							<div in:fade>
								<h3 class="mb-4 flex items-center gap-2 text-lg font-bold">
									<Sparkles size={20} class="text-[#ee2b8c]" />
									Select Events
								</h3>
								<div class="grid grid-cols-1 gap-3">
									{#each culturalEvents as event}
										<label
											class="group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 bg-[#f8f6f7] p-4 transition-all
                      {formData.events.cultural.includes(event)
												? 'border-[#ee2b8c] bg-white'
												: 'border-transparent hover:border-[#ee2b8c]/30'}
                    "
										>
											<input
												type="checkbox"
												class="h-5 w-5 rounded border-gray-300 text-[#ee2b8c] focus:ring-[#ee2b8c]"
												checked={formData.events.cultural.includes(event)}
												on:change={() => toggleCulturalEvent(event)}
											/>
											<div class="flex-1">
												<div class="flex items-center gap-2">
													<span class="text-sm font-extrabold">{event}</span>
													<span
														class="rounded-full bg-[#ee2b8c]/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#ee2b8c] uppercase"
														>Cultural</span
													>
												</div>
											</div>
										</label>
									{/each}
								</div>
							</div>
						{/if}
					</div>

					<!-- Info Alert -->
					<div
						class="flex items-start gap-4 rounded-xl border border-[#8c2bee]/10 bg-[#8c2bee]/5 p-4"
					>
						<Info size={20} class="shrink-0 text-[#8c2bee]" />
						<div class="text-sm leading-relaxed font-medium text-[#8c2bee]/90">
							Registration fee covers entry to the campus, participant kit, and lunch. Ensure you
							have your college ID card on the day of the event.
						</div>
					</div>
				</div>

				<!-- RIGHT COLUMN: SIDEBAR SUMMARY -->
				<div class="lg:col-span-4">
					<div class="sticky top-24 flex flex-col gap-6">
						<!-- Summary Card -->
						<div class="rounded-xl border border-[#f4f0f3] bg-white p-6 shadow-xl">
							<h3 class="mb-6 flex items-center gap-2 text-xl font-bold">
								<CreditCard size={20} />
								Registration Summary
							</h3>

							<div class="mb-6 flex flex-col gap-4 border-b border-[#f4f0f3] pb-6">
								<div class="flex items-start justify-between">
									<div>
										<p class="text-sm font-bold">Base Registration</p>
										<p class="text-xs text-[#896179]">Mandatory Entry Fee</p>
									</div>
									<span class="font-bold">₹150</span>
								</div>

								{#if selectedDept}
									<div class="flex items-start justify-between">
										<div>
											<p class="text-sm font-bold">Symposium Events</p>
											<p class="max-w-[150px] truncate text-xs text-[#896179]">
												{formData.events.technical.length + formData.events.nonTechnical.length} Selected
											</p>
										</div>
										<span class="font-bold">Included</span>
									</div>
								{/if}

								{#if formData.events.cultural.length > 0}
									<div class="flex items-start justify-between">
										<div>
											<p class="text-sm font-bold">Cultural Add-ons</p>
											<p class="text-xs text-[#896179]">{formData.events.cultural.length} Events</p>
										</div>
										<span class="font-bold">₹{formData.events.cultural.length * 100}</span>
									</div>
								{/if}
							</div>

							<div class="mb-8 flex flex-col gap-2">
								<div class="flex items-center justify-between">
									<span class="text-sm text-[#896179]">Subtotal</span>
									<span class="text-sm font-semibold"
										>₹{150 + formData.events.cultural.length * 100}</span
									>
								</div>
								<div
									class="mt-2 flex items-center justify-between border-t border-dashed border-[#e6dbe1] pt-4"
								>
									<span class="text-lg font-bold">Total Amount</span>
									<span class="text-2xl font-black text-[#8c2bee]"
										>₹{150 + formData.events.cultural.length * 100}</span
									>
								</div>
							</div>

							<button
								disabled={!isFormValid}
								on:click={handleSubmit}
								class="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#8c2bee] text-lg font-black text-white shadow-lg shadow-[#8c2bee]/30 transition-all hover:-translate-y-0.5 hover:shadow-[#8c2bee]/50 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
							>
								Proceed to Pay
								<ArrowRight size={20} />
							</button>

							<div
								class="mt-6 flex cursor-help flex-wrap justify-center gap-4 opacity-50 grayscale transition-all hover:grayscale-0"
							>
								<CreditCard size={24} />
								<Wallet size={24} />
								<QrCode size={24} />
							</div>
						</div>

						<!-- Support Card -->
						<div class="flex flex-col gap-3 rounded-xl bg-[#f8f6f7] p-4">
							<p class="flex items-center gap-2 text-sm font-bold">
								<Info size={18} class="text-[#8c2bee]" />
								Need help?
							</p>
							<p class="text-xs text-[#896179]">Contact the tech committee at:</p>
							<div class="flex items-center gap-2 text-sm font-bold text-[#181115]">
								support@inceptra26.com
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<!-- SUCCESS STATE -->
			<div class="mx-auto max-w-xl pt-10 text-center" in:fade>
				<div
					class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-xl shadow-green-100"
				>
					<CheckCircle2 size={40} />
				</div>
				<h1 class="mb-2 text-4xl font-black tracking-tight">Registration Successful!</h1>
				<p class="mb-10 text-lg text-[#896179]">
					You're in! Welcome to the pulse of innovation and culture.
				</p>

				<div class="relative overflow-hidden rounded-xl border border-[#f4f0f3] bg-white shadow-lg">
					<!-- Ticket Header -->
					<div class="bg-[#8c2bee] p-6 text-left text-white">
						<div class="flex items-start justify-between">
							<div>
								<span
									class="mb-2 inline-block rounded bg-white/20 px-2 py-1 text-xs font-bold tracking-wider uppercase"
									>Official Pass</span
								>
								<h3 class="text-xl font-black">INCEPTRA '26</h3>
							</div>
							<div class="text-right">
								<p class="text-xs font-bold tracking-widest uppercase opacity-70">ID</p>
								<p class="font-mono text-lg font-bold">
									INC-{Math.floor(Math.random() * 9000) + 1000}
								</p>
							</div>
						</div>
					</div>

					<!-- Ticket Body -->
					<div class="p-6 text-left">
						<div class="mb-6 grid grid-cols-2 gap-6">
							<div>
								<p class="mb-1 text-xs font-bold tracking-widest text-[#896179] uppercase">
									Participant
								</p>
								<p class="text-base font-bold">{formData.name}</p>
							</div>
							<div>
								<p class="mb-1 text-xs font-bold tracking-widest text-[#896179] uppercase">
									College ID
								</p>
								<p class="text-base font-bold">{formData.id}</p>
							</div>
						</div>

						<div class="mb-6">
							<p class="mb-2 text-xs font-bold tracking-widest text-[#896179] uppercase">Events</p>
							<div class="flex flex-wrap gap-2">
								{#if registrationType === 'symposium'}
									{#each formData.events.technical as e}
										<span class="rounded bg-[#8c2bee]/10 px-2 py-1 text-xs font-bold text-[#8c2bee]"
											>{e}</span
										>
									{/each}
									{#each formData.events.nonTechnical as e}
										<span class="rounded bg-[#ee2b8c]/10 px-2 py-1 text-xs font-bold text-[#ee2b8c]"
											>{e}</span
										>
									{/each}
								{:else}
									{#each formData.events.cultural as e}
										<span class="rounded bg-[#ee2b8c]/10 px-2 py-1 text-xs font-bold text-[#ee2b8c]"
											>{e}</span
										>
									{/each}
								{/if}
							</div>
						</div>

						<div
							class="flex items-center justify-between border-t border-dashed border-[#e6dbe1] pt-4"
						>
							<span class="text-sm font-bold text-[#896179]">Total Paid</span>
							<span class="text-xl font-black text-[#8c2bee]"
								>₹{150 + formData.events.cultural.length * 100}</span
							>
						</div>
					</div>
				</div>

				<button
					on:click={() => {
						submitted = false;
						resetSelection();
					}}
					class="mt-8 font-bold text-[#8c2bee] hover:underline"
				>
					Register Another Participant
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Custom Scrollbar for a polished feel */
	::-webkit-scrollbar {
		width: 8px;
	}
	::-webkit-scrollbar-track {
		background: #f1f1f1;
	}
	::-webkit-scrollbar-thumb {
		background: #d1d5db;
		border-radius: 4px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: #9ca3af;
	}
</style>
