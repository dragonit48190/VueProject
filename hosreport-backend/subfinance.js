const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูลผู้ป่วยเบาหวานรายใหม่
router.get('/subfinance', (req, res) => {
    const { date1, date2, pttype } = req.query; // เพิ่ม pttype
    
    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    if (!date1 || !date2 || !pttype) {
      return res.status(400).json({ 
        success: false,
        error: 'กรุณาระบุช่วงวันที่และสิทธิให้ครบถ้วน (date1, date2, pttype)' 
      });
    }
  const sql = `
  SELECT
  p.hn,
  p.cid,
  CONCAT(p.pname, p.fname, '  ', p.lname) AS ptname,
  v.age_y as age,
  CONCAT(DATE_FORMAT(v.vstdate, '%d-%m-'), YEAR(v.vstdate) + 543) AS vstdate,
  v.pdx as icd,
  pt.name as pttype_name,
  v.income
FROM
  vn_stat v
  LEFT JOIN opitemrece oi ON v.vn = oi.vn
  LEFT JOIN pttype pt ON v.pttype = pt.pttype
  LEFT JOIN patient p ON v.hn = p.hn
WHERE
  v.vstdate BETWEEN ? and ? AND v.pttype = ?
  AND oi.finance_number IS NULL
  AND v.pttype IN ('10', '11', '13', '21', '22', '24', '27', '31', '34', '36', '41', '42', '44')
  AND oi.sum_price != '0'
GROUP BY
  v.vn
ORDER BY
  v.vstdate
  `;
  db.query('SET NAMES utf8', () => {
    // เปลี่ยนเป็น 3 parameters: date1, date2, pttype
    db.query(sql, [date1, date2, pttype], (err, results) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' 
        });
      }
      
      // ปกปิดข้อมูล CID เพื่อความปลอดภัย
      const maskedResults = results.map((row, index) => {
        const maskedRow = { ...row };
        
        // เพิ่มลำดับ
        maskedRow.sequence = index + 1;
        
        // ปกปิด CID (แสดงเฉพาะ 3 หลักแรกและ 2 หลักสุดท้าย)
        if (maskedRow.cid && maskedRow.cid.toString().length === 13) {
          const cidStr = maskedRow.cid.toString();
          maskedRow.cid = cidStr.substring(0, 3) + 'xxxxxxxx' + cidStr.substring(11);
        }
        
        return maskedRow;
      });
      
      res.json({
        success: true,
        count: maskedResults.length,
        data: maskedResults
      });
    });
});
  });

module.exports = router;