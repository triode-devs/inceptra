import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    // Layout will handle the login check. 
    // This just ensures /admin redirects to a useful page once logged in.
    // However, since SvelteKit loads the layout first, we can just redirect here.
    throw redirect(307, '/admin/registrations');
}
