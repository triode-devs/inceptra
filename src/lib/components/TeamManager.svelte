<script>
	import {
		Users,
		Plus,
		ArrowRight,
		Check,
		X,
		Copy,
		Share2,
		Sparkles,
		ShieldCheck,
		ChevronRight,
		User as UserIcon,
		Info
	} from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';

	export let registration = null;
	export let onUpdate = () => {};

	let teams = [];
	let loading = true;
	let error = null;

	let showCreateModal = false;
	let showJoinModal = false;
	let selectedEvent = '';
	let teamName = '';
	let teamCode = '';
	let actionLoading = false;

	async function fetchTeams() {
		if (!registration) return;
		try {
			const res = await fetch(`/api/teams?registrationId=${registration.id}`);
			const data = await res.json();
			if (res.ok) {
				teams = data.teams || [];
			}
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	}

	$: {
		if (registration) fetchTeams();
	}

	async function handleCreateTeam() {
		if (!teamName || !selectedEvent) return;
		actionLoading = true;
		try {
			const res = await fetch('/api/teams/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					registrationId: registration.id,
					eventName: selectedEvent,
					teamName
				})
			});
			const data = await res.json();
			if (res.ok) {
				showCreateModal = false;
				teamName = '';
				fetchTeams();
				onUpdate();
			} else {
				alert(data.error);
			}
		} catch (err) {
			alert('Failed to create team');
		} finally {
			actionLoading = false;
		}
	}

	async function handleJoinTeam() {
		if (!teamCode || !selectedEvent) return;
		actionLoading = true;
		try {
			const res = await fetch('/api/teams/join', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					registrationId: registration.id,
					eventName: selectedEvent,
					teamCode
				})
			});
			const data = await res.json();
			if (res.ok) {
				showJoinModal = false;
				teamCode = '';
				fetchTeams();
				onUpdate();
			} else {
				alert(data.error);
			}
		} catch (err) {
			alert('Failed to join team');
		} finally {
			actionLoading = false;
		}
	}

	function getEventTeam(eventName) {
		return teams.find((t) => t.event_name === eventName);
	}

	const teamEvents = [
		'Paper Presentation',
		'Technical Quiz',
		'Blind Code',
		'Debugging',
		'Paperbestowment',
		'Technical Brain Blast',
		'Circuit Debugging',
		'Trade Show',
		'Paper Tract',
		'Flyer / Buzzcard',
		'Fine Tune',
		'Innovation Expo',
		'CAD Modeling',
		'Calibre',
		'Bridge',
		'Model Making',
		'CAD Quest',
		'Paper Events',
		'Gaming',
		'Connexion',
		'Creative Events',
		'Free Fire'
	];

	$: allEvents = [
		...(registration.technical_events || []),
		...(registration.non_technical_events || []),
		...(registration.cultural_events || [])
	];

	$: teamEligibleEvents = allEvents.filter((e) => teamEvents.includes(e));

	function copyCode(code) {
		navigator.clipboard.writeText(code);
	}

	async function shareTeam(team) {
		const text = `Join my team "${team.team_name}" for ${team.event_name} at INCEPTRA '26! \n\nTeam Code: ${team.team_code}\n\nRegister now: ${window.location.origin}/register`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: `Inceptra '26 - Join Team`,
					text: text
				});
			} catch (err) {
				console.error(err);
			}
		} else {
			copyCode(team.team_code);
			alert('Team code copied to clipboard!');
		}
	}
</script>

<div class="mt-6 flex flex-col gap-4 border-t border-gray-50 pt-6">
	<div class="flex items-center gap-2">
		<Users size={16} class="text-[#8c2bee]" />
		<h4 class="text-sm font-black tracking-tight uppercase">Team Management</h4>
	</div>

	{#if loading}
		<div class="h-10 w-32 animate-pulse rounded-lg bg-gray-50"></div>
	{:else}
		<div class="flex flex-col gap-3">
			{#each teamEligibleEvents as event}
				{@const team = getEventTeam(event)}
				<div
					class="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4"
				>
					<div class="flex flex-col gap-1">
						<span class="text-[10px] font-black tracking-widest text-[#8c2bee] uppercase"
							>{event}</span
						>
						{#if team}
							<div class="flex items-center gap-2">
								<span class="text-sm font-bold">{team.team_name}</span>
								<div
									class="flex items-center gap-1.5 rounded-lg bg-[#8c2bee]/10 px-2 py-1 text-[10px] font-black text-[#8c2bee]"
								>
									CODE: {team.team_code}
									<div class="ml-1 flex items-center gap-1 border-l border-[#8c2bee]/20 pl-1">
										<button
											onclick={() => copyCode(team.team_code)}
											class="hover:scale-110 active:scale-95"
											title="Copy Code"
										>
											<Copy size={12} />
										</button>
										<button
											onclick={() => shareTeam(team)}
											class="hover:scale-110 active:scale-95"
											title="Share Team"
										>
											<Share2 size={12} />
										</button>
									</div>
								</div>
							</div>
							<p class="text-[10px] font-medium text-gray-400">Members: {team.members}</p>
						{:else}
							<p class="text-[10px] font-medium text-gray-400">Not in a team</p>
						{/if}
					</div>

					{#if !team && registration.payment_status === 'approved'}
						<div class="flex gap-2">
							<button
								onclick={() => {
									selectedEvent = event;
									showJoinModal = true;
								}}
								class="rounded-xl bg-white px-3 py-1.5 text-[10px] font-black uppercase shadow-sm transition-all hover:bg-gray-100"
							>
								Join Team
							</button>
							<button
								onclick={() => {
									selectedEvent = event;
									showCreateModal = true;
								}}
								class="rounded-xl bg-[#8c2bee] px-3 py-1.5 text-[10px] font-black text-white uppercase shadow-md shadow-purple-100 transition-all hover:scale-105"
							>
								Create Team
							</button>
						</div>
					{:else if registration.payment_status !== 'approved'}
						<div
							class="flex items-center gap-1.5 rounded-lg bg-yellow-50 px-2 py-1 text-[9px] font-bold text-yellow-600 uppercase"
						>
							<Info size={12} /> Pending Payment Approval
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Create Team Modal -->
{#if showCreateModal}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
		in:fade
	>
		<div class="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl" in:slide>
			<h3 class="text-xl font-black">Create Team</h3>
			<p class="mt-1 text-sm text-[#756189]">Forming a team for <b>{selectedEvent}</b></p>

			<div class="mt-6 flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<label
						for="team-name"
						class="text-[10px] font-black tracking-widest text-gray-400 uppercase">Team Name</label
					>
					<input
						id="team-name"
						type="text"
						bind:value={teamName}
						placeholder="The Invincibles"
						class="rounded-xl border border-gray-100 bg-gray-50 p-4 font-bold outline-none focus:border-[#8c2bee] focus:bg-white"
					/>
				</div>

				<div class="flex gap-3">
					<button
						onclick={() => (showCreateModal = false)}
						class="flex-1 rounded-xl bg-gray-50 py-3 text-xs font-black text-gray-500 uppercase"
					>
						Cancel
					</button>
					<button
						onclick={handleCreateTeam}
						disabled={actionLoading || !teamName}
						class="flex-1 rounded-xl bg-[#8c2bee] py-3 text-xs font-black text-white uppercase shadow-lg shadow-purple-100 disabled:opacity-50"
					>
						{actionLoading ? 'Creating...' : 'Confirm'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Join Team Modal -->
{#if showJoinModal}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
		in:fade
	>
		<div class="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl" in:slide>
			<h3 class="text-xl font-black">Join Team</h3>
			<p class="mt-1 text-sm text-[#756189]">Entering a team for <b>{selectedEvent}</b></p>

			<div class="mt-6 flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<label
						for="join-team-code"
						class="text-[10px] font-black tracking-widest text-gray-400 uppercase">Team Code</label
					>
					<input
						id="join-team-code"
						type="text"
						bind:value={teamCode}
						placeholder="ABC123"
						class="rounded-xl border border-gray-100 bg-gray-50 p-4 font-bold uppercase outline-none focus:border-[#8c2bee] focus:bg-white"
					/>
				</div>

				<div class="flex gap-3">
					<button
						onclick={() => (showJoinModal = false)}
						class="flex-1 rounded-xl bg-gray-50 py-3 text-xs font-black text-gray-500 uppercase"
					>
						Cancel
					</button>
					<button
						onclick={handleJoinTeam}
						disabled={actionLoading || !teamCode}
						class="flex-1 rounded-xl bg-[#8c2bee] py-3 text-xs font-black text-white uppercase shadow-lg shadow-purple-100 disabled:opacity-50"
					>
						{actionLoading ? 'Joining...' : 'Confirm'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
