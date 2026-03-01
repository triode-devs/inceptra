<script>
	import { onMount } from 'svelte';
	import { API_BASE_URL } from '$lib';
	import { symposiumData, culturalData } from '$lib/data/data';

	let logs = $state([]);
	let isRunning = $state(false);

	let isAuthenticated = $state(false);
	let username = $state('');
	let password = $state('');
	let loginError = $state('');

	function handleLogin(e) {
		e.preventDefault();
		if (username === 'test' && password === 'testpass') {
			isAuthenticated = true;
			loginError = '';
		} else {
			loginError = 'Invalid credentials';
		}
	}

	const firstNames = [
		'Aarav',
		'Vivaan',
		'Aditya',
		'Vihaan',
		'Arjun',
		'Sai',
		'Reyansh',
		'Ayaan',
		'Krishna',
		'Ishaan',
		'Diya',
		'Ananya',
		'Aaradhya',
		'Saanvi',
		'Pari',
		'Aditi',
		'Kavya',
		'Neha',
		'Pooja',
		'Sneha'
	];
	const lastNames = [
		'Kumar',
		'Singh',
		'Sharma',
		'Patel',
		'Reddy',
		'Rao',
		'Iyer',
		'Nair',
		'Menon',
		'Pillai'
	];
	const colleges = [
		'NIT Trichy',
		'SASTRA University',
		'SRM Institute',
		'VIT Vellore',
		'Anna University',
		'PSG Tech',
		'SSN College',
		'Thiagarajar College',
		'Mepco Schlenk',
		'Kumaraguru College'
	];
	const cities = [
		'Trichy',
		'Chennai',
		'Coimbatore',
		'Madurai',
		'Salem',
		'Erode',
		'Tirunelveli',
		'Thanjavur'
	];
	const depts = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS'];

	function randomChoice(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	function randomId() {
		return Math.floor(10000000 + Math.random() * 90000000).toString();
	}

	function randomPhone() {
		return '+919' + Math.floor(100000000 + Math.random() * 900000000).toString();
	}

	function generateBaseProfile() {
		const name = `${randomChoice(firstNames)} ${randomChoice(lastNames)}`;
		return {
			name,
			id: randomId(),
			email: name.toLowerCase().replace(' ', '.') + '@example.com',
			phone: randomPhone(),
			year: randomChoice(['1', '2', '3', '4']),
			college: randomChoice(colleges),
			address: randomChoice(cities),
			food: randomChoice(['veg', 'non-veg']),
			studentDept: randomChoice(depts),
			events: { technical: [], nonTechnical: [], cultural: [] },
			paperTitle: '',
			paperFile: null,
			hackathonTopic: '',
			hackathonType: '',
			transactionId: 'TEST_' + randomId(),
			amount: 300,
			paymentMode: 'online',
			payment_screenshot_key: 'TEST_KEY_123',
			user_id: null
		};
	}

	function addLog(msg, type = 'info') {
		logs = [{ time: new Date().toLocaleTimeString(), msg, type }, ...logs].slice(0, 50);
	}

	async function submitRegistration(payload) {
		addLog(
			`Submitting for ${payload.registrationType} - ${payload.targetDept || 'No Dept'}...`,
			'info'
		);
		try {
			const response = await fetch(`${API_BASE_URL}/api/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const result = await response.json();
			if (response.ok) {
				addLog(`✅ Success: ${payload.name} registered.`, 'success');
			} else {
				addLog(`❌ Error: ${result.error || 'Failed'}`, 'error');
			}
		} catch (e) {
			addLog(`❌ Exception: ${e.message}`, 'error');
		}
	}

	async function testDepartment(deptId) {
		const dept = symposiumData.find((d) => d.id === deptId);
		if (!dept) return;

		let payload = generateBaseProfile();
		payload.registrationType = 'symposium';
		payload.targetDept = dept.name;

		// Select 1-2 random tech events safely
		const allTech = [...(dept.events.technical || [])];
		if (allTech.length > 0) {
			const count = Math.min(allTech.length, Math.floor(Math.random() * 2) + 1);
			for (let i = 0; i < count; i++) {
				const ev = randomChoice(allTech);
				if (!payload.events.technical.includes(ev)) payload.events.technical.push(ev);
			}
		}

		// Select 0-1 random non-tech events safely
		const allNonTech = [...(dept.events.nonTechnical || [])];
		if (allNonTech.length > 0 && Math.random() > 0.5) {
			payload.events.nonTechnical.push(randomChoice(allNonTech));
		}

		// Check if paper presentation is selected to add a title
		const hasPaper = payload.events.technical.some((e) => e.toLowerCase().includes('paper'));
		if (hasPaper) {
			const topics = [
				'AI and Machine Learning',
				'IoT in Smart Cities',
				'Blockchain for Security',
				'Advanced Robotics',
				'Renewable Energy Systems'
			];
			payload.paperTitle = randomChoice(topics) + ' ' + Math.floor(Math.random() * 100);
		}

		await submitRegistration(payload);
	}

	async function testCultural() {
		let payload = generateBaseProfile();
		payload.registrationType = 'cultural';
		payload.targetDept = null;

		const allCultural = culturalData.map((c) => c.name);
		const count = Math.floor(Math.random() * 3) + 1; // 1 to 3 events
		for (let i = 0; i < count; i++) {
			const ev = randomChoice(allCultural);
			if (!payload.events.cultural.includes(ev)) payload.events.cultural.push(ev);
		}

		await submitRegistration(payload);
	}

	async function testHackathon() {
		let payload = generateBaseProfile();
		payload.registrationType = 'hackathon';
		payload.targetDept = null;

		const topics = [
			'Fintech & Security',
			'HealthTech',
			'Smart Education',
			'Green Earth',
			'AI Assistants'
		];
		payload.hackathonTopic = randomChoice(topics);
		payload.hackathonType = randomChoice(['software', 'hardware']);

		await submitRegistration(payload);
	}

	async function testAll() {
		if (isRunning) return;
		isRunning = true;

		addLog('🚀 Starting bulk test generation...', 'info');

		for (const dept of symposiumData) {
			await testDepartment(dept.id);
			await new Promise((r) => setTimeout(r, 500));
		}

		await testHackathon();
		await new Promise((r) => setTimeout(r, 500));

		await testCultural();

		addLog('✅ Bulk generation complete.', 'success');
		isRunning = false;
	}
</script>

{#if !isAuthenticated}
	<div class="flex min-h-screen items-center justify-center bg-[#f7f6f8] p-6 font-['Lexend']">
		<div class="w-full max-w-sm rounded-[2.5rem] bg-white p-8 shadow-xl">
			<h1 class="mb-6 text-center text-2xl font-black">API Generator</h1>
			<p class="mb-4 text-center text-xs font-bold text-gray-400">Restricted access.</p>
			<form onsubmit={handleLogin} class="flex flex-col gap-4">
				{#if loginError}
					<div class="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">
						{loginError}
					</div>
				{/if}
				<div>
					<label for="username" class="text-xs font-bold tracking-widest text-gray-400 uppercase"
						>Username</label
					>
					<input
						id="username"
						type="text"
						bind:value={username}
						class="mt-1 w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 font-bold transition-colors outline-none focus:border-[#8c2bee]"
					/>
				</div>
				<div>
					<label for="password" class="text-xs font-bold tracking-widest text-gray-400 uppercase"
						>Password</label
					>
					<input
						id="password"
						type="password"
						bind:value={password}
						class="mt-1 w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 font-bold transition-colors outline-none focus:border-[#8c2bee]"
					/>
				</div>
				<button
					type="submit"
					class="mt-4 w-full rounded-xl bg-[#8c2bee] py-3 font-black text-white transition-colors hover:bg-[#7b24d4]"
				>
					Login
				</button>
			</form>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-[#f7f6f8] p-8 pt-24 font-['Lexend'] text-[#141118]">
		<div class="mx-auto max-w-4xl">
			<h1 class="mb-6 text-3xl font-black">API Test Generator</h1>
			<p class="mb-8 text-gray-600">
				Generate mock registrations directly against the API for testing purposes.
			</p>

			<div class="mb-8 rounded-3xl bg-white p-6 shadow-sm">
				<h2 class="mb-4 text-xl font-bold">Quick Generators</h2>

				<div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
					{#each symposiumData as dept}
						<button
							onclick={() => testDepartment(dept.id)}
							disabled={isRunning}
							class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 font-bold text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50"
						>
							+ {dept.id.toUpperCase()}
						</button>
					{/each}

					<button
						onclick={testCultural}
						disabled={isRunning}
						class="rounded-xl border border-pink-100 bg-pink-50 px-4 py-3 font-bold text-pink-700 transition-colors hover:bg-pink-100 disabled:opacity-50"
					>
						+ Cultural
					</button>

					<button
						onclick={testHackathon}
						disabled={isRunning}
						class="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 font-bold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
					>
						+ Hackathon
					</button>
				</div>

				<div class="border-t border-gray-100 pt-6">
					<button
						onclick={testAll}
						disabled={isRunning}
						class="w-full rounded-xl bg-[#8c2bee] py-4 font-black text-white transition-colors hover:bg-[#7b24d4] disabled:bg-gray-400"
					>
						{isRunning ? 'Running...' : '🚀 Generate 1 of Everything (Bulk Test)'}
					</button>
				</div>
			</div>

			<!-- Logs -->
			<div class="flex h-96 flex-col overflow-hidden rounded-3xl bg-black p-6 shadow-sm">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="font-mono font-bold text-white">Terminal Logs</h2>
					<button
						onclick={() => (logs = [])}
						class="font-mono text-xs text-gray-400 hover:text-white">CLEAR</button
					>
				</div>

				<div class="flex-1 space-y-2 overflow-y-auto font-mono text-sm">
					{#if logs.length === 0}
						<p class="text-gray-600">Waiting for actions...</p>
					{/if}
					{#each logs as log}
						<div class="flex items-start gap-3 border-b border-gray-800 pb-2">
							<span class="shrink-0 text-gray-500">[{log.time}]</span>
							<span
								class={log.type === 'error'
									? 'text-red-400'
									: log.type === 'success'
										? 'text-emerald-400'
										: 'text-gray-300'}
							>
								{log.msg}
							</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}
