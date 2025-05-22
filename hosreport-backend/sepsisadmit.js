const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API endpoint สำหรับดึงข้อมูล NON STEMI I214
router.get('/sepsisadmit', (req, res) => {
  const { date1, date2 } = req.query;
  
  // ตรวจสอบว่ามีข้อมูลวันที่ครบถ้วนหรือไม่
  if (!date1 || !date2) {
    return res.status(400).json({ error: 'กรุณาระบุช่วงวันที่ให้ครบถ้วน' });
  }
  
  const sql = `
  SELECT a.an,p.hn,CONCAT(p.pname,p.fname,'  ',p.lname) as ptname,a.age_y as age
,CONCAT(DATE_FORMAT(a.regdate, '%d-%m-'), YEAR(a.regdate) + 543) AS regdate
,CONCAT(DATE_FORMAT(a.dchdate, '%d-%m-'), YEAR(a.dchdate) + 543) AS dchdate
,a.admdate,id.icd10 as icd,i.name as icdname,pt.name as pttype,FORMAT(a.income,0) AS income
,p.addrpart as num,p.moopart as moo,t.name as tum
FROM an_stat a
left join iptdiag id on a.an = id.an
left join icd101 i on id.icd10 = i.code
left join pttype pt on a.pttype = pt.pttype
left join patient p on a.hn = p.hn
left join thaiaddress t on p.chwpart=t.chwpart and p.amppart=t.amppart and p.tmbpart=t.tmbpart and t.codetype='3'
WHERE a.dchdate BETWEEN ? and ?
AND (id.icd10 = 'A419' OR
id.icd10 = 'R572' OR
id.icd10 = 'R651')
GROUP BY a.an
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