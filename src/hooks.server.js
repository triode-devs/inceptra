import { dev } from '$app/environment';

let platformProxy;

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
    if (dev) {
        if (!platformProxy) {
            try {
                const { getPlatformProxy } = await import('wrangler');
                // We can pass options here if we want to support remote or specific persistence
                platformProxy = await getPlatformProxy();
            } catch (e) {
                console.error('Failed to initialize Cloudflare platform proxy:', e);
            }
        }

        if (platformProxy) {
            event.platform = platformProxy;
        }
    }

    return resolve(event);
};
