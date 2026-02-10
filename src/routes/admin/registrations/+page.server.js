/** @type {import('./$types').PageServerLoad} */
export async function load({ platform }) {
    if (!platform?.env?.DB) {
        console.log('Admin Load: No Database Binding found');
        return { registrations: [], settings: {}, error: 'Database connection failed' };
    }

    try {
        // Fetch registrations
        const registrationsPromise = platform.env.DB.prepare(
            'SELECT * FROM registrations ORDER BY created_at DESC'
        ).all();

        // Fetch settings
        const settingsPromise = platform.env.DB.prepare('SELECT * FROM settings').all();

        const [regRes, setRes] = await Promise.all([registrationsPromise, settingsPromise]);

        // Convert settings array to key-value object
        const settings = (setRes.results || []).reduce((acc, curr) => {
            acc[curr.key] = curr.value;
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
                    console.error(`Failed to parse JSON field for reg ${reg.id}:`, str);
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
            settings
        };
    } catch (e) {
        console.error('Admin Load Error:', e);
        return { registrations: [], settings: {}, error: e.message || 'Unknown Load Error' };
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    updateStatus: async ({ request, platform }) => {
        const data = await request.formData();
        const id = data.get('id');
        const status = data.get('status');

        if (!platform?.env?.DB) {
            return { success: false, error: 'Database connection failed' };
        }

        try {
            await platform.env.DB.prepare('UPDATE registrations SET payment_status = ? WHERE id = ?')
                .bind(status, id)
                .run();

            return { success: true };
        } catch (e) {
            console.error('Update Status Error:', e);
            return { success: false, error: e.message };
        }
    },

    toggleOfflinePayment: async ({ request, platform }) => {
        const data = await request.formData();
        const enabled = data.get('enabled');

        if (!platform?.env?.DB) {
            return { success: false, error: 'Database connection failed' };
        }

        try {
            await platform.env.DB.prepare(
                "INSERT INTO settings (key, value) VALUES ('offline_payment_enabled', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
            )
                .bind(enabled)
                .run();

            return { success: true };
        } catch (e) {
            console.error('Toggle Offline Payment Error:', e);
            return { success: false, error: e.message };
        }
    }
};
