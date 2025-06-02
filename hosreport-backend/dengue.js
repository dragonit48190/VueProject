const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูลผู้ป่วยเบาหวานรายใหม่
router.get('/dengue', (req, res) => {
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
  concat(p.pname,p.fname,' ',p.lname) as ptname,
  s.name as sex,
  TIMESTAMPDIFF(YEAR, p.birthday, DATE(NOW())) AS age,
  CONCAT(DATE_FORMAT(o.vstdate, '%d-%m-'), YEAR(o.vstdate) + 543) AS vstdate,
  p.fathername as father,
  p.mathername as mather,
  o.icd10 as icd,
  i.name as icdname,
  l1.lab_order_result as HCT,
  l2.lab_order_result as WBC,
  l3.lab_order_result as PLTCount,
  p.addrpart as num,
  p.moopart as moo,
  vl.village_name as ban
          
  from ovstdiag o
  left outer join patient p on p.hn = o.hn
  left outer join thaiaddress t on p.chwpart=t.chwpart and t.amppart=p.amppart and t.tmbpart=p.tmbpart and t.codetype='3'
  left outer join person ps on p.cid = ps.cid
  left outer join sex s on p.sex = s.code
  left outer join village vl on vl.village_id = ps.village_id
  left outer join house ho on ho.house_id = ps.house_id
  left outer join icd101 i on o.icd10 = i.code
  left outer join lab_head h on o.vn = h.vn
  left outer join lab_order l1 on l1.lab_order_number = h.lab_order_number and l1.lab_items_code = '4'
  left outer join lab_order l2 on l2.lab_order_number = h.lab_order_number and l2.lab_items_code = '5'
  left outer join lab_order l3 on l3.lab_order_number = h.lab_order_number and l3.lab_items_code = '11'
  where o.vstdate BETWEEN ? AND ?
  and o.icd10 BETWEEN 'A90' and 'A919'
  and vl.village_moo <> '0'
  group by o.vn
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