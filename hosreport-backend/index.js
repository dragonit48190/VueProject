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

app.get('/api/opd', (req, res) => {
  const sql = `
    SELECT COUNT(*) AS visit 
    FROM ovst 
    WHERE vstdate = CURDATE() 
      AND main_dep = '010'
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB query failed' })
    res.json({ opd: results[0].visit })
  })
})

app.get('/api/dent', (req, res) => {
  const sql = `
  SELECT COUNT(*) AS visit
  FROM vn_stat v
  LEFT JOIN ovst o ON v.vn = o.vn
  WHERE v.vstdate = CURDATE()
  AND v.vn IN (SELECT vn FROM dtmain WHERE vstdate = CURDATE())
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB query failed' })
    res.json({ dent: results[0].visit })
  })
})

app.get('/api/er', (req, res) => {
  const sql = `
  SELECT COUNT(*) AS visit FROM er_regist WHERE vstdate = CURDATE()
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB query failed' })
    res.json({ er: results[0].visit })
  })
})

app.get('/api/stroke', (req, res) => {
  const { date1, date2 } = req.query

  if (!date1 || !date2) {
    return res.status(400).json({ error: 'กรุณาระบุ date1 และ date2' })
  }

  const sql = `
    SELECT o.vn, o.vstdate, CONCAT(p.pname, p.fname, ' ', p.lname) AS fullname,
           o.hn, o.main_dep, d.icd10
    FROM ovstdiag d
    JOIN ovst o ON o.vn = d.vn
    JOIN patient p ON p.hn = o.hn
    WHERE d.icd10 = 'I64'
      AND o.vstdate BETWEEN ? AND ?
    ORDER BY o.vstdate DESC
  `

  db.query(sql, [date1, date2], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB query failed' })
    res.json(results)
  })
})


// เริ่มต้น Server
app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`)
})
