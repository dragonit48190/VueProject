const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูลผู้ป่วยเบาหวานรายใหม่
router.get('/newcopd', (req, res) => {
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
      o.hn,
      p.cid,
      CONCAT(p.pname, p.fname, ' ', p.lname) AS ptname,
      TIMESTAMPDIFF(YEAR, p.birthday, DATE(NOW())) AS age,
      CONCAT(DATE_FORMAT(MIN(o.vstdate), '%d-%m-'), YEAR(MIN(o.vstdate)) + 543) AS vstdate,
      o.icd10 AS icd,
      i.name AS icdname,
      p.addrpart AS num,
      p.moopart AS moo,
      t.name AS tum,
      CASE
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '01' THEN 'รพ.โพนสวรรค์'
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '02' 
             AND (p.moopart + 0) IN (2, 3, 4, 7, 8, 9, 10) THEN 'รพ.สต.นาหัวบ่อ'
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '02' 
             AND (p.moopart + 0) IN (1, 5, 6) THEN 'รพ.สต.โพนตูม'
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '03' 
             AND (p.moopart + 0) IN (1, 3, 4, 6, 8, 10, 11, 12, 15, 16) THEN 'รพ.สต.ขามเตี้ยใหญ่'
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '03' 
             AND (p.moopart + 0) IN (2, 5, 7, 9, 13, 14) THEN 'รพ.สต.ดอนยาง'
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '04' THEN 'รพ.สต.โพนบก'
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' 
             AND (p.moopart + 0) IN (1, 2, 13, 15, 18) THEN 'รพ.สต.บ้านค้อ'
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' 
             AND (p.moopart + 0) IN (6, 7, 8, 9, 10, 12, 19, 20) THEN 'รพ.สต.ขว้างคลี'
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' 
             AND (p.moopart + 0) IN (3, 4, 5, 11, 14, 16, 17) THEN 'รพ.สต.ห้วยไห'
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '06' 
             AND (p.moopart + 0) IN (4, 6, 7, 9, 12) THEN 'รพ.สต.บ้านต้าย'
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '06' 
             AND (p.moopart + 0) IN (1, 2, 3, 5, 8, 10, 11) THEN 'รพ.สต.โพนจาน'
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '07' THEN 'รพ.สต.นาใน'
        ELSE 'นอกเขต'
      END AS hospital
    FROM ovstdiag o
    INNER JOIN patient p ON o.hn = p.hn
    INNER JOIN thaiaddress t ON p.chwpart = t.chwpart 
      AND p.amppart = t.amppart 
      AND p.tmbpart = t.tmbpart 
      AND t.codetype = '3'
    INNER JOIN icd101 i ON o.icd10 = i.code
    WHERE o.icd10 BETWEEN 'J44' AND 'J449'
      AND o.vstdate BETWEEN ? AND ?
      AND NOT EXISTS (
        SELECT 1 
        FROM ovstdiag prev 
        WHERE prev.hn = o.hn 
          AND prev.icd10 BETWEEN 'J44' AND 'J449'
          AND prev.vstdate < ?
      )
    GROUP BY o.hn, p.cid, p.pname, p.fname, p.lname, p.birthday, 
             o.icd10, i.name, p.addrpart, p.moopart, t.name
    ORDER BY MIN(o.vstdate), o.hn
  `;

  db.query('SET NAMES utf8', () => {
    // ส่งพารามิเตอร์ 3 ตัว: date1, date2, date1 (สำหรับ NOT EXISTS)
    db.query(sql, [date1, date2, date1], (err, results) => {
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