import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, platform }) {
	try {
		const data = await request.json();
		const {
			name,
			id: college_id,
			email,
			phone,
			year,
			college,
			address,
			food,
			registrationType,
			dept,
			events,
			amount,
			payment_screenshot_key,
			user_id
		} = data;

		if (!platform?.env?.DB) {
			return json({ error: 'Database connection failed' }, { status: 500 });
		}

		const db = platform.env.DB;

		const technical_events = JSON.stringify(events.technical || []);
		const non_technical_events = JSON.stringify(events.nonTechnical || []);
		const cultural_events = JSON.stringify(events.cultural || []);

		const result = await db
			.prepare(
				`INSERT INTO registrations (
                name, college_id, email, phone, year, college, address, food, 
                registration_type, dept, technical_events, non_technical_events, cultural_events, amount,
                payment_screenshot_key, payment_status, user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
			)
			.bind(
				name,
				college_id,
				email,
				phone,
				year,
				college,
				address,
				food,
				registrationType,
				dept || null,
				technical_events,
				non_technical_events,
				cultural_events,
				amount,
				payment_screenshot_key || null,
				'pending',
				user_id || null
			)
			.run();

		if (result.success) {
			return json({ success: true, id: result.meta.last_row_id });
		} else {
			return json({ error: 'Failed to save registration' }, { status: 500 });
		}
	} catch (error) {
		console.error('Registration error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
