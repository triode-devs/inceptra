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
			} else {
				error = data.error || 'Failed to fetch registrations';
			}
		} catch (err) {
			error = 'Connection error. Please try again.';
		} finally {
			loading = false;
		}
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
		<div class="grid grid-cols-1 gap-4">
			{#each registrations as reg (reg.id)}
				{@const StatusIcon = getStatusIcon(reg.payment_status)}
				<div
					class="group relative overflow-hidden rounded-[2rem] border border-white bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
						<div class="flex flex-col gap-2">
							<div class="flex items-center gap-2">
								<span class="text-[10px] font-black tracking-widest text-[#8c2bee] uppercase">
									{reg.registration_type}
								</span>
								<div class="h-1 w-1 rounded-full bg-gray-300"></div>
								<span class="text-[10px] font-black tracking-widest text-gray-400 uppercase">
									ID: {reg.college_id}
								</span>
							</div>
							<h3 class="text-xl font-black">{reg.name}</h3>
							<p class="text-sm font-medium text-[#756189]">{reg.dept || 'General'}</p>
						</div>

						<div class="flex flex-wrap items-center gap-4">
							<div class="flex flex-col items-end gap-1">
								<span class="text-[10px] font-bold tracking-tighter text-gray-400 uppercase">
									Registered on {formatDate(reg.created_at)}
								</span>
							</div>
						</div>
					</div>

					<div class="mt-6 flex flex-wrap gap-2 border-t border-gray-50 pt-6">
						{#each [...reg.technical_events, ...reg.non_technical_events, ...reg.cultural_events] as event}
							<span class="rounded-lg bg-gray-50 px-3 py-1 text-[10px] font-bold text-gray-600">
								{event}
							</span>
						{/each}
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
