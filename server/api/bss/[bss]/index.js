import { pool } from '~/server/lib/db/mariadb'

async function getBms(bss) {
  let query = ''

  if (bss === 'bss1') {
    query = `
      SELECT b.* 
      FROM battery AS b 
      INNER JOIN (
        SELECT id_bms, MAX(waktu) AS latest_waktu 
        FROM battery 
        WHERE id_bms < 89 
        GROUP BY id_bms
      ) AS latest 
      ON b.id_bms = latest.id_bms AND b.waktu = latest.latest_waktu 
      ORDER BY b.id_bms ASC
    `
  } else if (bss === 'bss2') {
    query = `
      SELECT b.* 
      FROM battery AS b 
      INNER JOIN (
        SELECT id_bms, MAX(waktu) AS latest_waktu 
        FROM battery 
        WHERE id_bms > 88 
        GROUP BY id_bms
      ) AS latest 
      ON b.id_bms = latest.id_bms AND b.waktu = latest.latest_waktu 
      ORDER BY b.id_bms ASC
    `
  } else {
    return []
  }

  try {
    const [rows] = await pool.query(query)
    return rows
  } catch (err) {
    console.error('Database error:', err)
    return []
  }
}

export default defineEventHandler(async (event) => {
  const { bss } = event.context.params
  const result = await getBms(bss)
  return result
})
