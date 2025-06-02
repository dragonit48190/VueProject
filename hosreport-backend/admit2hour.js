const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูลผู้ป่วยเบาหวานรายใหม่
router.get('/admit2hour', (req, res) => {
  const { date1, date2 } = req.query;
  
  // ตรวจสอบว่ามีข้อมูลวันที่ครบถ้วนหรือไม่
  if (!date1 || !date2) {
    return res.status(400).json({ 
      success: false,
      error: 'กรุณาระบุช่วงวันที่ให้ครบถ้วน (date1 และ date2)' 
    });
  }
  
  const sql = `
  SELECT a.an,
p.hn,
p.cid,
CONCAT(p.pname,p.fname,'  ',p.lname) as ptname,
a.age_y as age,
CONCAT(DATE_FORMAT(i.regdate, '%d-%m-'), YEAR(i.regdate) + 543) AS regdate,
i.regtime,
CONCAT(DATE_FORMAT(i.dchdate, '%d-%m-'), YEAR(i.dchdate) + 543) AS dchdate,
i.dchtime,
d.name as status,
a.pdx as icd,
ic.name as icdname,
a.admit_hour as hour
from ipt i
left outer join an_stat a on i.an = a.an
left outer join icd101 ic on a.pdx = ic.code
left outer join dchtype d on i.dchtype = d.dchtype
left outer join patient p on a.hn = p.hn
left outer join thaiaddress t on p.chwpart=t.chwpart and p.amppart=t.amppart and p.tmbpart=t.tmbpart and t.codetype='3'
WHERE a.dchdate BETWEEN ? and ?
and a.admit_hour <= 2
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