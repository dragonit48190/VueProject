const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูลผู้ป่วยเบาหวานรายใหม่
router.get('/rtpcr', (req, res) => {
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
  o.vsttime,
  v.pdx as icd,
  op.cc,
  li.lab_items_name as rapid,
  ld.lab_order_result as result,
  p.addrpart as num,
  p.moopart as moo,
  t.name as tum,
  t2.name as amp,
  t3.name as chw,
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
  
  from ovst o
  left outer join opdscreen op on op.vn = o.vn
  left outer join vn_stat v on o.vn = v.vn 
  left outer join patient p on p.hn = o.hn 
  left outer join thaiaddress t on p.chwpart=t.chwpart and p.amppart=t.amppart and p.tmbpart=t.tmbpart and t.codetype='3'
  left outer join thaiaddress t2 on p.chwpart=t2.chwpart and p.amppart=t2.amppart and t2.codetype='2'
  left outer join thaiaddress t3 on p.chwpart=t3.chwpart and t3.codetype='1'
  left outer join lab_head h on h.vn = o.vn 
  left outer join lab_order ld  on ld.lab_order_number = h.lab_order_number 
  left outer join lab_items li on ld.lab_items_code = li.lab_items_code 
  where o.vstdate BETWEEN ? and ?
  AND ld.lab_items_code in (789,783)
  GROUP BY o.vn
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