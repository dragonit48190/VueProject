const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูล Clinic DM (ไม่ต้องค้นหาจากวันที่)
router.get('/labcovid', (req, res) => {
  const sql = `
  SELECT
  p.hn,
  p.cid,
  concat(p.pname, p.fname, '  ', p.lname) AS ptname,
  s.NAME AS sex,
  v.age_y AS age,
  CONCAT(DATE_FORMAT(o.vstdate, '%d-%m-'), YEAR(o.vstdate) + 543) AS vstdate,
  o.vsttime,
  v.pdx AS icd,
  li.lab_items_name AS lab,
  ld.lab_order_result AS result,
  k.department AS department,
  p.addrpart AS num,
  p.moopart AS moo,
  t.NAME AS tum
FROM
  ovst o
  LEFT OUTER JOIN opdscreen op ON op.vn = o.vn
  LEFT OUTER JOIN vn_stat v ON o.vn = v.vn
  LEFT OUTER JOIN patient p ON p.hn = o.hn
  LEFT OUTER JOIN thaiaddress t ON p.chwpart = t.chwpart
  AND p.amppart = t.amppart
  AND p.tmbpart = t.tmbpart
  AND t.codetype = '3'
  LEFT OUTER JOIN sex s ON p.sex = s.code
  LEFT OUTER JOIN lab_head h ON h.vn = o.vn
  LEFT OUTER JOIN lab_order ld ON ld.lab_order_number = h.lab_order_number
  LEFT OUTER JOIN lab_items li ON ld.lab_items_code = li.lab_items_code
  LEFT OUTER JOIN kskdepartment k ON h.order_department = k.depcode
WHERE
  o.vstdate > '2024-09-30'
  AND ld.lab_items_code IN ('783', '785', '787', '789', '799', '806')
GROUP BY
  o.vn
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