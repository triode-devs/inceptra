import { json } from '@sveltejs/kit';

export async function GET({ url, platform }) {
    if (!platform?.env?.DB) {
        return json({ error: 'Database connection failed' }, { status: 500 });
    }

    const registrationId = url.searchParams.get('registrationId');

    if (!registrationId) {
        return json({ error: 'Missing registrationId' }, { status: 400 });
    }

    try {
        // Fetch all teams for this registration, including member names
        const { results } = await platform.env.DB.prepare(
            `SELECT t.id, t.team_name, t.team_code, t.event_name, tm.role,
             (SELECT group_concat(r.name, ', ') 
              FROM team_members tm2 
              JOIN registrations r ON tm2.registration_id = r.id 
              WHERE tm2.team_id = t.id) as members
             FROM team_members tm
             JOIN teams t ON tm.team_id = t.id
             WHERE tm.registration_id = ?`
        ).bind(registrationId).all();

        return json({ success: true, teams: results });
    } catch (e) {
        console.error('Fetch Teams Error:', e);
        return json({ error: e.message }, { status: 500 });
    }
}
