const express = require('express');
const router = express.Router();
const db = require('./db');  // ใช้การเชื่อมต่อฐานข้อมูลเดียวกับ index.js

// API Endpoint สำหรับดึงข้อมูล RE_ADMIT
router.get('/readmitdm', (req, res) => {
  const { date1, date2 } = req.query;
  
  // ตรวจสอบว่ามีข้อมูลวันที่ครบถ้วนหรือไม่
  if (!date1 || !date2) {
    return res.status(400).json({ error: 'กรุณาระบุช่วงวันที่ให้ครบถ้วน' });
  }
  
  const sql = `
  SELECT a.hn,
p.cid,
b.an as first_an,
concat(p.pname,p.fname,'  ',p.lname)as ptname,
a.age_y as age,
b.pdx as first_icd,
i2.name as first_icdname,
CONCAT(DATE_FORMAT(b.dchdate, '%d-%m-'), YEAR(b.dchdate) + 543) AS dchdate,
a.an as last_an,
CONCAT(DATE_FORMAT(a.regdate, '%d-%m-'), YEAR(a.regdate) + 543) AS regdate,
a.pdx as last_icd,
i.name as icdname,
a.lastvisit as visit,
d.name as status  
from an_stat a
left outer join an_stat b on a.hn = b.hn and a.an > b.an
left outer join patient p on a.hn = p.hn
left outer join icd101 i on a.pdx = i.code
left outer join icd101 i2 on b.pdx = i2.code
left outer join ipt ip on ip.an = a.an
left outer join dchtype d on ip.dchtype = d.dchtype
where (a.dchdate BETWEEN ? and ? ) and a.lastvisit <= '28'
and ((to_days(a.regdate))-(to_days(b.dchdate))) <= '28'
and (b.pdx BETWEEN 'E10' and 'E149' OR
b.dx0 BETWEEN 'E10' and 'E149' OR
b.dx1 BETWEEN 'E10' and 'E149' OR
b.dx2 BETWEEN 'E10' and 'E149' OR
b.dx3 BETWEEN 'E10' and 'E149' OR
b.dx4 BETWEEN 'E10' and 'E149' OR
b.dx5 BETWEEN 'E10' and 'E149')
and (a.pdx BETWEEN 'E10' and 'E149' OR
a.dx0 BETWEEN 'E10' and 'E149' OR
a.dx1 BETWEEN 'E10' and 'E149' OR
a.dx2 BETWEEN 'E10' and 'E149' OR
a.dx3 BETWEEN 'E10' and 'E149' OR
a.dx4 BETWEEN 'E10' and 'E149' OR
a.dx5 BETWEEN 'E10' and 'E149')
group by a.hn
order by a.an
  `;

  db.query('SET NAMES utf8', () => {
    db.query(sql, [date1, date2], (err, results) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ error: 'Query Failed' });
      }
      
      // ปกปิดข้อมูล CID ก่อนส่งกลับไปยัง frontend
      const maskedResults = results.map(row => {
        // สร้าง object ใหม่เพื่อไม่แก้ไขข้อมูลต้นฉบับ
        const maskedRow = {...row};
        
        // ปกปิด CID
        if (maskedRow.cid && maskedRow.cid.toString().length === 13) {
          const cidStr = maskedRow.cid.toString();
          maskedRow.cid = cidStr.substring(0, 3) + 'xxxxxxxx' + cidStr.substring(11);
        }
        
        return maskedRow;
      });
      
      res.json(maskedResults); // ส่งข้อมูลที่ปกปิดแล้ว
    });
  });
});

module.exports = router;