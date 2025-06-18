import { deleteCookie } from 'h3'

export default defineEventHandler((event) => {
    deleteCookie(event, 'accessToken', { path: '/' })
    return {
        success: true,
        message: 'Logged out'
    }
})
