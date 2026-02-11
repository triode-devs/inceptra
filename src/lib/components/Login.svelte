<script>
	import { auth, googleProvider, signInWithPopup } from '$lib/firebase';
	import { LogIn, Github, Sparkles } from 'lucide-svelte';
	import tecLogo from '$lib/assets/tec svg.svg';

	let loading = false;
	let error = null;

	async function loginWithGoogle() {
		loading = true;
		error = null;
		try {
			await signInWithPopup(auth, googleProvider);
		} catch (e) {
			error = e.message;
			console.error(e);
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-[60vh] items-center justify-center p-6">
	<div class="w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-2xl">
		<div class="bg-[#141118] p-10 text-center text-white">
			<div class="mb-6 flex justify-center">
				<div class="rounded-2xl bg-white p-3 shadow-xl">
					<img src={tecLogo} alt="TEC Logo" class="h-12 w-auto" />
				</div>
			</div>
			<div class="flex items-center justify-center gap-2 text-[#8c2bee]">
				<Sparkles size={20} fill="currentColor" />
				<span class="text-xs font-black tracking-widest uppercase">Participant Access</span>
			</div>
			<h2 class="mt-4 text-3xl font-black">INCEPTRA <span class="text-[#8c2bee]">26</span></h2>
			<p class="mt-2 text-sm text-gray-400">Please sign in to continue with your registration.</p>
		</div>

		<div class="p-10">
			{#if error}
				<div class="mb-6 rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600">
					{error}
				</div>
			{/if}

			<button
				onclick={loginWithGoogle}
				disabled={loading}
				class="group relative flex w-full items-center justify-center gap-4 rounded-2xl border-2 border-gray-100 bg-white py-4 font-bold transition-all hover:border-[#8c2bee] hover:bg-gray-50 active:scale-95 disabled:opacity-50"
			>
				{#if loading}
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-[#8c2bee] border-t-transparent"
					></div>
				{:else}
					<img
						src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
						alt="Google"
						class="h-6 w-6"
					/>
				{/if}
				<span>Continue with Google</span>
			</button>

			<p class="mt-8 text-center text-[10px] font-bold tracking-widest text-gray-400 uppercase">
				Secure Login powered by Firebase
			</p>
		</div>
	</div>
</div>
