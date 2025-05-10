// db.js
const mysql = require('mysql2')

// สร้างการเชื่อมต่อกับ HOSxP
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'dragonit',
  password: 'pswh11112',       // ← ใส่รหัสผ่านของ MySQL ถ้ามี
  database: 'his'     // ← เปลี่ยนตามชื่อฐาน HOSxP ของคุณ
})

// ทดสอบการเชื่อมต่อทันที
connection.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack)
    return
  }
  console.log('✅ Connected to MySQL database (db.js)')
})

module.exports = connection
