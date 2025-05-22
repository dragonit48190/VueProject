const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูล RE_ADMIT
router.get('/readmitold', (req, res) => {
  const { date1, date2 } = req.query;
  
  // ตรวจสอบว่ามีข้อมูลวันที่ครบถ้วนหรือไม่
  if (!date1 || !date2) {
    return res.status(400).json({ error: 'กรุณาระบุช่วงวันที่ให้ครบถ้วน' });
  }
  
  const sql = `
  SELECT 
    a.hn,
    CONCAT(p.pname, p.fname, '  ', p.lname) as ptname,
    a.age_y as age,
    -- ครั้งแรก
    b.an as first_an,
    b.pdx as first_pdx,
    i2.name as first_diagnosis,
    CONCAT(DATE_FORMAT(b.regdate, '%d-%m-'), YEAR(b.regdate) + 543) AS first_admit,
    CONCAT(DATE_FORMAT(b.dchdate, '%d-%m-'), YEAR(b.dchdate) + 543) AS first_discharge,
    -- Re-admit
    a.an as readmit_an,
    a.pdx as readmit_pdx,
    i.name as readmit_diagnosis,
    CONCAT(DATE_FORMAT(a.regdate, '%d-%m-'), YEAR(a.regdate) + 543) AS readmit_date,
    -- จำนวนวันระหว่าง
    (TO_DAYS(a.regdate) - TO_DAYS(b.dchdate)) as days,
    d.name as discharge_status
FROM an_stat a
LEFT OUTER JOIN an_stat b ON a.hn = b.hn AND a.an > b.an and a.pdx = b.pdx
LEFT OUTER JOIN patient p ON a.hn = p.hn
LEFT OUTER JOIN icd101 i ON a.pdx = i.code
LEFT OUTER JOIN icd101 i2 ON b.pdx = i2.code
LEFT OUTER JOIN ipt ip ON ip.an = a.an
LEFT OUTER JOIN dchtype d ON ip.dchtype = d.dchtype
WHERE a.dchdate BETWEEN ? AND ?
    AND (TO_DAYS(a.regdate) - TO_DAYS(b.dchdate)) BETWEEN 1 AND 28
    AND b.dchdate IS NOT NULL
GROUP BY a.hn
ORDER BY days, a.hn
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