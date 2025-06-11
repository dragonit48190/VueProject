// doctorChart.js
const express = require('express')
const db = require('./db')

const router = express.Router()

// 🔥 GET /api/doctor-chart/ipd-doctors - ดึงสถิติ IPD รายแพทย์
router.get('/ipd-doctors', (req, res) => {
  try {
    // SQL Query ตามที่คุณให้มา
    const query = `
      SELECT 
        a.dx_doctor, 
        d.name AS doctor, 
        COUNT(*) AS totalVisit
      FROM an_stat a
      LEFT JOIN doctor d ON a.dx_doctor = d.code
      WHERE a.regdate BETWEEN '2024-10-01' AND '2025-09-30'
      GROUP BY a.dx_doctor
      ORDER BY totalVisit DESC
    `

    db.query(query, (err, results) => {
      if (err) {
        console.error('IPD Doctors Database error:', err)
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในฐานข้อมูล'
        })
      }

      // ประมวลผลข้อมูลสำหรับ Chart
      const labels = []           // ชื่อแพทย์
      const visitCounts = []      // จำนวน Admit
      const doctorDetails = []    // รายละเอียดแพทย์

      results.forEach(row => {
        // แสดงชื่อแพทย์ (ถ้าไม่มีชื่อใช้รหัส)
        const doctorName = row.doctor || `รหัส: ${row.dx_doctor}`
        
        labels.push(doctorName)
        visitCounts.push(parseInt(row.totalVisit))
        
        doctorDetails.push({
          code: row.dx_doctor,
          name: doctorName,
          visits: parseInt(row.totalVisit)
        })
      })

      // คำนวณสรุปข้อมูล
      const totalAllVisits = visitCounts.reduce((sum, val) => sum + val, 0)

      // หาแพทย์ที่มีผู้ป่วยมากที่สุดและน้อยที่สุด
      const maxVisitIndex = visitCounts.indexOf(Math.max(...visitCounts))
      const minVisitIndex = visitCounts.indexOf(Math.min(...visitCounts))

      // ส่งข้อมูลในรูปแบบเดียวกับ OPD
      res.json({
        success: true,
        data: {
          // ข้อมูลสำหรับ Chart
          labels: labels,
          visitCounts: visitCounts,
          
          // ข้อมูลสรุปสำหรับ Sidebar
          summary: {
            totalAllVisits: totalAllVisits,
            totalDoctors: results.length,
            maxDoctor: {
              name: labels[maxVisitIndex],
              visits: visitCounts[maxVisitIndex]
            },
            minDoctor: {
              name: labels[minVisitIndex],
              visits: visitCounts[minVisitIndex]
            }
          },
          
          // ข้อมูลรายแพทย์ทั้งหมด
          doctorDetails: doctorDetails
        }
      })
    })

  } catch (error) {
    console.error('IPD Doctors error:', error)
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ'
    })
  }
})

// 🔥 สามารถเพิ่ม endpoints อื่นๆ สำหรับแพทย์ได้ในอนาคต
// เช่น /api/doctor-chart/opd-doctors, /api/doctor-chart/specialties

module.exports = router