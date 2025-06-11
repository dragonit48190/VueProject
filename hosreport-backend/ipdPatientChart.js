// ipdPatientChart.js
const express = require('express')
const db = require('./db')

const router = express.Router()

// 🔥 GET /api/ipd-patient-chart/monthly-statistics - ดึงสถิติผู้ป่วยในรายเดือน
router.get('/monthly-statistics', (req, res) => {
  try {
    // SQL Query ตามที่คุณให้มา
    const query = `
      SELECT 
        MONTH(regdate) AS month,
        COUNT(*) AS total
      FROM an_stat
      WHERE regdate BETWEEN '2024-10-01' AND '2025-09-30'
      GROUP BY MONTH(regdate)
      ORDER BY 
        CASE 
          WHEN MONTH(regdate) >= 10 THEN MONTH(regdate)
          ELSE MONTH(regdate) + 12
        END
    `

    db.query(query, (err, results) => {
      if (err) {
        console.error('IPD Patient Monthly Database error:', err)
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในฐานข้อมูล'
        })
      }

      // แปลงหมายเลขเดือนเป็นชื่อเดือนภาษาไทย (ปรับจาก OPD)
      const monthNames = {
        10: 'ตุลาคม', 11: 'พฤศจิกายน', 12: 'ธันวาคม',
        1: 'มกราคม', 2: 'กุมภาพันธ์', 3: 'มีนาคม',
        4: 'เมษายน', 5: 'พฤษภาคม', 6: 'มิถุนายน',
        7: 'กรกฎาคม', 8: 'สิงหาคม', 9: 'กันยายน'
      }

      const labels = []
      const totalAdmits = []  // จำนวนครั้ง Admit รายเดือน

      // วนลูปประมวลผลข้อมูล (ปรับจาก OPD)
      results.forEach(row => {
        const monthNumber = parseInt(row.month)
        labels.push(monthNames[monthNumber] || 'ไม่ระบุ')
        totalAdmits.push(parseInt(row.total))
      })

      // คำนวณสรุปข้อมูล
      const totalAllAdmits = totalAdmits.reduce((sum, val) => sum + val, 0)

      // หาค่าสูงสุดและต่ำสุด
      const maxAdmitIndex = totalAdmits.indexOf(Math.max(...totalAdmits))
      const minAdmitIndex = totalAdmits.indexOf(Math.min(...totalAdmits))

      // สร้างข้อมูลรายเดือน
      const monthlyDetails = labels.map((month, index) => ({
        month: month,
        admits: totalAdmits[index]
      }))

      // ส่งข้อมูลในรูปแบบเดียวกับ OPD
      res.json({
        success: true,
        data: {
          // ข้อมูลสำหรับ Chart (ปรับจาก OPD)
          labels: labels,
          totalAdmits: totalAdmits,
          
          // ข้อมูลสรุปสำหรับ Sidebar
          summary: {
            totalAllAdmits: totalAllAdmits,
            maxMonth: {
              month: labels[maxAdmitIndex],
              admits: totalAdmits[maxAdmitIndex]
            },
            minMonth: {
              month: labels[minAdmitIndex],
              admits: totalAdmits[minAdmitIndex]
            }
          },
          
          // ข้อมูลรายเดือนทั้งหมด
          monthlyDetails: monthlyDetails
        }
      })
    })

  } catch (error) {
    console.error('IPD Patient Monthly error:', error)
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ'
    })
  }
})

module.exports = router