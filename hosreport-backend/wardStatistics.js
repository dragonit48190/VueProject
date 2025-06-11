// wardStatistics.js
const express = require('express')
const db = require('./db')

const router = express.Router()

// 🔥 GET /api/ward-statistics/current-admits - ดึงสถิติ Ward ปัจจุบัน
router.get('/current-admits', (req, res) => {
  try {
    // SQL Queries ตาม PHP เดิม (แต่ละ Ward แยกกัน)
    const queries = {
      // 1. Admit LR (Labor Room) - Ward 02
      admit_lr: `
        SELECT COUNT(*) as visit 
        FROM an_stat 
        WHERE ward = '02' AND dchdate IS NULL
      `,
      
      // 2. Admit WARD1 (ตึกล่าง) - Ward 01
      admit_ward1: `
        SELECT COUNT(*) as visit 
        FROM an_stat 
        WHERE ward = '01' AND dchdate IS NULL
      `,
      
      // 3. Admit Mini (มินิธัญญารักษ์) - Ward 09
      admit_mini: `
        SELECT COUNT(*) as visit 
        FROM an_stat 
        WHERE ward = '09' AND dchdate IS NULL
      `,
      
      // 4. Admit WARD2 - Ward 05
      admit_ward2: `
        SELECT COUNT(*) as visit 
        FROM an_stat 
        WHERE ward = '05' AND dchdate IS NULL
      `,
      
      // 5. Admit HOME WARD - Ward 08
      admit_home: `
        SELECT COUNT(*) as visit 
        FROM an_stat 
        WHERE ward = '08' AND dchdate IS NULL
      `,
      
      // 6. Admit HOME WARD DRUG (ยาเสพติด) - Ward 11
      admit_drug: `
        SELECT COUNT(*) as visit 
        FROM an_stat 
        WHERE ward = '11' AND dchdate IS NULL
      `
    }

    // สร้าง Promise สำหรับ query ทั้งหมด (เหมือนวิธีใน dashboard-stats)
    const queryPromises = Object.entries(queries).map(([key, sql]) => {
      return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
          if (err) reject(err)
          else resolve({ key, count: results[0]?.visit || 0 })
        })
      })
    })

    Promise.all(queryPromises)
      .then(results => {
        // ประมวลผลข้อมูล
        const wardData = {}
        results.forEach(({ key, count }) => {
          wardData[key] = parseInt(count)
        })

        // คำนวณสรุปข้อมูล
        const totalAdmits = Object.values(wardData).reduce((sum, val) => sum + val, 0)

        // ส่งข้อมูลในรูปแบบที่ Frontend ต้องการ
        res.json({
          success: true,
          data: {
            // ข้อมูลแต่ละ Ward (ตาม PHP เดิม)
            admit_lr: wardData.admit_lr,
            admit_ward1: wardData.admit_ward1,
            admit_mini: wardData.admit_mini,
            admit_ward2: wardData.admit_ward2,
            admit_home: wardData.admit_home,
            admit_drug: wardData.admit_drug,
            
            // ข้อมูลสรุป
            summary: {
              totalAdmits: totalAdmits,
              wardCount: 6
            },
            
            // ข้อมูลรายละเอียดสำหรับ Cards
            wardDetails: [
              {
                id: 'admit_lr',
                name: 'Admit LR',
                description: 'LR',
                count: wardData.admit_lr,
                color: 'purple',
                icon: 'bx-smile'
              },
              {
                id: 'admit_ward1',
                name: 'Admit WARD ล่าง',
                description: 'Admit WARD 1',
                count: wardData.admit_ward1,
                color: 'dark',
                icon: 'bx-bed'
              },
              {
                id: 'admit_mini',
                name: 'มินิธัญญารักษ์',
                description: 'Admit มินิธัญญารักษ์',
                count: wardData.admit_mini,
                color: 'success',
                icon: 'bx-user'
              },
              {
                id: 'admit_ward2',
                name: 'Admit WARD 2',
                description: 'Admit WARD บน',
                count: wardData.admit_ward2,
                color: 'info',
                icon: 'bx-plus'
              },
              {
                id: 'admit_home',
                name: 'Admit HOME WARD',
                description: 'จำนวน HOME WARD',
                count: wardData.admit_home,
                color: 'primary',
                icon: 'bx-home'
              },
              {
                id: 'admit_drug',
                name: 'HOME WARD ยาเสพติด',
                description: 'HOME WARD ยาเสพติด',
                count: wardData.admit_drug,
                color: 'warning',
                icon: 'bx-transfer'
              }
            ]
          }
        })
      })
      .catch(err => {
        console.error('Ward Statistics error:', err)
        res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในฐานข้อมูล'
        })
      })

  } catch (error) {
    console.error('Ward Statistics error:', error)
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ'
    })
  }
})

module.exports = router