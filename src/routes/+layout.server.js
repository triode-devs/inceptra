/** @type {import('./$types').LayoutServerLoad} */
export async function load({ platform }) {
    if (!platform?.env?.DB) {
        return { settings: {} };
    }

    try {
        const { results } = await platform.env.DB.prepare('SELECT * FROM settings').all();
        const settings = (results || []).reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return { settings };
    } catch (e) {
        console.error('Layout Load Error:', e);
        return { settings: {} };
    }
}
