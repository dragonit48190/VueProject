const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูลผู้ป่วยเบาหวานรายใหม่
router.get('/ettubeer', (req, res) => {
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
  CONCAT(DATE_FORMAT(o.vstdate, '%d-%m-'), YEAR(o.vstdate) + 543) AS vstdate,
  v.pdx as icd,
  el.er_emergency_level_name as ertype,
  n.name as Tube,
  et.name as status
  FROM vn_stat v 
  inner join opitemrece o on v.vn = o.vn
  inner join er_regist e on o.vn = e.vn
  inner join er_emergency_level el on e.er_emergency_level_id = el.er_emergency_level_id
  inner join er_dch_type et on e.er_dch_type = et.er_dch_type
  inner join patient p on o.hn = p.hn
  inner join nondrugitems n on o.icode = n.icode
  WHERE o.vstdate BETWEEN ? and ?
  and o.icode in ('3000262',
  '3000251',
  '3000252',
  '3000253',
  '3000254',
  '3000255',
  '3000256',
  '3000257',
  '3000258',
  '3000259',
  '3000260',
  '3000261',
  '3003172')
  order by e.vstdate
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