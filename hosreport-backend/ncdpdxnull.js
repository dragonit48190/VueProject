const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูล RE_ADMIT
router.get('/ncdpdxnull', (req, res) => {
  const { date1, date2 } = req.query;
  
  // ตรวจสอบว่ามีข้อมูลวันที่ครบถ้วนหรือไม่
  if (!date1 || !date2) {
    return res.status(400).json({ error: 'กรุณาระบุช่วงวันที่ให้ครบถ้วน' });
  }
  
  const sql = `
  SELECT 
    o.hn,
    p.cid,
    CONCAT(p.pname, p.fname, ' ', p.lname) as ptname,
    CONCAT(DATE_FORMAT(o.vstdate, '%d-%m-'), YEAR(o.vstdate) + 543) AS vstdate,
    o.vsttime,
    pt.name as pttype,
    v.pdx as icd,
    os.cc,
    FORMAT(v.income,0) as income,
    k.department
FROM ovst o 
LEFT JOIN vn_stat v ON v.vn = o.vn
LEFT JOIN opdscreen os ON o.vn = os.vn
LEFT JOIN patient p ON p.hn = o.hn 
LEFT JOIN kskdepartment k ON o.main_dep = k.depcode
LEFT JOIN pttype pt ON o.pttype = pt.pttype 
WHERE o.vstdate BETWEEN ? AND ? 
    AND LENGTH(v.pdx) < 3
    AND os.cc IS NOT NULL 
    AND TRIM(os.cc) != ''
    AND o.main_dep = 074  
ORDER BY o.vstdate, o.vsttime;
  `;

  db.query('SET NAMES utf8', () => {
    db.query(sql, [date1, date2], (err, results) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ error: 'Query Failed' });
      }
      
      // ปกปิดข้อมูล CID ก่อนส่งกลับไปยัง frontend
      const maskedResults = results.map(row => {
        // สร้าง object ใหม่เพื่อไม่แก้ไขข้อมูลต้นฉบับ
        const maskedRow = {...row};
        
        // ปกปิด CID
        if (maskedRow.cid && maskedRow.cid.toString().length === 13) {
          const cidStr = maskedRow.cid.toString();
          maskedRow.cid = cidStr.substring(0, 3) + 'xxxxxxxx' + cidStr.substring(11);
        }
        
        return maskedRow;
      });
      
      res.json(maskedResults); // ส่งข้อมูลที่ปกปิดแล้ว
    });
  });
});

module.exports = router;