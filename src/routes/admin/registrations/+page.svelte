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

	const departments = [
		{ id: 'cse', name: 'Computer Science' },
		{ id: 'eee', name: 'Electrical & Electronics' },
		{ id: 'ece', name: 'Electronics & Comm' },
		{ id: 'mech', name: 'Mech & Mechatronics' },
		{ id: 'civil', name: 'Civil Engineering' }
	];

	let filteredRegistrations = $derived(
		registrations.filter((r) => {
			if (!r) return false;
			const name = r.name || '';
			const collegeId = r.college_id || '';
			const email = r.email || '';
			const dept = r.dept || '';
			const regType = r.registration_type || '';

			const matchesSearch =
				name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				collegeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
				email.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesStatus = statusFilter === 'all' || r.payment_status === statusFilter;
			const matchesDept = deptFilter === 'all' || dept.toLowerCase() === deptFilter.toLowerCase();
			const matchesType =
				typeFilter === 'all' || regType.toLowerCase() === typeFilter.toLowerCase();

			const isOffline = r.payment_screenshot_key === 'OFFLINE';
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
	const stats = $derived({
		total: Array.isArray(registrations) ? registrations.length : 0,
		pending: Array.isArray(registrations)
			? registrations.filter((r) => r && r.payment_status === 'pending').length
			: 0,
		approved: Array.isArray(registrations)
			? registrations.filter((r) => r && r.payment_status === 'approved').length
			: 0,
		revenue: Array.isArray(registrations)
			? registrations
					.filter((r) => r && r.payment_status === 'approved')
					.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
			: 0
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

				<div class="flex items-center gap-4">
					<!-- Offline Payment Toggle -->
					<form
						method="POST"
						action="?/toggleOfflinePayment"
						use:enhance
						class="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-3 shadow-sm transition-all hover:shadow-md"
					>
						<div class="flex flex-col">
							<span class="text-[10px] font-bold tracking-widest text-gray-400 uppercase"
								>Payment Gateway</span
							>
							<span class="text-xs font-bold text-gray-700">Counter Payments</span>
						</div>
						<input type="hidden" name="enabled" value={isOfflineEnabled ? 'false' : 'true'} />
						<button
							type="submit"
							class="flex items-center gap-2 transition-colors {isOfflineEnabled
								? 'text-green-600'
								: 'text-gray-300'}"
						>
							{#if isOfflineEnabled}
								<ToggleRight size={32} />
							{:else}
								<ToggleLeft size={32} />
							{/if}
						</button>
					</form>
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
				</select>

				<select
					bind:value={deptFilter}
					class="h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#8c2bee]/20"
				>
					<option value="all">All Departments</option>
					{#each departments as dept}
						<option value={dept.id}>{dept.name}</option>
					{/each}
				</select>

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
							<th class="px-6 py-4">Events</th>
							<th class="px-6 py-4">Amount</th>
							<th class="px-6 py-4">Status</th>
							<th class="px-6 py-4">Date</th>
							<th class="px-6 py-4 text-center">Actions</th>
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
										<span class="text-xs text-[#8c2bee]">{reg.dept || 'N/A'}</span>
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
								<td class="px-6 py-4 font-bold text-gray-900">₹{reg.amount || 0}</td>
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
			class="relative max-h-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
			role="button"
			tabindex="0"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<img
				src="/api/image/{viewImage}"
				alt="Payment Screenshot"
				class="h-auto w-full object-contain"
			/>
			<div class="flex items-center justify-between border-t border-gray-100 bg-gray-50 p-4">
				<span class="text-sm font-bold text-gray-500">Payment Verification Screenshot</span>
				<div class="flex gap-2">
					<a
						href="/api/image/{viewImage}"
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
