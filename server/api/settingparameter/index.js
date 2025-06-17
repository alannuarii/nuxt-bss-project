export default defineEventHandler(async (event) => {
    try {
        const response = await $fetch('http://10.10.10.100:5010/settingparameter');

        // Jika response sukses dan memiliki data
        if (response && response.data) {
            return {
                success: true,
                data: response.data,
                message: response.message || 'Data fetched successfully'
            };
        } else {
            return {
                success: false,
                message: 'No data received from the server'
            };
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return {
            success: false,
            message: 'Failed to fetch data',
            error: error.message
        };
    }
});
