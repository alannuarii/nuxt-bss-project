import { queryInfluxDB } from '~/server/lib/db/influxdb'

export default defineEventHandler(async (event) => {
    const token = process.env.TOKEN
    const org = process.env.ORG
    const bucket = process.env.BUCKET
    const url = process.env.URL

    const query = `
      from(bucket: "${bucket}")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "weather_station")
        |> filter(fn: (r) => r._field == "Air Temperature" or r._field == "External Temperature" or r._field == "Global Irradiance" or r._field == "Wind Direction" or r._field == "Wind Speed" or r._field == "Relative Humidity")
        |> last()
    `;

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
