<script>
	import { onMount } from 'svelte';
	import { fade, fly, slide, scale } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';
	import { 
		Search, 
		Loader2, 
		UserX, 
		X, 
		ArrowRight, 
		ShieldCheck, 
		LogOut,
		UserPlus,
		Users,
		Award,
		Zap,
		ChevronRight
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';

	const API_BASE_URL = 'https://ece-api.eruthukattu24.workers.dev';
	let adminName = $state('Event Admin');

	// --- STATE ---
	let events = $state([]);
	let isLoading = $state(true);
	let searchText = $state('');

	// Enrollment Modal State
	let isAddStudentOpen = $state(false);
	let newStudent = $state({ 
		name: '', 
		roll_no: '', 
		department: 'ECE', 
		year: 'I', 
		phone: '', 
		email: '',
		event_ids: [] 
	});

	onMount(async () => {
		if (typeof window !== 'undefined' && sessionStorage.getItem('ece_session') !== 'active') {
			goto('/ece');
			return;
		}
		await fetchEvents();
	});

	async function fetchEvents() {
		isLoading = true;
		try {
			const res = await fetch(`${API_BASE_URL}/events`);
			const data = await res.json();
			if (data.success) {
				events = data.events;
			}
		} catch (error) {
			console.error('Failed to fetch events', error);
		} finally {
			isLoading = false;
		}
	}

	function handleLogout() {
		sessionStorage.removeItem('ece_session');
		goto('/ece');
	}

	async function addStudent() {
		if (selectedTech.length > 2 || selectedNonTech.length > 1) {
			alert('Quota Error: Maximum 2 Technical and 1 Non-Technical events allowed.');
			return;
		}
		
		try {
			const res = await fetch(`${API_BASE_URL}/students`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...newStudent,
					enrolled_by: adminName
				})
			});
			const data = await res.json();
			if (data.success) {
				alert('Student enrolled successfully!');
				isAddStudentOpen = false;
				newStudent = { name: '', roll_no: '', department: 'ECE', year: 'I', phone: '', email: '', event_ids: [] };
			} else {
				alert('Failed: ' + (data.error || 'Unknown error'));
			}
		} catch (e) {
			console.error(e);
			alert('Error enrolling student');
		}
	}

	function toggleEventSelection(event) {
		const isSelected = newStudent.event_ids.includes(event.id);
		const type = (event.type || '').toLowerCase();
		
		if (isSelected) {
			newStudent.event_ids = newStudent.event_ids.filter(eid => eid !== event.id);
		} else {
			if (type === 'technical' && selectedTech.length >= 2) return;
			if (type === 'non_technical' && selectedNonTech.length >= 1) return;
			newStudent.event_ids = [...newStudent.event_ids, event.id];
		}
	}

	// Helpers for event filtering in modal
	let techEvents = $derived(events.filter(e => (e.type || '').toLowerCase() === 'technical'));
	let nonTechEvents = $derived(events.filter(e => (e.type || '').toLowerCase() === 'non_technical'));
	let selectedTech = $derived(newStudent.event_ids.filter(id => techEvents.some(te => te.id === id)));
	let selectedNonTech = $derived(newStudent.event_ids.filter(id => nonTechEvents.some(ne => ne.id === id)));
	let isQuotaMet = $derived(selectedTech.length <= 2 && selectedNonTech.length <= 1);

	// Main list filtering
	let activeTab = $state('events'); // 'events' or 'attendance'
	let filteredEvents = $derived(
		events.filter(e => e.name.toLowerCase().includes(searchText.toLowerCase()))
	);

	function getInitials(name) {
		return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
	}

	function navigateToEvent(id) {
		goto(`/ece/${id}`);
	}
</script>

<svelte:head>
	<title>ECE Dashboard | INCEPTRA '26</title>
</svelte:head>

<div class="font-poppins fixed inset-0 -z-10 h-screen w-screen overflow-hidden bg-slate-50">
	<div class="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-cyan-50"></div>
	<div class="animate-blob absolute top-0 -left-4 h-96 w-96 rounded-full bg-blue-300 opacity-60 mix-blend-multiply blur-3xl filter"></div>
	<div class="animate-blob animation-delay-2000 absolute top-0 -right-4 h-96 w-96 rounded-full bg-cyan-200 opacity-60 mix-blend-multiply blur-3xl filter"></div>
	<div class="animate-blob animation-delay-4000 absolute -bottom-32 left-20 h-96 w-96 rounded-full bg-indigo-200 opacity-60 mix-blend-multiply blur-3xl filter"></div>
</div>

<div class="relative flex min-h-screen w-full flex-col overflow-hidden bg-white/40 pb-24 backdrop-blur-md">
	<div class="mx-auto w-full max-w-4xl">
		<header class="flex flex-col gap-6 px-6 pt-10 pb-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-[10px] font-black tracking-widest text-[#8c2bee] uppercase">ECE Coordinator</p>
					<h1 class="text-3xl font-black text-zinc-900">Dashboard</h1>
				</div>
				<div class="flex items-center gap-3">
					<button onclick={handleLogout} class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 border border-white shadow-sm text-red-500 transition-all hover:bg-red-500 hover:text-white">
						<LogOut size={22} />
					</button>
					<div class="h-12 w-12 overflow-hidden rounded-2xl border-2 border-white shadow-sm ring-2 ring-blue-100 flex items-center justify-center bg-zinc-900 text-white font-bold">
						{getInitials(adminName)}
					</div>
				</div>
			</div>

			<!-- Stats / Quick Actions -->
			<div class="grid grid-cols-2 gap-4">
				<button 
					onclick={() => activeTab = 'events'}
					class={`flex flex-col items-center justify-center gap-2 rounded-[2rem] p-6 transition-all active:scale-95 ${activeTab === 'events' ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-900/20' : 'bg-white/70 border border-white text-zinc-900 shadow-xl shadow-slate-200/50'}`}
				>
					<div class={`rounded-full p-3 ${activeTab === 'events' ? 'bg-white/10' : 'bg-zinc-900/5'}`}>
						<Award size={24} />
					</div>
					<span class="text-sm font-bold">Events</span>
				</button>
				<button 
					onclick={() => activeTab = 'attendance'}
					class={`flex flex-col items-center justify-center gap-2 rounded-[2rem] p-6 transition-all active:scale-95 ${activeTab === 'attendance' ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-900/20' : 'bg-white/70 border border-white text-zinc-900 shadow-xl shadow-slate-200/50'}`}
				>
					<div class={`rounded-full p-3 ${activeTab === 'attendance' ? 'bg-white/10' : 'bg-zinc-900/5'}`}>
						<Users size={24} />
					</div>
					<span class="text-sm font-bold">Attendance</span>
				</button>
			</div>

			<div class="flex items-center gap-2 mt-4">
				<button 
					onclick={() => isAddStudentOpen = true}
					class="flex-1 h-14 rounded-2xl bg-white/60 border border-white shadow-sm flex items-center justify-center gap-2 text-zinc-900 font-bold transition-all hover:bg-zinc-900 hover:text-white"
				>
					<UserPlus size={18} /> Enroll Student
				</button>
				<button 
					onclick={() => navigateToEvent('all')}
					class="h-14 px-6 rounded-2xl bg-white/60 border border-white shadow-sm flex items-center justify-center gap-2 text-zinc-900 font-bold transition-all hover:bg-zinc-900 hover:text-white"
				>
					<Search size={18} /> View All
				</button>
			</div>

			<div class="group relative flex items-center rounded-2xl border border-white/60 bg-white/40 px-4 shadow-sm backdrop-blur-md transition-all focus-within:ring-2 focus-within:ring-blue-500/20 hover:bg-white/60">
				<Search size={20} class="text-gray-500" />
				<input
					type="text"
					placeholder="Search events..."
					bind:value={searchText}
					class="h-14 w-full bg-transparent px-3 text-sm font-medium text-zinc-800 outline-none placeholder:text-gray-400"
				/>
			</div>
		</header>

		<div class="px-6 pb-20">
			<h2 class="mb-4 text-xs font-black tracking-widest text-gray-400 uppercase ml-1">Event Attendance Lists</h2>
			
			{#if isLoading}
				<div class="flex h-60 w-full flex-col items-center justify-center gap-3">
					<Loader2 size={36} class="animate-spin text-blue-500" />
					<p class="text-xs font-bold text-gray-400">Loading Events...</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-4">
					{#each filteredEvents as event (event.id)}
						<button 
							onclick={() => navigateToEvent(event.id)}
							class="group relative flex items-center gap-4 overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-5 shadow-sm backdrop-blur-md transition-all hover:scale-[1.01] hover:bg-white/70 hover:shadow-lg active:scale-95"
						>
							<div class={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-inner
								${event.type === 'technical' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-[#ee2b8c]'}`}>
								{#if event.type === 'technical'}
									<Zap size={28} />
								{:else}
									<Award size={28} />
								{/if}
							</div>
							
							<div class="flex flex-1 flex-col items-start justify-center text-left">
								<p class="text-[10px] font-black tracking-widest text-gray-400 uppercase italic mb-1">{event.type}</p>
								<h3 class="text-lg font-black text-zinc-900 leading-tight">{event.name}</h3>
								<div class="mt-2 flex items-center gap-2 text-xs font-bold text-gray-500">
									<Users size={14} />
									<span>Click to Mark Attendance</span>
								</div>
							</div>

							<div class="mr-2 rounded-full bg-white p-2 text-zinc-300 shadow-sm transition-colors group-hover:text-zinc-900">
								<ChevronRight size={20} />
							</div>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

{#if isAddStudentOpen}
	<button class="fixed inset-0 z-100 bg-zinc-900/40 backdrop-blur-sm transition-opacity" onclick={() => (isAddStudentOpen = false)} aria-label="Close modal"></button>
	<div 
		transition:scale={{ duration: 300, start: 0.95, easing: quintOut }}
		class="no-scrollbar fixed inset-4 z-110 m-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-4xl bg-white p-6 shadow-2xl md:p-8"
	>
		<div class="mb-6 flex items-center justify-between">
			<div>
				<h2 class="text-2xl font-black text-zinc-900">Enroll New Student</h2>
				<p class="text-xs font-bold tracking-widest text-[#8c2bee] uppercase mt-1">Direct Registration</p>
			</div>
			<button onclick={() => (isAddStudentOpen = false)} class="rounded-full bg-gray-100 p-2 text-zinc-500 hover:bg-gray-200">
				<X size={20} />
			</button>
		</div>

		<div class="flex flex-col gap-6">
			<!-- Part 1: Basic Info -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="flex flex-col gap-1.5">
					<label class="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Full Name</label>
					<input type="text" bind:value={newStudent.name} placeholder="e.g. Alice Smith"
						class="h-12 rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-zinc-900 outline-none focus:border-blue-500 focus:bg-white" />
				</div>
				<div class="flex flex-col gap-1.5">
					<label class="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Registration No</label>
					<input type="text" bind:value={newStudent.roll_no} placeholder="e.g. 20ECE005"
						class="h-12 rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-zinc-900 outline-none focus:border-blue-500 focus:bg-white" />
				</div>
				<div class="flex flex-col gap-1.5">
					<label class="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Email Address</label>
					<input type="email" bind:value={newStudent.email} placeholder="alice@gmail.com"
						class="h-12 rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-zinc-900 outline-none focus:border-blue-500 focus:bg-white" />
				</div>
				<div class="flex flex-col gap-1.5">
					<label class="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Phone Number</label>
					<input type="tel" bind:value={newStudent.phone} placeholder="9998887776"
						class="h-12 rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-zinc-900 outline-none focus:border-blue-500 focus:bg-white" />
				</div>
				<div class="flex flex-col gap-1.5">
					<label class="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Year of Study</label>
					<select bind:value={newStudent.year} class="h-12 rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-zinc-900 outline-none focus:border-blue-500 focus:bg-white">
						<option value="I">I Year</option>
						<option value="II">II Year</option>
						<option value="III">III Year</option>
						<option value="IV">IV Year</option>
					</select>
				</div>
			</div>

			<!-- Part 2: Event Selection -->
			<div class="space-y-4 pt-4 border-t border-gray-100">
				<div>
					<div class="flex items-center justify-between mb-2.5">
						<h3 class="text-sm font-black text-gray-700">Technical Events <span class="text-blue-500">(Max 2)</span></h3>
						<span class={`text-[10px] font-bold px-2.5 py-1 rounded-full ${selectedTech.length <= 2 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
							{selectedTech.length} / 2 Selected
						</span>
					</div>
					<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
						{#each techEvents as event}
							<button 
								onclick={() => toggleEventSelection(event)}
								class={`flex items-center gap-2 p-3.5 rounded-xl border text-left transition-all active:scale-[0.98] ${newStudent.event_ids.includes(event.id) ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}`}
							>
								<div class={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${newStudent.event_ids.includes(event.id) ? 'border-white bg-white' : 'border-gray-300'}`}>
									{#if newStudent.event_ids.includes(event.id)}
										<div class="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
									{/if}
								</div>
								<span class="text-xs font-bold leading-tight line-clamp-2">{event.name}</span>
							</button>
						{/each}
					</div>
				</div>

				<div>
					<div class="flex items-center justify-between mb-2.5">
						<h3 class="text-sm font-black text-gray-700">Non-Technical Event <span class="text-pink-500">(Max 1)</span></h3>
						<span class={`text-[10px] font-bold px-2.5 py-1 rounded-full ${selectedNonTech.length <= 1 ? 'bg-pink-100 text-pink-700' : 'bg-red-100 text-red-700'}`}>
							{selectedNonTech.length} / 1 Selected
						</span>
					</div>
					<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
						{#each nonTechEvents as event}
							<button 
								onclick={() => toggleEventSelection(event)}
								class={`flex items-center gap-2 p-3.5 rounded-xl border text-left transition-all active:scale-[0.98] ${newStudent.event_ids.includes(event.id) ? 'bg-[#ee2b8c] border-[#ee2b8c] text-white shadow-md shadow-pink-200' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}`}
							>
								<div class={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${newStudent.event_ids.includes(event.id) ? 'border-white bg-white' : 'border-gray-300'}`}>
									{#if newStudent.event_ids.includes(event.id)}
										<div class="w-2.5 h-2.5 rounded-full bg-[#ee2b8c]"></div>
									{/if}
								</div>
								<span class="text-xs font-bold leading-tight line-clamp-2">{event.name}</span>
							</button>
						{/each}
					</div>
				</div>
			</div>

			<button
				onclick={addStudent}
				disabled={!isQuotaMet || !newStudent.name || !newStudent.roll_no}
				class="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 font-bold text-white shadow-xl shadow-zinc-900/20 transition-all active:scale-95 disabled:opacity-50"
			>
				Enroll Student <UserPlus size={18} />
			</button>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
	}
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	@keyframes blob {
		0% { transform: translate(0px, 0px) scale(1); }
		33% { transform: translate(30px, -50px) scale(1.1); }
		66% { transform: translate(-20px, 20px) scale(0.9); }
		100% { transform: translate(0px, 0px) scale(1); }
	}
	.animate-blob { animation: blob 20s infinite; }
	.animation-delay-2000 { animation-delay: 2s; }
	.animation-delay-4000 { animation-delay: 4s; }
</style>