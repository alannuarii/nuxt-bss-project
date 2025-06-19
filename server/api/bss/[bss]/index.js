export default defineEventHandler(async (event) => {
    try {
        const { bss } = event.context.params;

        if (!bss) {
            return {
                success: false,
                message: 'Date parameter is missing'
            };
        }

        const response = await $fetch(`${process.env.ENDPOINT}/getbms/${bss}`);

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
