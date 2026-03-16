<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { fade, fly, slide, scale } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';
	import { 
		Search, 
		Loader2, 
		UserX, 
		Pencil, 
		ChevronUp, 
		Trash2, 
		X, 
		ArrowRight, 
		XCircle, 
		CloudUpload, 
		ArrowLeft, 
		ShieldCheck, 
		Cloud, 
		CheckCircle,
		LogOut,
		UserPlus,
		LayoutGrid
	} from 'lucide-svelte';
	import { goto } from '$app/navigation';

	const API_BASE_URL = 'https://ece-api.eruthukattu24.workers.dev';
	let adminName = $state('admin_web');

	// --- STATE ---
	let eventId = $derived(page.params.id);
	let eventInfo = $state(null);
	let students = $state([]);
	let isLoading = $state(true);
	let stagedChanges = $state({});
	let isQueueOpen = $state(false);
	let isSubmitOpen = $state(false);
	let searchText = $state('');
	let eventsList = $state([]);
	let isAddStudentOpen = $state(false);
	let newStudent = $state({ 
		name: '', 
		roll_no: '', 
		department: 'ECE', 
		college: '',
		year: 'I', 
		phone: '', 
		email: '',
		event_ids: [] 
	});

	async function fetchEvents() {
		try {
			const res = await fetch(`${API_BASE_URL}/events`);
			const data = await res.json();
			if (data.success) eventsList = data.events;
		} catch (error) {
			console.error('Failed to fetch events', error);
		}
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
				newStudent = { name: '', roll_no: '', department: 'ECE', college: '', year: 'I', phone: '', email: '', event_ids: [] };
				await loadData();
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

	async function deleteStudent(roll_no) {
		if (!confirm(`Are you sure you want to delete student ${roll_no}? This action is permanent.`)) return;
		
		try {
			const res = await fetch(`${API_BASE_URL}/students/${roll_no}`, {
				method: 'DELETE'
			});
			const data = await res.json();
			if (data.success) {
				alert('Student record deleted successfully');
				await loadData();
			} else {
				alert('Delete failed: ' + (data.error || 'Unknown error'));
			}
		} catch (e) {
			console.error(e);
			alert('Error deleting student record');
		}
	}

	async function clearAttendance() {
		if (!eventInfo || eventId === 'all') return;
		if (!confirm(`Are you sure you want to clear ALL attendance records for ${eventInfo.name}? This action cannot be undone.`)) return;
		
		isLoading = true;
		try {
			const res = await fetch(`${API_BASE_URL}/attendance`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ event_id: eventId })
			});
			const data = await res.json();
			if (data.success) {
				alert('Attendance cleared successfully');
				await loadData();
			} else {
				alert('Failed to clear attendance: ' + (data.error || 'Unknown error'));
			}
		} catch (e) {
			console.error(e);
			alert('Error clearing attendance');
		} finally {
			isLoading = false;
		}
	}

	let techEvents = $derived(eventsList.filter(e => (e.type || '').toLowerCase() === 'technical'));
	let nonTechEvents = $derived(eventsList.filter(e => (e.type || '').toLowerCase() === 'non_technical'));
	let selectedTech = $derived(newStudent.event_ids.filter(id => techEvents.some(te => te.id === id)));
	let selectedNonTech = $derived(newStudent.event_ids.filter(id => nonTechEvents.some(ne => ne.id === id)));
	let isQuotaMet = $derived(selectedTech.length <= 2 && selectedNonTech.length <= 1);

	function getEventName(id) {
		const event = eventsList.find(e => e.id === id);
		return event ? event.name : id;
	}

	function getEventType(id) {
		const event = eventsList.find(e => e.id === id);
		return event ? event.type : 'unknown';
	}

	onMount(async () => {
		if (typeof window !== 'undefined' && sessionStorage.getItem('ece_session') !== 'active') {
			goto('/ece');
			return;
		}
		
		updateTransitions();
		window.addEventListener('resize', updateTransitions);
		await Promise.all([loadData(), fetchEvents()]);
		return () => window.removeEventListener('resize', updateTransitions);
	});

	// React to param changes
	$effect(() => {
		if (eventId) {
			loadData();
		}
	});

	async function loadData() {
		isLoading = true;
		stagedChanges = {};
		try {
			if (eventId !== 'all') {
				// Fetch specific event info first if needed, 
				// but the attendance endpoint returns student list
				const res = await fetch(`${API_BASE_URL}/events/${eventId}/attendance`);
				const data = await res.json();
				if (data.success) {
					students = data.students || [];
					eventInfo = data.event;
				}
			} else {
				const res = await fetch(`${API_BASE_URL}/students`);
				const data = await res.json();
				if (data.success) {
					students = data.students || [];
					eventInfo = { name: 'All Registered Students', id: 'all' };
				}
			}
		} catch (error) {
			console.error('Failed to load data', error);
		} finally {
			isLoading = false;
		}
	}

	function handleLogout() {
		sessionStorage.removeItem('ece_session');
		goto('/ece');
	}

	let filteredStudents = $derived(
		students.filter(
			(s) =>
				s.name.toLowerCase().includes(searchText.toLowerCase()) ||
				s.roll_no.toLowerCase().includes(searchText.toLowerCase())
		)
	);

	let queuedItems = $derived(Object.values(stagedChanges));
	let queueCount = $derived(queuedItems.length);
	let presentCount = $derived(queuedItems.filter(i => i.newStatus === 'present').length);
	let absentCount = $derived(queuedItems.filter(i => i.newStatus === 'absent').length);

	function toggleAttendance(student) {
		if (eventId === 'all') {
			alert('Attendance marking is only available when a specific event is selected.');
			return;
		}
		const currentStaged = stagedChanges[student.roll_no];
		let nextStatus = 'present';

		if (currentStaged) {
			if (currentStaged.newStatus === 'present') {
				nextStatus = 'absent';
			} else {
				delete stagedChanges[student.roll_no];
				stagedChanges = { ...stagedChanges };
				if (Object.keys(stagedChanges).length === 0) isQueueOpen = false;
				return;
			}
		} else {
			nextStatus = student.status === 'present' ? 'absent' : 'present';
		}

		stagedChanges[student.roll_no] = { ...student, newStatus: nextStatus };
		stagedChanges = { ...stagedChanges };
	}

	function removeFromQueue(roll_no) {
		delete stagedChanges[roll_no];
		stagedChanges = { ...stagedChanges }; 
		if (queueCount === 0) isQueueOpen = false;
	}

	function clearQueue() {
		stagedChanges = {};
		isQueueOpen = false;
	}

	function openSubmit() {
		isQueueOpen = false;
		setTimeout(() => (isSubmitOpen = true), 200);
	}

	async function submitBulkAttendance() {
		if (!eventInfo || queueCount === 0) return;

		const payload = {
			event_id: eventInfo.id,
			marked_by: adminName,
			records: queuedItems.map((item) => ({
				student_roll: item.roll_no,
				status: item.newStatus
			}))
		};

		try {
			const res = await fetch(`${API_BASE_URL}/attendance/bulk`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const result = await res.json();

			if (result.success) {
				alert(`Successfully updated attendance for ${queueCount} students.`);
				isSubmitOpen = false;
				await loadData();
			} else {
				alert(`Failed to update attendance: ${result.error || 'Unknown error'}`);
			}
		} catch (e) {
			console.error('Submission Error', e);
			alert('Something went wrong while updating attendance.');
		}
	}

	let transitionX = $state(0);
	let transitionY = $state(200);

	function updateTransitions() {
		if (typeof window !== 'undefined') {
			if (window.innerWidth >= 768) {
				transitionX = 400;
				transitionY = 0;
			} else {
				transitionX = 0;
				transitionY = 500;
			}
		}
	}

	function getInitials(name) {
		return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
	}
</script>

<svelte:head>
	<title>{eventInfo ? eventInfo.name : 'Attendance'} | ECE Admin</title>
</svelte:head>

<div class="font-poppins fixed inset-0 -z-10 h-screen w-screen overflow-hidden bg-slate-50">
	<div class="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-cyan-50"></div>
	<div class="animate-blob absolute top-0 -left-4 h-96 w-96 rounded-full bg-blue-300 opacity-60 mix-blend-multiply blur-3xl filter"></div>
	<div class="animate-blob animation-delay-2000 absolute top-0 -right-4 h-96 w-96 rounded-full bg-cyan-200 opacity-60 mix-blend-multiply blur-3xl filter"></div>
	<div class="animate-blob animation-delay-4000 absolute -bottom-32 left-20 h-96 w-96 rounded-full bg-indigo-200 opacity-60 mix-blend-multiply blur-3xl filter"></div>
</div>

<div class="relative flex min-h-screen w-full flex-col overflow-hidden bg-white/40 pb-24 backdrop-blur-md">
	<div class="mx-auto w-full max-w-7xl">
		<header class="flex flex-col gap-4 px-6 pt-6 pb-2">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<button 
						onclick={() => goto('/ece/home')}
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 border border-white shadow-sm text-gray-600 transition-all hover:bg-zinc-900 hover:text-white"
						title="Back to Dashboard"
					>
						<LayoutGrid size={18} />
					</button>
					<div>
						<p class="text-[10px] font-black tracking-widest text-gray-400 uppercase">
							{eventId === 'all' ? 'Directory' : 'Attendance'}
						</p>
						<h1 class="text-xl font-bold text-zinc-900 line-clamp-1">{eventInfo?.name || 'Loading...'}</h1>
					</div>
				</div>
				<div class="flex items-center gap-2">
					{#if eventId === 'all'}
						<button 
							onclick={() => isAddStudentOpen = true}
							class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm transition-all hover:bg-blue-600 hover:text-white"
							title="Add Student"
						>
							<UserPlus size={18} />
						</button>
					{/if}
					{#if eventId !== 'all'}
						<button 
							onclick={clearAttendance}
							class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-sm transition-all hover:bg-amber-600 hover:text-white"
							title="Clear All Attendance"
						>
							<Trash2 size={18} />
						</button>
					{/if}
					<button onclick={handleLogout} class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 shadow-sm transition-all hover:bg-red-500 hover:text-white">
						<LogOut size={18} />
					</button>
					<div class="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm ring-2 ring-blue-100 flex items-center justify-center bg-zinc-900 text-white font-bold text-xs">
						{getInitials(adminName)}
					</div>
				</div>
			</div>

			<div class="group relative flex items-center rounded-2xl border border-white/60 bg-white/40 px-4 shadow-sm backdrop-blur-md transition-all focus-within:ring-2 focus-within:ring-blue-500/20 hover:bg-white/60">
				<Search size={20} class="text-gray-500" />
				<input
					type="text"
					placeholder="Search student name or roll no..."
					bind:value={searchText}
					class="h-12 w-full bg-transparent px-3 text-sm text-zinc-800 outline-none placeholder:text-gray-400"
				/>
			</div>
		</header>

		{#if isLoading}
			<div class="flex h-60 w-full flex-col items-center justify-center gap-3">
				<Loader2 size={36} class="animate-spin text-blue-500" />
				<p class="text-xs font-bold text-gray-400 animate-pulse">Fetching Enrollment List...</p>
			</div>
		{:else}
			<div class="w-full px-6 pb-36 mt-4">
				{#if filteredStudents.length === 0}
					<div class="flex h-40 flex-col items-center justify-center text-gray-400">
						<UserX size={40} class="mb-2 opacity-50" />
						<p class="text-sm">No students found matching your search.</p>
					</div>
				{:else}
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" in:fade={{ duration: 200 }}>
						{#each filteredStudents as student (student.roll_no)}
							{@const isStaged = stagedChanges[student.roll_no]}
							{@const displayStatus = isStaged ? isStaged.newStatus : (student.status || 'pending')}
							
							{@const viewOnly = eventId === 'all'}
							
							<div
								class={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-3 shadow-sm backdrop-blur-md transition-all hover:scale-[1.02] hover:shadow-md
								${isStaged ? 'border-blue-400 bg-blue-50/80 ring-2 ring-blue-500/20' : 'border-white/60 bg-white/40 hover:bg-white/60'}`}
							>
								<div class={`h-14 w-14 shrink-0 flex items-center justify-center overflow-hidden rounded-xl shadow-inner font-bold text-lg
									${displayStatus === 'present' ? 'bg-green-100 text-green-700' : displayStatus === 'absent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
									{getInitials(student.name)}
								</div>

								<div class="flex flex-1 flex-col items-start justify-center gap-1 text-left">
									<h3 class="line-clamp-1 text-sm font-bold text-zinc-900">{student.name}</h3>
									<div class="flex items-center gap-1.5">
										<p class="font-poppins text-[10px] font-medium text-gray-500">{student.roll_no}</p>
										<span class="text-[10px] text-gray-300">•</span>
										<p class="font-poppins text-[10px] font-black text-blue-500 italic">{student.year} Year</p>
									</div>
									<span class={`mt-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider
										${displayStatus === 'present' ? 'bg-green-100 text-green-700' : displayStatus === 'absent' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'}`}>
										{displayStatus}
									</span>
									
									{#if student.college}
										<p class="font-poppins text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tight line-clamp-1">{student.college}</p>
									{/if}

									{#if viewOnly && (student.event_ids || student.events)}
										<div class="mt-2 flex flex-wrap gap-1">
											{#each (student.events || student.event_ids || []) as e}
												{@const eventObj = typeof e === 'object' ? e : { id: e, name: getEventName(e), type: getEventType(e) }}
												<span class={`rounded-full px-2 py-0.5 text-[8px] font-bold capitalize border outline-1
													${eventObj.type === 'technical' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-pink-50 border-pink-100 text-pink-600'}`}>
													{eventObj.name}
												</span>
											{/each}
										</div>
									{/if}
								</div>

								<div class="flex flex-col gap-2">
									{#if viewOnly}
										<button 
											onclick={() => deleteStudent(student.roll_no)}
											class="text-red-400 hover:text-red-600 transition-colors p-1"
											title="Delete Student"
										>
											<Trash2 size={18} />
										</button>
									{:else}
										<button 
											onclick={() => toggleAttendance(student)}
											class="text-blue-500 hover:text-blue-700 transition-colors p-1 active:scale-90"
											title="Toggle Attendance"
										>
											<Pencil size={18} />
										</button>
									{/if}
								</div>

								{#if isStaged}
									<div in:scale={{ duration: 200, easing: elasticOut }} class="absolute top-2 right-2 text-blue-600">
										<Pencil size={16} class="drop-shadow-sm" />
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

{#if queueCount > 0 && !isQueueOpen && !isSubmitOpen}
	<div transition:fly={{ y: 50, duration: 400, opacity: 0 }} class="fixed right-4 bottom-28 left-4 z-50 mx-auto max-w-sm md:right-6 md:bottom-6 md:left-auto md:w-96">
		<button
			onclick={() => (isQueueOpen = true)}
			class="relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-zinc-900/95 p-4 text-white shadow-2xl shadow-blue-900/30 backdrop-blur-xl transition-transform active:scale-95"
		>
			<div class="flex items-center gap-3">
				<div class="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 font-bold backdrop-blur-sm">
					{queueCount}
				</div>
				<div class="text-left">
					<p class="text-[10px] font-medium tracking-wider text-gray-300 uppercase">Pending Updates</p>
					<p class="text-sm font-bold text-blue-200">Review Required</p>
				</div>
			</div>
			<div class="flex items-center gap-2 pr-2 text-sm font-bold text-white">
				Review <ChevronUp size={20} />
			</div>
		</button>
	</div>
{/if}

{#if isQueueOpen}
	<button class="fixed inset-0 z-30 bg-zinc-900/40 backdrop-blur-sm transition-opacity" onclick={() => (isQueueOpen = false)} aria-label="Close queue"></button>
	<div transition:fly={{ x: transitionX, y: transitionY, duration: 400, opacity: 1, easing: quintOut }} class="fixed bottom-0 z-70 w-full rounded-t-[32px] bg-white shadow-2xl md:fixed md:top-0 md:right-0 md:bottom-0 md:h-screen md:w-[400px] md:max-w-md md:rounded-l-3xl md:rounded-tr-none md:border-l md:border-white/50">
		<div class="mx-auto mt-4 h-1.5 w-12 rounded-full bg-gray-300 md:hidden"></div>
		<div class="flex h-full flex-col p-6 pb-6">
			<div class="mb-4 flex shrink-0 items-center justify-between">
				<h2 class="text-xl font-bold text-zinc-900">Pending Updates</h2>
				<div class="flex gap-2">
					<button onclick={clearQueue} class="rounded-full bg-red-50 p-2 text-red-500 hover:bg-red-100" title="Clear All" aria-label="Clear all pending updates">
						<Trash2 size={20} />
					</button>
					<button onclick={() => (isQueueOpen = false)} class="rounded-full bg-gray-100 p-2 text-zinc-500 hover:bg-gray-200" aria-label="Close queue">
						<X size={20} />
					</button>
				</div>
			</div>

			<div class="no-scrollbar flex-1 overflow-y-auto pr-1">
				{#each queuedItems as item}
					<div class="mb-4 flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
						<div class={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-sm
							${item.newStatus === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
							{getInitials(item.name)}
						</div>

						<div class="flex-1">
							<h4 class="font-bold text-zinc-900 text-sm">{item.name}</h4>
							<p class="text-xs text-gray-500">{item.roll_no}</p>
							<div class="mt-1 flex gap-1">
								<span class="text-[10px] text-gray-400 line-through">{item.status || 'pending'}</span>
								<ArrowRight size={10} class="text-gray-400 mt-0.5" />
								<span class={`text-[10px] font-bold uppercase ${item.newStatus === 'present' ? 'text-green-600' : 'text-red-600'}`}>
									{item.newStatus}
								</span>
							</div>
						</div>

						<button onclick={() => removeFromQueue(item.roll_no)} class="rounded-full bg-red-50 p-2 text-red-500 hover:bg-red-100 active:scale-95">
							<XCircle size={18} />
						</button>
					</div>
				{/each}
			</div>

			<div class="z-10 mt-4 shrink-0 border-t border-dashed border-gray-200 bg-white pt-4">
				<div class="flex justify-between text-sm font-medium text-gray-500 mb-2">
					<span>Marking Present:</span> <span class="text-zinc-900 font-bold">{presentCount}</span>
				</div>
				<div class="flex justify-between text-sm font-medium text-gray-500 mb-4">
					<span>Marking Absent:</span> <span class="text-zinc-900 font-bold">{absentCount}</span>
				</div>
				<button
					onclick={openSubmit}
					disabled={queueCount === 0}
					class="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 font-bold text-white shadow-lg shadow-zinc-900/20 transition-all active:scale-95 disabled:scale-100 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
				>
					Proceed to Sync <CloudUpload size={20} />
				</button>
			</div>
		</div>
	</div>
{/if}

{#if isSubmitOpen}
	<button class="fixed inset-0 z-30 bg-zinc-900/40 backdrop-blur-sm transition-opacity" onclick={() => (isSubmitOpen = false)} aria-label="Close submit"></button>
	<div transition:fly={{ x: transitionX, y: transitionY, duration: 400, opacity: 1, easing: quintOut }} class="fixed bottom-0 z-40 w-full rounded-t-[32px] bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:top-0 md:right-0 md:h-screen md:w-[450px] md:rounded-none md:rounded-l-[32px] md:border-l md:border-white/50">
		<div class="mx-auto mt-4 h-1.5 w-12 rounded-full bg-gray-300 md:hidden"></div>

		<div class="no-scrollbar max-h-[85vh] overflow-y-auto px-6 py-6 pb-28 md:flex md:h-full md:max-h-none md:flex-col md:pb-6">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-xl font-bold text-zinc-900">Confirm Sync</h2>
				<button onclick={() => (isSubmitOpen = false)} class="flex items-center gap-1 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 active:scale-95">
					<ArrowLeft size={14} /> Back
				</button>
			</div>

			<div class="mb-6">
				<p class="mb-2.5 block text-xs font-bold tracking-wider text-gray-400 uppercase">Target Event</p>
				<div class="rounded-2xl bg-gray-50 border border-gray-100 p-4">
					<h3 class="font-bold text-zinc-900">{eventInfo?.name}</h3>
					<p class="text-xs text-gray-500 mt-1 capitalize font-bold">{eventInfo?.type || ''} Event</p>
				</div>
			</div>

			<div class="mb-6">
				<p class="mb-2.5 block text-xs font-black tracking-widest text-gray-400 uppercase ml-1">Coordinator Identity</p>
				<div class="relative">
					<ShieldCheck size={20} class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						bind:value={adminName}
						class="h-14 w-full rounded-2xl border border-gray-200 bg-white pr-4 pl-12 text-sm font-bold text-zinc-900 transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
					/>
				</div>
			</div>

			<div class="rounded-2xl border border-gray-100 bg-blue-50/50 p-5 mt-auto">
				<div class="flex items-end justify-between">
					<div class="flex flex-col">
						<span class="text-xs font-bold text-gray-400 uppercase">Records to Update</span>
						<span class="text-3xl font-bold text-zinc-900">{queueCount}</span>
					</div>
					<Cloud size={36} class="text-blue-300" />
				</div>
			</div>

			<button
				onclick={submitBulkAttendance}
				class="group relative mt-4 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-95"
			>
				<div class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
				<span>Submit to Server</span>
				<CheckCircle size={20} class="opacity-90" />
			</button>
		</div>
	</div>
{/if}



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
					<label for="student-name" class="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Full Name</label>
					<input id="student-name" type="text" bind:value={newStudent.name} placeholder="e.g. Alice Smith"
						class="h-12 rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-zinc-900 outline-none focus:border-blue-500 focus:bg-white" />
				</div>
				<div class="flex flex-col gap-1.5">
					<label for="student-roll" class="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Registration No</label>
					<input id="student-roll" type="text" bind:value={newStudent.roll_no} placeholder="e.g. 20ECE005"
						class="h-12 rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-zinc-900 outline-none focus:border-blue-500 focus:bg-white" />
				</div>
				<div class="flex flex-col gap-1.5">
					<label for="student-email" class="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Email Address</label>
					<input id="student-email" type="email" bind:value={newStudent.email} placeholder="alice@gmail.com"
						class="h-12 rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-zinc-900 outline-none focus:border-blue-500 focus:bg-white" />
				</div>
				<div class="flex flex-col gap-1.5">
					<label for="student-phone" class="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Phone Number</label>
					<input id="student-phone" type="tel" bind:value={newStudent.phone} placeholder="9998887776"
						class="h-12 rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-zinc-900 outline-none focus:border-blue-500 focus:bg-white" />
				</div>
				<div class="flex flex-col gap-1.5">
					<label for="student-college" class="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">College Name</label>
					<input id="student-college" type="text" bind:value={newStudent.college} placeholder="e.g. GCE"
						class="h-12 rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-zinc-900 outline-none focus:border-blue-500 focus:bg-white" />
				</div>
				<div class="flex flex-col gap-1.5 md:col-span-2">
					<label for="student-dept" class="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Department</label>
					<input id="student-dept" type="text" bind:value={newStudent.department} placeholder="e.g. ECE"
						class="h-12 rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-zinc-900 outline-none focus:border-blue-500 focus:bg-white" />
				</div>
				<div class="flex flex-col gap-1.5">
					<label for="student-year" class="text-[10px] font-black tracking-widest text-gray-400 uppercase ml-1">Year of Study</label>
					<select id="student-year" bind:value={newStudent.year} class="h-12 rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold text-zinc-900 outline-none focus:border-blue-500 focus:bg-white">
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
