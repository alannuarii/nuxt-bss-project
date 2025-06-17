export default defineEventHandler(async (event) => {
    try {
        const { date } = event.context.params;

        if (!date) {
            return {
                success: false,
                message: 'Date parameter is missing'
            };
        }

        const response = await $fetch(`http://10.10.10.100:5010/optimization/${date}`);

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
