/** @type {import('./$types').PageServerLoad} */
export async function load({ platform, params }) {
    if (!platform?.env?.DB) {
        return { registrations: [], settings: {}, error: 'Database connection failed' };
    }

    const { dept: deptId } = params;

    // Dept ID to Full Name mapping
    const idMap = {
        'cse': 'Computer Science',
        'ece': 'Electronics & Comm',
        'eee': 'Electrical & Electronics',
        'mech': 'Mech & Mechatronics',
        'civil': 'Civil Engineering'
    };

    const deptFullName = idMap[deptId.toLowerCase()];

    if (!deptFullName) {
        return { registrations: [], settings: {}, error: 'Invalid department' };
    }

    try {
        // Fetch registrations filtered by department
        const registrationsPromise = platform.env.DB.prepare(
            `SELECT id, name, college_id, email, phone, year, college, address, food, registration_type, dept, 
            technical_events, non_technical_events, cultural_events, amount, payment_screenshot_key, 
            payment_status, user_id, created_at 
            FROM registrations 
            WHERE dept = ? 
            ORDER BY created_at DESC`
        ).bind(deptFullName).all();

        // Fetch settings
        const settingsPromise = platform.env.DB.prepare('SELECT * FROM settings').all();

        const [regRes, setRes] = await Promise.all([registrationsPromise, settingsPromise]);

        // Convert settings array to key-value object
        const settings = (setRes?.results || []).reduce((acc, curr) => {
            if (curr && curr.key) {
                acc[curr.key] = curr.value;
            }
            return acc;
        }, {});

        // Safely parse JSON strings into arrays
        const registrations = (regRes.results || []).map((reg) => {
            const safeParse = (str) => {
                if (!str) return [];
                if (Array.isArray(str)) return str;
                if (typeof str !== 'string') return [str];
                try {
                    return JSON.parse(str);
                } catch (e) {
                    return [];
                }
            };

            return {
                ...reg,
                technical_events: safeParse(reg.technical_events),
                non_technical_events: safeParse(reg.non_technical_events),
                cultural_events: safeParse(reg.cultural_events)
            };
        });

        return {
            registrations,
            settings,
            deptFullName
        };
    } catch (e) {
        console.error('Admin Load Error:', e);
        return { registrations: [], settings: {}, error: e.message || 'Unknown Load Error' };
    }
}

/** @type {import('./$types').Actions} */
export const actions = {};
