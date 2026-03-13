import { API_BASE_URL } from '$lib/index';

export const load = async ({ fetch }) => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/admin/registrations`);
        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        return {
            registrations: data.registrations || [],
        };
    } catch (e) {
        console.error('API Load Error:', e);
        return {
            registrations: [],
            error: 'Failed to load data.'
        };
    }
};
