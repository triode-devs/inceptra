<script>
	import { adminUser, logoutAdmin, getDashboardUrl } from '$lib/adminAuth';
	import AdminLogin from '$lib/components/AdminLogin.svelte';
	import { LogOut, User as UserIcon, ShieldCheck } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';

	let { children } = $props();

	function handleLogout() {
		logoutAdmin();
		window.location.href = '/admin'; // Return to login
	}

	// Check if the current user has permission to view this department
	function checkPermission(user, currentDeptId) {
		if (!user) return false;
		if (user.role === 'superadmin') return true;

		// If it's a department page, check if IDs match
		if (currentDeptId && currentDeptId !== 'registrations') {
			// Map common URL IDs to display names if necessary
			const idMap = {
				cse: 'Computer Science',
				ece: 'Electronics & Comm',
				eee: 'Electrical & Electronics',
				mech: 'Mech & Mechatronics',
				civil: 'Civil Engineering'
			};
			return user.department === idMap[currentDeptId] || user.department === currentDeptId;
		}

		// Department admins cannot view the main 'registrations' (Super Admin) page
		return false;
	}

	const currentDeptId = $derived(
		$page.params.dept || ($page.url.pathname.includes('registrations') ? 'registrations' : null)
	);
	const hasPermission = $derived(checkPermission($adminUser, currentDeptId));

	// If the user is logged in but on the wrong page, we're likely in the middle of a redirect
	const isRedirecting = $derived($adminUser && !hasPermission);

	// Auto-redirect if on wrong page but logged in
	import { browser } from '$app/environment';
	$effect(() => {
		if (browser && $adminUser && !hasPermission) {
			const correctUrl = getDashboardUrl($adminUser);
			if (window.location.pathname !== correctUrl) {
				window.location.href = correctUrl;
			}
		}
	});
</script>

{#if !$adminUser}
	<AdminLogin />
{:else if isRedirecting}
	<div class="flex min-h-screen flex-col items-center justify-center bg-[#f7f6f8] p-6 text-center">
		<div
			class="h-12 w-12 animate-spin rounded-full border-4 border-[#8c2bee] border-t-transparent"
		></div>
		<p class="mt-4 font-bold text-[#756189]">Redirecting to your dashboard...</p>
	</div>
{:else if !hasPermission}
	<!-- This block is technically unreachable now due to isRedirecting, 
         but keeping it for clarity in case of logic changes -->
	<div class="flex min-h-screen flex-col items-center justify-center bg-[#f7f6f8] p-6 text-center">
		<div
			class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600"
		>
			<ShieldCheck size={40} />
		</div>
		<h1 class="text-3xl font-black">Access Denied</h1>
		<p class="mt-2 text-lg text-[#896179]">
			You do not have permission to view this department's data.
		</p>
		<div class="mt-8 flex gap-4">
			<button
				onclick={handleLogout}
				class="rounded-xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-600 transition-all hover:bg-gray-50"
			>
				Logout
			</button>
			<a
				href={getDashboardUrl($adminUser)}
				class="rounded-xl bg-[#8c2bee] px-6 py-3 font-bold text-white shadow-lg shadow-[#8c2bee]/20 transition-all hover:scale-105"
			>
				Back to My Dashboard
			</a>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-[#f7f6f8]">
		<!-- Admin Header -->
		<header
			class="fixed top-0 right-0 left-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md"
		>
			<div
				class="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
			>
				<div class="flex items-center gap-4">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8c2bee] text-white"
					>
						<ShieldCheck size={20} />
					</div>
					<div>
						<h1 class="text-lg leading-none font-black tracking-tight uppercase">
							Admin <span class="text-[#8c2bee]">Dashboard</span>
						</h1>
						<p class="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
							{$adminUser.name}
							{#if $adminUser.department}({$adminUser.department}){/if}
						</p>
					</div>
				</div>

				<div class="flex items-center gap-3">
					<div class="hidden items-center gap-2 rounded-xl bg-gray-50 px-3 py-1.5 sm:flex">
						<div
							class="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-[#8c2bee]/20 text-[#8c2bee]"
						>
							<UserIcon size={14} />
						</div>
						<span class="text-xs font-bold text-gray-600">{$adminUser.name}</span>
					</div>

					<button
						onclick={handleLogout}
						class="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-xs font-bold text-gray-600 transition-all hover:bg-red-50 hover:text-red-600"
					>
						<LogOut size={14} /> <span class="hidden sm:inline">Logout</span>
					</button>
				</div>
			</div>
		</header>

		<main class="pt-24 pb-12">
			{@render children()}
		</main>
	</div>
{/if}
