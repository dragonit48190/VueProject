const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูลผู้ป่วยเบาหวานรายใหม่
router.get('/physicpatient', (req, res) => {
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
	CONCAT(p.pname, p.fname, '  ', p.lname) AS ptname,
	v.age_y AS age,
	round(os.bw, 0) AS bw,
	os.height,
	CONCAT(DATE_FORMAT(pm.vstdate, '%d-%m-'), YEAR(pm.vstdate) + 543) AS vstdate,
	pi.NAME AS psname,
	v.pdx AS icd,
	i.NAME AS icdname,
	pm.doctor_text AS doctor,
	p.addrpart AS num,
	p.moopart AS moo,
	t.name AS tum
FROM
	physic_main pm
	LEFT OUTER JOIN ovst o ON pm.vn = o.vn
	LEFT OUTER JOIN vn_stat v ON pm.vn = v.vn
	LEFT OUTER JOIN icd101 i ON v.pdx = i.code
	LEFT OUTER JOIN opdscreen os ON pm.vn = os.vn
	LEFT OUTER JOIN physic_list pl ON pm.vn = pl.vn
	LEFT OUTER JOIN patient p ON v.hn = p.hn
	LEFT OUTER JOIN thaiaddress t ON p.chwpart = t.chwpart
	AND p.amppart = t.amppart
	AND p.tmbpart = t.tmbpart
	AND t.codetype = '3'
	LEFT OUTER JOIN physic_items pi ON pl.physic_items_id = pi.physic_items_id
WHERE
	o.vstdate BETWEEN '2025-05-01' AND '2025-05-31'
GROUP BY pm.vn
ORDER BY
	pm.hn,
	pm.vstdate
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