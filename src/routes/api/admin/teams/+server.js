import { json } from '@sveltejs/kit';

export async function GET({ platform }) {
    if (!platform?.env?.DB) {
        return json({ error: 'Database connection failed' }, { status: 500 });
    }

    try {
        // Fetch all teams with their members and total count
        const { results } = await platform.env.DB.prepare(
            `SELECT t.id, t.team_name, t.team_code, t.event_name, t.created_at,
             group_concat(r.name || ' (' || r.college_id || ')', ', ') as members,
             count(tm.registration_id) as member_count
             FROM teams t
             JOIN team_members tm ON t.id = tm.team_id
             JOIN registrations r ON tm.registration_id = r.id
             GROUP BY t.id
             ORDER BY t.event_name ASC, t.created_at DESC`
        ).all();

        return json({ success: true, teams: results });
    } catch (e) {
        console.error('Admin Fetch Teams Error:', e);
        return json({ error: e.message }, { status: 500 });
    }
}
