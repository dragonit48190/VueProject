const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูลผู้ป่วยเบาหวานรายใหม่
router.get('/shizoscreen', (req, res) => {
  const { date1, date2 } = req.query;
  
  // ตรวจสอบว่ามีข้อมูลวันที่ครบถ้วนหรือไม่
  if (!date1 || !date2) {
    return res.status(400).json({ 
      success: false,
      error: 'กรุณาระบุช่วงวันที่ให้ครบถ้วน (date1 และ date2)' 
    });
  }
  
  const sql = `
  SELECT
	p.hn,
	p.cid,
	concat(p.pname, p.fname, '  ', p.lname) AS ptname,
	s.name AS sex,
    v.age_y AS age,
	CONCAT(DATE_FORMAT(o.vstdate, '%d-%m-'), YEAR(o.vstdate) + 543) AS vstdate,
	o.vsttime AS time,
	v.pdx AS pdx,
	od.icd10 AS icd,
	i.NAME AS icdname,
	p.addrpart AS num, 
	p.moopart AS moo,
	t3.NAME AS tum,
	t2.NAME AS amp,
	t1.NAME AS chw
FROM
	ovst o
	LEFT JOIN vn_stat v ON o.vn = v.vn
	LEFT JOIN ovstdiag od ON o.vn = od.vn
	LEFT JOIN icd101 i ON v.pdx = i.code
	LEFT JOIN patient p ON o.hn = p.hn
	LEFT JOIN sex s on p.sex = s.code 
	LEFT JOIN thaiaddress t1 ON p.chwpart = t1.chwpart
	AND t1.codetype = '1'
	LEFT JOIN thaiaddress t2 ON p.chwpart = t2.chwpart
	AND p.amppart = t2.amppart
	AND t2.codetype = '2'
	LEFT JOIN thaiaddress t3 ON p.chwpart = t3.chwpart
	AND p.amppart = t3.amppart
	AND p.tmbpart = t3.tmbpart
	AND t3.codetype = '3'
WHERE
	od.icd10 = 'Z503'
	AND o.vstdate BETWEEN ? and ?
GROUP BY
	o.vn
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