const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูล Clinic DM (ไม่ต้องค้นหาจากวันที่)
router.get('/screendrink', (req, res) => {
  const sql = `
  SELECT
  p2.patient_hn AS hn,
  p2.cid,
  concat(p2.pname, p2.fname, '  ', p2.lname) AS ptname,
  s.name as sex,
  TIMESTAMPDIFF(YEAR,p2.birthdate,CURDATE()) as age,
  round(sh.body_height) AS hi,
  round(sh.body_weight) AS bw,
  round(sh.waist) AS waist,
  ps.present_smoking AS smoke,
  ps.present_drinking_alcohol AS drink,
  CONCAT(DATE_FORMAT(sh.screen_date, '%d-%m-'), YEAR(sh.screen_date) + 543) AS vstdate,
  h1.address AS num,
  v.village_moo AS moo,
  v.village_name AS ban
FROM
  person_dmht_screen_summary p1
  LEFT OUTER JOIN person p2 ON p2.person_id = p1.person_id
  LEFT OUTER JOIN sex s ON p2.sex = s.code
  LEFT OUTER JOIN house_regist_type h2 ON h2.house_regist_type_id = p2.house_regist_type_id
  LEFT OUTER JOIN house h1 ON h1.house_id = p2.house_id
  LEFT OUTER JOIN village v ON v.village_id = h1.village_id
  LEFT OUTER JOIN person_dmht_risk_screen_head sh ON p1.person_dmht_screen_summary_id = sh.person_dmht_screen_summary_id
  LEFT OUTER JOIN person_dmht_nhso_screen ps ON p1.person_dmht_screen_summary_id = ps.person_dmht_screen_summary_id
WHERE
  p1.bdg_year = '2568'
  AND (ps.present_smoking = "Y" OR ps.present_drinking_alcohol = "Y")
GROUP BY
  p2.cid
ORDER BY
  sh.screen_date
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