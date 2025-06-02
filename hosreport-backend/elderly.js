const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูล Clinic DM (ไม่ต้องค้นหาจากวันที่)
router.get('/elderly', (req, res) => {
  const sql = `
  SELECT p.patient_hn as hn,
  p.cid,
  CONCAT(p.pname,p.fname,'  ',p.lname)as ptname,
  s.name as sex,
  CONCAT(DATE_FORMAT(p.birthdate, '%d-%m-'), YEAR(p.birthdate) + 543) AS birthdate,
  TIMESTAMPDIFF(year,p.birthdate,NOW()) as age,
  timestampdiff(month,p.birthdate,NOW())-(timestampdiff(year,p.birthdate,now())*12) as month,
  timestampdiff(day,date_add(p.birthdate,interval (timestampdiff(month,p.birthdate,now())) month),curdate()) as day,
  t.name as tname,
  ho.address as num,
  vl.village_moo AS moo,
  vl.village_name as ban,
  ht.house_regist_type_name as status
  from person p
  left join sex s on p.sex = s.code
  left join pttype t on p.pttype = t.pttype
  left join village vl on vl.village_id=p.village_id
  left join house ho on ho.house_id=p.house_id
  left join house_regist_type ht on p.house_regist_type_id=ht.house_regist_type_id
  where TIMESTAMPDIFF(year,p.birthdate,NOW()) > 59
  and vl.village_moo<> 0
  AND p.death = 'N'
  order by vl.village_moo
  `;

  db.query('SET NAMES utf8', () => {
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
      }
      
      // ปกปิดข้อมูล CID เพื่อความปลอดภัย
      const maskedResults = results.map(row => {
        const maskedRow = { ...row };
        
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