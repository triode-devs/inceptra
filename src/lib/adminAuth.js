import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Admin credentials mapping
// ID -> { password, department, role }
// If department is null, it's a super admin
export const ADMIN_CREDENTIALS = {
    'admin': {
        password: 'inceptra26_core',
        department: null,
        role: 'superadmin',
        name: 'Super Admin'
    },
    'cse_admin': {
        password: 'tec_cse_26',
        department: 'Computer Science',
        role: 'deptadmin',
        name: 'CSE Admin'
    },
    'ece_admin': {
        password: 'tec_ece_26',
        department: 'Electronics & Comm',
        role: 'deptadmin',
        name: 'ECE Admin'
    },
    'eee_admin': {
        password: 'tec_eee_26',
        department: 'Electrical & Electronics',
        role: 'deptadmin',
        name: 'EEE Admin'
    },
    'mech_admin': {
        password: 'tec_mech_26',
        department: 'Mech & Mechatronics',
        role: 'deptadmin',
        name: 'MECH Admin'
    },
    'civil_admin': {
        password: 'tec_civil_26',
        department: 'Civil Engineering',
        role: 'deptadmin',
        name: 'CIVIL Admin'
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
    if (!user) return '/admin';
    if (user.role === 'superadmin') return '/admin/registrations';

    const idMap = {
        'Computer Science': 'cse',
        'Electronics & Comm': 'ece',
        'Electrical & Electronics': 'eee',
        'Mech & Mechatronics': 'mech',
        'Civil Engineering': 'civil'
    };

    const slug = idMap[user.department];
    // If the user has a department but we explicitly don't have a mapping, fall back safely or log error. 
    // For now assuming valid department means valid slug, but let's be safe.
    return slug ? `/admin/${slug}` : '/admin';
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
