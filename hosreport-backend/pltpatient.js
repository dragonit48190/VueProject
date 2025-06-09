const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูลผู้ป่วยเบาหวานรายใหม่
router.get('/pltpatient', (req, res) => {
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
	s.NAME AS sex,
	v.age_y AS age,
	CONCAT(DATE_FORMAT(h.service_date, '%d-%m-'), YEAR(h.service_date) + 543) AS vstdate,
	d.NAME AS drug,
	n.NAME AS nondrug,
	ot.qty,
	ot.sum_price AS price,
	pt.NAME AS pttype
FROM
	health_med_service h
	LEFT OUTER JOIN ovst o ON h.vn = o.vn
	LEFT OUTER JOIN vn_stat v ON h.vn = v.vn
	LEFT OUTER JOIN opitemrece ot ON h.vn = ot.vn
	LEFT OUTER JOIN drugitems d ON ot.icode = d.icode
	LEFT OUTER JOIN nondrugitems n ON ot.icode = n.icode
	LEFT OUTER JOIN pttype pt ON o.pttype = pt.pttype
	LEFT OUTER JOIN patient p ON h.hn = p.hn
	LEFT OUTER JOIN sex s ON p.sex = s.CODE
WHERE
	h.service_date BETWEEN ? AND ?
ORDER BY
	h.hn,
	ot.icode
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