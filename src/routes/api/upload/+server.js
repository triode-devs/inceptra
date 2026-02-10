import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, platform }) {
    try {
        if (!platform?.env?.BUCKET) {
            return json({ error: 'R2 Bucket connection failed' }, { status: 500 });
        }

        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Use arrayBuffer() to ensure the data has a known length for R2
        const key = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        await platform.env.BUCKET.put(key, await file.arrayBuffer(), {
            httpMetadata: { contentType: file.type }
        });

        return json({ success: true, key });
    } catch (error) {
        console.error('Upload error:', error);
        return json({ error: error.message }, { status: 500 });
    }
}
