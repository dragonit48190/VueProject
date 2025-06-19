const express = require('express');
const router = express.Router();
const db = require('./db');

// API Endpoint สำหรับดึงรายละเอียดการใช้ยา
router.get('/phamacydrugs', (req, res) => {
  const { date1, date2, drugName } = req.query;
  
  // ตรวจสอบพารามิเตอร์
  if (!date1 || !date2 || !drugName) {
    return res.status(400).json({ 
      success: false,
      error: 'กรุณาระบุช่วงวันที่และชื่อยาให้ครบถ้วน' 
    });
  }
  
  const sql = `
    SELECT 
      p.hn,
      CONCAT(p.pname, p.fname, '  ', p.lname) as ptname,
      TIMESTAMPDIFF(YEAR, p.birthday, CURDATE()) as age,
      s.name as sex,
      CONCAT(DATE_FORMAT(p.birthday, '%d-%m-'), YEAR(p.birthday) + 543) as birthdate,
      CONCAT(DATE_FORMAT(o.vstdate, '%d-%m-'), YEAR(o.vstdate) + 543) AS vstdate,
      d.name as drug,
      o.qty,
      o.sum_price,
      p.addrpart as num,
      p.moopart as moo,
      t.name as tum
    FROM opitemrece o 
    LEFT JOIN drugitems d ON o.icode = d.icode
    LEFT JOIN patient p ON o.hn = p.hn
    LEFT JOIN sex s ON p.sex = s.code 
    LEFT JOIN thaiaddress t ON p.chwpart = t.chwpart 
      AND p.amppart = t.amppart 
      AND p.tmbpart = t.tmbpart
      AND t.codetype = '3'
    WHERE o.vstdate BETWEEN ? AND ?
      AND d.name LIKE ?
      AND d.istatus = 'Y'
    GROUP BY o.vn
    ORDER BY o.vstdate, p.hn
  `;

  db.query('SET NAMES utf8', () => {
    // เพิ่ม % สำหรับ LIKE
    const drugParam = `%${drugName}%`;
    
    db.query(sql, [date1, date2, drugParam], (err, results) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' 
        });
      }
      
      // เพิ่มลำดับที่
      const detailResults = results.map((row, index) => ({
        ...row,
        sequence: index + 1
      }));
      
      res.json({
        success: true,
        count: detailResults.length,
        data: detailResults
      });
    });
  });
});

// API Endpoint สำหรับค้นหาชื่อยา
router.get('/drugitems/search', (req, res) => {
  const { q } = req.query;
  
  // ถ้าไม่มี query หรือน้อยกว่า 2 ตัวอักษร ส่ง empty array
  if (!q || q.trim().length < 2) {
    return res.json({ 
      success: true, 
      data: [] 
    });
  }
  
  const sql = `
    SELECT
      icode,
      name,
      strength,
      units,
      istatus
    FROM
      drugitems
    WHERE
      istatus = 'Y'
      AND LOWER(name) LIKE LOWER(?)
    ORDER BY
      name
    LIMIT 20
  `;
  
  db.query('SET NAMES utf8', () => {
    const searchParam = `%${q.trim()}%`;
    
    db.query(sql, [searchParam], (err, results) => {
      if (err) {
        console.error('Drug search error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'เกิดข้อผิดพลาดในการค้นหายา' 
        });
      }
      
      res.json({
        success: true,
        count: results.length,
        data: results
      });
    });
  });
});

// API Endpoint สำหรับดึงสรุปยอดการใช้ยา  
router.get('/drug-usage-summary', (req, res) => {
  const { date1, date2, drugName } = req.query;
  
  // ตรวจสอบพารามิเตอร์
  if (!date1 || !date2 || !drugName) {
    return res.status(400).json({ 
      success: false,
      error: 'กรุณาระบุช่วงวันที่และชื่อยาให้ครบถ้วน' 
    });
  }
  
  const sql = `
    SELECT 
      d.name as drug_name,
      COUNT(DISTINCT o.hn) as total_patients,
      COUNT(o.vn) as total_prescriptions,
      SUM(o.qty) as total_qty,
      SUM(o.sum_price) as total_amount
    FROM opitemrece o 
    LEFT JOIN drugitems d ON o.icode = d.icode
    WHERE o.vstdate BETWEEN ? AND ?
      AND d.name LIKE ?
      AND d.istatus = 'Y'
    GROUP BY d.icode, d.name
  `;

  db.query('SET NAMES utf8', () => {
    const drugParam = `%${drugName}%`;
    
    db.query(sql, [date1, date2, drugParam], (err, results) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสรุป' 
        });
      }
      
      // ถ้าไม่พบข้อมูล
      if (results.length === 0) {
        return res.json({
          success: true,
          data: {
            drug_name: drugName,
            total_patients: 0,
            total_prescriptions: 0,
            total_qty: 0,
            total_amount: 0
          }
        });
      }
      
      res.json({
        success: true,
        data: results[0]
      });
    });
  });
});

module.exports = router;