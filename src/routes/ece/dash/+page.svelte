<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { 
		Search, 
		Loader2, 
		Download, 
		FileSpreadsheet, 
		ArrowLeft, 
		LogOut,
		Users,
		Filter,
		CheckCircle2,
		XCircle,
		Clock
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';

	const API_BASE_URL = 'https://ece-api.eruthukattu24.workers.dev';
	let adminName = $state('admin_web');

	// --- STATE ---
	let students = $state([]);
	let isLoading = $state(true);
	let searchText = $state('');
	let allEvents = $state([]);

	onMount(async () => {
		if (typeof window !== 'undefined' && localStorage.getItem('ece_session') !== 'active') {
			goto('/ece');
			return;
		}
		await loadData();
	});

	async function loadData() {
		isLoading = true;
		try {
			const res = await fetch(`${API_BASE_URL}/students`);
			const data = await res.json();
			if (data.success) {
				students = data.students || [];
				
				// Extract all unique events to build columns
				const eventMap = new Map();
				students.forEach(s => {
					(s.events || []).forEach(e => {
						if (!eventMap.has(e.id)) {
							eventMap.set(e.id, { id: e.id, name: e.name, type: e.type });
						}
					});
				});
				allEvents = Array.from(eventMap.values()).sort((a, b) => {
					if (a.type !== b.type) return a.type === 'technical' ? -1 : 1;
					return a.name.localeCompare(b.name);
				});
			}
		} catch (error) {
			console.error('Failed to load data', error);
		} finally {
			isLoading = false;
		}
	}

	function handleLogout() {
		localStorage.removeItem('ece_session');
		goto('/ece');
	}

	let filteredStudents = $derived(
		students.filter(
			(s) =>
				s.name.toLowerCase().includes(searchText.toLowerCase()) ||
				s.roll_no.toLowerCase().includes(searchText.toLowerCase()) ||
				s.college?.toLowerCase().includes(searchText.toLowerCase())
		)
	);

	function exportToExcel() {
		// Generate CSV content
		const headers = ['Name', 'Roll No', 'College', 'Dept', 'Year', ...allEvents.map(e => e.name)];
		const rows = filteredStudents.map(s => {
			const eventStatuses = allEvents.map(e => {
				const event = (s.events || []).find(se => se.id === e.id);
				return event ? event.status : '-';
			});
			return [
				`"${s.name}"`,
				`"${s.roll_no}"`,
				`"${s.college}"`,
				`"${s.department}"`,
				`"${s.year}"`,
				...eventStatuses.map(st => `"${st}"`)
			];
		});

		const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute('download', `ECE_Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function getStatusColor(status) {
		switch (status?.toLowerCase()) {
			case 'present': return 'text-green-600 bg-green-100';
			case 'absent': return 'text-red-600 bg-red-100';
			case 'pending': return 'text-amber-600 bg-amber-100';
			default: return 'text-gray-400 bg-gray-50';
		}
	}

	function getStatusIcon(status) {
		switch (status?.toLowerCase()) {
			case 'present': return CheckCircle2;
			case 'absent': return XCircle;
			case 'pending': return Clock;
			default: return null;
		}
	}
</script>

<svelte:head>
	<title>Student Attendance Dashboard | ECE Admin</title>
</svelte:head>

<div class="font-poppins fixed inset-0 -z-10 h-screen w-screen overflow-hidden bg-slate-50">
	<div class="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-cyan-50"></div>
	<div class="animate-blob absolute top-0 -left-4 h-96 w-96 rounded-full bg-blue-300 opacity-60 mix-blend-multiply blur-3xl filter"></div>
</div>

<div class="relative flex min-h-screen w-full flex-col overflow-hidden bg-white/40 pb-20 backdrop-blur-md">
	<div class="mx-auto w-full max-w-7xl px-6 pt-10">
		<header class="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
			<div class="flex items-center gap-4">
				<button 
					onclick={() => goto('/ece/home')}
					class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-white shadow-sm text-gray-600 transition-all hover:bg-zinc-900 hover:text-white"
				>
					<ArrowLeft size={22} />
				</button>
				<div>
					<p class="text-[10px] font-black tracking-widest text-[#8c2bee] uppercase">Administration</p>
					<h1 class="text-3xl font-black text-zinc-900">Attendance Dash</h1>
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-3">
				<div class="relative flex-1 min-w-[280px]">
					<Search size={18} class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
					<input 
						type="text" 
						placeholder="Search name, roll no or college..." 
						bind:value={searchText}
						class="h-12 w-full rounded-2xl border border-white bg-white/70 pl-11 pr-4 text-sm font-medium outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20"
					/>
				</div>
				<button 
					onclick={exportToExcel}
					class="flex h-12 items-center gap-2 rounded-2xl bg-green-600 px-6 font-bold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700 active:scale-95"
				>
					<FileSpreadsheet size={18} />
					<span class="hidden sm:inline">Export Excel</span>
				</button>
				<button 
					onclick={handleLogout}
					class="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 shadow-sm transition-all hover:bg-red-500 hover:text-white"
				>
					<LogOut size={20} />
				</button>
			</div>
		</header>

		{#if isLoading}
			<div class="flex h-96 flex-col items-center justify-center gap-4">
				<div class="relative">
					<div class="h-16 w-16 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500"></div>
					<Users size={24} class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
				</div>
				<p class="text-sm font-bold text-gray-400 animate-pulse">Syncing student records...</p>
			</div>
		{:else}
			<div class="overflow-x-auto rounded-[2.5rem] border border-white bg-white/50 shadow-2xl backdrop-blur-xl">
				<table class="w-full text-left border-collapse">
					<thead>
						<tr class="border-b border-gray-100 bg-white/30 backdrop-blur-md">
							<th class="sticky left-0 z-10 bg-white/80 p-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Student Info</th>
							<th class="p-5 text-[10px] font-black uppercase tracking-widest text-gray-400">College</th>
							<th class="p-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Dept/Year</th>
							{#each allEvents as event}
								<th class="p-5 text-center min-w-[140px]">
									<div class="flex flex-col items-center gap-1">
										<span class={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${event.type === 'technical' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-[#ee2b8c]'}`}>
											{event.type}
										</span>
										<span class="text-[10px] font-bold text-zinc-900 leading-tight block truncate max-w-[120px]" title={event.name}>
											{event.name}
										</span>
									</div>
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each filteredStudents as student (student.roll_no)}
							<tr class="border-b border-gray-50 transition-colors hover:bg-white/40">
								<td class="sticky left-0 z-10 bg-white/80 p-4">
									<div class="flex items-center gap-3">
										<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-[10px] font-black text-white">
											{student.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
										</div>
										<div class="min-w-[150px]">
											<p class="text-xs font-black text-zinc-900 line-clamp-1">{student.name}</p>
											<p class="text-[10px] font-bold text-gray-400 tracking-tighter">{student.roll_no}</p>
										</div>
									</div>
								</td>
								<td class="p-4">
									<p class="text-[10px] font-bold text-zinc-600 line-clamp-2 max-w-[200px] leading-relaxed">
										{student.college || '---'}
									</p>
								</td>
								<td class="p-4">
									<div class="flex flex-col gap-0.5">
										<span class="text-[10px] font-bold text-zinc-800">{student.department}</span>
										<span class="text-[9px] font-medium text-blue-500 uppercase">{student.year} Year</span>
									</div>
								</td>
								{#each allEvents as event}
									{@const status = (student.events || []).find(se => se.id === event.id)?.status || '---'}
									{@const StatusIcon = getStatusIcon(status)}
									<td class="p-4 text-center">
										{#if status === '---'}
											<span class="text-xs text-gray-300">-</span>
										{:else}
											<div class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(status)}`}>
												{#if StatusIcon}
													<StatusIcon size={12} strokeWidth={3} />
												{/if}
												{status}
											</div>
										{/if}
									</td>
								{/each}
							</tr>
						{:else}
							<tr>
								<td colspan={4 + allEvents.length} class="p-20 text-center text-gray-400">
									<Search size={48} class="mx-auto mb-4 opacity-10" />
									<p class="text-sm font-bold tracking-widest uppercase">No students found</p>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			
			<div class="mt-6 flex items-center justify-between px-2">
				<p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
					Showing {filteredStudents.length} of {students.length} students
				</p>
				<p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">
					INCEPTRA '26 • ECE SYMPOSIUM
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
	}
	
	/* Sticky column shadow */
	td.sticky::after {
		content: '';
		position: absolute;
		top: 0;
		right: -10px;
		bottom: 0;
		width: 10px;
		background: linear-gradient(to right, rgba(0,0,0,0.02), transparent);
		pointer-events: none;
	}

	@keyframes blob {
		0% { transform: translate(0px, 0px) scale(1); }
		33% { transform: translate(30px, -50px) scale(1.1); }
		66% { transform: translate(-20px, 20px) scale(0.9); }
		100% { transform: translate(0px, 0px) scale(1); }
	}
	.animate-blob { animation: blob 20s infinite; }
</style>
