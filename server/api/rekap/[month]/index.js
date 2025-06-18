export default defineEventHandler(async (event) => {
  const { month } = event.context.params

  try {
    const response = await $fetch(`${process.env.ENDPOINT}/rekap/${month}`)

    if (response && response.data) {
      return {
        success: true,
        data: response.data,
        message: response.message || 'Data fetched successfully'
      }
    } else {
      return {
        success: false,
        message: 'No data received from the server'
      }
    }
  } catch (error) {
    console.error('Fetch error:', error)
    return {
      success: false,
      message: 'Failed to fetch data',
      error: error.message
    }
  }
})
