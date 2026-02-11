<script>
	import { loginAdmin } from '$lib/adminAuth';
	import { KeyRound, User, Sparkles, ShieldCheck } from 'lucide-svelte';
	import tecLogo from '$lib/assets/tec svg.svg';
	import { fade } from 'svelte/transition';

	let id = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin() {
		error = '';
		loading = true;

		// Small delay for natural feel
		await new Promise((r) => setTimeout(r, 500));

		const result = loginAdmin(id, password);
		if (result.success) {
			// Redirect based on role/department
			window.location.href = result.redirectUrl;
		} else {
			error = result.error;
		}
		loading = false;
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-[#f7f6f8] p-6">
	<div class="w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-2xl" in:fade>
		<div class="bg-[#141118] p-10 text-center text-white">
			<div class="mb-6 flex justify-center">
				<div class="rounded-2xl bg-white p-3 shadow-xl">
					<img src={tecLogo} alt="TEC Logo" class="h-12 w-auto" />
				</div>
			</div>
			<div class="flex items-center justify-center gap-2 text-[#8c2bee]">
				<ShieldCheck size={20} fill="currentColor" fill-opacity="0.2" />
				<span class="text-xs font-black tracking-widest uppercase">Admin Portal</span>
			</div>
			<h2 class="mt-4 text-3xl font-black">INCEPTRA <span class="text-[#8c2bee]">26</span></h2>
			<p class="mt-2 text-sm text-gray-400">Restricted access for organizers only.</p>
		</div>

		<form
			class="p-10"
			onsubmit={(e) => {
				e.preventDefault();
				handleLogin();
			}}
		>
			{#if error}
				<div class="mb-6 rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600" in:fade>
					{error}
				</div>
			{/if}

			<div class="flex flex-col gap-6">
				<div class="flex flex-col gap-2">
					<label for="admin-id" class="text-xs font-black tracking-widest text-gray-400 uppercase"
						>Admin ID</label
					>
					<div class="relative">
						<User class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={18} />
						<input
							id="admin-id"
							type="text"
							bind:value={id}
							required
							autocomplete="username"
							placeholder="e.g. cse_admin"
							class="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 py-4 pr-4 pl-12 font-bold transition-all outline-none focus:border-[#8c2bee] focus:bg-white"
						/>
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<label for="admin-pass" class="text-xs font-black tracking-widest text-gray-400 uppercase"
						>Password</label
					>
					<div class="relative">
						<KeyRound class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" size={18} />
						<input
							id="admin-pass"
							type="password"
							bind:value={password}
							required
							autocomplete="current-password"
							placeholder="••••••••"
							class="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 py-4 pr-4 pl-12 font-bold transition-all outline-none focus:border-[#8c2bee] focus:bg-white"
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#8c2bee] text-lg font-black text-white shadow-lg shadow-[#8c2bee]/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
				>
					{#if loading}
						<div
							class="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"
						></div>
					{:else}
						Login to Dashboard
					{/if}
				</button>
			</div>

			<p class="mt-8 text-center text-[10px] font-bold tracking-widest text-gray-400 uppercase">
				Enterprise Security Verified
			</p>
		</form>
	</div>
</div>
