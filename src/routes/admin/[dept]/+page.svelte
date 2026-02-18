<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	import {
		Search,
		Filter,
		CheckCircle2,
		XCircle,
		Clock,
		Eye,
		Download,
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

	let { data } = $props();

	// Safe data access with defaults
	let registrations = $derived(data?.registrations || []);
	let deptFullName = $derived(data?.deptFullName || 'Department');

	let searchQuery = $state('');
	let statusFilter = $state('all');
	let typeFilter = $state('all');
	let paymentFilter = $state('all');

	let filteredRegistrations = $derived(
		(registrations || []).filter((r) => {
			if (!r) return false;
			const name = r.name || '';
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
	let viewImage = $state(null);

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
			<a
				href="/admin/{$page.params.dept}/scan"
				data-sveltekit-reload
				class="flex items-center gap-2 rounded-xl bg-[#141118] px-6 py-3 font-bold text-white shadow-xl shadow-purple-900/10 transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
			>
				<ScanLine size={20} />
				Scan QR
			</a>
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
						<th class="px-6 py-4 text-center">Details</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-50">
					{#each filteredRegistrations as reg (reg.id)}
						{@const StatusIcon = getStatusIcon(reg.payment_status)}
						<tr class="group transition-colors hover:bg-gray-50/30">
							<td class="px-6 py-4">
								<div class="flex flex-col">
									<span class="font-bold text-gray-900">{reg.name}</span>
									<span class="text-[10px] font-bold tracking-tight text-gray-400 uppercase"
										>{reg.college_id}</span
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
												<a
													href="/api/image/{reg.paper_file}"
													download
													class="flex items-center gap-1 text-[10px] font-bold text-[#8c2bee] hover:underline"
													title="Download Paper"
												>
													<Download size={12} /> Download
												</a>
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
							<td class="px-6 py-4">
								<div class="flex items-center justify-center gap-2">
									{#if reg.payment_screenshot_key && reg.payment_screenshot_key !== 'OFFLINE'}
										<button
											onclick={() => (viewImage = reg.payment_screenshot_key)}
											class="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-600 transition-all hover:bg-[#8c2bee] hover:text-white"
											title="View Screenshot"
										>
											<Eye size={16} />
										</button>
									{:else if reg.payment_screenshot_key === 'OFFLINE'}
										<div
											class="flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1.5 text-[9px] font-black text-gray-400 uppercase"
										>
											<Building2 size={12} /> Counter
										</div>
									{/if}
								</div>
							</td>
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

<!-- Modal for Screenshot -->
{#if viewImage}
	<div
		class="fixed inset-0 z-[100] flex h-full w-full items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
		onclick={() => (viewImage = null)}
		role="button"
		tabindex="0"
		onkeydown={(e) => {
			if (e.key === 'Escape') viewImage = null;
		}}
		in:fade
	>
		<div
			class="relative max-h-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
			onclick={(e) => e.stopPropagation()}
		>
			<img
				src="/api/image/{viewImage}"
				alt="Screenshot"
				class="h-auto max-h-[80vh] w-full object-contain"
			/>
			<div class="flex items-center justify-between bg-gray-50 p-6">
				<span class="text-xs font-black tracking-widest text-gray-400 uppercase"
					>Verification Image</span
				>
				<div class="flex gap-2">
					<a
						href="/api/image/{viewImage}"
						download
						class="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-5 py-2 text-sm font-bold shadow-sm transition-all hover:bg-gray-50"
					>
						<Download size={16} /> Download
					</a>
					<button
						onclick={() => (viewImage = null)}
						class="rounded-xl bg-gray-900 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-black"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
