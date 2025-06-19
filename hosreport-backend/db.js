// db.js
const mysql = require('mysql2')

// สร้างการเชื่อมต่อกับฐานข้อมูล HOSxP
const connection = mysql.createConnection({
  host: '127.0.0.1',  // Host ที่อยู่เครื่อง server
  user: 'dragonit',       // user 
  password: 'pswh11112',       // ← ใส่รหัสผ่านของ MySQL
  database: 'hos',    // ← เปลี่ยนตามชื่อฐานข้อมูล
  port: 3306,       // port MYSQL 
  charset: 'utf8' //  แสดงภาษาไทย
})

// ทดสอบการเชื่อมต่อ
connection.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack)
    return
  }
  console.log('✅ Connected to MySQL database (db.js)')
})

module.exports = connection
