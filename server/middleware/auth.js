import { getCookie, sendRedirect, deleteCookie, getRequestURL } from 'h3';

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'accessToken');
    const pathname = getRequestURL(event).pathname;

    const isAuthPage = pathname.startsWith('/auth');
    const isApiAuth = pathname.startsWith('/api/auth');

    if (isApiAuth) return; // Biarkan endpoint API auth lolos

    if (!token && !isAuthPage) {
        // Belum login dan mencoba akses halaman terlindungi
        return sendRedirect(event, '/auth/login', 303);
    }

    if (token) {
        try {
            await $fetch(`${process.env.API_AUTH}/api/verify-token`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });

            // Jika token valid dan akses ke halaman login, redirect ke /
            if (isAuthPage) {
                return sendRedirect(event, '/', 303);
            }
        } catch {
            deleteCookie(event, 'accessToken');
            return sendRedirect(event, '/auth/login', 303);
        }
    }
});
