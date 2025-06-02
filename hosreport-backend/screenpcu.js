const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูล Clinic DM (ไม่ต้องค้นหาจากวันที่)
router.get('/screenpcu', (req, res) => {
  const sql = `
  SELECT p.patient_hn as hn,
p.cid,
CONCAT(p.pname,p.fname,'  ',p.lname)as ptname,
s.name as sex,
TIMESTAMPDIFF(year,p.birthdate,NOW()) as age,
substring_index(GROUP_CONCAT(round(os.bw)),',',1) as bw,
substring_index(GROUP_CONCAT(os.height),',',1) as hi,
substring_index(GROUP_CONCAT(round (os.waist)),',',1) as wait,
t.name as tname,
h.address as num,
vl.village_moo AS moo,
vl.village_name as ban,
ht.house_regist_type_name as status
from person p 
left join ovst o on p.patient_hn = o.hn
left join opdscreen os on o.vn = os.vn
left join sex s on p.sex = s.code
left join pttype t on o.pttype = t.pttype
left join house h on p.house_id = h.house_id
left join village vl on h.village_id = vl.village_id
left join house_regist_type ht on p.house_regist_type_id = ht.house_regist_type_id
where TIMESTAMPDIFF(year,p.birthdate,NOW()) BETWEEN 30 and 70 
and  o.vn in ( select max(vn) from ovst group by hn)
and vl.village_moo != 0
AND p.death='N'
AND p.sex = 2
GROUP BY o.hn
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