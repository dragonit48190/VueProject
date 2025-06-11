// patientChart.js
const express = require('express')
const db = require('./db')

const router = express.Router()

// 🔥 GET /api/patient-chart/opd-statistics - ดึงสถิติผู้ป่วยนอกรายเดือน
router.get('/opd-statistics', (req, res) => {
  try {
    // SQL Query ตาม PHP เดิม
    const query = `
      SELECT 
        MONTH(vstdate) AS monthNumber,
        COUNT(DISTINCT hn) AS totalPt,
        COUNT(*) AS totalVisit
      FROM ovst 
      WHERE vstdate BETWEEN '2024-10-01' AND '2025-09-30'
      GROUP BY MONTH(vstdate)
      ORDER BY 
        CASE 
          WHEN MONTH(vstdate) >= 10 THEN MONTH(vstdate) 
          ELSE MONTH(vstdate) + 12 
        END
    `

    db.query(query, (err, results) => {
      if (err) {
        console.error('OPD Statistics Database error:', err)
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในฐานข้อมูล'
        })
      }

      // แปลงหมายเลขเดือนเป็นชื่อเดือนภาษาไทย (ตาม PHP เดิม)
      const monthNames = {
        10: 'ตุลาคม', 11: 'พฤศจิกายน', 12: 'ธันวาคม',
        1: 'มกราคม', 2: 'กุมภาพันธ์', 3: 'มีนาคม',
        4: 'เมษายน', 5: 'พฤษภาคม', 6: 'มิถุนายน',
        7: 'กรกฎาคม', 8: 'สิงหาคม', 9: 'กันยายน'
      }

      const labels = []
      const totalPatients = []
      const totalVisits = []

      // วนลูปประมวลผลข้อมูล (ตาม PHP เดิม)
      results.forEach(row => {
        const monthNumber = parseInt(row.monthNumber)
        labels.push(monthNames[monthNumber] || 'ไม่ระบุ')
        totalPatients.push(parseInt(row.totalPt))
        totalVisits.push(parseInt(row.totalVisit))
      })

      // คำนวณสรุปข้อมูล
      const totalAllVisits = totalVisits.reduce((sum, val) => sum + val, 0)
      const totalAllPatients = totalPatients.reduce((sum, val) => sum + val, 0)

      // หาค่าสูงสุดและต่ำสุด
      const maxVisitIndex = totalVisits.indexOf(Math.max(...totalVisits))
      const minVisitIndex = totalVisits.indexOf(Math.min(...totalVisits))

      // สร้างข้อมูลรายเดือน
      const monthlyDetails = labels.map((month, index) => ({
        month: month,
        patients: totalPatients[index],
        visits: totalVisits[index]
      }))

      // ส่งข้อมูลในรูปแบบที่ Frontend ต้องการ (ตาม PHP เดิม)
      res.json({
        success: true,
        data: {
          // ข้อมูลสำหรับ Highcharts (ตาม PHP เดิม)
          labels: labels,
          totalPatients: totalPatients,
          totalVisits: totalVisits,
          
          // ข้อมูลสรุปสำหรับ Sidebar
          summary: {
            totalAllVisits: totalAllVisits,
            totalAllPatients: totalAllPatients,
            maxMonth: {
              month: labels[maxVisitIndex],
              patients: totalPatients[maxVisitIndex],
              visits: totalVisits[maxVisitIndex]
            },
            minMonth: {
              month: labels[minVisitIndex],
              patients: totalPatients[minVisitIndex],
              visits: totalVisits[minVisitIndex]
            }
          },
          
          // ข้อมูลรายเดือนทั้งหมด
          monthlyDetails: monthlyDetails
        }
      })
    })

  } catch (error) {
    console.error('OPD Statistics error:', error)
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ'
    })
  }
})

// ลบส่วน dashboard-stats ออกแล้ว - ใช้ API เดิมที่มีอยู่

// 🔥 GET /api/patient-chart/yearly-comparison/:year - เปรียบเทียบข้อมูลรายปี (เพิ่มเติม)
router.get('/yearly-comparison/:year', (req, res) => {
  try {
    const year = req.params.year || '2568'
    
    // สามารถเพิ่ม logic เปรียบเทียบปีต่างๆ ได้ในอนาคต
    const currentYearStart = year === '2568' ? '2024-10-01' : `${parseInt(year) + 543 - 1}-10-01`
    const currentYearEnd = year === '2568' ? '2025-09-30' : `${parseInt(year) + 543}-09-30`
    
    const query = `
      SELECT 
        YEAR(vstdate) as year,
        MONTH(vstdate) AS monthNumber,
        COUNT(DISTINCT hn) AS totalPt,
        COUNT(*) AS totalVisit
      FROM ovst 
      WHERE vstdate BETWEEN ? AND ?
      GROUP BY YEAR(vstdate), MONTH(vstdate)
      ORDER BY year, 
        CASE 
          WHEN MONTH(vstdate) >= 10 THEN MONTH(vstdate) 
          ELSE MONTH(vstdate) + 12 
        END
    `

    db.query(query, [currentYearStart, currentYearEnd], (err, results) => {
      if (err) {
        console.error('Yearly comparison error:', err)
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในฐานข้อมูล'
        })
      }

      res.json({
        success: true,
        data: results,
        year: year
      })
    })

  } catch (error) {
    console.error('Yearly comparison error:', error)
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ'
    })
  }
})

module.exports = router