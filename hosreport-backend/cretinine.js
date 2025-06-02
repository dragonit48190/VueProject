const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูล Clinic Asthma (ไม่ต้องค้นหาจากวันที่)
router.get('/cretinine', (req, res) => {
  const sql = `
  SELECT lh.hn,pt.cid,concat(pt.pname,pt.fname,' ',pt.lname) as ptname  
  ,SUBSTRING_INDEX( substring_index(group_concat(DATE_FORMAT(DATE_ADD(lh.order_date, INTERVAL 543 YEAR),'%d-%m-%Y') order by lh.order_date SEPARATOR ","), ",", 1),",", -1 ) as first_date     
  ,SUBSTRING_INDEX( substring_index(group_concat(lo.lab_order_result order by lh.order_date SEPARATOR ","), ",", 1),",", -1 ) as first_result
 
 ,SUBSTRING_INDEX( substring_index(group_concat(DATE_FORMAT(DATE_ADD(lh.order_date, INTERVAL 543 YEAR),'%d-%m-%Y') order by lh.order_date SEPARATOR ","), ",", 2),",", -1 ) as second_date
 ,SUBSTRING_INDEX( substring_index(group_concat(lo.lab_order_result order by lh.order_date SEPARATOR ","), ",", 2),",", -1 ) as second_result
 
  ,COUNT(lh.vn) as visit               
 ,DATEDIFF(SUBSTRING_INDEX( substring_index(group_concat(lh.order_date order by lh.order_date SEPARATOR ","), ",", 2),",", -1 ),SUBSTRING_INDEX( substring_index(group_concat(lh.order_date order by lh.order_date SEPARATOR ","), ",", 1),",", -1 ) ) as sum_date    
 
 ,if(DATEDIFF(SUBSTRING_INDEX( substring_index(group_concat(lh.order_date order by lh.order_date SEPARATOR ","), ",", 2),",", -1 ),SUBSTRING_INDEX( substring_index(group_concat(lh.order_date order by lh.order_date SEPARATOR ","), ",", 1),",", -1 ) ) > 90,"เข้าเกณฑ์ ชดเชยครั้งที่ 2 ได้ (เจาะครั้งที่ 2 มากกว่า 3 เดือน)","* ไม่เข้าเกณฑ์ ชดเชยไม่ได้ (เจาะครั้งที่ 2 น้อยกว่า 3 เดือน)") as criterion
 ,od.icd10 as idc
 from lab_head lh      
 left join patient pt on pt.hn=lh.hn     
 left join lab_order lo on lo.lab_order_number=lh.lab_order_number     
 left join ovstdiag od on lh.vn = od.vn      
 where lh.order_date BETWEEN '?' and '?'
 and lo.lab_items_code = 198        
 and od.icd10 BETWEEN "E10" and "E149"
 GROUP BY lh.hn        
 HAVING visit = 2       
 ORDER BY ptname 
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