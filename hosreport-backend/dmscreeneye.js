const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูล Clinic Asthma (ไม่ต้องค้นหาจากวันที่)
router.get('/dmscreeneye', (req, res) => {
  const sql = `
  SELECT 
      p.hn,
      p.cid,
      CONCAT(p.pname, p.fname, ' ', p.lname) AS ptname,
      TIMESTAMPDIFF(YEAR, p.birthday, NOW()) AS age,
      s.do_eye_screen AS screen,
      CONCAT(DATE_FORMAT(s.screen_date, '%d-%m-'), YEAR(s.screen_date) + 543) AS screen_date,
      e.dmht_eye_screen_type_id AS idtype,
      dt.dmht_eye_screen_type_name AS type,
      r1.dmht_eye_screen_result_name AS LE,
      r2.dmht_eye_screen_result_name AS RE,
      e.va_left_text AS vale,
      e.va_right_text AS varig,
      e.treatment_text AS tex,
      p.addrpart AS num,
      p.moopart AS moo,
      t.name AS tum,
      CASE
          WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '01' THEN 'รพ.โพนสวรรค์'
          WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '02' 
               AND (p.moopart + 0) IN (2, 3, 4, 7, 8, 9, 10) THEN 'รพ.สต.นาหัวบ่อ'
          WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '02' 
               AND (p.moopart + 0) IN (1, 5, 6) THEN 'รพ.สต.โพนตูม'
          WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '03' 
               AND (p.moopart + 0) IN (1, 3, 4, 6, 8, 10, 11, 12, 15, 16) THEN 'รพ.สต.ขามเตี้ยใหญ่'
          WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '03' 
               AND (p.moopart + 0) IN (2, 5, 7, 9, 13, 14) THEN 'รพ.สต.ดอนยาง'
          WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '04' THEN 'รพ.สต.โพนบก'
          WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' 
               AND (p.moopart + 0) IN (1, 2, 13, 15, 18) THEN 'รพ.สต.บ้านค้อ'
          WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' 
               AND (p.moopart + 0) IN (6, 7, 8, 9, 10, 12, 19, 20) THEN 'รพ.สต.ขว้างคลี'
          WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' 
               AND (p.moopart + 0) IN (3, 4, 5, 11, 14, 16, 17) THEN 'รพ.สต.ห้วยไห'
          WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '06' 
               AND (p.moopart + 0) IN (4, 6, 7, 9, 12) THEN 'รพ.สต.บ้านต้าย'
          WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '06' 
               AND (p.moopart + 0) IN (1, 2, 3, 5, 8, 10, 11) THEN 'รพ.สต.โพนจาน'
          WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '07' THEN 'รพ.สต.นาใน'
          ELSE 'นอกเขต'
      END AS hospital
  FROM clinicmember c
  LEFT JOIN (
      SELECT z.* 
      FROM (
          SELECT 
              clinicmember_id,
              IF(
                  MAX(IF(do_eye_screen = 'Y', clinicmember_cormobidity_screen_id, NULL)) IS NULL,
                  MAX(clinicmember_cormobidity_screen_id),
                  MAX(IF(do_eye_screen = 'Y', clinicmember_cormobidity_screen_id, NULL))
              ) AS latest_screen_id
          FROM clinicmember_cormobidity_screen 
          WHERE screen_date BETWEEN '2024-10-01' AND '2025-05-23'
          GROUP BY clinicmember_id
      ) x
      LEFT JOIN clinicmember_cormobidity_screen z 
          ON z.clinicmember_cormobidity_screen_id = x.latest_screen_id
  ) s ON c.hn = s.hn
  LEFT JOIN clinicmember_cormobidity_eye_screen e 
      ON e.clinicmember_cormobidity_screen_id = s.clinicmember_cormobidity_screen_id 
  LEFT JOIN dmht_eye_screen_result r1 
      ON e.dmht_eye_screen_result_left_id = r1.dmht_eye_screen_result_id
  LEFT JOIN dmht_eye_screen_result r2 
      ON e.dmht_eye_screen_result_right_id = r2.dmht_eye_screen_result_id
  LEFT JOIN dmht_eye_screen_type dt 
      ON e.dmht_eye_screen_type_id = dt.dmht_eye_screen_type_id
  
  -- Join ข้อมูลผู้ป่วยและที่อยู่
  INNER JOIN patient p ON s.hn = p.hn
  INNER JOIN thaiaddress t ON p.chwpart = t.chwpart 
      AND p.amppart = t.amppart 
      AND p.tmbpart = t.tmbpart 
      AND t.codetype = '3'
  
  WHERE c.clinic = 002
      AND c.dchdate IS NULL 
  ORDER BY p.hn;
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