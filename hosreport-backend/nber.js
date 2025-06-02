const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูลผู้ป่วยเบาหวานรายใหม่
router.get('/nber', (req, res) => {
  const { date1, date2 } = req.query;
  
  // ตรวจสอบว่ามีข้อมูลวันที่ครบถ้วนหรือไม่
  if (!date1 || !date2) {
    return res.status(400).json({ 
      success: false,
      error: 'กรุณาระบุช่วงวันที่ให้ครบถ้วน (date1 และ date2)' 
    });
  }
  
  const sql = `
  SELECT p.hn,
p.cid,
CONCAT(p.pname,p.fname,'  ',p.lname) as ptname,
v.age_y as age,
CONCAT(DATE_FORMAT(e.vstdate, '%d-%m-'), YEAR(e.vstdate) + 543) AS vstdate,
v.pdx as icd,
i.name as icdname,
r.name as oper,
td.name as status 
FROM er_regist e
left outer join vn_stat v on e.vn = v.vn 
left outer join er_regist_oper o on e.vn=o.vn
left outer join er_oper_code r on o.er_oper_code=r.er_oper_code
left outer join er_dch_type td on e.er_dch_type=td.er_dch_type
left outer join icd101 i on v.pdx = i.code 
left outer join patient p on v.hn = p.hn
left outer join thaiaddress t on p.chwpart=t.chwpart and p.amppart=t.amppart and p.tmbpart=t.tmbpart and t.codetype='3'
WHERE v.vstdate BETWEEN ? and ?
AND o.er_oper_code = '91'
GROUP BY v.vn
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