// server/api/auth/login.js
export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const formData = new FormData();
    formData.set('email', body.email);
    formData.set('password', body.password);

    try {
        const res = await fetch(`${process.env.API_AUTH}/api/login`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            return { error: 'Login gagal. Silakan coba lagi.' };
        }

        const result = await res.json();

        if (result.access_token) {
            setCookie(event, 'accessToken', result.access_token, {
                path: '/',
                sameSite: 'strict',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24
            });

            return { success: true };
        }

        return { error: result.message || 'Token tidak ditemukan.' };
    } catch (err) {
        console.error('Login error:', err);
        return { error: 'Terjadi kesalahan saat login.' };
    }
});
