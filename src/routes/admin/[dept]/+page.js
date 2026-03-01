import { error } from '@sveltejs/kit';
import { API_BASE_URL } from '$lib/index';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
    const { dept } = params;

    const departments = [
        { id: 'cse', name: 'Computer Science' },
        { id: 'eee', name: 'Electrical & Electronics' },
        { id: 'ece', name: 'Electronics & Comm' },
        { id: 'mech', name: 'Mech & Mechatronics' },
        { id: 'civil', name: 'Civil Engineering' },
        { id: 'cultural', name: 'Cultural' },
        { id: 'hackathon', name: 'Hackathon' }
    ];

    const deptConfig = departments.find((d) => d.id === dept);

    if (!deptConfig) {
        throw error(404, 'Department not found');
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/admin/registrations`);

        if (!res.ok) {
            throw error(res.status, 'Failed to fetch registrations');
        }

        const data = await res.json();
        const allRegistrations = data.registrations || [];

        const filteredRegistrations = allRegistrations.filter((reg) => {
            // Support both snake_case and camelCase field names from different backends
            const regType = (reg.registration_type || reg.registrationType || '').toLowerCase();
            if (dept === 'cultural') {
                return regType === 'cultural';
            }
            if (dept === 'hackathon') {
                return regType === 'hackathon';
            }
            // For symposium departments, check target_dept (case-insensitive)
            const targetDept = (reg.target_dept || reg.targetDept || '').toLowerCase();
            return deptConfig && targetDept === deptConfig.name.toLowerCase();
        });

        return {
            registrations: filteredRegistrations,
            deptFullName: deptConfig?.name || 'Department',
            deptId: dept
        };
    } catch (err) {
        console.error('Load error:', err);
        return {
            registrations: [],
            deptFullName: deptConfig?.name || 'Department',
            error: 'Failed to load data'
        };
    }
}
