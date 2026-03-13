<script>
	import { onMount } from 'svelte';
	import { adminUser } from '$lib/adminAuth';
	import { goto } from '$app/navigation';
	import { Users, Building2, Trophy, Activity, Code, Layers, Sparkles } from 'lucide-svelte';
	import { symposiumData, culturalData } from '$lib/data/data';

	let { data } = $props();
	let allRegistrations = $derived(data.registrations || []);

	let isSuperAdmin = $state(false);
	let deptFilter = $state('');
	let deptFullName = $state('Department');

	const departments = [
		{ id: 'civil', name: 'Civil Engineering' },
		{ id: 'cse', name: 'Computer Science' },
		{ id: 'eee', name: 'Electrical & Electronics' },
		{ id: 'ece', name: 'Electronics & Comm' },
		{ id: 'mech', name: 'Mech & Mechatronics' },
		{ id: 'cultural', name: 'Cultural' },
		{ id: 'hackathon', name: 'Hackathon' }
	];

	onMount(() => {
		const unsubscribe = adminUser.subscribe((u) => {
			if (!u) {
				goto('/admin');
				return;
			}
			if (u.role === 'superadmin') {
				isSuperAdmin = true;
			} else {
				isSuperAdmin = false;
				const mapped = departments.find((d) => d.name === u.department);
				if (mapped) {
					deptFilter = mapped.id;
					deptFullName = mapped.name;
				} else if (u.normalizedId) {
					const directMatch = departments.find((d) => d.id === u.normalizedId);
					if (directMatch) {
						deptFilter = directMatch.id;
						deptFullName = directMatch.name;
					}
				}
			}
		});
		return unsubscribe;
	});

	// 1. Super Admin Stats: Group by Department
	let deptCounts = $derived.by(() => {
		if (!isSuperAdmin) return [];
		let counts = {};

		// Initialize with 0s
		departments.forEach((d) => {
			counts[d.name] = 0;
		});
		counts['Symposium (Total)'] = 0;

		allRegistrations.forEach((r) => {
			let type = (r.registration_type || '').toLowerCase();
			if (type === 'cultural') {
				counts['Cultural']++;
			} else if (type === 'hackathon') {
				counts['Hackathon']++;
			} else {
				let rDept = (r.target_dept || '').toLowerCase();
				let matched = departments.find((d) => d.name.toLowerCase() === rDept);
				if (matched) {
					counts[matched.name]++;
					if (matched.id !== 'cultural' && matched.id !== 'hackathon') {
						counts['Symposium (Total)']++;
					}
				}
			}
		});

		// Move Symposium (Total) to the top for easy reading
		let entries = Object.entries(counts).map(([name, count]) => ({ name, count }));
		let symposium = entries.find((e) => e.name === 'Symposium (Total)');
		let others = entries.filter((e) => e.name !== 'Symposium (Total)').sort((a, b) => b.count - a.count);

		return [symposium, ...others];
	});

	// 2. Department Admin Stats: Group by Event
	let eventCounts = $derived.by(() => {
		if (isSuperAdmin || !deptFilter) return [];

		let counts = {};

		// Initialize counts with 0 based on data.js events
		if (deptFilter === 'cultural') {
			culturalData.forEach((eventGroup) => {
				counts[eventGroup.name] = 0;
			});
		} else if (deptFilter !== 'hackathon') {
			const deptData = symposiumData.find((d) => d.id === deptFilter);
			if (deptData) {
				(deptData.events?.technical || []).forEach((e) => {
					counts[e] = 0;
				});
				(deptData.events?.nonTechnical || []).forEach((e) => {
					counts[e] = 0;
				});
			}
		}

		// First filter by dept
		const deptRegs = allRegistrations.filter((r) => {
			const rType = (r.registration_type || '').toLowerCase();
			if (deptFilter === 'cultural') return rType === 'cultural';
			if (deptFilter === 'hackathon') return rType === 'hackathon';

			const tgt = (r.target_dept || '').toLowerCase();
			return tgt === deptFullName.toLowerCase();
		});

		deptRegs.forEach((r) => {
			if (deptFilter === 'cultural') {
				(r.cultural_events || []).forEach((e) => {
					counts[e] = (counts[e] || 0) + 1;
				});
			} else if (deptFilter === 'hackathon') {
				const topic = r.hackathon_topic || 'Unknown Topic';
				counts[topic] = (counts[topic] || 0) + 1;
			} else {
				(r.technical_events || []).forEach((e) => {
					counts[e] = (counts[e] || 0) + 1;
				});
				(r.non_technical_events || []).forEach((e) => {
					counts[e] = (counts[e] || 0) + 1;
				});
			}
		});

		return Object.entries(counts)
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => b.count - a.count);
	});

	let totalFiltered = $derived(
		isSuperAdmin
			? allRegistrations.length
			: allRegistrations.filter((r) => {
					const rType = (r.registration_type || '').toLowerCase();
					if (deptFilter === 'cultural') return rType === 'cultural';
					if (deptFilter === 'hackathon') return rType === 'hackathon';

					const tgt = (r.target_dept || '').toLowerCase();
					return tgt === deptFullName.toLowerCase();
				}).length
	);
</script>

<svelte:head>
	<title>Statistics Dashboard | Inceptra '26</title>
</svelte:head>

<div class="min-h-screen bg-[#f7f6f8] pt-20 pb-12 font-['Lexend'] text-[#141118]">
	<div class="mx-auto max-w-[1400px] px-4 sm:px-6">
		<div class="mb-10">
			<div class="flex items-center gap-2 text-[#8c2bee]">
				<Activity size={18} />
				<span class="text-xs font-black tracking-widest uppercase">Analytics</span>
			</div>
			<h1 class="mt-2 text-2xl font-black tracking-tight text-[#141118] sm:text-4xl">
				Statistics <span class="text-[#8c2bee]">Dashboard</span>
			</h1>
			<p class="mt-2 text-sm text-[#756189] sm:text-base">
				{#if isSuperAdmin}
					Total registration breakdown across all departments.
				{:else}
					Event-wise student registration count for {deptFullName}.
				{/if}
			</p>
		</div>

		<!-- Metric Card -->
		<div
			class="mb-8 overflow-hidden rounded-3xl border border-white bg-white p-6 shadow-sm shadow-purple-100/50"
		>
			<div class="flex items-center gap-4">
				<div
					class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 text-blue-600"
				>
					<Users size={28} />
				</div>
				<div>
					<h3 class="text-4xl font-black text-gray-900">{totalFiltered}</h3>
					<p class="mt-1 text-sm font-bold tracking-wide text-gray-500 uppercase">
						{#if isSuperAdmin}
							Total Overall Registrations
						{:else}
							Total {deptFullName} Registrations
						{/if}
					</p>
				</div>
			</div>
		</div>

		<!-- Main Chart / Table Area -->
		<div
			class="rounded-3xl border border-white bg-white p-4 shadow-sm shadow-purple-100/50 sm:p-6 lg:p-8"
		>
			<div class="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
				<h2 class="text-xl font-black text-gray-800">
					{#if isSuperAdmin}
						<Building2 class="mr-2 inline-block h-5 w-5 text-[#8c2bee]" />
						Department-wise Registrations
					{:else}
						<Trophy class="mr-2 inline-block h-5 w-5 text-[#8c2bee]" />
						Event-wise Registrations
					{/if}
				</h2>
			</div>

			{#if isSuperAdmin}
				<!-- Super Admin View: Dept Table -->
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm">
						<thead>
							<tr class="border-b border-gray-100 text-gray-400">
								<th class="py-3 font-bold tracking-wider uppercase">Department / Category</th>
								<th class="py-3 text-right font-bold tracking-wider uppercase"
									>Total Registrations</th
								>
								<th class="py-3 pl-4 text-left font-bold tracking-wider uppercase">Gauge</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-50">
							{#each deptCounts as d}
								<tr class="transition-colors hover:bg-gray-50/50">
									<td class="py-4 font-bold text-gray-800">{d.name}</td>
									<td class="py-4 text-right text-lg font-black text-[#8c2bee]">{d.count}</td>
									<td class="w-1/2 py-4 pl-4">
										<div class="h-2 w-full overflow-hidden rounded-full bg-gray-100">
											<div
												class="h-full rounded-full bg-gradient-to-r from-[#8c2bee] to-[#ee2b8c]"
												style="width: {totalFiltered > 0 ? (d.count / totalFiltered) * 100 : 0}%;"
											></div>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<!-- Department Admin View: Event Cards / List -->
				{#if eventCounts.length === 0}
					<div class="py-12 text-center font-medium text-gray-400">
						No event data found for this department.
					</div>
				{:else}
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each eventCounts as e}
							<div
								class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-[#8c2bee]/30 hover:shadow-lg hover:shadow-purple-100/50"
							>
								<div class="mb-3 flex items-center justify-between">
									<div
										class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#8c2bee] transition-colors group-hover:bg-[#8c2bee] group-hover:text-white"
									>
										<Layers size={20} />
									</div>
								</div>
								<h3 class="mb-1 min-h-[45px] text-[15px] leading-tight font-bold text-gray-900">
									{e.name}
								</h3>
								<div class="mt-4 flex items-end justify-between">
									<div>
										<span class="text-xs font-bold text-gray-400 uppercase">Total</span>
										<div class="flex items-baseline gap-1">
											<span class="text-3xl font-black text-[#8c2bee]">{e.count}</span>
											<span class="text-sm font-bold text-gray-500">Students</span>
										</div>
									</div>
								</div>
								<div
									class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#8c2bee] to-[#ee2b8c] transition-all"
									style="width: {totalFiltered > 0 ? (e.count / totalFiltered) * 100 : 0}%;"
								></div>
							</div>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
