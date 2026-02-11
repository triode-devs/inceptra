import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, platform }) {
    const userId = url.searchParams.get('userId');

    if (!userId) {
        return json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!platform?.env?.DB) {
        return json({ error: 'Database connection failed' }, { status: 500 });
    }

    try {
        const { results } = await platform.env.DB.prepare(
            'SELECT id, name, college_id, email, phone, year, college, address, food, registration_type, dept, technical_events, non_technical_events, cultural_events, amount, payment_screenshot_key, payment_status, user_id, created_at FROM registrations WHERE user_id = ? ORDER BY created_at DESC'
        )
            .bind(userId)
            .all();

        // Safely parse JSON strings into arrays like in the admin panel
        const registrations = (results || []).map((reg) => {
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

        return json({ registrations });
    } catch (error) {
        console.error('Fetch user registrations error:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
