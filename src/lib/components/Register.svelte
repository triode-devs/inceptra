<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
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
		Phone,
		XCircle,
		User,
		History,
		UserCheck
	} from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import symposiumQR from '../assets/qr/symposium.png';
	import culturalsQR from '../assets/qr/culturals.png';
	import { symposiumData, culturalEvents } from '$lib/data/data';
	import QRCode from 'qrcode';
	import { API_BASE_URL } from '$lib';

	// Props: Accept deptId from parent (URL param)
	export let deptId = null;
	export let settings = {};
	export let userEmail = null;
	export let userId = null;

	let registrationType = 'hackathon'; // 'symposium' | 'cultural' | 'hackathon'
	let submitted = false;
	let loading = false;
	let error = null;
	let currentStep = 1; // 1: Info/Selection, 2: Payment
	let paymentScreenshotKey = null;
	let uploadingScreenshot = false;
	let paymentMethod = 'online'; // 'online' | 'offline'
	let qrCodeDataUrl = '';

	$: isOfflineEnabled = true;

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
			amount: totalAmount,
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

	// --- Data loaded from data.js ---

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
		studentDept: '', // Participant's Department
		events: {
			technical: [],
			nonTechnical: [],
			cultural: []
		},
		paperTitle: '',
		paperFile: null,
		hackathonTopic: 'Sustainable Tech (Green Energy)',
		hackathonType: 'software',
		transactionId: ''
	};

	// Sync email if userEmail changes
	$: if (userEmail && !formData.email) {
		formData.email = userEmail;
	}

	// --- Logic ---
	let selectedDeptIndex = -1;
	let otherDeptName = '';
	const KNOWN_DEPTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS'];
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

	// LocalStorage key for form data
	const STORAGE_KEY = 'inceptra_registration_draft';
	let saveTimeout = null;

	// --- Profile Suggestions ---
	let suggestedProfiles = [];
	let loadingProfiles = false;
	let showProfileDropdown = false;

	async function loadProfileSuggestions() {
		if (!userId || !browser) return;
		loadingProfiles = true;
		try {
			// 1. Fetch from API
			const res = await fetch(`${API_BASE_URL}/api/user/registrations?userId=${userId}`);
			const data = await res.json();
			let profiles = [];

			if (res.ok && data.registrations) {
				profiles = data.registrations.map((r) => ({
					name: r.name,
					id: r.college_id,
					email: r.email,
					phone: r.phone,
					year: r.year,
					college: r.college,
					address: r.address,
					food: r.food,
					studentDept: r.student_dept || r.dept,
					type: 'Previous Entry'
				}));
			}

			// 2. Fetch from LocalStorage (Draft)
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed.formData && parsed.formData.name) {
					profiles.push({
						...parsed.formData,
						type: 'Unfinished Draft'
					});
				}
			}

			// Deduplicate by Name + ID
			const unique = [];
			const seen = new Set();
			for (const p of profiles) {
				const key = `${p.name}-${p.id}`;
				if (!seen.has(key)) {
					unique.push(p);
					seen.add(key);
				}
			}
			suggestedProfiles = unique;
		} catch (e) {
			console.error('Failed to load suggested profiles', e);
		} finally {
			loadingProfiles = false;
		}
	}

	function applyProfile(profile) {
		formData = {
			...formData,
			name: profile.name || '',
			id: profile.id || '',
			email: profile.email || '',
			phone: profile.phone || '',
			year: profile.year || '',
			college: profile.college || '',
			address: profile.address || '',
			food: profile.food || '',
			studentDept: profile.studentDept || profile.dept || ''
		};

		// Handle "Other" department in restoration
		if (formData.studentDept && !KNOWN_DEPTS.includes(formData.studentDept)) {
			otherDeptName = formData.studentDept;
			formData.studentDept = 'Other';
		} else {
			otherDeptName = '';
		}

		// If dept matches an organizing dept, update selectedDeptIndex
		const deptToMatch = profile.targetDept || profile.dept;
		if (deptToMatch) {
			const index = symposiumData.findIndex((d) => d.name === deptToMatch);
			if (index !== -1) selectedDeptIndex = index;
		}
		showProfileDropdown = false;
	}

	// Save form data to localStorage (Keep as draft but don't auto-fill)
	function saveFormToLocalStorage() {
		if (!browser) return;
		try {
			const dataToSave = {
				formData,
				registrationType,
				selectedDeptIndex,
				currentStep,
				paymentMethod,
				timestamp: Date.now()
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
		} catch (e) {
			console.error('Failed to save form data:', e);
		}
	}

	// Debounced auto-save function
	function autoSave() {
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			saveFormToLocalStorage();
		}, 1000);
	}

	// Clear saved form data
	function clearSavedForm() {
		if (!browser) return;
		try {
			localStorage.removeItem(STORAGE_KEY);
			console.log('Saved form data cleared');
		} catch (e) {
			console.error('Failed to clear saved form data:', e);
		}
	}

	// Watch for form changes and auto-save
	$: if (browser && !submitted) {
		formData;
		registrationType;
		selectedDeptIndex;
		currentStep;
		paymentMethod;
		autoSave();
	}

	onMount(() => {
		loadProfileSuggestions();

		// If a department is pre-selected via prop, scroll to the section
		if (deptId) {
			setTimeout(() => {
				document
					.getElementById('dept-selection')
					?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}, 500);
		}
	});

	onDestroy(() => {
		if (saveTimeout) clearTimeout(saveTimeout);
	});

	// Calculate Amount
	$: totalAmount = 300;

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
			const res = await fetch(`${API_BASE_URL}/api/upload`, {
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
			const res = await fetch(`${API_BASE_URL}/api/upload`, {
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
			if (formData.events.technical.length < 2) {
				formData.events.technical = [...formData.events.technical, event];
			} else {
				error = 'Maximum 2 Technical events allowed.';
				setTimeout(() => (error = null), 3000);
			}
		}
	}

	function toggleNonTechEvent(event) {
		if (formData.events.nonTechnical.includes(event)) {
			formData.events.nonTechnical = formData.events.nonTechnical.filter((e) => e !== event);
		} else {
			if (formData.events.nonTechnical.length < 1) {
				formData.events.nonTechnical = [event];
			} else {
				error = 'Maximum 1 Non-Technical event allowed.';
				setTimeout(() => (error = null), 3000);
			}
		}
	}

	function toggleCulturalEvent(event) {
		if (formData.events.cultural.includes(event)) {
			formData.events.cultural = formData.events.cultural.filter((e) => e !== event);
		} else {
			if (formData.events.cultural.length < 2) {
				formData.events.cultural = [...formData.events.cultural, event];
			} else {
				error = 'Maximum 2 Cultural events allowed.';
				setTimeout(() => (error = null), 3000);
			}
		}
	}

	// --- Validation ---
	$: isHackathonValid = formData.hackathonTopic && formData.hackathonType;

	$: isCulturalValid = formData.events.cultural.length > 0 && formData.events.cultural.length <= 2;

	// Defensive reactive check to enforce limits if data is restored from old drafts
	$: if (formData.events.technical.length > 2) {
		formData.events.technical = formData.events.technical.slice(0, 2);
	}
	$: if (formData.events.nonTechnical.length > 1) {
		formData.events.nonTechnical = formData.events.nonTechnical.slice(0, 1);
	}
	$: if (formData.events.cultural.length > 2) {
		formData.events.cultural = formData.events.cultural.slice(0, 2);
	}

	$: isSymposiumValid = (() => {
		if (!selectedDept) return false;
		const techCount = formData.events.technical.length;
		const nonTechCount = formData.events.nonTechnical.length;
		// At least one event, and within limits
		return (techCount > 0 || nonTechCount > 0) && techCount <= 2 && nonTechCount <= 1;
	})();

	$: isFormValid =
		(registrationType === 'symposium'
			? isSymposiumValid
			: registrationType === 'hackathon'
				? isHackathonValid
				: isCulturalValid) &&
		formData.name &&
		formData.id &&
		formData.email &&
		formData.phone &&
		formData.year &&
		formData.college &&
		formData.address &&
		formData.food &&
		(formData.studentDept === 'Other' ? otherDeptName : formData.studentDept) &&
		(currentStep === 2 && paymentMethod === 'online'
			? paymentScreenshotKey && formData.transactionId
			: true);

	async function handleSubmit() {
		if (isFormValid && (paymentScreenshotKey || paymentMethod === 'offline')) {
			loading = true;
			error = null;
			try {
				const response = await fetch(`${API_BASE_URL}/api/register`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						...formData,
						registrationType,
						amount: totalAmount,
						paymentMode: paymentMethod,
						transactionId: paymentMethod === 'offline' ? 'OFFLINE' : formData.transactionId,
						payment_screenshot_key: paymentMethod === 'offline' ? 'OFFLINE' : paymentScreenshotKey,
						studentDept: formData.studentDept === 'Other' ? otherDeptName : formData.studentDept,
						targetDept: selectedDept?.name || null,
						user_id: userId
					})
				});

				const result = await response.json();

				if (response.ok) {
					submitted = true;
					// Clear saved form data on successful submission
					clearSavedForm();
					loadProfileSuggestions(); // Refresh suggestions with the new entry
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
									<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
										<button
											type="button"
											class="flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all
                      {registrationType === 'symposium'
												? 'border-[#8c2bee] bg-[#8c2bee]/5 text-[#8c2bee]'
												: 'border-transparent bg-[#f8f6f7] hover:border-[#8c2bee]/30'}"
											onclick={() => {
												registrationType = 'symposium';
												resetSelection();
											}}
										>
											<Cpu size={32} />
											<span class="font-bold">Symposium</span>
										</button>
										<button
											type="button"
											class="flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all
                      {registrationType === 'cultural'
												? 'border-[#ee2b8c] bg-[#ee2b8c]/5 text-[#ee2b8c]'
												: 'border-transparent bg-[#f8f6f7] hover:border-[#ee2b8c]/30'}"
											onclick={() => {
												registrationType = 'cultural';
												resetSelection();
											}}
										>
											<Sparkles size={32} />
											<span class="font-bold">Culturals</span>
										</button>
										<button
											type="button"
											class="flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all
                      {registrationType === 'hackathon'
												? 'border-emerald-600 bg-emerald-600/5 text-emerald-600'
												: 'border-transparent bg-[#f8f6f7] hover:border-emerald-600/30'}"
											onclick={() => {
												registrationType = 'hackathon';
												resetSelection();
											}}
										>
											<Zap size={32} />
											<span class="font-bold">Hackathon</span>
										</button>
									</div>
								</div>

								<!-- Quick Fill Dropdown -->
								{#if suggestedProfiles.length > 0}
									<div class="mb-4 md:col-span-2">
										<label
											class="mb-3 block text-sm font-bold tracking-widest text-gray-500 uppercase"
										>
											Quick Fill Details
										</label>
										<div class="relative">
											<button
												type="button"
												onclick={() => (showProfileDropdown = !showProfileDropdown)}
												class="flex h-14 w-full items-center justify-between rounded-xl border-2 border-dashed border-[#8c2bee]/20 bg-white px-6 font-bold text-[#8c2bee] transition-all hover:border-[#8c2bee]/50"
											>
												<div class="flex items-center gap-3">
													<History size={18} />
													<span>Select from previous or drafts</span>
												</div>
												<ChevronRight
													size={18}
													class="transition-transform {showProfileDropdown ? 'rotate-90' : ''}"
												/>
											</button>

											{#if showProfileDropdown}
												<div
													class="absolute top-full right-0 left-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl"
													transition:slide
												>
													{#each suggestedProfiles as profile}
														<button
															type="button"
															onclick={() => applyProfile(profile)}
															class="flex w-full items-center justify-between rounded-xl p-4 text-left transition-all hover:bg-gray-50"
														>
															<div class="flex items-center gap-3">
																<div
																	class="flex h-10 w-10 items-center justify-center rounded-full bg-[#8c2bee]/10 text-[#8c2bee]"
																>
																	<User size={18} />
																</div>
																<div>
																	{#if profile.type === 'Unfinished Draft'}
																		<p
																			class="mb-0.5 text-xs font-bold tracking-tighter text-[#8c2bee] uppercase"
																		>
																			Resume Draft
																		</p>
																	{/if}
																	<p class="text-sm font-black">{profile.name}</p>
																	<p class="text-[10px] font-bold text-gray-400 uppercase">
																		{profile.id} • {profile.college}
																	</p>
																</div>
															</div>
															<span
																class="rounded-full bg-gray-100 px-2.5 py-1 text-[8px] font-black tracking-widest text-gray-500 uppercase"
															>
																{profile.type}
															</span>
														</button>
													{/each}
												</div>
											{/if}
										</div>
									</div>
								{/if}

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
								<div class="flex flex-col gap-4">
									<label class="text-sm font-bold" for="studentDept">Your Department</label>
									<select
										id="studentDept"
										bind:value={formData.studentDept}
										class="h-14 rounded-xl border-none bg-[#f8f6f7] px-6 font-medium focus:ring-2 focus:ring-[#8c2bee]/20
										{!formData.studentDept && error?.includes('department') ? 'ring-2 ring-red-500' : ''}"
									>
										<option value="">Select Dept</option>
										<option value="CSE">CSE</option>
										<option value="ECE">ECE</option>
										<option value="EEE">EEE</option>
										<option value="MECH">MECH</option>
										<option value="CIVIL">CIVIL</option>
										<option value="IT">IT</option>
										<option value="AIDS">AI & DS</option>
										<option value="Other">Other</option>
									</select>
								</div>

								{#if formData.studentDept === 'Other'}
									<div class="flex flex-col gap-4" transition:slide>
										<label class="text-sm font-bold" for="otherDept">Specify Department</label>
										<input
											id="otherDept"
											bind:value={otherDeptName}
											placeholder="Your Department Name"
											class="h-14 rounded-xl border-none bg-[#f8f6f7] px-6 font-medium focus:ring-2 focus:ring-[#8c2bee]/20"
										/>
									</div>
								{/if}
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
													onclick={() => !isDeptLocked && (selectedDeptIndex = idx)}
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
														{@const isSelected = formData.events.technical.includes(event)}
														{@const isLimitReached = formData.events.technical.length >= 2}
														<label
															class="group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all
                            {isSelected
																? 'border-[#8c2bee] bg-white'
																: 'border-transparent bg-[#f8f6f7] hover:border-[#8c2bee]/30'}
                            {!isSelected && isLimitReached ? 'cursor-not-allowed opacity-50' : ''}
                          "
														>
															<input
																type="checkbox"
																class="h-5 w-5 rounded border-gray-300 text-[#8c2bee] focus:ring-[#8c2bee]"
																checked={isSelected}
																disabled={!isSelected && isLimitReached}
																onchange={() => toggleTechEvent(event)}
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
																				onclick={() => (formData.paperFile = null)}
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
																			onchange={handlePaperUpload}
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
															{@const isSelected = formData.events.nonTechnical.includes(event)}
															{@const isLimitReached = formData.events.nonTechnical.length >= 1}
															<label
																class="group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all
                               {isSelected
																	? 'border-[#8c2bee] bg-white'
																	: 'border-transparent bg-[#f8f6f7] hover:border-[#8c2bee]/30'}
                               {!isSelected && isLimitReached
																	? 'cursor-not-allowed opacity-50'
																	: ''}
                             "
															>
																<input
																	type="checkbox"
																	class="h-5 w-5 rounded border-gray-300 text-[#8c2bee] focus:ring-[#8c2bee]"
																	checked={isSelected}
																	disabled={!isSelected && isLimitReached}
																	onchange={() => toggleNonTechEvent(event)}
																/>
																<div class="flex-1">
																	<div class="flex items-center gap-2">
																		<span class="text-sm font-extrabold">{event}</span>
																		<span
																			class="rounded-full bg-[#8c2bee]/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#8c2bee] uppercase"
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
									<div class="mb-4 rounded-lg bg-[#ee2b8c]/5 p-3 text-xs font-bold text-[#ee2b8c]">
										Note: You can participate in a maximum of 2 cultural events.
									</div>
									<div class="grid grid-cols-1 gap-3">
										{#each culturalEvents as event}
											{@const isSelected = formData.events.cultural.includes(event)}
											{@const isLimitReached = formData.events.cultural.length >= 2}
											<label
												class="group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all
                      {isSelected
													? 'border-[#ee2b8c] bg-white'
													: 'border-transparent bg-[#f8f6f7] hover:border-[#ee2b8c]/30'}
                      {!isSelected && isLimitReached ? 'cursor-not-allowed opacity-50' : ''}
                    "
											>
												<input
													type="checkbox"
													class="h-5 w-5 rounded border-gray-300 text-[#ee2b8c] focus:ring-[#ee2b8c]"
													checked={isSelected}
													disabled={!isSelected && isLimitReached}
													onchange={() => toggleCulturalEvent(event)}
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

							<!-- HACKATHON SELECTION -->
							{#if registrationType === 'hackathon' && currentStep === 1}
								<div in:fade class="flex flex-col gap-8">
									<h3 class="flex items-center gap-2 text-lg font-bold">
										<Zap size={20} class="text-emerald-600" />
										Hackathon Details
									</h3>

									<div class="flex flex-col gap-6">
										<div class="flex flex-col gap-3">
											<label class="text-sm font-bold" for="hackathonTopic"
												>Project / Topic Name</label
											>
											<input
												id="hackathonTopic"
												bind:value={formData.hackathonTopic}
												class="h-14 cursor-not-allowed rounded-xl border-none bg-[#f8f6f7] px-6 font-medium text-gray-400"
												readonly
											/>
										</div>

										<div class="flex flex-col gap-3">
											<label class="text-sm font-bold" for="hackathonType">Select Category</label>
											<div class="grid grid-cols-2 gap-4">
												<button
													type="button"
													class="flex items-center justify-center gap-2 rounded-xl border-2 py-4 font-bold transition-all
                          {formData.hackathonType === 'software'
														? 'border-emerald-600 bg-emerald-600/5 text-emerald-600'
														: 'border-transparent bg-[#f8f6f7] hover:border-emerald-600/30'}"
													onclick={() => (formData.hackathonType = 'software')}
												>
													Software
												</button>
												<button
													type="button"
													class="flex items-center justify-center gap-2 rounded-xl border-2 py-4 font-bold transition-all
                          {formData.hackathonType === 'hardware'
														? 'border-emerald-600 bg-emerald-600/5 text-emerald-600'
														: 'border-transparent bg-[#f8f6f7] hover:border-emerald-600/30'}"
													onclick={() => (formData.hackathonType = 'hardware')}
												>
													Hardware
												</button>
											</div>
										</div>
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
												onclick={() => (paymentMethod = 'online')}
											>
												<QrCode size={24} />
												<span class="text-sm font-bold">Scan & Pay</span>
											</button>
											<button
												class="flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all
												{paymentMethod === 'offline'
													? 'border-[#8c2bee] bg-[#8c2bee]/5 text-[#8c2bee]'
													: 'border-transparent bg-[#f8f6f7] opacity-60'}"
												onclick={() => (paymentMethod = 'offline')}
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

										<!-- Transaction ID Field -->
										<div class="flex flex-col gap-4">
											<label class="text-sm font-bold" for="transactionId"
												>Transaction ID (UTR)</label
											>
											<input
												id="transactionId"
												bind:value={formData.transactionId}
												class="h-14 rounded-xl border-none bg-[#f8f6f7] px-6 font-medium focus:ring-2 focus:ring-[#8c2bee]/20"
												placeholder="Enter UPI Transaction ID"
											/>
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
															onclick={() => (paymentScreenshotKey = null)}
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
														onchange={handleScreenshotUpload}
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
										<p class="text-sm font-bold">Category</p>
										<p class="text-xs text-[#896179]">
											{registrationType.charAt(0).toUpperCase() + registrationType.slice(1)}
										</p>
									</div>
									<span class="font-bold">₹{totalAmount}</span>
								</div>

								{#if registrationType === 'symposium' && (formData.events.technical.length > 0 || formData.events.nonTechnical.length > 0)}
									<div class="flex items-start justify-between">
										<div>
											<p class="text-sm font-bold">Selected Events</p>
											<p class="max-w-[150px] truncate text-xs text-[#896179]">
												{formData.events.technical.length} Tech, {formData.events.nonTechnical
													.length} Non-Tech
											</p>
										</div>
										<span class="text-xs font-bold text-green-600">Included</span>
									</div>
								{:else if registrationType === 'cultural' && formData.events.cultural.length > 0}
									<div class="flex items-start justify-between">
										<div>
											<p class="text-sm font-bold">Selected Events</p>
											<p class="max-w-[150px] truncate text-xs text-[#896179]">
												{formData.events.cultural.length} Events
											</p>
										</div>
										<span class="text-xs font-bold text-green-600">Included</span>
									</div>
								{/if}
							</div>

							<div class="mb-8 flex flex-col gap-2">
								<div
									class="mt-2 flex items-center justify-between border-t border-dashed border-[#e6dbe1] pt-4"
								>
									<span class="text-lg font-bold">Total Amount</span>
									<span class="text-2xl font-black text-[#8c2bee]">₹{totalAmount}</span>
								</div>
							</div>

							<button
								disabled={loading}
								onclick={() => {
									if (currentStep === 1) {
										if (
											!formData.studentDept ||
											(formData.studentDept === 'Other' && !otherDeptName)
										) {
											error = 'Please select your department before proceeding.';
											setTimeout(() => (error = null), 3000);
											// Scroll to department selection
											document
												.getElementById('studentDept')
												?.scrollIntoView({ behavior: 'smooth', block: 'center' });
											return;
										}

										if (totalAmount === 0 && registrationType !== 'hackathon') {
											error = 'Please select at least one event before proceeding.';
											setTimeout(() => (error = null), 3000);
											return;
										}

										if (!isFormValid) {
											error = 'Please fill all required fields before proceeding.';
											setTimeout(() => (error = null), 3000);
											return;
										}
										currentStep = 2;
										window.scrollTo({ top: 0, behavior: 'smooth' });
									} else {
										if (
											paymentMethod === 'online' &&
											(!paymentScreenshotKey || !formData.transactionId)
										) {
											error = 'Please upload payment screenshot and enters transaction ID.';
											setTimeout(() => (error = null), 3000);
											return;
										}
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
									onclick={() => (currentStep = 1)}
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
								<span class="font-bold">₹{totalAmount}</span>
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
						onclick={() => window.location.reload()}
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
