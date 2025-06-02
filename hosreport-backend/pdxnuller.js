const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูลผู้ป่วยเบาหวานรายใหม่
router.get('/pdxnuller', (req, res) => {
  const { date1, date2 } = req.query;
  
  // ตรวจสอบว่ามีข้อมูลวันที่ครบถ้วนหรือไม่
  if (!date1 || !date2) {
    return res.status(400).json({ 
      success: false,
      error: 'กรุณาระบุช่วงวันที่ให้ครบถ้วน (date1 และ date2)' 
    });
  }
  
  const sql = `
  SELECT o.hn,
  p.cid,
  concat(p.pname,p.fname,'  ',p.lname)as ptname,
  s.name as sex,
  TIMESTAMPDIFF(YEAR, p.birthday, CURDATE()) AS age,
  CONCAT(DATE_FORMAT(o.vstdate, '%d-%m-'), YEAR(o.vstdate) + 543) AS vstdate,
  o.vsttime,
  pt.name as pttype,
  v.pdx as icd,
  os.cc,
  v.income,
  k.department,
  o.staff
  from ovst o 
  left outer join vn_stat v on v.vn=o.vn
  left outer join opdscreen os on o.vn=os.vn
  left outer join patient p on p.hn=o.hn
  left outer join sex s on p.sex = s.code
  left outer join kskdepartment k on o.main_dep=k.depcode
  left outer join pttype pt on o.pttype=pt.pttype 
  where o.vstdate BETWEEN ? and ?
  and length(v.pdx) < 3
  AND os.cc !=' '
  AND o.main_dep = 011
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