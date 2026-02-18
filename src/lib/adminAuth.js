import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Admin credentials mapping
// ID -> { password, department, role }
// If department is null, it's a super admin
export const ADMIN_CREDENTIALS = {
    'admin': {
        password: 'inceptra@admin',
        department: null,
        role: 'superadmin',
        name: 'Super Admin'
    },
    'cse': {
        password: 'inceptra@cse',
        department: 'Computer Science',
        role: 'deptadmin',
        name: 'CSE Admin'
    },
    'ece': {
        password: 'inceptra@ece',
        department: 'Electronics & Comm',
        role: 'deptadmin',
        name: 'ECE Admin'
    },
    'eee': {
        password: 'inceptra@eee',
        department: 'Electrical & Electronics',
        role: 'deptadmin',
        name: 'EEE Admin'
    },
    'mech': {
        password: 'inceptra@mech',
        department: 'Mech & Mechatronics',
        role: 'deptadmin',
        name: 'MECH Admin'
    },
    'civil': {
        password: 'inceptra@civil',
        department: 'Civil Engineering',
        role: 'deptadmin',
        name: 'CIVIL Admin'
    },
    'cultural': {
        password: 'inceptra@cultural',
        department: 'Cultural',
        role: 'deptadmin',
        name: 'Cultural Admin'
    },
    'hackathon': {
        password: 'inceptra@hackathon',
        department: 'Hackathon',
        role: 'deptadmin',
        name: 'Hackathon Admin'
    }
};

function getInitialAdmin() {
    if (!browser) return null;
    try {
        const stored = localStorage.getItem('admin_session');
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        console.error('Failed to parse admin session:', e);
        return null;
    }
}

const initialAdmin = getInitialAdmin();

export const adminUser = writable(initialAdmin);

if (browser) {
    adminUser.subscribe(val => {
        if (val) {
            localStorage.setItem('admin_session', JSON.stringify(val));
        } else {
            localStorage.removeItem('admin_session');
        }
    });
}

export function getDashboardUrl(user) {
    // Consolidating all dashboards to /admin/registrations with dynamic filtering
    return '/admin/registrations';
}

export function loginAdmin(id, password) {
    if (!id || !password) return { success: false, error: 'ID and Password are required' };

    // Make ID check case-insensitive and trimmed
    const normalizedId = id.trim().toLowerCase();
    const admin = ADMIN_CREDENTIALS[normalizedId];

    if (admin && admin.password === password) {
        const userData = {
            normalizedId,
            name: admin.name,
            role: admin.role,
            department: admin.department
        };
        adminUser.set(userData);

        return {
            success: true,
            redirectUrl: getDashboardUrl(userData)
        };
    }
    return { success: false, error: 'Invalid ID or Password' };
}


export function logoutAdmin() {
    adminUser.set(null);
}
