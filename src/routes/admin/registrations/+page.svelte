<script>
	import { enhance } from '$app/forms';
	import {
		Search,
		Filter,
		CheckCircle2,
		XCircle,
		Clock,
		Eye,
		Download,
		ExternalLink,
		User,
		Mail,
		Phone,
		Building2,
		CalendarDays,
		Settings,
		ToggleLeft,
		ToggleRight
	} from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';

	import { adminUser } from '$lib/adminAuth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { API_BASE_URL } from '$lib/index';
	import { Html5Qrcode } from 'html5-qrcode';
	import { onDestroy } from 'svelte';
	import { ScanLine } from 'lucide-svelte';

	let { data } = $props();

	// Safe data access with defaults
	let registrations = $derived(data?.registrations || []);
	let settings = $derived(data?.settings || {});
	let isOfflineEnabled = $derived(settings['offline_payment_enabled'] === 'true');

	let searchQuery = $state('');
	let statusFilter = $state('all');
	let deptFilter = $state('all');
	let typeFilter = $state('all');
	let paymentFilter = $state('all');

	let isSuperAdmin = $state(false);

	const departments = [
		{ id: 'cse', name: 'Computer Science' },
		{ id: 'eee', name: 'Electrical & Electronics' },
		{ id: 'ece', name: 'Electronics & Comm' },
		{ id: 'mech', name: 'Mech & Mechatronics' },
		{ id: 'civil', name: 'Civil Engineering' },
		{ id: 'cultural', name: 'Cultural' },
		{ id: 'hackathon', name: 'Hackathon' }
	];

	onMount(() => {
		const unsubscribe = adminUser.subscribe((u) => {
			if (!u) {
				// Not logged in, redirect to login
				goto('/admin');
				return;
			}

			if (u.role === 'superadmin') {
				isSuperAdmin = true;
				// Keep default 'all'
			} else {
				isSuperAdmin = false;
				// Find the department ID for this user
				// The user object has 'department' name like "Computer Science"
				const mapped = departments.find((d) => d.name === u.department);
				if (mapped) {
					deptFilter = mapped.id;
				} else if (u.normalizedId) {
					// Fallback to normalized ID if it matches (e.g. 'cultural', 'hackathon')
					// departments have 'id'
					const directMatch = departments.find((d) => d.id === u.normalizedId);
					if (directMatch) deptFilter = directMatch.id;
				}
			}
		});
		return unsubscribe;
	});

	function checkDeptMatch(r, filter) {
		if (!r) return false;
		if (filter === 'all') return true;
		const dept = r.target_dept || r.dept || '';
		const regType = r.registration_type || '';

		// Find the full name for the selected filter ID (e.g., 'cse' -> 'Computer Science')
		const filterDeptObj = departments.find((d) => d.id === filter);
		const filterName = filterDeptObj ? filterDeptObj.name : '';

		return (
			(filterName && dept === filterName) ||
			dept.toLowerCase().includes(filter.toLowerCase()) ||
			(filter === 'cultural' && regType === 'cultural') ||
			(filter === 'hackathon' && regType === 'hackathon')
		);
	}

	let filteredRegistrations = $derived(
		registrations.filter((r) => {
			if (!r) return false;
			const name = r.name || '';
			const collegeId = r.college_id || '';
			const email = r.email || '';
			const regType = r.registration_type || '';

			const matchesSearch =
				name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				collegeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
				email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(r.transaction_id || '').toLowerCase().includes(searchQuery.toLowerCase());

			const matchesStatus = statusFilter === 'all' || r.payment_status === statusFilter;
			const matchesDept = checkDeptMatch(r, deptFilter);
			const matchesType =
				typeFilter === 'all' || regType.toLowerCase() === typeFilter.toLowerCase();

			const isOffline = r.payment_mode === 'offline' || r.payment_screenshot_key === 'OFFLINE';
			const matchesPayment =
				paymentFilter === 'all' ||
				(paymentFilter === 'online' && !isOffline) ||
				(paymentFilter === 'offline' && isOffline);

			return matchesSearch && matchesStatus && matchesDept && matchesType && matchesPayment;
		})
	);

	let selectedReg = $state(null);
	let viewImage = $state(null);

	function formatDate(dateStr) {
		if (!dateStr) return 'N/A';
		try {
			// Ensure we have a string for .includes
			const str = typeof dateStr === 'string' ? dateStr : String(dateStr);
			// Handle SQLite space between date and time
			const isoStr = str.includes(' ') ? str.replace(' ', 'T') : str;
			const date = new Date(isoStr);
			if (isNaN(date.getTime())) return 'Invalid Date';
			return date.toLocaleDateString('en-IN', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch (e) {
			console.error('Date parsing error:', e, dateStr);
			return 'Invalid Date';
		}
	}

	function getStatusColor(status) {
		switch (status) {
			case 'approved':
				return 'bg-green-100 text-green-700 border-green-200';
			case 'rejected':
				return 'bg-red-100 text-red-700 border-red-200';
			default:
				return 'bg-yellow-100 text-yellow-700 border-yellow-200';
		}
	}

	function getStatusIcon(status) {
		switch (status) {
			case 'approved':
				return CheckCircle2;
			case 'rejected':
				return XCircle;
			default:
				return Clock;
		}
	}

	// Dashboard Stats
	// Dashboard Stats - Filtered by Department ONLY (ignoring search/status)
	let statsRegistrations = $derived(registrations.filter((r) => checkDeptMatch(r, deptFilter)));

	const stats = $derived({
		total: Array.isArray(statsRegistrations) ? statsRegistrations.length : 0,
		pending: Array.isArray(statsRegistrations)
			? statsRegistrations.filter((r) => r && r.payment_status === 'pending').length
			: 0,
		approved: Array.isArray(statsRegistrations)
			? statsRegistrations.filter((r) => r && r.payment_status === 'approved').length
			: 0,
		revenue: Array.isArray(statsRegistrations)
			? statsRegistrations
					.filter((r) => r && r.payment_status === 'approved')
					.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
			: 0
	});

	// QR Scanner Logic
	let isScanning = $state(false);
	let scanResult = $state(null);
	let scanError = $state(null);
	let scanner = null;

	function startScanner() {
		isScanning = true;
		scanResult = null;
		scanError = null;

		// Delay to allow modal DOM to render
		setTimeout(() => {
			const html5QrCode = new Html5Qrcode('reader');
			scanner = html5QrCode;

			const config = {
				fps: 10,
				qrbox: { width: 250, height: 250 },
				useBarCodeDetectorIfSupported: true
			};

			Html5Qrcode.getCameras()
				.then((devices) => {
					if (devices && devices.length) {
						const cameraId = devices[devices.length - 1].id;
						return html5QrCode.start(cameraId, config, onScanSuccess, onScanFailure);
					} else {
						return html5QrCode.start(
							{ facingMode: 'environment' },
							config,
							onScanSuccess,
							onScanFailure
						);
					}
				})
				.catch((err) => {
					console.error('Error starting scanner', err);
					scanError = 'Camera access failed: ' + (err.message || 'Unknown error');
				});
		}, 300);
	}

	function onScanSuccess(decodedText) {
		try {
			const data = JSON.parse(decodedText);
			scanResult = data;
			stopScanner();
		} catch (e) {
			console.error('Invalid QR', e);
			scanError = 'Invalid QR Code format';
		}
	}

	function onScanFailure(error) {
		// console.warn(`Scan error: ${error}`);
	}

	function stopScanner() {
		if (scanner) {
			scanner
				.stop()
				.then(() => {
					scanner.clear();
					isScanning = false;
				})
				.catch((err) => console.error('Failed to stop scanner', err));
		} else {
			isScanning = false;
		}
	}

	function closeScanResult() {
		scanResult = null;
	}

	onDestroy(() => {
		if (scanner && isScanning) {
			scanner.stop().catch(console.error);
		}
	});
</script>

<svelte:head>
	<title>Admin Panel | Inceptra '26</title>
</svelte:head>

<div class="min-h-screen bg-[#f7f6f8] pt-24 pb-12 font-['Lexend'] text-[#141118]">
	<div class="mx-auto max-w-[1400px] px-6">
		<!-- Header Section -->
		<div class="mb-10">
			<div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
				<div>
					<h1 class="text-4xl font-black tracking-tight text-[#141118]">
						Registration <span class="text-[#8c2bee]">Dashboard</span>
					</h1>
					<p class="mt-2 text-[#756189]">
						Manage and verify participant payments for Inceptra '26.
					</p>
				</div>
			</div>

			<!-- Stats Grid -->
			<div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div
					class="rounded-3xl border border-white bg-white p-6 shadow-sm transition-all hover:shadow-md"
				>
					<div class="flex items-center justify-between">
						<div class="rounded-2xl bg-blue-50 p-3 text-blue-600">
							<User size={24} />
						</div>
						<span class="text-xs font-bold text-gray-400 capitalize">Total Registrations</span>
					</div>
					<div class="mt-4">
						<h3 class="text-3xl font-black">{stats.total}</h3>
						<p class="text-xs font-medium text-gray-500">Participants registered</p>
					</div>
				</div>

				<div
					class="rounded-3xl border border-white bg-white p-6 shadow-sm transition-all hover:shadow-md"
				>
					<div class="flex items-center justify-between">
						<div class="rounded-2xl bg-yellow-50 p-3 text-yellow-600">
							<Clock size={24} />
						</div>
						<span class="text-xs font-bold text-gray-400 capitalize">Pending Verification</span>
					</div>
					<div class="mt-4">
						<h3 class="text-3xl font-black">{stats.pending}</h3>
						<p class="text-xs font-medium text-gray-500">Awaiting your approval</p>
					</div>
				</div>

				<div
					class="rounded-3xl border border-white bg-white p-6 shadow-sm transition-all hover:shadow-md"
				>
					<div class="flex items-center justify-between">
						<div class="rounded-2xl bg-green-50 p-3 text-green-600">
							<CheckCircle2 size={24} />
						</div>
						<span class="text-xs font-bold text-gray-400 capitalize">Verified Payments</span>
					</div>
					<div class="mt-4">
						<h3 class="text-3xl font-black">{stats.approved}</h3>
						<p class="text-xs font-medium text-gray-500">Confirmed registrations</p>
					</div>
				</div>

				<div
					class="rounded-3xl border border-white bg-white p-6 shadow-sm transition-all hover:shadow-md"
				>
					<div class="flex items-center justify-between">
						<div class="rounded-2xl bg-purple-50 p-3 text-purple-600">
							<Building2 size={24} />
						</div>
						<span class="text-xs font-bold text-gray-400 capitalize">Total Revenue</span>
					</div>
					<div class="mt-4">
						<h3 class="text-3xl font-black">₹{(stats?.revenue || 0).toLocaleString('en-IN')}</h3>
						<p class="text-xs font-medium text-gray-500">From verified payments</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Search and Filters -->
		<div class="mb-8 flex flex-wrap items-center gap-4">
			<div class="relative min-w-[300px] flex-1">
				<Search class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={18} />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search by name, ID, or email..."
					class="h-12 w-full rounded-xl border border-gray-200 bg-white pr-4 pl-12 outline-none focus:ring-2 focus:ring-[#8c2bee]/20"
				/>
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<select
					bind:value={typeFilter}
					class="h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#8c2bee]/20"
				>
					<option value="all">All Types</option>
					<option value="symposium">Symposium</option>
					<option value="cultural">Cultural</option>
					<option value="hackathon">Hackathon</option>
				</select>

				<select
					bind:value={deptFilter}
					disabled={!isSuperAdmin}
					class="h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#8c2bee]/20 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<option value="all">All Departments</option>
					{#each departments as dept}
						<option value={dept.id}>{dept.name}</option>
					{/each}
				</select>
				{#if !isSuperAdmin}
					<!-- Overlay or disabled state logic could be here, but 'disabled' attribute works too -->
				{/if}

				<select
					bind:value={statusFilter}
					class="h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#8c2bee]/20"
				>
					<option value="all">All Statuses</option>
					<option value="pending">Pending</option>
					<option value="approved">Approved</option>
					<option value="rejected">Rejected</option>
				</select>

				<select
					bind:value={paymentFilter}
					class="h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#8c2bee]/20"
				>
					<option value="all">Payment Mode</option>
					<option value="online">Online (UPI)</option>
					<option value="offline">Offline (Counter)</option>
				</select>
			</div>
		</div>

		{#if data?.error}
			<div class="mb-8 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
				<div class="mb-1 text-lg font-bold">Error Loading Data</div>
				<p class="opacity-90">{data.error}</p>
			</div>
		{/if}

		<div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
			<div class="overflow-x-auto">
				<table class="w-full text-left">
					<thead>
						<tr
							class="border-b border-gray-100 bg-gray-50/50 text-xs font-bold tracking-widest text-gray-400 uppercase"
						>
							<th class="px-6 py-4">Participant</th>
							<th class="px-6 py-4">Department / Type</th>
							<th class="px-6 py-4">Events / Topic</th>
							<th class="px-6 py-4">Paper / Details</th>
							<th class="px-6 py-4">Payment</th>
							<th class="px-6 py-4">Status</th>
							<th class="px-6 py-4">Date</th>
							{#if isSuperAdmin}
								<th class="px-6 py-4 text-center">Actions</th>
							{/if}
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						{#each filteredRegistrations as reg (reg.id)}
							{@const StatusIcon = getStatusIcon(reg.payment_status)}
							<tr class="group transition-colors hover:bg-gray-50/50">
								<td class="px-6 py-4">
									<div class="flex flex-col">
										<span class="font-bold text-gray-900">{reg.name || 'Unknown'}</span>
										<span class="text-xs text-gray-500"
											>{reg.college_id || 'N/A'} • {reg.college || 'N/A'}</span
										>
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="flex flex-col">
										<span class="text-sm font-semibold capitalize"
											>{reg.registration_type || 'N/A'}</span
										>
										<span class="text-xs text-[#8c2bee]"
											>{reg.target_dept || reg.dept || 'N/A'}</span
										>
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="flex max-w-[200px] flex-wrap gap-1">
										{#if reg.registration_type === 'symposium'}
											{#each reg.technical_events || [] as e}
												{#if e}
													<span
														class="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600"
													>
														{e}
													</span>
												{/if}
											{/each}
											{#each reg.non_technical_events || [] as e}
												{#if e}
													<span
														class="rounded bg-pink-50 px-1.5 py-0.5 text-[10px] font-bold text-pink-600"
													>
														{e}
													</span>
												{/if}
											{/each}
										{:else if reg.registration_type === 'hackathon'}
											<div class="flex flex-col gap-1">
												<span class="text-xs font-bold text-emerald-600">{reg.hackathon_topic}</span
												>
												<span class="text-[10px] font-medium text-gray-500 uppercase"
													>{reg.hackathon_type}</span
												>
											</div>
										{:else}
											{#each reg.cultural_events || [] as e}
												{#if e}
													<span
														class="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-600"
													>
														{e}
													</span>
												{/if}
											{/each}
										{/if}
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="flex flex-col gap-1">
										{#if reg.paper_file}
											<div class="flex max-w-[200px] flex-col gap-1">
												<span class="text-xs font-bold text-gray-700"
													>{reg.paper_title || 'Paper'}</span
												>
												<div class="flex flex-wrap gap-2">
													<a
														href="{API_BASE_URL}/api/image/{reg.paper_file}"
														target="_blank"
														class="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline"
														title="View Paper"
													>
														<ExternalLink size={12} /> View
													</a>
													<a
														href="{API_BASE_URL}/api/image/{reg.paper_file}"
														download
														class="flex items-center gap-1 text-[10px] font-bold text-[#8c2bee] hover:underline"
														title="Download Paper"
													>
														<Download size={12} /> Download
													</a>
												</div>
											</div>
										{:else}
											<span class="text-xs text-gray-400">—</span>
										{/if}
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="flex flex-col">
										<span class="font-bold text-gray-900">₹{reg.amount || 0}</span>
										{#if reg.transaction_id}
											<span class="text-[9px] font-medium text-gray-400"
												>ID: {reg.transaction_id}</span
											>
										{/if}
									</div>
								</td>
								<td class="px-6 py-4">
									<div
										class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold capitalize {getStatusColor(
											reg.payment_status
										)}"
									>
										<StatusIcon size={14} />
										{reg.payment_status || 'pending'}
									</div>
								</td>
								<td class="px-6 py-4 text-sm text-gray-500">{formatDate(reg.created_at)}</td>
								{#if isSuperAdmin}
									<td class="px-6 py-4">
										<div class="flex items-center justify-center gap-2">
											{#if reg.payment_screenshot_key && reg.payment_screenshot_key !== 'OFFLINE'}
												<button
													onclick={() => (viewImage = reg.payment_screenshot_key)}
													class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-[#8c2bee] hover:text-white"
													title="View Screenshot"
												>
													<Eye size={16} />
												</button>
											{:else if reg.payment_screenshot_key === 'OFFLINE'}
												<div
													class="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-[10px] font-black text-gray-400 uppercase"
													title="Payment to be collected at counter"
												>
													<Building2 size={12} /> Counter
												</div>
											{/if}
											<button
												onclick={() => (selectedReg = reg)}
												class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-[#8c2bee] hover:text-white"
												title="Quick Actions"
											>
												<Settings size={16} />
											</button>
										</div>
									</td>
								{/if}
							</tr>
						{:else}
							<tr>
								<td colspan="7" class="px-6 py-20 text-center text-gray-400">
									No registrations found matching your filters.
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<!-- Floating Scan Button -->
<button
	onclick={startScanner}
	class="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#141118] text-white shadow-xl shadow-purple-900/20 transition-all hover:scale-110 hover:shadow-2xl active:scale-95 md:h-auto md:w-auto md:rounded-xl md:px-6 md:py-3"
	title="Scan QR"
>
	<ScanLine size={24} class="md:h-5 md:w-5" />
	<span class="hidden font-bold md:ml-2 md:block">Scan QR</span>
</button>

<!-- Scanner Modal -->
{#if isScanning}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 backdrop-blur-md"
		role="dialog"
		aria-modal="true"
	>
		<div class="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
			<div class="bg-gray-900 p-4 text-center text-white">
				<h3 class="text-lg font-bold">Scan Participant QR</h3>
			</div>
			<div class="p-4">
				<div id="reader" class="overflow-hidden rounded-xl bg-black"></div>
				{#if scanError}
					<div class="mt-4 rounded-lg bg-red-50 p-3 text-center text-xs font-bold text-red-600">
						{scanError}
					</div>
				{/if}
				<button
					onclick={stopScanner}
					class="mt-4 w-full rounded-xl bg-gray-100 py-3 font-bold text-gray-700 hover:bg-gray-200"
				>
					Cancel Scan
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Scan Result Modal -->
{#if scanResult}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"
		role="dialog"
		aria-modal="true"
	>
		<div class="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl">
			<!-- Header -->
			<div class="bg-gradient-to-r from-[#8c2bee] to-[#ee2b8c] p-6 text-center text-white">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
				>
					<User size={32} class="text-white" />
				</div>
				<h2 class="text-2xl font-black tracking-tight uppercase">{scanResult.name}</h2>
				<p class="font-mono text-sm opacity-80">{scanResult.id}</p>
			</div>

			<div class="p-6">
				<!-- College Info -->
				<div class="mb-6 rounded-xl bg-gray-50 p-4 text-center">
					<Building2 size={16} class="mx-auto mb-2 text-gray-400" />
					<p class="text-sm font-bold text-gray-800">{scanResult.college}</p>
					<p class="mt-1 text-xs text-gray-500">{scanResult.year} Year</p>
				</div>

				<!-- Key Details Grid -->
				<div class="mb-6 grid grid-cols-2 gap-4">
					<div class="rounded-xl bg-gray-50 p-3">
						<span class="block text-[10px] font-bold tracking-widest text-gray-400 uppercase"
							>Department</span
						>
						<span class="mt-1 block text-sm font-bold capitalize">{scanResult.dept}</span>
					</div>
					<div class="rounded-xl bg-gray-50 p-3">
						<span class="block text-[10px] font-bold tracking-widest text-gray-400 uppercase"
							>Amount Paid</span
						>
						<span class="mt-1 block text-sm font-bold text-[#8c2bee]">₹{scanResult.amount}</span>
					</div>
					<div class="col-span-2 rounded-xl bg-gray-50 p-3">
						<span class="block text-[10px] font-bold tracking-widest text-gray-400 uppercase"
							>Payment Status</span
						>
						<div class="mt-2 flex items-center gap-2">
							{#if scanResult.paymentStatus === 'approved'}
								<div
									class="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700 uppercase"
								>
									<CheckCircle2 size={14} /> Verified
								</div>
							{:else if scanResult.paymentStatus === 'rejected'}
								<div
									class="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 uppercase"
								>
									<XCircle size={14} /> Rejected
								</div>
							{:else}
								<div
									class="flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700 uppercase"
								>
									<Clock size={14} />
									{scanResult.paymentStatus || 'Pending'}
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Events List -->
				<div class="mb-8">
					<span class="mb-3 block text-[10px] font-bold tracking-widest text-gray-400 uppercase"
						>Registered Events</span
					>
					<div class="flex flex-wrap gap-2">
						{#if scanResult.events && scanResult.events.length > 0}
							{#each scanResult.events as event}
								<span
									class="rounded-lg border border-[#8c2bee]/20 bg-[#8c2bee]/5 px-3 py-1.5 text-xs font-bold text-[#8c2bee]"
								>
									{event}
								</span>
							{/each}
						{:else}
							<span class="text-sm text-gray-400 italic">No events found</span>
						{/if}
					</div>
				</div>

				<!-- Contact -->
				{#if scanResult.phone}
					<div class="mb-6 flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
						<Phone size={12} />
						{scanResult.phone}
						{#if scanResult.email}
							<span class="mx-1">•</span> {scanResult.email}
						{/if}
					</div>
				{/if}

				<!-- Action Button -->
				<div class="flex gap-4">
					<button
						onclick={startScanner}
						class="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gray-100 font-bold text-gray-900 transition-colors hover:bg-gray-200"
					>
						<ScanLine size={18} /> Scan Next
					</button>
					<button
						onclick={closeScanResult}
						class="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#141118] font-bold text-white transition-colors hover:bg-black"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Modal for Screenshot -->
{#if viewImage}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
		role="button"
		tabindex="0"
		onclick={() => (viewImage = null)}
		onkeydown={(e) => e.key === 'Escape' && (viewImage = null)}
		transition:fade
	>
		<div
			class="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
			role="button"
			tabindex="0"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<div class="flex flex-1 items-center justify-center overflow-auto bg-gray-50">
				<img
					src="{API_BASE_URL}/api/image/{viewImage}"
					alt="Payment Screenshot"
					class="max-h-full max-w-full object-contain"
				/>
			</div>
			<div
				class="flex flex-none items-center justify-between border-t border-gray-100 bg-gray-50 p-4"
			>
				<span class="text-sm font-bold text-gray-500">Payment Verification Screenshot</span>
				<div class="flex gap-2">
					<a
						href="{API_BASE_URL}/api/image/{viewImage}"
						download
						class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold hover:bg-gray-50"
					>
						<Download size={16} /> Download
					</a>
					<button
						onclick={() => (viewImage = null)}
						class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Modal for Quick Actions -->
{#if selectedReg}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
		role="button"
		tabindex="0"
		onclick={() => (selectedReg = null)}
		onkeydown={(e) => e.key === 'Escape' && (selectedReg = null)}
		transition:fade
	>
		<div
			class="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl"
			role="button"
			tabindex="0"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			in:slide
		>
			<div class="bg-gray-900 p-8 text-white">
				<h3 class="text-2xl font-black">Verify Payment</h3>
				<p class="mt-1 text-sm text-gray-400">
					Update status for {selectedReg.name || 'Participant'}
				</p>
			</div>

			<div class="p-8">
				<div class="mb-8 grid grid-cols-1 gap-4">
					<div class="flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500"
						>
							<Mail size={18} />
						</div>
						<div class="flex flex-col">
							<span class="text-[10px] font-bold tracking-widest text-gray-400 uppercase"
								>Email</span
							>
							<span class="text-sm font-bold">{selectedReg.email || 'N/A'}</span>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500"
						>
							<Phone size={18} />
						</div>
						<div class="flex flex-col">
							<span class="text-[10px] font-bold tracking-widest text-gray-400 uppercase"
								>Phone</span
							>
							<span class="text-sm font-bold">{selectedReg.phone || 'N/A'}</span>
						</div>
					</div>
				</div>

				<form
					method="POST"
					action="?/updateStatus"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								selectedReg = null;
							}
						};
					}}
					class="grid grid-cols-2 gap-4"
				>
					<input type="hidden" name="id" value={selectedReg.id} />
					<button
						type="submit"
						name="status"
						value="approved"
						class="flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 font-bold text-white shadow-lg shadow-green-600/20 transition-colors hover:bg-green-700"
					>
						<CheckCircle2 size={18} /> Approve
					</button>
					<button
						type="submit"
						name="status"
						value="rejected"
						class="flex h-12 items-center justify-center gap-2 rounded-xl bg-red-600 font-bold text-white shadow-lg shadow-red-600/20 transition-colors hover:bg-red-700"
					>
						<XCircle size={18} /> Reject
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		overflow: auto !important;
	}
</style>
