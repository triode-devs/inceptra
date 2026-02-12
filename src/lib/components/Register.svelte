<script>
	import { onMount } from 'svelte';
	import {
		Cpu,
		Zap,
		Building,
		Radio,
		Settings,
		CheckCircle2,
		AlertCircle,
		ArrowRight,
		Sparkles,
		ChevronRight,
		Info,
		CreditCard,
		Wallet,
		QrCode,
		Plus,
		Download,
		Phone
	} from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import symposiumQR from '../assets/qr/symposium.png';
	import culturalsQR from '../assets/qr/culturals.png';
	import QRCode from 'qrcode';

	// Props: Accept deptId from parent (URL param)
	export let deptId = null;
	export let settings = {};
	export let userEmail = null;
	export let userId = null;

	let registrationType = 'symposium'; // 'symposium' | 'cultural'
	let submitted = false;
	let loading = false;
	let error = null;
	let currentStep = 1; // 1: Info/Selection, 2: Payment
	let paymentScreenshotKey = null;
	let uploadingScreenshot = false;
	let paymentMethod = 'online'; // 'online' | 'offline'
	let qrCodeDataUrl = '';

	$: isOfflineEnabled = settings['offline_payment_enabled'] === 'true';

	const generatePassQR = async () => {
		const qrData = {
			id: formData.id,
			name: formData.name,
			college: formData.college,
			phone: formData.phone,
			email: formData.email,
			year: formData.year,
			dept: selectedDept?.name || 'N/A',
			events: [
				...formData.events.technical,
				...formData.events.nonTechnical,
				...formData.events.cultural
			],
			amount: 150 + formData.events.cultural.length * 100,
			paymentStatus: paymentMethod === 'offline' ? 'Pending (Offline)' : 'Pending Verification',
			timestamp: new Date().toISOString()
		};

		try {
			qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
				width: 300,
				margin: 2,
				color: {
					dark: '#000000',
					light: '#ffffff'
				}
			});
		} catch (err) {
			console.error('Error generating QR code', err);
		}
	};

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
		email: userEmail || '',
		phone: '',
		year: '',
		college: '',
		address: '',
		food: '',
		dept: '', // For Symposium
		events: {
			technical: [],
			nonTechnical: [],
			cultural: []
		},
		paperTitle: '',
		paperFile: null
	};

	// Sync email if userEmail changes
	$: if (userEmail && !formData.email) {
		formData.email = userEmail;
	}

	// --- Logic ---
	let selectedDeptIndex = -1;
	$: selectedDept = selectedDeptIndex !== -1 ? symposiumData[selectedDeptIndex] : null;

	// Determine if we are in a "Locked Department" mode based on prop
	$: isDeptLocked = !!deptId;

	// Reactively handle deptId changes (e.g. navigation)
	$: if (deptId) {
		const index = symposiumData.findIndex((d) => d.id === deptId);
		if (index !== -1) {
			registrationType = 'symposium';
			selectedDeptIndex = index;
		}
	}

	onMount(() => {
		// If a department is pre-selected via prop, scroll to the section
		if (deptId) {
			setTimeout(() => {
				document
					.getElementById('dept-selection')
					?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}, 500);
		}
	});

	// Calculate Progress
	$: progress = (() => {
		let score = 0;
		if (formData.name) score += 10;
		if (formData.id) score += 10;
		if (formData.email) score += 10;
		if (formData.phone) score += 10;
		if (formData.year) score += 10;
		if (formData.college) score += 10;

		if (registrationType === 'symposium') {
			if (selectedDept) score += 10;
			if (isSymposiumValid) score += 10;
		} else {
			if (isCulturalValid) score += 20;
		}

		if (currentStep === 2) score += 10;
		if (paymentScreenshotKey || paymentMethod === 'offline') score += 10;

		return Math.min(score, 100);
	})();

	async function handleScreenshotUpload(e) {
		const file = e.target.files[0];
		if (!file) return;

		uploadingScreenshot = true;
		error = null;

		const uploadFormData = new FormData();
		uploadFormData.append('file', file);

		try {
			const res = await fetch('/api/upload', {
				method: 'POST',
				body: uploadFormData
			});
			const result = await res.json();
			if (res.ok) {
				paymentScreenshotKey = result.key;
			} else {
				error = result.error || 'Upload failed';
			}
		} catch (err) {
			error = 'Failed to upload screenshot';
			console.error(err);
		} finally {
			uploadingScreenshot = false;
		}
	}

	let uploadingPaper = false;
	let paperUploadError = null;

	async function handlePaperUpload(e) {
		const file = e.target.files[0];
		if (!file) return;

		uploadingPaper = true;
		paperUploadError = null;

		const uploadFormData = new FormData();
		uploadFormData.append('file', file);

		try {
			const res = await fetch('/api/upload', {
				method: 'POST',
				body: uploadFormData
			});
			const result = await res.json();
			if (res.ok) {
				formData.paperFile = result.key;
			} else {
				paperUploadError = result.error || 'Upload failed';
			}
		} catch (err) {
			paperUploadError = 'Failed to upload paper';
			console.error(err);
		} finally {
			uploadingPaper = false;
		}
	}

	function toggleTechEvent(event) {
		if (formData.events.technical.includes(event)) {
			formData.events.technical = formData.events.technical.filter((e) => e !== event);
		} else {
			// Allow selecting any number of events, or at least no upper limit blocking
			formData.events.technical = [...formData.events.technical, event];
		}
	}

	function toggleNonTechEvent(event) {
		if (formData.events.nonTechnical.includes(event)) {
			// Deselect if already selected
			formData.events.nonTechnical = formData.events.nonTechnical.filter((e) => e !== event);
		} else {
			// Limit to exactly 1: Replace existing selection with the new one
			formData.events.nonTechnical = [event];
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
		// Check if AT LEAST one event is selected overall (tech or non-tech)
		return formData.events.technical.length > 0 || formData.events.nonTechnical.length > 0;
	})();

	$: isCulturalValid = formData.events.cultural.length > 0;

	$: isFormValid =
		(registrationType === 'symposium' ? isSymposiumValid : isCulturalValid) &&
		formData.name &&
		formData.id &&
		formData.email &&
		formData.phone &&
		formData.year &&
		formData.college &&
		formData.address &&
		formData.food;

	async function handleSubmit() {
		if (isFormValid && (paymentScreenshotKey || paymentMethod === 'offline')) {
			loading = true;
			error = null;
			try {
				const response = await fetch('/api/register', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						...formData,
						registrationType,
						amount: 150 + formData.events.cultural.length * 100,
						payment_screenshot_key: paymentMethod === 'offline' ? 'OFFLINE' : paymentScreenshotKey,
						dept: selectedDept?.name || null,
						user_id: userId
					})
				});

				const result = await response.json();

				if (response.ok) {
					submitted = true;
					await generatePassQR();
					window.scrollTo({ top: 0, behavior: 'smooth' });
				} else {
					error = result.error || 'Failed to submit registration';
				}
			} catch (e) {
				error = 'An error occurred. Please try again.';
				console.error(e);
			} finally {
				loading = false;
			}
		}
	}

	function resetSelection() {
		// Only clear department index if we are NOT in locked mode
		if (!isDeptLocked) {
			selectedDeptIndex = -1;
		}
		formData.events = { technical: [], nonTechnical: [], cultural: [] };
	}
</script>

<div class="min-h-screen bg-[#f7f6f8] pt-24 pb-20 font-['Lexend'] text-[#141118]">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		{#if !submitted}
			<!-- Progress Bar -->
			<div class="mb-12 h-2 w-full overflow-hidden rounded-full bg-white shadow-inner">
				<div
					class="h-full bg-gradient-to-r from-[#8c2bee] to-[#ee2b8c] transition-all duration-700 ease-out"
					style="width: {progress}%"
				></div>
			</div>

			<div class="grid grid-cols-1 gap-12 lg:grid-cols-12">
				<!-- LEFT COLUMN: FORM -->
				<div class="flex flex-col gap-10 lg:col-span-8">
					<!-- Step 1 Header -->
					<div class="flex flex-col gap-2">
						<span class="text-xs font-black tracking-widest text-[#8c2bee] uppercase"
							>Step {currentStep} of 2</span
						>
						<h1 class="text-4xl font-black tracking-tight sm:text-5xl">
							{currentStep === 1 ? 'Quick Registration' : 'Payment Verification'}
						</h1>
					</div>

					<div class="flex flex-col gap-8 rounded-[2.5rem] bg-white p-6 shadow-2xl sm:p-10">
						{#if currentStep === 1}
							<div class="grid grid-cols-1 gap-8 md:grid-cols-2" in:fade>
								<!-- Registration Type -->
								<div class="md:col-span-2">
									<label class="mb-3 block text-sm font-bold" for="type"
										>What are you registering for?</label
									>
									<div class="grid grid-cols-2 gap-4">
										<button
											class="flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all
                      {registrationType === 'symposium'
												? 'border-[#8c2bee] bg-[#8c2bee]/5 text-[#8c2bee]'
												: 'border-transparent bg-[#f8f6f7] hover:border-[#8c2bee]/30'}"
											on:click={() => {
												registrationType = 'symposium';
												resetSelection();
											}}
										>
											<Cpu size={32} />
											<span class="font-bold">Symposium</span>
										</button>
										<button
											class="flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all
                      {registrationType === 'cultural'
												? 'border-[#ee2b8c] bg-[#ee2b8c]/5 text-[#ee2b8c]'
												: 'border-transparent bg-[#f8f6f7] hover:border-[#ee2b8c]/30'}"
											on:click={() => {
												registrationType = 'cultural';
												resetSelection();
											}}
										>
											<Sparkles size={32} />
											<span class="font-bold">Culturals</span>
										</button>
									</div>
								</div>

								<!-- Personal Info -->
								<div class="flex flex-col gap-4">
									<label class="text-sm font-bold" for="name">Full Name</label>
									<input
										id="name"
										bind:value={formData.name}
										class="h-14 rounded-xl border-none bg-[#f8f6f7] px-6 font-medium focus:ring-2 focus:ring-[#8c2bee]/20"
										placeholder="As per records"
									/>
								</div>
								<div class="flex flex-col gap-4">
									<label class="text-sm font-bold" for="id">College ID / Reg No</label>
									<input
										id="id"
										bind:value={formData.id}
										class="h-14 rounded-xl border-none bg-[#f8f6f7] px-6 font-medium focus:ring-2 focus:ring-[#8c2bee]/20"
										placeholder="Identity number"
									/>
								</div>
								<div class="flex flex-col gap-4">
									<label class="text-sm font-bold" for="email">Email Address</label>
									<input
										id="email"
										type="email"
										bind:value={formData.email}
										class="h-14 rounded-xl border-none bg-[#f8f6f7] px-6 font-medium focus:ring-2 focus:ring-[#8c2bee]/20"
										placeholder="username@domain.com"
									/>
								</div>
								<div class="flex flex-col gap-4">
									<label class="text-sm font-bold" for="phone">Phone Number</label>
									<input
										id="phone"
										type="tel"
										bind:value={formData.phone}
										class="h-14 rounded-xl border-none bg-[#f8f6f7] px-6 font-medium focus:ring-2 focus:ring-[#8c2bee]/20"
										placeholder="WhatsApp active"
									/>
								</div>
								<div class="flex flex-col gap-4">
									<label class="text-sm font-bold" for="year">Year of Study</label>
									<select
										id="year"
										bind:value={formData.year}
										class="h-14 rounded-xl border-none bg-[#f8f6f7] px-6 font-medium focus:ring-2 focus:ring-[#8c2bee]/20"
									>
										<option value="">Select Year</option>
										<option value="1">1st Year</option>
										<option value="2">2nd Year</option>
										<option value="3">3rd Year</option>
										<option value="4">4th Year</option>
									</select>
								</div>
								<div class="flex flex-col gap-4">
									<label class="text-sm font-bold" for="college">College Name</label>
									<input
										id="college"
										bind:value={formData.college}
										class="h-14 rounded-xl border-none bg-[#f8f6f7] px-6 font-medium focus:ring-2 focus:ring-[#8c2bee]/20"
										placeholder="Your Institution"
									/>
								</div>
								<div class="flex flex-col gap-4">
									<label class="text-sm font-bold" for="address">City / Location</label>
									<input
										id="address"
										bind:value={formData.address}
										class="h-14 rounded-xl border-none bg-[#f8f6f7] px-6 font-medium focus:ring-2 focus:ring-[#8c2bee]/20"
										placeholder="Where are you coming from?"
									/>
								</div>
								<div class="flex flex-col gap-4">
									<label class="text-sm font-bold" for="food">Food Preference</label>
									<select
										id="food"
										bind:value={formData.food}
										class="h-14 rounded-xl border-none bg-[#f8f6f7] px-6 font-medium focus:ring-2 focus:ring-[#8c2bee]/20"
									>
										<option value="">Select Diet</option>
										<option value="veg">Vegetarian</option>
										<option value="non-veg">Non-Vegetarian</option>
									</select>
								</div>
							</div>

							<!-- DEPARTMENT SELECTION -->
							{#if registrationType === 'symposium' && currentStep === 1}
								<div id="dept-selection" in:fade>
									<h3 class="mb-4 flex items-center gap-2 text-lg font-bold">
										<Building size={20} class="text-[#8c2bee]" />
										Select Department
									</h3>
									<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
										{#each symposiumData as dept, idx}
											{#if !isDeptLocked || deptId === dept.id}
												<button
													class="flex flex-col items-center gap-3 rounded-2xl border-2 p-4 text-center transition-all
                          {selectedDeptIndex === idx
														? 'border-[#8c2bee] bg-[#8c2bee]/5 text-[#8c2bee]'
														: 'border-transparent bg-[#f8f6f7] hover:border-[#8c2bee]/30'}
                          {isDeptLocked ? 'cursor-default ring-2 ring-[#8c2bee]/20' : ''}"
													on:click={() => !isDeptLocked && (selectedDeptIndex = idx)}
												>
													<div
														class="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm"
													>
														<svelte:component this={dept.icon} size={18} />
													</div>
													<div class="flex flex-col">
														<span class="text-sm font-bold text-gray-700">{dept.name}</span>
														{#if isDeptLocked}
															<span class="text-xs text-gray-500">Department Locked</span>
														{/if}
													</div>
													{#if selectedDeptIndex === idx}
														<CheckCircle2 size={16} class="ml-auto text-[#8c2bee]" />
													{/if}
												</button>
											{/if}
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
													Max 1 Non-Technical Event
												</span>
											</div>

											<!-- Tech Events -->
											<div class="mb-6">
												<p class="mb-3 text-xs font-bold tracking-widest text-[#896179] uppercase">
													Technical Events (Unlimited)
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

												<!-- Paper Presentation Additional Fields -->
												{#if formData.events.technical.some((e) => e
														.toLowerCase()
														.includes('paper'))}
													<div class="mt-6 border-t border-[#f4f0f3] pt-6" transition:slide>
														<h4 class="mb-4 text-sm font-bold text-[#8c2bee]">
															📄 Paper Presentation Details
														</h4>
														<div class="flex flex-col gap-4">
															<div class="flex flex-col gap-2">
																<label class="text-sm font-bold" for="paperTitle">
																	Paper Title <span class="text-red-500">*</span>
																</label>
																<input
																	id="paperTitle"
																	bind:value={formData.paperTitle}
																	class="h-12 rounded-xl border-none bg-[#f8f6f7] px-4 font-medium focus:ring-2 focus:ring-[#8c2bee]/20"
																	placeholder="Enter your paper title"
																	required={formData.events.technical.some((e) =>
																		e.toLowerCase().includes('paper')
																	)}
																/>
															</div>
															<div class="flex flex-col gap-2">
																<label class="text-sm font-bold" for="paperFile">
																	Upload Paper (Optional)
																</label>
																<div
																	class="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e6dbe1] p-6 transition-all hover:border-[#8c2bee]/50"
																>
																	{#if formData.paperFile}
																		<div class="flex flex-col items-center gap-3 text-green-600">
																			<CheckCircle2 size={32} />
																			<span class="text-sm font-bold">Paper Uploaded!</span>
																			<button
																				class="text-xs font-bold text-[#8c2bee] underline"
																				on:click={() => (formData.paperFile = null)}
																			>
																				Change File
																			</button>
																		</div>
																	{:else if uploadingPaper}
																		<div class="flex flex-col items-center gap-3">
																			<div
																				class="h-8 w-8 animate-spin rounded-full border-4 border-[#8c2bee] border-t-transparent"
																			></div>
																			<span class="animate-pulse text-sm font-bold"
																				>Uploading...</span
																			>
																		</div>
																	{:else}
																		<input
																			id="paperFile"
																			type="file"
																			accept=".pdf,.doc,.docx"
																			class="absolute inset-0 cursor-pointer opacity-0"
																			on:change={handlePaperUpload}
																		/>
																		<div class="flex flex-col items-center gap-2 opacity-60">
																			<Plus size={24} />
																			<span class="text-sm font-bold">Click to upload paper</span>
																			<span class="text-xs text-gray-500"
																				>PDF, DOC, DOCX (Optional)</span
																			>
																		</div>
																	{/if}
																</div>
																{#if paperUploadError}
																	<div
																		class="rounded-lg bg-red-50 p-3 text-xs font-bold text-red-600"
																		in:slide
																	>
																		{paperUploadError}
																	</div>
																{/if}
															</div>
														</div>
													</div>
												{/if}
											</div>

											<!-- Non-Tech Events -->
											{#if selectedDept.events.nonTechnical.length > 0}
												<div>
													<p
														class="mb-3 text-xs font-bold tracking-widest text-[#896179] uppercase"
													>
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

											<!-- Validation Warning - Hidden as we allow single selection now -->
											{#if !isSymposiumValid && selectedDept && formData.events.technical.length === 0 && formData.events.nonTechnical.length === 0}
												<!-- Optional: Add a subtle hint if needed, or leave empty if button disabled is enough -->
											{/if}
										</div>
									{/if}
								</div>
							{/if}

							<!-- CULTURAL SELECTION -->
							{#if registrationType === 'cultural' && currentStep === 1}
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
						{/if}

						{#if currentStep === 2}
							<div in:fade class="flex flex-col gap-8">
								<div class="flex flex-col gap-4">
									<h3 class="flex items-center gap-2 text-xl font-bold">
										<QrCode size={24} class="text-[#8c2bee]" />
										Payment Method
									</h3>

									{#if isOfflineEnabled}
										<div class="grid grid-cols-2 gap-4">
											<button
												class="flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all
												{paymentMethod === 'online'
													? 'border-[#8c2bee] bg-[#8c2bee]/5 text-[#8c2bee]'
													: 'border-transparent bg-[#f8f6f7] opacity-60'}"
												on:click={() => (paymentMethod = 'online')}
											>
												<QrCode size={24} />
												<span class="text-sm font-bold">Scan & Pay</span>
											</button>
											<button
												class="flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all
												{paymentMethod === 'offline'
													? 'border-[#8c2bee] bg-[#8c2bee]/5 text-[#8c2bee]'
													: 'border-transparent bg-[#f8f6f7] opacity-60'}"
												on:click={() => (paymentMethod = 'offline')}
											>
												<Building size={24} />
												<span class="text-sm font-bold">At Counter</span>
											</button>
										</div>
									{/if}
								</div>

								{#if paymentMethod === 'online'}
									<div class="flex flex-col gap-8" in:slide>
										<div class="flex flex-col gap-2">
											<p class="text-sm text-[#896179]">
												Scan the QR code below to pay the total amount using any UPI app.
											</p>
										</div>

										<!-- UPI QR -->
										<div
											class="flex flex-col items-center gap-6 rounded-2xl bg-[#f8f6f7] p-8 text-center"
										>
											<div
												class="relative h-64 w-64 overflow-hidden rounded-2xl bg-white p-2 shadow-inner sm:h-80 sm:w-80"
											>
												<img
													src={registrationType === 'symposium' ? symposiumQR : culturalsQR}
													alt="UPI QR Code"
													class="h-full w-full"
												/>
											</div>
											<div class="flex flex-col gap-4">
												<a
													href={registrationType === 'symposium' ? symposiumQR : culturalsQR}
													download="Inceptra_QR_{registrationType}.png"
													class="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#8c2bee] shadow-sm transition-all hover:bg-gray-50 active:scale-95"
												>
													<Download size={16} /> Download QR
												</a>
											</div>
										</div>

										<!-- Upload Field -->
										<div class="flex flex-col gap-4">
											<label class="text-sm font-bold" for="payment-screenshot"
												>Upload Payment Screenshot</label
											>
											<div
												class="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e6dbe1] p-8 transition-all hover:border-[#8c2bee]/50"
											>
												{#if paymentScreenshotKey}
													<div class="flex flex-col items-center gap-3 text-green-600">
														<CheckCircle2 size={40} />
														<span class="text-sm font-bold">Screenshot Uploaded!</span>
														<button
															class="text-xs font-bold text-[#8c2bee] underline"
															on:click={() => (paymentScreenshotKey = null)}
														>
															Change File
														</button>
													</div>
												{:else if uploadingScreenshot}
													<div class="flex flex-col items-center gap-3">
														<div
															class="h-10 w-10 animate-spin rounded-full border-4 border-[#8c2bee] border-t-transparent"
														></div>
														<span class="animate-pulse text-sm font-bold">Uploading...</span>
													</div>
												{:else}
													<input
														id="payment-screenshot"
														type="file"
														accept="image/*"
														class="absolute inset-0 cursor-pointer opacity-0"
														on:change={handleScreenshotUpload}
													/>
													<div class="flex flex-col items-center gap-3 opacity-60">
														<Plus size={32} />
														<span class="text-sm font-bold">Click to upload screenshot</span>
													</div>
												{/if}
											</div>
										</div>
									</div>
								{:else}
									<!-- Offline Instructions -->
									<div
										class="flex flex-col gap-6 rounded-2xl border-2 border-[#8c2bee]/20 bg-[#8c2bee]/5 p-8 text-center"
										in:slide
									>
										<div
											class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#8c2bee] shadow-sm"
										>
											<Building size={32} />
										</div>
										<div class="flex flex-col gap-2">
											<h4 class="text-lg font-black text-[#8c2bee]">
												Pay at the Registration Counter
											</h4>
											<p class="text-sm font-medium text-[#756189]">
												Please proceed to the registration desk on the event day to complete your
												payment and collect your physical kit.
											</p>
										</div>
										<div
											class="rounded-xl bg-white p-4 text-xs font-bold tracking-widest text-[#8c2bee] uppercase shadow-sm"
										>
											Counter Ref: {formData.id || 'N/A'}
										</div>
									</div>
								{/if}

								<!-- Contact Information for Payment Issues -->
								<div
									class="mt-4 rounded-3xl border border-white bg-[#f8f6f7] p-8 shadow-sm"
									in:slide
								>
									<div class="mb-6 flex items-center gap-3">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#8c2bee] shadow-sm"
										>
											<Phone size={20} />
										</div>
										<div>
											<h4
												class="text-sm leading-none font-black tracking-widest text-gray-400 uppercase"
											>
												Payment Support
											</h4>
											<p class="mt-1 text-xs font-bold text-[#756189]">
												Found an issue? We're here to help.
											</p>
										</div>
									</div>

									<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
										<div class="space-y-4">
											<div>
												<p
													class="mb-2 text-[10px] font-black tracking-widest text-[#ee2b8c] uppercase opacity-70"
												>
													Cultural Coordinator
												</p>
												<div
													class="rounded-2xl border border-pink-50 bg-white p-4 shadow-sm transition-all hover:scale-[1.02]"
												>
													<span class="block font-black text-gray-800">Mrs. M. Rajalakshimi</span>
													<a
														href="tel:+918682053074"
														class="mt-2 inline-flex items-center gap-2 font-bold text-[#ee2b8c] hover:underline"
													>
														<Phone size={12} />
														86820 53074
													</a>
												</div>
											</div>
										</div>

										<div class="space-y-4">
											<div>
												<p
													class="mb-2 text-[10px] font-black tracking-widest text-[#8c2bee] uppercase opacity-70"
												>
													Symposium Coordinators
												</p>
												<div class="flex flex-col gap-3">
													<div
														class="rounded-2xl border border-purple-50 bg-white p-4 shadow-sm transition-all hover:scale-[1.02]"
													>
														<span class="block font-black text-gray-800">Mr. K. Vijayakumar</span>
														<a
															href="tel:+919944103066"
															class="mt-2 inline-flex items-center gap-2 font-bold text-[#8c2bee] hover:underline"
														>
															<Phone size={12} />
															99441 03066
														</a>
													</div>
													<div
														class="rounded-2xl border border-purple-50 bg-white p-4 shadow-sm transition-all hover:scale-[1.02]"
													>
														<span class="block font-black text-gray-800">Mrs. L. Kokila</span>
														<a
															href="tel:+919566386316"
															class="mt-2 inline-flex items-center gap-2 font-bold text-[#8c2bee] hover:underline"
														>
															<Phone size={12} />
															95663 86316
														</a>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						{/if}
					</div>

					<!-- Info Alert -->
					<div
						class="flex items-start gap-4 rounded-xl border border-[#8c2bee]/10 bg-[#8c2bee]/5 p-4"
					>
						<div class="flex w-full flex-col gap-4">
							<div class="flex items-start gap-4">
								<Info size={20} class="shrink-0 text-[#8c2bee]" />
								<div class="text-sm leading-relaxed font-medium text-[#8c2bee]/90">
									Registration fee covers entry to the campus, participant kit, and lunch. Ensure
									you have your college ID card on the day of the event.
								</div>
							</div>

							{#if error}
								<div
									class="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700"
									in:slide
								>
									<AlertCircle size={18} class="mt-0.5 shrink-0" />
									<span>{error}</span>
								</div>
							{/if}
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
								disabled={(!isFormValid && currentStep === 1) ||
									(currentStep === 2 && paymentMethod === 'online' && !paymentScreenshotKey) ||
									loading}
								on:click={() => {
									if (currentStep === 1) {
										currentStep = 2;
										window.scrollTo({ top: 0, behavior: 'smooth' });
									} else {
										handleSubmit();
									}
								}}
								class="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#8c2bee] text-lg font-black text-white shadow-lg shadow-[#8c2bee]/30 transition-all hover:-translate-y-0.5 hover:shadow-[#8c2bee]/50 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
							>
								{#if loading}
									<div
										class="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"
									></div>
									Processing...
								{:else if currentStep === 1}
									Proceed to Pay
									<ArrowRight size={20} />
								{:else}
									Confirm Submission
									<CheckCircle2 size={20} />
								{/if}
							</button>

							{#if currentStep === 2}
								<button
									class="mt-4 w-full text-center text-sm font-bold text-[#896179] hover:text-[#181115]"
									on:click={() => (currentStep = 1)}
								>
									← Back to Selection
								</button>
							{/if}

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
								info@trichyengg.ac.in
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<!-- SUCCESS STATE: EVENT PASS UI -->
			<div class="mx-auto max-w-md pt-6" in:fade>
				<div class="mb-8 text-center">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-lg"
					>
						<CheckCircle2 size={32} />
					</div>
					<h1 class="text-3xl font-black text-[#141118]">Registration Successful!</h1>
					<p class="text-sm font-medium text-[#896179]">Here is your event pass. Please save it.</p>
				</div>

				<!-- THE PASS -->
				<div
					class="relative overflow-hidden rounded-3xl bg-[#1a1a1a] text-white shadow-2xl transition-transform hover:scale-[1.01]"
				>
					<!-- Pass Header -->
					<div class="bg-gradient-to-r from-[#8c2bee] to-[#ee2b8c] p-6 text-center">
						<h2 class="text-2xl font-black tracking-tighter uppercase italic">INCEPTRA '26</h2>
						<p class="text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase">
							Official Entry Pass
						</p>
					</div>

					<!-- Pass Body -->
					<div class="flex flex-col items-center p-8">
						<!-- User Info -->
						<div class="mb-6 text-center">
							<h3 class="text-2xl font-bold text-white">{formData.name}</h3>
							<p class="font-mono text-sm font-medium text-gray-400">
								{formData.college_id || formData.id}
							</p>
							<p class="mt-1 text-xs text-gray-500">{formData.college}</p>
						</div>

						<!-- QR Code Section -->
						<div class="relative mb-6 rounded-2xl bg-white p-3 shadow-lg">
							{#if qrCodeDataUrl}
								<img src={qrCodeDataUrl} alt="Event Pass QR" class="h-48 w-48 rounded-lg" />
							{:else}
								<div class="flex h-48 w-48 items-center justify-center bg-gray-100 text-gray-400">
									<span class="text-xs">Generating QR...</span>
								</div>
							{/if}
							<!-- Status Badge Override -->
							<div
								class="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-black whitespace-nowrap uppercase shadow-md
                {paymentMethod === 'offline'
									? 'bg-yellow-400 text-yellow-900'
									: 'bg-blue-500 text-white'}"
							>
								{paymentMethod === 'offline' ? 'Payment Pending' : 'Pending Verification'}
							</div>
						</div>

						<!-- Details Grid -->
						<div class="mb-6 grid w-full grid-cols-2 gap-x-2 gap-y-4 text-center text-sm">
							<div>
								<span class="block text-[10px] font-bold text-gray-500 uppercase">Department</span>
								<span class="font-bold">{selectedDept?.name || 'N/A'}</span>
							</div>
							<div>
								<span class="block text-[10px] font-bold text-gray-500 uppercase">Total Amount</span
								>
								<span class="font-bold">₹{150 + formData.events.cultural.length * 100}</span>
							</div>
						</div>

						<!-- Events -->
						<div class="w-full text-center">
							<span class="mb-2 block text-[10px] font-bold text-gray-500 uppercase"
								>Access Allowed For</span
							>
							<div class="flex flex-wrap justify-center gap-2">
								{#each [...formData.events.technical, ...formData.events.nonTechnical] as e}
									<span
										class="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold text-gray-300"
										>{e}</span
									>
								{/each}
								{#each formData.events.cultural as e}
									<span
										class="rounded-md border border-[#ee2b8c]/30 bg-[#ee2b8c]/10 px-2 py-1 text-[10px] font-bold text-[#ee2b8c]"
										>{e}</span
									>
								{/each}
							</div>
						</div>
					</div>

					<!-- Pass Footer -->
					<div
						class="flex flex-col items-center gap-2 bg-[#252525] px-6 py-4 text-center text-[10px] text-gray-500"
					>
						<p>Present this QR code at the registration desk for scanning.</p>
						<p class="font-mono">{new Date().toLocaleDateString()}</p>
					</div>
				</div>

				<!-- Actions -->
				<div class="mt-8 flex flex-col gap-3">
					<button
						class="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#8c2bee] font-bold text-white shadow-lg transition-transform active:scale-95"
						on:click={() => window.location.reload()}
					>
						<Plus size={18} /> Register Another
					</button>
					<a
						href="/"
						class="block text-center text-sm font-bold text-[#896179] hover:text-[#141118]"
					>
						Back to Home
					</a>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		background-color: #f7f6f8;
	}
</style>
