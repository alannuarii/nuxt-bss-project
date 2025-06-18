export default defineNuxtRouteMiddleware((to) => {
    const token = useCookie('accessToken');

    if (!token.value && !to.path.startsWith('/auth')) {
        return navigateTo('/auth/login');
    }
});
