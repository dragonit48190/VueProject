const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API endpoint สำหรับดึงข้อมูล NON STEMI I214
router.get('/ipddeath', (req, res) => {
  const { date1, date2 } = req.query;
  
  // ตรวจสอบว่ามีข้อมูลวันที่ครบถ้วนหรือไม่
  if (!date1 || !date2) {
    return res.status(400).json({ error: 'กรุณาระบุช่วงวันที่ให้ครบถ้วน' });
  }
  
  const sql = `
  SELECT 
    a.an,
    p.hn,
    p.cid,
    CONCAT(IFNULL(p.pname,''), IFNULL(p.fname,''), ' ', IFNULL(p.lname,'')) as ptname,
    a.age_y as age,
    a.pdx as icd,
    ic.name as icdname,
    CONCAT(DATE_FORMAT(a.dchdate, '%d-%m-'),YEAR(a.dchdate) + 543) AS vstdate,
    d.name as status,
		p.addrpart as num,p.moopart as moo,t.name as tum,
		CASE
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '01' THEN 'รพ.โพนสวรรค์'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '02' AND (p.moopart+0) IN (2,3,4,7,8,9,10) THEN 'รพ.สต.นาหัวบ่อ'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '02' AND (p.moopart+0) IN (1,5,6) THEN 'รพ.สต.โพนตูม'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '03' AND (p.moopart+0) IN (1,3,4,6,8,10,11,12,15,16) THEN 'รพ.สต.ขามเตี้ยใหญ่'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '03' AND (p.moopart+0) IN (2,5,7,9,13,14) THEN 'รพ.สต.ดอนยาง'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '04' THEN 'รพ.สต.โพนบก'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' AND (p.moopart+0) IN (1,2,13,15,18) THEN 'รพ.สต.บ้านค้อ'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' AND (p.moopart+0) IN (6,7,8,9,10,12,19,20) THEN 'รพ.สต.ขว้างคลี'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' AND (p.moopart+0) IN (3,4,5,11,14,16,17) THEN 'รพ.สต.ห้วยไห'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '06' AND (p.moopart+0) IN (4,6,7,9,12) THEN 'รพ.สต.บ้านต้าย'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '06' AND (p.moopart+0) IN (1,2,3,5,8,10,11) THEN 'รพ.สต.โพนจาน'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '07' THEN 'รพ.สต.นาใน'
  ELSE 'นอกเขต'
END AS hospital
FROM an_stat a
LEFT JOIN ipt i ON a.an = i.an
LEFT JOIN dchtype d ON i.dchtype = d.dchtype
INNER JOIN patient p ON a.hn = p.hn
INNER JOIN icd101 ic ON a.pdx = ic.code
INNER JOIN thaiaddress t ON p.chwpart = t.chwpart 
AND p.amppart = t.amppart 
AND p.tmbpart = t.tmbpart 
AND t.codetype = '3'
WHERE a.dchdate BETWEEN ? AND ?
    AND d.dchtype IN ('08','09')
ORDER BY a.an;
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