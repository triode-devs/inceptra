export async function GET({ params, platform }) {
    const key = params.key;

    if (!platform?.env?.BUCKET) {
        return new Response('No BUCKET', { status: 500 });
    }

    try {
        const object = await platform.env.BUCKET.get(key);
        if (!object) {
            return new Response('Not found', { status: 404 });
        }

        const buffer = await object.arrayBuffer();
        const contentType = object.httpMetadata?.contentType || 'image/png';

        return new Response(buffer, {
            headers: {
                'content-type': contentType,
                'cache-control': 'public, max-age=31536000'
            }
        });
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}
