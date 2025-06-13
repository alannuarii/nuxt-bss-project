import { queryInfluxDB } from '~/server/lib/db/influxdb'

export default defineEventHandler(async (event) => {
  const token = process.env.TOKEN
  const org = process.env.ORG
  const bucket = process.env.BUCKET
  const url = process.env.URL

  // Tangkap parameter dari URL
  const { powermeter } = event.context.params

  const query = `
    from(bucket: "${bucket}")
      |> range(start: -1m)
      |> filter(fn: (r) => r._measurement == "${powermeter}")
      |> filter(fn: (r) => r._field == "Active Power" or r._field == "Reactive Power" or r._field == "Voltage" or r._field == "Current" or r._field == "Power Factor" or r._field == "Frequency")
      |> last()
  `

  try {
    const result = await queryInfluxDB(token, org, url, query)
    return {
      status: 200,
      data: result
    }
  } catch (error) {
    console.error('Caught error:', error)
    setResponseStatus(event, 500)
    return { error: error.message }
  }
})
