<script>
	import { onMount } from 'svelte';
	import {
		CheckCircle2,
		Clock,
		XCircle,
		ChevronRight,
		MapPin,
		Calendar,
		CreditCard,
		Phone
	} from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import QRCode from 'qrcode';
	import { tick } from 'svelte';

	export let userId = null;

	let registrations = [];
	let loading = true;
	let error = null;

	async function fetchRegistrations() {
		if (!userId) return;
		loading = true;
		try {
			const res = await fetch(`/api/user/registrations?userId=${userId}`);
			const data = await res.json();
			if (res.ok) {
				registrations = data.registrations || [];
				await generateQRs();
			} else {
				error = data.error || 'Failed to fetch registrations';
			}
		} catch (err) {
			error = 'Connection error. Please try again.';
		} finally {
			loading = false;
		}
	}

	async function generateQRs() {
		for (let reg of registrations) {
			const qrData = {
				id: reg.college_id,
				name: reg.name,
				college: reg.college, // Assuming this exists in the fetched data, otherwise might need to be added to API or ignored
				// email: ... might not be in the list endpoint, check if needed.
				// Based on previous file, reg has: id, name, dept, registration_type, technical_events, etc.
				dept: reg.dept,
				events: [
					...(reg.technical_events || []),
					...(reg.non_technical_events || []),
					...(reg.cultural_events || [])
				],
				// Payment details included in QR but hidden from UI as requested
				paymentStatus: reg.payment_status,
				amount: reg.amount, // API should return this
				timestamp: reg.created_at
			};

			try {
				reg.qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
					width: 200,
					margin: 2,
					color: {
						dark: '#000000',
						light: '#ffffff'
					}
				});
			} catch (err) {
				console.error(err);
			}
		}
		registrations = registrations; // Trigger reactivity
	}

	onMount(() => {
		fetchRegistrations();
	});

	function getStatusColors(status) {
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

	function formatDate(dateStr) {
		try {
			const date = new Date(dateStr.replace(' ', 'T'));
			return date.toLocaleDateString('en-IN', {
				day: 'numeric',
				month: 'short',
				year: 'numeric'
			});
		} catch (e) {
			return dateStr;
		}
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-black text-[#141118]">
			My <span class="text-[#8c2bee]">Registrations</span>
		</h2>
		<button
			on:click={fetchRegistrations}
			class="text-xs font-bold tracking-widest text-[#8c2bee] uppercase hover:underline"
		>
			Refresh
		</button>
	</div>

	{#if loading}
		<div class="flex flex-col gap-4">
			{#each [1, 2] as i}
				<div class="h-40 w-full animate-pulse rounded-[2rem] bg-white"></div>
			{/each}
		</div>
	{:else if error}
		<div class="rounded-2xl bg-red-50 p-6 text-center font-bold text-red-600">
			{error}
		</div>
	{:else if registrations.length === 0}
		<div class="rounded-[2.5rem] bg-white p-12 text-center shadow-sm">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400"
			>
				<CreditCard size={32} />
			</div>
			<h3 class="text-xl font-bold">No registrations found</h3>
			<p class="mt-2 text-[#756189]">You haven't registered for any events yet.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each registrations as reg (reg.id)}
				<div
					class="relative overflow-hidden rounded-3xl bg-[#1a1a1a] text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl"
				>
					<!-- Pass Header -->
					<div class="bg-gradient-to-r from-[#8c2bee] to-[#ee2b8c] p-4 text-center">
						<h2 class="text-xl font-black tracking-tighter uppercase italic">INCEPTRA '26</h2>
						<p class="text-[8px] font-bold tracking-[0.2em] text-white/80 uppercase">
							Official Entry Pass
						</p>
					</div>

					<!-- Pass Body -->
					<div class="flex flex-col items-center p-6">
						<!-- User Info -->
						<div class="mb-4 text-center">
							<h3 class="text-lg font-bold text-white">{reg.name}</h3>
							<p class="font-mono text-xs font-medium text-gray-400">
								{reg.college_id}
							</p>
							<p class="mt-1 text-[10px] tracking-widest text-gray-500 uppercase">
								{reg.registration_type}
							</p>
						</div>

						<!-- QR Code Section -->
						<div class="relative mb-4 rounded-xl bg-white p-2 shadow-lg">
							{#if reg.qrCodeUrl}
								<img src={reg.qrCodeUrl} alt="Pass QR" class="h-32 w-32 rounded-lg" />
							{:else}
								<div class="flex h-32 w-32 items-center justify-center bg-gray-100 text-gray-400">
									<span class="text-[10px]">Generating...</span>
								</div>
							{/if}
						</div>

						<!-- Details Grid -->
						<div class="mb-4 w-full text-center">
							<span class="block text-[8px] font-bold text-gray-500 uppercase">Department</span>
							<span class="text-xs font-bold">{reg.dept || 'General'}</span>
						</div>

						<!-- Events -->
						<div class="w-full text-center">
							<span class="mb-2 block text-[8px] font-bold text-gray-500 uppercase"
								>Access Allowed For</span
							>
							<div class="flex flex-wrap justify-center gap-1.5">
								{#each [...(reg.technical_events || []), ...(reg.non_technical_events || []), ...(reg.cultural_events || [])] as event}
									<span
										class="rounded bg-[#8c2bee]/20 px-1.5 py-0.5 text-[8px] font-bold text-[#d4b3ff]"
										>{event}</span
									>
								{/each}
							</div>
						</div>
					</div>

					<!-- Pass Footer -->
					<div class="bg-[#252525] px-4 py-3 text-center text-[8px] font-medium text-gray-500">
						<p>Scan for details & validation</p>
						<div class="mt-1 flex justify-center gap-2 font-mono opacity-50">
							<span>{formatDate(reg.created_at)}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Payment Support Contacts -->
	<div class="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
		<div class="mb-6 flex items-center gap-3">
			<div
				class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8c2bee]/10 text-[#8c2bee]"
			>
				<Phone size={20} />
			</div>
			<div>
				<h3 class="text-sm font-black tracking-widest text-[#141118] uppercase">Payment Support</h3>
				<p class="mt-0.5 text-xs font-bold text-[#756189]">Issues with approval? Contact us.</p>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
				<p class="mb-1 text-[10px] font-black tracking-widest text-[#ee2b8c] uppercase opacity-70">
					Cultural Coordinator
				</p>
				<span class="block text-sm font-black text-gray-800">Mrs. M. Rajalakshimi</span>
				<a
					href="tel:+918682053074"
					class="mt-2 inline-flex items-center gap-2 text-xs font-bold text-[#ee2b8c] hover:underline"
				>
					<Phone size={12} /> 86820 53074
				</a>
			</div>
			<div class="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
				<p class="mb-1 text-[10px] font-black tracking-widest text-[#8c2bee] uppercase opacity-70">
					Symposium Coordinators
				</p>
				<div class="flex flex-col gap-3">
					<div>
						<span class="block text-sm text-xs font-black text-gray-800">Mr. K. Vijayakumar</span>
						<a
							href="tel:+919944103066"
							class="mt-1 inline-flex items-center gap-2 text-xs font-bold text-[#8c2bee] hover:underline"
						>
							<Phone size={12} /> 99441 03066
						</a>
					</div>
					<div>
						<span class="block text-sm text-xs font-black text-gray-800">Mrs. L. Kokila</span>
						<a
							href="tel:+919566386316"
							class="mt-1 inline-flex items-center gap-2 text-xs font-bold text-[#8c2bee] hover:underline"
						>
							<Phone size={12} /> 95663 86316
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
