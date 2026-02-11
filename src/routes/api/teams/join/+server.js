import { json } from '@sveltejs/kit';

export async function POST({ request, platform }) {
    if (!platform?.env?.DB) {
        return json({ error: 'Database connection failed' }, { status: 500 });
    }

    const { registrationId, eventName, teamCode } = await request.json();

    if (!registrationId || !eventName || !teamCode) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        // Find the team by code
        const team = await platform.env.DB.prepare(
            'SELECT * FROM teams WHERE team_code = ? AND event_name = ?'
        ).bind(teamCode.toUpperCase(), eventName).first();

        if (!team) {
            return json({ error: 'Invalid team code for this event' }, { status: 404 });
        }

        // Check if user is already in a team for this event
        const existing = await platform.env.DB.prepare(
            'SELECT * FROM team_members WHERE registration_id = ? AND event_name = ?'
        ).bind(registrationId, eventName).first();

        if (existing) {
            return json({ error: 'You are already in a team for this event' }, { status: 400 });
        }

        // Check if team is full (logic can be added here if there's a limit)

        // Join the team
        await platform.env.DB.prepare(
            'INSERT INTO team_members (team_id, registration_id, event_name, role) VALUES (?, ?, ?, ?)'
        ).bind(team.id, registrationId, eventName, 'member').run();

        return json({ success: true, team });
    } catch (e) {
        console.error('Join Team Error:', e);
        return json({ error: e.message }, { status: 500 });
    }
}
