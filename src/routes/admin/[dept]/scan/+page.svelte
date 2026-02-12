<script>
	import { onMount, onDestroy } from 'svelte';
	import { Html5Qrcode } from 'html5-qrcode';
	import { page } from '$app/stores';
	import {
		ArrowLeft,
		CheckCircle2,
		AlertCircle,
		ScanLine,
		XCircle,
		Building2,
		User,
		Phone
	} from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';

	let scanner = $state(null);
	let isScanning = $state(false);
	let scanResult = $state(null);
	let error = $state(null);

	function startScanner() {
		isScanning = true;
		scanResult = null;
		error = null;

		// Slight delay to ensure DOM is ready
		setTimeout(() => {
			const html5QrCode = new Html5Qrcode('reader');
			scanner = html5QrCode;

			const config = {
				fps: 10,
				qrbox: { width: 250, height: 250 },
				useBarCodeDetectorIfSupported: true
			};

			// Explicitly request camera permissions
			Html5Qrcode.getCameras()
				.then((devices) => {
					if (devices && devices.length) {
						// Prefer back camera
						const cameraId = devices[devices.length - 1].id;
						return html5QrCode.start(
							cameraId, // Use specific camera ID if available
							config,
							onScanSuccess,
							onScanFailure
						);
					} else {
						// Fallback if getCameras returns empty but permission might be there
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
					if (err.name === 'NotAllowedError') {
						// Common permission denied error
						error = 'Camera permission denied. Please allow camera access in browser settings.';
					} else if (err.name === 'NotFoundError') {
						error = 'No camera found on this device.';
					} else {
						// Try fallback start if getCameras failed
						html5QrCode
							.start({ facingMode: 'environment' }, config, onScanSuccess, onScanFailure)
							.catch((startErr) => {
								error = 'Failed to access camera: ' + (startErr.message || 'Unknown error');
							});
					}
				});
		}, 500);
	}

	function onScanSuccess(decodedText, decodedResult) {
		try {
			const data = JSON.parse(decodedText);
			scanResult = data;
			stopScanner();
		} catch (e) {
			console.error('Invalid QR Format', e);
			error = 'Invalid QR Code format. Not an Inceptra Pass.';
		}
	}

	function onScanFailure(error) {
		// handle scan failure, usually better to ignore and keep scanning.
	}

	function stopScanner() {
		if (scanner) {
			scanner
				.stop()
				.then(() => {
					scanner.clear();
					isScanning = false;
				})
				.catch((err) => {
					console.error('Failed to stop scanner', err);
				});
		} else {
			isScanning = false;
		}
	}

	onMount(() => {
		// Do nothing, wait for user interaction
	});

	onDestroy(() => {
		if (scanner && isScanning) {
			scanner.stop().catch((e) => console.error(e));
		}
	});

	function reset() {
		scanResult = null;
		isScanning = false;
		error = null;
	}
</script>

<div class="min-h-screen bg-[#f7f6f8] p-6 font-['Lexend'] text-[#141118]">
	<div class="mx-auto max-w-md">
		<div class="mb-6 flex items-center gap-4">
			<a
				href="/admin/{$page.params.dept}"
				data-sveltekit-reload
				class="rounded-xl bg-white p-2 text-gray-600 shadow-sm transition-colors hover:text-[#8c2bee]"
			>
				<ArrowLeft size={20} />
			</a>
			<h1 class="text-xl font-black">Scan Participant QR</h1>
		</div>

		{#if !isScanning && !scanResult}
			<div
				class="flex flex-col items-center justify-center rounded-3xl bg-white p-10 text-center shadow-xl"
			>
				<div
					class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-purple-50 text-[#8c2bee]"
				>
					<ScanLine size={48} />
				</div>
				<h2 class="text-xl font-black">Ready to Scan</h2>
				<p class="mt-2 mb-8 text-sm text-gray-500">
					Click the button below to open camera and scan an Event Pass.
				</p>
				<button
					onclick={startScanner}
					class="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#141118] text-lg font-black text-white shadow-lg transition-transform active:scale-95"
				>
					<ScanLine size={20} /> Start Camera
				</button>
			</div>
		{:else if isScanning}
			<div class="relative overflow-hidden rounded-3xl bg-white p-4 shadow-xl">
				<div id="reader" width="100%" class="overflow-hidden rounded-2xl"></div>
				<div class="mt-4 text-center text-sm font-bold text-gray-400">
					Point camera at the Event Pass QR
				</div>
				<button
					onclick={() => {
						stopScanner();
						isScanning = false;
					}}
					class="mt-4 text-xs font-bold text-red-500 underline"
				>
					Stop Camera
				</button>
				{#if error}
					<div
						class="mt-4 rounded-lg bg-red-50 p-3 text-center text-xs font-bold text-red-600"
						in:slide
					>
						{error}
					</div>
				{/if}
			</div>
		{:else if scanResult}
			<div class="overflow-hidden rounded-3xl bg-white shadow-xl" in:fade>
				<!-- Pass Header -->
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
										<AlertCircle size={14} />
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
						<div
							class="mb-6 flex items-center justify-center gap-2 text-xs font-bold text-gray-400"
						>
							<Phone size={12} />
							{scanResult.phone}
							{#if scanResult.email}
								<span class="mx-1">•</span> {scanResult.email}
							{/if}
						</div>
					{/if}

					<!-- Action Button -->
					<button
						onclick={reset}
						class="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#141118] text-lg font-black text-white shadow-lg transition-transform active:scale-95"
					>
						<ScanLine size={20} /> Scan Next
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
