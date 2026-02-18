import { API_BASE_URL } from '$lib/index';

export const prerender = false;
export const ssr = true; // Still useful for initial load if running in a node environment, but for static/spa it works on client navigation

export const load = async ({ fetch }) => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/admin/registrations`);
        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        return {
            registrations: data.registrations || [],
            settings: data.settings || {}
        };
    } catch (e) {
        console.error('API Load Error:', e);
        return {
            registrations: [],
            settings: {},
            error: 'Failed to load registrations. Is the backend running?'
        };
    }
}
