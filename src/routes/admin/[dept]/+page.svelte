<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	import {
		Search,
		Filter,
		CheckCircle2,
		XCircle,
		Clock,
		Download,
		ExternalLink,
		User,
		Mail,
		Phone,
		Building2,
		Settings,
		Cpu,
		Zap,
		Radio,
		Building,
		Sparkles,
		ScanLine
	} from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import { API_BASE_URL } from '$lib/index';
	import { Html5Qrcode } from 'html5-qrcode';
	import { onDestroy } from 'svelte';

	let { data } = $props();

	// Safe data access with defaults
	let safeData = $derived(data || {});
	let registrations = $derived(safeData.registrations || []);
	let deptFullName = $derived(safeData.deptFullName || 'Department');

	let searchQuery = $state('');
	let statusFilter = $state('all');
	let typeFilter = $state('all');
	let paymentFilter = $state('all');

	let filteredRegistrations = $derived(
		(registrations || []).filter((r) => {
			if (!r) return false;
			const name = r?.name || '';
			const collegeId = r.college_id || '';
			const email = r.email || '';
			const regType = r.registration_type || '';

			const matchesSearch =
				name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				collegeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
				email.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesStatus = statusFilter === 'all' || r.payment_status === statusFilter;
			const matchesType =
				typeFilter === 'all' || regType.toLowerCase() === typeFilter.toLowerCase();

			const isOffline = r.payment_mode === 'offline' || r.payment_screenshot_key === 'OFFLINE';
			const matchesPayment =
				paymentFilter === 'all' ||
				(paymentFilter === 'online' && !isOffline) ||
				(paymentFilter === 'offline' && isOffline);

			return matchesSearch && matchesStatus && matchesType && matchesPayment;
		})
	);

	let selectedReg = $state(null);

	function formatDate(dateStr) {
		if (!dateStr) return 'N/A';
		try {
			const str = typeof dateStr === 'string' ? dateStr : String(dateStr);
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

	const stats = $derived({
		total: (registrations || []).length,
		pending: (registrations || []).filter((r) => r.payment_status === 'pending').length,
		approved: (registrations || []).filter((r) => r.payment_status === 'approved').length,
		revenue: (registrations || [])
			.filter((r) => r.payment_status === 'approved')
			.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
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
	<title>{deptFullName} Admin | Inceptra '26</title>
</svelte:head>

<div class="mx-auto max-w-[1400px] px-6">
	<!-- Header Section -->
	<div class="mb-10">
		<div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
			<div>
				<div class="mb-2 flex items-center gap-2 text-[#8c2bee]">
					<Sparkles size={16} />
					<span class="text-[10px] font-black tracking-widest uppercase">Department Admin</span>
				</div>
				<h1 class="text-4xl font-black tracking-tight text-[#141118]">
					{deptFullName} <span class="text-[#8c2bee]">Records</span>
				</h1>
				<p class="mt-2 text-[#756189]">
					Viewing all registrations for the {deptFullName} department.
				</p>
			</div>
		</div>

		<!-- Stats Grid -->
		<div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-3xl border border-white bg-white p-6 shadow-sm shadow-purple-100/50">
				<div class="flex items-center justify-between">
					<div class="rounded-2xl bg-blue-50 p-3 text-blue-600">
						<User size={24} />
					</div>
				</div>
				<div class="mt-4">
					<h3 class="text-3xl font-black">{stats.total}</h3>
					<p class="text-xs font-bold tracking-tight text-gray-400 uppercase">Total Registered</p>
				</div>
			</div>

			<div class="rounded-3xl border border-white bg-white p-6 shadow-sm shadow-purple-100/50">
				<div class="flex items-center justify-between">
					<div class="rounded-2xl bg-yellow-50 p-3 text-yellow-600">
						<Clock size={24} />
					</div>
				</div>
				<div class="mt-4">
					<h3 class="text-3xl font-black">{stats.pending}</h3>
					<p class="text-xs font-bold tracking-tight text-gray-400 uppercase">Pending Approval</p>
				</div>
			</div>

			<div class="rounded-3xl border border-white bg-white p-6 shadow-sm shadow-purple-100/50">
				<div class="flex items-center justify-between">
					<div class="rounded-2xl bg-green-50 p-3 text-green-600">
						<CheckCircle2 size={24} />
					</div>
				</div>
				<div class="mt-4">
					<h3 class="text-3xl font-black">{stats.approved}</h3>
					<p class="text-xs font-bold tracking-tight text-gray-400 uppercase">Verified</p>
				</div>
			</div>

			<div class="rounded-3xl border border-white bg-white p-6 shadow-sm shadow-purple-100/50">
				<div class="flex items-center justify-between">
					<div class="rounded-2xl bg-purple-50 p-3 text-purple-600">
						<Building2 size={24} />
					</div>
				</div>
				<div class="mt-4">
					<h3 class="text-3xl font-black">₹{stats.revenue.toLocaleString('en-IN')}</h3>
					<p class="text-xs font-bold tracking-tight text-gray-400 uppercase">Total Collection</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="mb-8 flex flex-wrap items-center gap-4">
		<div class="relative min-w-[300px] flex-1">
			<Search class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={18} />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search name, college ID..."
				class="h-12 w-full rounded-xl border border-gray-100 bg-white pr-4 pl-12 font-medium transition-all outline-none focus:border-[#8c2bee] focus:shadow-lg focus:shadow-purple-100/50"
			/>
		</div>

		<div class="flex flex-wrap items-center gap-2">
			<select
				bind:value={statusFilter}
				class="h-12 rounded-xl border border-gray-100 bg-white px-4 text-sm font-bold transition-all outline-none focus:border-[#8c2bee]"
			>
				<option value="all">Progress: All</option>
				<option value="pending">Pending</option>
				<option value="approved">Approved</option>
				<option value="rejected">Rejected</option>
			</select>
			<select
				bind:value={paymentFilter}
				class="h-12 rounded-xl border border-gray-100 bg-white px-4 text-sm font-bold transition-all outline-none focus:border-[#8c2bee]"
			>
				<option value="all">Payment: Any</option>
				<option value="online">Online</option>
				<option value="offline">Counter</option>
			</select>
		</div>
	</div>

	<!-- Table -->
	<div
		class="overflow-hidden rounded-3xl border border-gray-50 bg-white shadow-xl shadow-purple-100/20"
	>
		<div class="overflow-x-auto">
			<table class="w-full text-left">
				<thead>
					<tr
						class="border-b border-gray-50 bg-gray-50/50 text-xs font-black tracking-widest text-gray-400 uppercase"
					>
						<th class="px-6 py-4">Participant</th>
						<th class="px-6 py-4">Events / Topic</th>
						<th class="px-6 py-4">Paper / Details</th>
						<th class="px-6 py-4">Amount</th>
						<th class="px-6 py-4">Status</th>
						<th class="px-6 py-4">Date</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-50">
					{#each filteredRegistrations as reg (reg.id)}
						{@const StatusIcon = getStatusIcon(reg.payment_status)}
						<tr class="group transition-colors hover:bg-gray-50/30">
							<td class="px-6 py-4">
								<div class="flex flex-col">
									<span class="font-bold text-gray-900">{reg?.name || 'Unknown'}</span>
									<span class="text-[10px] font-bold tracking-tight text-gray-400 uppercase"
										>{reg?.college_id || 'N/A'}</span
									>
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex max-w-[200px] flex-wrap gap-1">
									{#if reg.registration_type === 'hackathon'}
										<span class="text-xs font-bold text-emerald-600">{reg.hackathon_topic}</span>
									{:else if reg.registration_type === 'cultural'}
										{#each reg.cultural_events || [] as e}
											<span
												class="rounded bg-pink-50 px-1.5 py-0.5 text-[10px] font-bold text-pink-600"
												>{e}</span
											>
										{/each}
									{:else}
										{#each [...(reg.technical_events || []), ...(reg.non_technical_events || [])] as e}
											<span
												class="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-[#8c2bee]"
												>{e}</span
											>
										{/each}
									{/if}
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex flex-col gap-1">
									{#if reg.paper_title}
										<div class="flex max-w-[200px] flex-col gap-1">
											<span class="text-xs font-bold text-gray-700">{reg.paper_title}</span>
											{#if reg.paper_file}
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
											{/if}
										</div>
									{:else if reg.registration_type === 'hackathon'}
										<span class="text-[10px] font-bold text-gray-400 uppercase"
											>{reg.hackathon_type}</span
										>
									{:else}
										<span class="text-xs text-gray-400">—</span>
									{/if}
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex flex-col">
									<span class="font-black text-gray-900">₹{reg.amount}</span>
									{#if reg.transaction_id}
										<span class="text-[9px] font-medium text-gray-400"
											>UTR: {reg.transaction_id}</span
										>
									{/if}
								</div>
							</td>
							<td class="px-6 py-4">
								<div
									class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase {getStatusColor(
										reg.payment_status
									)}"
								>
									<StatusIcon size={12} />
									{reg.payment_status}
								</div>
							</td>
							<td class="px-6 py-4 text-xs font-bold text-gray-400 uppercase"
								>{formatDate(reg.created_at)}</td
							>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="px-6 py-20 text-center font-bold text-gray-400">
								No records found.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
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

<!-- Modal for Screenshot -->
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
				<h2 class="text-2xl font-black tracking-tight uppercase">
					{scanResult?.name || 'Unknown'}
				</h2>
				<p class="font-mono text-sm opacity-80">{scanResult?.id || 'N/A'}</p>
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
						<span class="mt-1 block text-sm font-bold capitalize"
							>{scanResult?.student_dept ||
								scanResult?.dept ||
								scanResult?.target_dept ||
								'N/A'}</span
						>
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

<style>
	:global(body) {
		overflow: auto !important;
	}
</style>
