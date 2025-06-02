const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูลสรุปตาม pttype
router.get('/pttypesum', (req, res) => {
  const { date1, date2 } = req.query;
  
  // ตรวจสอบว่ามีข้อมูลวันที่ครบถ้วนหรือไม่
  if (!date1 || !date2) {
    return res.status(400).json({ 
      success: false,
      error: 'กรุณาระบุช่วงวันที่ให้ครบถ้วน (date1 และ date2)' 
    });
  }
  
  const sql = `
    SELECT 
      v.pttype,
      pt.name as pttype_name,
      SUM(ROUND(v.income, 2)) as income,
      COUNT(DISTINCT v.vn) as visit
    FROM vn_stat v 
    LEFT JOIN pttype pt ON v.pttype = pt.pttype
    WHERE v.vstdate BETWEEN ? AND ?
    GROUP BY v.pttype, pt.name
    ORDER BY COUNT(DISTINCT v.vn) DESC
  `;

  db.query('SET NAMES utf8', () => {
    db.query(sql, [date1, date2], (err, results) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' 
        });
      }
      
      // เพิ่มลำดับให้ข้อมูล
      const resultsWithSequence = results.map((row, index) => ({
        ...row,
        sequence: index + 1
      }));
      
      res.json({
        success: true,
        count: resultsWithSequence.length,
        data: resultsWithSequence
      });
    });
  });
});

module.exports = router;