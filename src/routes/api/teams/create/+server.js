import { json } from '@sveltejs/kit';

export async function POST({ request, platform }) {
    if (!platform?.env?.DB) {
        return json({ error: 'Database connection failed' }, { status: 500 });
    }

    const { registrationId, eventName, teamName } = await request.json();

    if (!registrationId || !eventName || !teamName) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate a unique 6-digit team code
    const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
        // Start a transaction (simulated with multiple executes since atomic is handled by D1)
        // Check if user is already in a team for this event
        const existing = await platform.env.DB.prepare(
            'SELECT * FROM team_members WHERE registration_id = ? AND event_name = ?'
        ).bind(registrationId, eventName).first();

        if (existing) {
            return json({ error: 'You are already in a team for this event' }, { status: 400 });
        }

        // Create the team
        const result = await platform.env.DB.prepare(
            'INSERT INTO teams (event_name, team_name, team_code) VALUES (?, ?, ?)'
        ).bind(eventName, teamName, teamCode).run();

        const teamId = result.meta.last_row_id;

        // Add the creator as the leader
        await platform.env.DB.prepare(
            'INSERT INTO team_members (team_id, registration_id, event_name, role) VALUES (?, ?, ?, ?)'
        ).bind(teamId, registrationId, eventName, 'leader').run();

        return json({ success: true, team: { id: teamId, team_name: teamName, team_code: teamCode } });
    } catch (e) {
        console.error('Create Team Error:', e);
        return json({ error: e.message }, { status: 500 });
    }
}
