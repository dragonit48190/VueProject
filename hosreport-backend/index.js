const express = require('express')
const cors = require('cors')        //  เพิ่มส่วนนี้
const app = express()
const port = 5000

const db = require('./db')          //  ดึงการเชื่อมต่อที่แยกไว้

app.use(cors())                     //  เปิดใช้งาน CORS
app.use(express.json())             //  อ่าน JSON body

// API ดึงข้อมูล SQL Visit HOSxP
app.get('/api/authen', (req, res) => {
  const sql = `
    SELECT COUNT(*) AS total_visit_today
    FROM ovst
    WHERE vstdate = CURDATE()
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB query failed' })
    res.json({ total_visit_today: results[0].total_visit_today })
  })
})

app.get('/api/notauthen', (req, res) => {
  const sql = `
    SELECT COUNT(*) AS visit FROM visit_pttype v
    LEFT JOIN ovst o ON v.vn = o.vn 
    WHERE o.vstdate = CURDATE()
      AND v.auth_code IS NULL
      AND o.pttype NOT IN ('18','41','42')
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB query failed' })
    res.json({ notauthen: results[0].visit })
  })
})

app.get('/api/authened', (req, res) => {
  const sql = `
    SELECT COUNT(*) AS visit FROM visit_pttype v
    LEFT JOIN ovst o ON v.vn = o.vn 
    WHERE o.vstdate = CURDATE()
      AND v.auth_code IS NOT NULL
      AND o.pttype NOT IN ('18','41','42')
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB query failed' })
    res.json({ authened: results[0].visit })
  })
})






// เริ่มต้น Server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`)
})
