const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูลผู้ป่วยเบาหวานรายใหม่
router.get('/subphytype', (req, res) => {
    const { date1, date2, pttype } = req.query; // เพิ่ม pttype
    
    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    if (!date1 || !date2 || !pttype) {
      return res.status(400).json({ 
        success: false,
        error: 'กรุณาระบุช่วงวันที่และสิทธิให้ครบถ้วน (date1, date2, pttype)' 
      });
    }
  const sql = `
  SELECT
	pt.hn,
	pt.cid,
	CONCAT(pt.pname, pt.fname, '  ', pt.lname) AS ptname,
	v.age_y AS age,
	CONCAT(DATE_FORMAT(p.vstdate, '%d-%m-'), YEAR(p.vstdate) + 543) AS vstdate,
	p.service_time AS TIME,
	p.doctor_text AS doctor,
	py.NAME AS pttype_name,
	v.pdx AS icd,
	i.NAME AS icdname,
	v.income AS income,
	pt.addrpart AS num,
	pt.moopart AS moo,
	t.NAME AS tum
FROM
	physic_main p
	LEFT OUTER JOIN vn_stat v ON p.vn = v.vn
	LEFT OUTER JOIN icd101 i ON v.pdx = i.code
	LEFT OUTER JOIN pttype py ON v.pttype = py.pttype
	LEFT OUTER JOIN patient pt ON pt.hn = p.hn
	LEFT OUTER JOIN thaiaddress t ON pt.chwpart = t.chwpart
	AND pt.amppart = t.amppart
	AND pt.tmbpart = t.tmbpart
	AND t.codetype = '3'
WHERE
	p.vstdate BETWEEN ? AND ? AND v.pttype = ?
  ORDER BY v.vstdate DESC, v.hn
  `;
  db.query('SET NAMES utf8', () => {
    // เปลี่ยนเป็น 3 parameters: date1, date2, pttype
    db.query(sql, [date1, date2, pttype], (err, results) => {
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