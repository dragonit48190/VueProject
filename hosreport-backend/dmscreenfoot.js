const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูล Clinic Asthma (ไม่ต้องค้นหาจากวันที่)
router.get('/dmscreenfoot', (req, res) => {
  const sql = `
  SELECT 
    -- ข้อมูลผู้ป่วยพื้นฐาน
    p.hn,
    p.cid,
    CONCAT(
        COALESCE(p.pname, ''), 
        COALESCE(p.fname, ''), 
        '  ', 
        COALESCE(p.lname, '')
    ) as ptname,
    TIMESTAMPDIFF(YEAR, p.birthday, NOW()) as age,
    
    -- ข้อมูลการตรวจคัดกรอง
    COALESCE(s.do_foot_screen, 'N') as screen,
    s.screen_date as vstdate,
    
    -- ผลการตรวจเท้า
    r1.dmht_foot_screen_result_name as LF,
    r2.dmht_foot_screen_result_name as RF,
    r3.dmht_foot_screen_ulcer_name as ulc,
    r4.dmht_foot_screen_history_ulcer_name as ulcn,
    
    -- ที่อยู่
    COALESCE(p.addrpart, '') as num,
    COALESCE(p.moopart, '') as moo,
    COALESCE(t.name, '') as tum,
    
    -- โรงพยาบาลที่รับผิดชอบ
    CASE
        -- โรงพยาบาลโพนสวรรค์
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '01' 
            THEN 'รพ.โพนสวรรค์'
        
        -- รพ.สต.นาหัวบ่อ
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '02' 
             AND CAST(COALESCE(p.moopart, '0') AS UNSIGNED) IN (2,3,4,7,8,9,10) 
            THEN 'รพ.สต.นาหัวบ่อ'
        
        -- รพ.สต.โพนตูม
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '02' 
             AND CAST(COALESCE(p.moopart, '0') AS UNSIGNED) IN (1,5,6) 
            THEN 'รพ.สต.โพนตูม'
        
        -- รพ.สต.ขามเตี้ยใหญ่
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '03' 
             AND CAST(COALESCE(p.moopart, '0') AS UNSIGNED) IN (1,3,4,6,8,10,11,12,15,16) 
            THEN 'รพ.สต.ขามเตี้ยใหญ่'
        
        -- รพ.สต.ดอนยาง
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '03' 
             AND CAST(COALESCE(p.moopart, '0') AS UNSIGNED) IN (2,5,7,9,13,14) 
            THEN 'รพ.สต.ดอนยาง'
        
        -- รพ.สต.โพนบก
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '04' 
            THEN 'รพ.สต.โพนบก'
        
        -- รพ.สต.บ้านค้อ
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' 
             AND CAST(COALESCE(p.moopart, '0') AS UNSIGNED) IN (1,2,13,15,18) 
            THEN 'รพ.สต.บ้านค้อ'
        
        -- รพ.สต.ขว้างคลี
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' 
             AND CAST(COALESCE(p.moopart, '0') AS UNSIGNED) IN (6,7,8,9,10,12,19,20) 
            THEN 'รพ.สต.ขว้างคลี'
        
        -- รพ.สต.ห้วยไห
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' 
             AND CAST(COALESCE(p.moopart, '0') AS UNSIGNED) IN (3,4,5,11,14,16,17) 
            THEN 'รพ.สต.ห้วยไห'
        
        -- รพ.สต.บ้านต้าย
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '06' 
             AND CAST(COALESCE(p.moopart, '0') AS UNSIGNED) IN (4,6,7,9,12) 
            THEN 'รพ.สต.บ้านต้าย'
        
        -- รพ.สต.โพนจาน
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '06' 
             AND CAST(COALESCE(p.moopart, '0') AS UNSIGNED) IN (1,2,3,5,8,10,11) 
            THEN 'รพ.สต.โพนจาน'
        
        -- รพ.สต.นาใน
        WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '07' 
            THEN 'รพ.สต.นาใน'
        
        ELSE 'นอกเขต'
    END AS hospital

FROM clinicmember c
LEFT JOIN (
    SELECT 
        z.* 
    FROM (
        SELECT 
            clinicmember_id,
            COALESCE(
                MAX(CASE WHEN do_foot_screen = 'Y' THEN clinicmember_cormobidity_screen_id END),
                MAX(clinicmember_cormobidity_screen_id)
            ) as latest_screen_id
        FROM clinicmember_cormobidity_screen 
        WHERE screen_date BETWEEN '2025-05-01' AND '2025-05-31'
        GROUP BY clinicmember_id
    ) x
    LEFT JOIN clinicmember_cormobidity_screen z ON z.clinicmember_cormobidity_screen_id = x.latest_screen_id
) s ON c.hn = s.hn
LEFT JOIN clinicmember_cormobidity_foot_screen e ON e.clinicmember_cormobidity_screen_id = s.clinicmember_cormobidity_screen_id
LEFT JOIN dmht_foot_screen_result r1 ON e.dmht_foot_screen_result_left_id = r1.dmht_foot_screen_result_id
LEFT JOIN dmht_foot_screen_result r2 ON e.dmht_foot_screen_result_right_id = r2.dmht_foot_screen_result_id
LEFT JOIN dmht_foot_screen_ulcer r3 ON e.dmht_foot_screen_ulcer_id = r3.dmht_foot_screen_ulcer_id
LEFT JOIN dmht_foot_screen_history_ulcer r4 ON e.dmht_foot_screen_history_ulcer_id = r4.dmht_foot_screen_history_ulcer_id
INNER JOIN patient p ON c.hn = p.hn
LEFT JOIN thaiaddress t ON p.chwpart = t.chwpart 
                        AND p.amppart = t.amppart 
                        AND p.tmbpart = t.tmbpart 
                        AND t.codetype = '3'
WHERE c.clinic = '002'
ORDER BY hospital, p.hn;
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