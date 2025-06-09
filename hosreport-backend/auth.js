// auth.js
const express = require('express')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const db = require('./db')

const router = express.Router()

// JWT Secret (ในการใช้งานจริงควรเก็บใน environment variable)
const JWT_SECRET = 'your-secret-key-here'

// Helper function สำหรับสร้าง MD5 hash
const createMD5Hash = (password) => {
  return crypto.createHash('md5').update(password).digest('hex')
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { loginname, password } = req.body

  // ตรวจสอบว่ามีข้อมูลครบไหม
  if (!loginname || !password) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอก Username และ Password'
    })
  }

  // แปลง password เป็น MD5
  const hashedPassword = createMD5Hash(password)
  console.log('Login attempt:', loginname)
  console.log('Hashed password:', hashedPassword)

  // Query ตรวจสอบ user ในฐานข้อมูล
  const query = `
    SELECT loginname, name, groupname, entryposition 
    FROM opduser 
    WHERE LOWER(loginname) = LOWER(?) AND passweb = ?
    LIMIT 1
  `

  db.query(query, [loginname, hashedPassword], (err, results) => {
    if (err) {
      console.error('Database error:', err)
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในระบบฐานข้อมูล'
      })
    }

    console.log('Query results:', results)

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Username หรือ Password ไม่ถูกต้อง'
      })
    }

    const user = results[0]

    // สร้าง JWT Token
    const token = jwt.sign(
      {
        loginname: user.loginname,
        name: user.name,
        groupname: user.groupname,
        entryposition: user.entryposition
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // ส่งข้อมูล user กลับไป
    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user: {
        loginname: user.loginname,
        name: user.name,
        groupname: user.groupname,
        entryposition: user.entryposition
      },
      token: token
    })
  })
})

// POST /api/auth/verify - ตรวจสอบ Token
router.post('/verify', (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'ไม่พบ Token'
      })
    }

    // ตรวจสอบ JWT Token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Token ไม่ถูกต้องหรือหมดอายุ'
        })
      }

      res.json({
        success: true,
        user: decoded
      })
    })

  } catch (error) {
    console.error('Verify error:', error)
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ'
    })
  }
})

// 🔥 POST /api/auth/profile - ดึงข้อมูลโปรไฟล์เต็ม
router.post('/profile', (req, res) => {
  try {
    const { loginname } = req.body

    if (!loginname) {
      return res.status(400).json({
        success: false,
        message: 'ไม่พบ Username'
      })
    }

    // ดึงข้อมูลโปรไฟล์เต็มจากฐานข้อมูล
    const query = `
      SELECT 
        os.loginname,
        os.NAME,
        os.entryposition,
        os.groupname,
        os.doctorcode,
        p.hometel,
        p.informaddr,
        pm.image
      FROM opduser os
      LEFT JOIN doctor d ON os.doctorcode = d.code 
      LEFT JOIN patient p ON d.cid = p.cid
      LEFT JOIN patient_image pm ON p.hn = pm.hn
      WHERE LOWER(os.loginname) = LOWER(?)
      LIMIT 1
    `

    db.query(query, [loginname], (dbErr, results) => {
      if (dbErr) {
        console.error('Database error:', dbErr)
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในฐานข้อมูล'
        })
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลผู้ใช้'
        })
      }

      const profile = results[0]
      
      // แปลง BLOB image เป็น Base64 (ถ้ามี)
      let imageBase64 = null
      if (profile.image) {
        imageBase64 = `data:image/jpeg;base64,${profile.image.toString('base64')}`
      }

      res.json({
        success: true,
        profile: {
          loginname: profile.loginname,
          name: profile.NAME,
          entryposition: profile.entryposition,
          groupname: profile.groupname,
          doctorcode: profile.doctorcode,
          hometel: profile.hometel,
          informaddr: profile.informaddr,
          image: imageBase64, // Base64 string หรือ null
          hasImage: !!profile.image
        }
      })
    })

  } catch (error) {
    console.error('Profile error:', error)
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ'
    })
  }
})

// 🔥 GET /api/auth/avatar/:loginname - ดึงรูปโปรไฟล์อย่างเดียว
router.get('/avatar/:loginname', (req, res) => {
  try {
    const { loginname } = req.params

    const query = `
      SELECT pm.image
      FROM opduser os
      LEFT JOIN doctor d ON os.doctorcode = d.code 
      LEFT JOIN patient p ON d.cid = p.cid
      LEFT JOIN patient_image pm ON p.hn = pm.hn
      WHERE LOWER(os.loginname) = LOWER(?)
      LIMIT 1
    `

    db.query(query, [loginname], (err, results) => {
      if (err) {
        console.error('Database error:', err)
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในฐานข้อมูล'
        })
      }

      if (results.length === 0 || !results[0].image) {
        // ส่งรูป default ถ้าไม่มีรูป
        return res.json({
          success: true,
          image: null,
          hasImage: false
        })
      }

      const imageBlob = results[0].image
      const imageBase64 = `data:image/jpeg;base64,${imageBlob.toString('base64')}`

      res.json({
        success: true,
        image: imageBase64,
        hasImage: true
      })
    })

  } catch (error) {
    console.error('Avatar error:', error)
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ'
    })
  }
})

module.exports = router