<script>
	import { onMount } from 'svelte';
	import { Users, Search, Filter, Calendar, Sparkles, Copy } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let teams = [];
	let loading = true;
	let searchQuery = '';
	let eventFilter = 'all';

	async function fetchAllTeams() {
		try {
			const res = await fetch('/api/admin/teams');
			const data = await res.json();
			if (res.ok) {
				teams = data.teams || [];
			}
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchAllTeams();
	});

	$: events = [...new Set(teams.map((t) => t.event_name))];

	$: filteredTeams = teams.filter((t) => {
		const matchesSearch =
			t.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			t.members.toLowerCase().includes(searchQuery.toLowerCase()) ||
			t.team_code.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesEvent = eventFilter === 'all' || t.event_name === eventFilter;
		return matchesSearch && matchesEvent;
	});

	function formatDate(dateStr) {
		return new Date(dateStr.replace(' ', 'T')).toLocaleDateString('en-IN', {
			day: '2-digit',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="mx-auto max-w-[1400px] px-6">
	<div class="mb-10">
		<h1 class="text-4xl font-black tracking-tight text-[#141118]">
			Team <span class="text-[#8c2bee]">Management</span>
		</h1>
		<p class="mt-2 text-[#756189]">Review and manage cross-registration team structures.</p>
	</div>

	<div class="mb-8 flex flex-wrap items-center gap-4">
		<div class="relative min-w-[300px] flex-1">
			<Search class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={18} />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search team name, code or member..."
				class="h-12 w-full rounded-xl border border-gray-100 bg-white pr-4 pl-12 font-medium outline-none focus:border-[#8c2bee]"
			/>
		</div>

		<select
			bind:value={eventFilter}
			class="h-12 rounded-xl border border-gray-100 bg-white px-4 text-sm font-bold outline-none focus:border-[#8c2bee]"
		>
			<option value="all">All Events</option>
			{#each events as event}
				<option value={event}>{event}</option>
			{/each}
		</select>
	</div>

	{#if loading}
		<div class="flex flex-col gap-4">
			{#each [1, 2, 3] as i}
				<div class="h-32 w-full animate-pulse rounded-3xl bg-white"></div>
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredTeams as team}
				<div
					class="rounded-3xl border border-white bg-white p-6 shadow-sm shadow-purple-100/20 transition-all hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="mb-4 flex items-center justify-between">
						<span class="text-[10px] font-black tracking-widest text-[#8c2bee] uppercase"
							>{team.event_name}</span
						>
						<div
							class="flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1 text-[10px] font-black text-gray-500"
						>
							{team.team_code}
						</div>
					</div>
					<h3 class="text-xl font-black">{team.team_name}</h3>
					<div class="mt-4 flex flex-col gap-2">
						<p class="text-xs font-bold tracking-tight text-gray-400 uppercase">
							Members ({team.member_count})
						</p>
						<p class="text-sm leading-relaxed font-medium text-[#756189]">{team.members}</p>
					</div>
					<div
						class="mt-6 flex items-center gap-2 border-t border-gray-50 pt-4 text-[10px] font-bold text-gray-300 uppercase"
					>
						<Calendar size={12} /> Created {formatDate(team.created_at)}
					</div>
				</div>
			{:else}
				<div class="col-span-full py-20 text-center font-bold text-gray-400">No teams found.</div>
			{/each}
		</div>
	{/if}
</div>
