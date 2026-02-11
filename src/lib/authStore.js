import { writable } from 'svelte/store';
import { auth, onAuthStateChanged } from './firebase';

export const user = writable(null);
export const authLoaded = writable(false);

if (typeof window !== 'undefined') {
    onAuthStateChanged(auth, (u) => {
        user.set(u);
        authLoaded.set(true);
    });
}
