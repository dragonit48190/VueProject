const express = require('express')
const cors = require('cors')        //  เพิ่มส่วน cors
const app = express()
const port = 5000

const db = require('./db')          //  ดึงการเชื่อมต่อที่แยกไว้
// นำเข้า router จากไฟล์ nonstemi.js
const nonStemiRoutes = require('./nonstemi');
const sepsisRoutes = require('./sepsis');
const sepsisadmitRoutes = require('./sepsisadmit');
const admitRoutes = require('./admit');
const readmitRoutes = require('./readmit');
const readmitoldRoutes = require('./readmitold');
const ipdreferRoutes = require('./ipdrefer');
const copderRoutes = require('./copder');
const headinjuryRoutes = require('./headinjury');
const ipddeathRoutes = require('./ipddeath');
const ncdpdxnullRoutes = require('./ncdpdxnull');
const clinicdmRoutes = require('./clinicdm');
const clinichtRoutes = require('./clinicht');
const clinicckdRoutes = require('./clinicckd');
const cliniccopdRoutes = require('./cliniccopd');
const clinicasthmaRoutes = require('./clinicasthma');
const newdmRoutes = require('./newdm');
const newhtRoutes = require('./newht');
const newckdRoutes = require('./newckd');
const newcopdRoutes = require('./newcopd');
const newasthmaRoutes = require('./newasthma');
const influlotnullRoutes = require('./influlotnull');
const dmscreeneyeRoutes = require('./dmscreeneye');
const pttypesumRoutes = require('./pttypesum');
const subtypeRoutes = require('./subtype');
const dmscreenfootRoutes = require('./dmscreenfoot');
const cretinineRoutes = require('./cretinine');
const childenRoutes = require('./childen');
const studentRoutes = require('./student');
const teenagerRoutes = require('./teenager');
const workageRoutes = require('./workage');
const elderlyRoutes = require('./elderly');
const screenpcuRoutes = require('./screenpcu');
const screensRoutes = require('./screens');
const rapidRoutes = require('./rapid');
const rtpcrRoutes = require('./rtpcr');
const denguefeverRoutes = require('./denguefever');
const dengueRoutes = require('./dengue');
const pdxnullerRoutes = require('./pdxnuller');
const asthmaerRoutes = require('./asthmaer');
const emergencyerRoutes = require('./emergencyer');
const ettubeerRoutes = require('./ettubeer');
const cprerRoutes = require('./cprer');
const castopererRoutes = require('./castoperer');
const defiberRoutes = require('./defiber');
const nberRoutes = require('./nber');
const admit2hourRoutes = require('./admit2hour');
const admitipdRoutes = require('./admitipd');
const admitdmRoutes = require('./admitdm');
const readmitdmRoutes = require('./readmitdm');
const admitdmhypoRoutes = require('./admitdmhypo');
const admitdmhyperRoutes = require('./admitdmhyper');
const admitdhfRoutes = require('./admitdhf');
const phypttypeRoutes = require('./phypttype');
const subphytypeRoutes = require('./subphytype');
const physicpatientRoutes = require('./physicpatient');
const physicovertimeRoutes = require('./physicovertime');
const clinicdrugRoutes = require('./clinicdrug');
const admitshizoRoutes = require('./admitshizo');
const screendrinkRoutes = require('./screendrink');
const pallaitivecaRoutes = require('./pallaitiveca');
const pallaitiveckdRoutes = require('./pallaitiveckd');
const pallaitivecopdRoutes = require('./pallaitivecopd');
const pallaitiveheartRoutes = require('./pallaitiveheart');
const telemedRoutes = require('./telemed');
const financenullRoutes = require('./financenull');
const subfinanceRoutes = require('./subfinance');
const strokesmokingRoutes = require('./strokesmoking');
const labcovidRoutes = require('./labcovid');
const pltpatientRoutes = require('./pltpatient');
const authRoutes = require('./auth');
const shizoscreenRoutes = require('./shizoscreen');
const clinicshizoRoutes = require('./clinicshizo');
const patientChartRoutes = require('./patientChart');
const doctorChartRoutes = require('./doctorChart');
const ipdPatientChartRoutes = require('./ipdPatientChart');
const wardStatisticsRoutes = require('./wardStatistics');
const phamacydrugsRoutes = require('./phamacydrugs');
const phamacyalertRoutes = require('./phamacyalert');
const phamacywarfarinRoutes = require('./phamacywarfarin');
const phamacyinsulinRoutes = require('./phamacyinsulin');



app.use(cors())                     //  เปิดใช้งาน CORS
app.use(express.json())             //  อ่าน JSON body
// ใช้งาน router
app.use('/api', nonStemiRoutes);
app.use('/api', sepsisRoutes);
app.use('/api', sepsisadmitRoutes);
app.use('/api', admitRoutes);
app.use('/api', readmitRoutes);
app.use('/api', readmitoldRoutes);
app.use('/api', ipdreferRoutes);
app.use('/api', copderRoutes);
app.use('/api', headinjuryRoutes);
app.use('/api', ipddeathRoutes);
app.use('/api', ncdpdxnullRoutes);
app.use('/api', clinicdmRoutes);
app.use('/api', clinichtRoutes);
app.use('/api', clinicckdRoutes);
app.use('/api', cliniccopdRoutes);
app.use('/api', clinicasthmaRoutes);
app.use('/api', newdmRoutes);
app.use('/api', newhtRoutes);
app.use('/api', newckdRoutes);
app.use('/api', newcopdRoutes);
app.use('/api', newasthmaRoutes);
app.use('/api', influlotnullRoutes);
app.use('/api', dmscreeneyeRoutes);
app.use('/api', pttypesumRoutes);
app.use('/api', subtypeRoutes);
app.use('/api', dmscreenfootRoutes);
app.use('/api', cretinineRoutes);
app.use('/api', childenRoutes);
app.use('/api', studentRoutes);
app.use('/api', teenagerRoutes);
app.use('/api', workageRoutes);
app.use('/api', elderlyRoutes);
app.use('/api', screenpcuRoutes);
app.use('/api', screensRoutes);
app.use('/api', rapidRoutes);
app.use('/api', rtpcrRoutes);
app.use('/api', denguefeverRoutes);
app.use('/api', dengueRoutes);
app.use('/api', pdxnullerRoutes);
app.use('/api', asthmaerRoutes);
app.use('/api', emergencyerRoutes);
app.use('/api', ettubeerRoutes);
app.use('/api', cprerRoutes);
app.use('/api', castopererRoutes);
app.use('/api', defiberRoutes);
app.use('/api', nberRoutes);
app.use('/api', admit2hourRoutes);
app.use('/api', admitipdRoutes);
app.use('/api', admitdmRoutes);
app.use('/api', readmitdmRoutes);
app.use('/api', admitdmhypoRoutes);
app.use('/api', admitdmhyperRoutes);
app.use('/api', admitdhfRoutes);
app.use('/api', phypttypeRoutes);
app.use('/api', subphytypeRoutes);
app.use('/api', physicpatientRoutes);
app.use('/api', physicovertimeRoutes);
app.use('/api', clinicdrugRoutes);
app.use('/api', admitshizoRoutes);
app.use('/api', screendrinkRoutes);
app.use('/api', pallaitivecaRoutes);
app.use('/api', pallaitiveckdRoutes);
app.use('/api', pallaitivecopdRoutes);
app.use('/api', pallaitiveheartRoutes);
app.use('/api', telemedRoutes);
app.use('/api', financenullRoutes);
app.use('/api', subfinanceRoutes);
app.use('/api', strokesmokingRoutes);
app.use('/api', labcovidRoutes);
app.use('/api', pltpatientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', shizoscreenRoutes);
app.use('/api', clinicshizoRoutes);
app.use('/api/patient-chart', patientChartRoutes);
app.use('/api/doctor-chart', doctorChartRoutes);
app.use('/api/ipd-patient-chart', ipdPatientChartRoutes);
app.use('/api/ward-statistics', wardStatisticsRoutes);
app.use('/api', phamacydrugsRoutes);
app.use('/api', phamacyalertRoutes);
app.use('/api', phamacywarfarinRoutes);
app.use('/api', phamacyinsulinRoutes);

// 🔥 เพิ่ม Health Check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'HOSReport Backend API is running',
    timestamp: new Date().toISOString(),
    port: port
  })
})

// API ดึงข้อมูล SQL Visit HOSxP
app.get('/api/authen', (req, res) => {
  const sql = `
    SELECT COUNT(*) AS total_visit_today
    FROM ovst
    WHERE vstdate = CURDATE()
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB query failed' })
    res.json({ total_visit_today: results[0].total_visit_today })
  })
})

app.get('/api/notauthen', (req, res) => {
  const sql = `
    SELECT COUNT(*) AS visit FROM visit_pttype v
    LEFT JOIN ovst o ON v.vn = o.vn 
    WHERE o.vstdate = CURDATE()
      AND v.auth_code IS NULL
      AND o.pttype NOT IN ('18','41','42')
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB query failed' })
    res.json({ notauthen: results[0].visit })
  })
})

app.get('/api/authened', (req, res) => {
  const sql = `
    SELECT COUNT(*) AS visit FROM visit_pttype v
    LEFT JOIN ovst o ON v.vn = o.vn 
    WHERE o.vstdate = CURDATE()
      AND v.auth_code IS NOT NULL
      AND o.pttype NOT IN ('18','41','42')
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB query failed' })
    res.json({ authened: results[0].visit })
  })
})

app.get('/api/opd', (req, res) => {
  const sql = `
    SELECT COUNT(*) AS visit 
    FROM ovst 
    WHERE vstdate = CURDATE() 
      AND main_dep = '010'
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB query failed' })
    res.json({ opd: results[0].visit })
  })
})

app.get('/api/dent', (req, res) => {
  const sql = `
  SELECT COUNT(*) AS visit
  FROM vn_stat v
  LEFT JOIN ovst o ON v.vn = o.vn
  WHERE v.vstdate = CURDATE()
  AND v.vn IN (SELECT vn FROM dtmain WHERE vstdate = CURDATE())
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB query failed' })
    res.json({ dent: results[0].visit })
  })
})

app.get('/api/er', (req, res) => {
  const sql = `
  SELECT COUNT(*) AS visit FROM er_regist WHERE vstdate = CURDATE()
  `
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB query failed' })
    res.json({ er: results[0].visit })
  })
})

// backend/index.js
app.get('/api/strokerefer', (req, res) => {
  const { date1, date2 } = req.query
  const sql = `
    SELECT p.hn, p.cid, CONCAT(p.pname, p.fname, ' ', p.lname) as ptname,
           TIMESTAMPDIFF(year, p.birthday, CURDATE()) as age,
           CONCAT(DATE_FORMAT(r.refer_date, '%d-%m-'),YEAR(r.refer_date) + 543) AS refer_date, r.pdx as icd, i.name as icdname,
           p.addrpart as num, p.moopart as moo, tt.name as tum
           ,CASE
         WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '01' THEN 'รพ.โพนสวรรค์'
       
         WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '02' AND (p.moopart+0) IN (2,3,4,7,8,9,10) THEN 'รพ.สต.นาหัวบ่อ'
         WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '02' AND (p.moopart+0) IN (1,5,6) THEN 'รพ.สต.โพนตูม'
       
         WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '03' AND (p.moopart+0) IN (1,3,4,6,8,10,11,12,15,16) THEN 'รพ.สต.ขามเตี้ยใหญ่'
         WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '03' AND (p.moopart+0) IN (2,5,7,9,13,14) THEN 'รพ.สต.ดอนยาง'
       
         WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '04' THEN 'รพ.สต.โพนบก'
       
         WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' AND (p.moopart+0) IN (1,2,13,15,18) THEN 'รพ.สต.บ้านค้อ'
         WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' AND (p.moopart+0) IN (6,7,8,9,10,12,19,20) THEN 'รพ.สต.ขว้างคลี'
         WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' AND (p.moopart+0) IN (3,4,5,11,14,16,17) THEN 'รพ.สต.ห้วยไห'
       
         WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '06' AND (p.moopart+0) IN (4,6,7,9,12) THEN 'รพ.สต.บ้านต้าย'
         WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '06' AND (p.moopart+0) IN (1,2,3,5,8,10,11) THEN 'รพ.สต.โพนจาน'
       
         WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '07' THEN 'รพ.สต.นาใน'
       
         ELSE 'นอกเขต'
       END AS hospital
    FROM referout r
    INNER JOIN patient p ON r.hn = p.hn
    INNER JOIN thaiaddress tt ON p.chwpart = tt.chwpart 
        AND p.amppart = tt.amppart 
        AND p.tmbpart = tt.tmbpart 
        AND tt.codetype = '3'
    INNER JOIN icd101 i ON r.pdx = i.code
    WHERE r.refer_date BETWEEN ? AND ? 
    AND r.pdx = 'I64'
    ORDER BY r.refer_date
  `
  db.query('SET NAMES utf8', () => {
    db.query(sql, [date1, date2], (err, results) => {
      if (err) return res.status(500).json({ error: 'Query Failed' });
      
      // ปกปิดข้อมูล CID ก่อนส่งกลับไปยัง frontend
      const maskedResults = results.map(row => {
        const maskedRow = {...row};
        
        // ปกปิด CID
        if (maskedRow.cid && maskedRow.cid.toString().length === 13) {
          const cidStr = maskedRow.cid.toString();
          maskedRow.cid = cidStr.substring(0, 3) + 'xxxxxxxx' + cidStr.substring(11);
        }
        
        return maskedRow;
      });
      
      res.json(maskedResults);
    });
  });
});

// api/stroke 
app.get('/api/stroke', (req, res) => {
  const { date1, date2 } = req.query
  const sql = `
  SELECT p.cid,CONCAT(DATE_FORMAT(o.vstdate, '%d-%m-'),YEAR(o.vstdate) + 543) AS vstdate, CONCAT(p.pname, p.fname, ' ', p.lname) AS fullname,
  TIMESTAMPDIFF(year, p.birthday, CURDATE()) as age, o.hn, d.icd10 as icd, i.name as icdname,
  p.addrpart as num, p.moopart as moo, tt.name as tum,
  CASE
    WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '01' THEN 'รพ.โพนสวรรค์'
    WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '02' AND (p.moopart+0) IN (2,3,4,7,8,9,10) THEN 'รพ.สต.นาหัวบ่อ'
    WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '02' AND (p.moopart+0) IN (1,5,6) THEN 'รพ.สต.โพนตูม'
    WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '03' AND (p.moopart+0) IN (1,3,4,6,8,10,11,12,15,16) THEN 'รพ.สต.ขามเตี้ยใหญ่'
    WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '03' AND (p.moopart+0) IN (2,5,7,9,13,14) THEN 'รพ.สต.ดอนยาง'
    WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '04' THEN 'รพ.สต.โพนบก'
    WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' AND (p.moopart+0) IN (1,2,13,15,18) THEN 'รพ.สต.บ้านค้อ'
    WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' AND (p.moopart+0) IN (6,7,8,9,10,12,19,20) THEN 'รพ.สต.ขว้างคลี'
    WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' AND (p.moopart+0) IN (3,4,5,11,14,16,17) THEN 'รพ.สต.ห้วยไห'
    WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '06' AND (p.moopart+0) IN (4,6,7,9,12) THEN 'รพ.สต.บ้านต้าย'
    WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '06' AND (p.moopart+0) IN (1,2,3,5,8,10,11) THEN 'รพ.สต.โพนจาน'
    WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '07' THEN 'รพ.สต.นาใน'
    ELSE 'นอกเขต'
  END AS hospital
  FROM ovstdiag d
  LEFT JOIN ovst o ON o.vn = d.vn
  LEFT JOIN patient p ON p.hn = o.hn
  INNER JOIN thaiaddress tt ON p.chwpart = tt.chwpart 
      AND p.amppart = tt.amppart 
      AND p.tmbpart = tt.tmbpart 
      AND tt.codetype = '3'
  INNER JOIN icd101 i ON d.icd10 = i.code
  WHERE d.icd10 = 'I64'
   AND o.vstdate BETWEEN ? AND ?
  ORDER BY o.vstdate 
  `
  db.query('SET NAMES utf8', () => {
    db.query(sql, [date1, date2], (err, results) => {
      if (err) return res.status(500).json({ error: 'Query Failed' });
      
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
// api/stemi
app.get('/api/stemi', (req, res) => {
  const { date1, date2 } = req.query
  const sql = `
  SELECT p.hn,p.cid,CONCAT(p.pname,p.fname,'  ',p.lname) as ptname,s.name as sex,v.age_y as age
,CONCAT(DATE_FORMAT(o.vstdate, '%d-%m-'),YEAR(o.vstdate) + 543) AS vstdate,o.icd10 as icd,i.name as icdname,os.name as status
,p.addrpart as num,p.moopart as moo,tt.name as tum
,CASE
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '01' THEN 'รพ.โพนสวรรค์'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '02' AND (p.moopart+0) IN (2,3,4,7,8,9,10) THEN 'รพ.สต.นาหัวบ่อ'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '02' AND (p.moopart+0) IN (1,5,6) THEN 'รพ.สต.โพนตูม'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '03' AND (p.moopart+0) IN (1,3,4,6,8,10,11,12,15,16) THEN 'รพ.สต.ขามเตี้ยใหญ่'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '03' AND (p.moopart+0) IN (2,5,7,9,13,14) THEN 'รพ.สต.ดอนยาง'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '04' THEN 'รพ.สต.โพนบก'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' AND (p.moopart+0) IN (1,2,13,15,18) THEN 'รพ.สต.บ้านค้อ'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' AND (p.moopart+0) IN (6,7,8,9,10,12,19,20) THEN 'รพ.สต.ขว้างคลี'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '05' AND (p.moopart+0) IN (3,4,5,11,14,16,17) THEN 'รพ.สต.ห้วยไห'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '06' AND (p.moopart+0) IN (4,6,7,9,12) THEN 'รพ.สต.บ้านต้าย'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '06' AND (p.moopart+0) IN (1,2,3,5,8,10,11) THEN 'รพ.สต.โพนจาน'
  WHEN p.chwpart = '48' AND p.amppart = '10' AND p.tmbpart = '07' THEN 'รพ.สต.นาใน'
  ELSE 'นอกเขต'
END AS hospital
FROM ovstdiag o
left join ovst ot on o.vn = ot.vn
left join vn_stat v on o.vn = v.vn
left join ovstost os on ot.ovstost = os.ovstost
left join patient p on o.hn = p.hn
left join sex s on p.sex = s.code
left join thaiaddress tt on p.chwpart=tt.chwpart and p.amppart=tt.amppart and p.tmbpart=tt.tmbpart 
and tt.codetype='3'
left join icd101 i on o.icd10 = i.code
WHERE o.vstdate BETWEEN ? and ?
AND o.icd10 BETWEEN 'I210' and 'I213' 
GROUP BY o.vn
ORDER BY o.vstdate
`
  db.query('SET NAMES utf8', () => {
    db.query(sql, [date1, date2], (err, results) => {
      if (err) return res.status(500).json({ error: 'Query Failed' });
      
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

// ฟังก์ชันช่วยตรวจสอบรูปแบบวันที่
function isValidDate(dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if(!dateString.match(regEx)) return false;  // รูปแบบไม่ตรง yyyy-mm-dd
  
  const d = new Date(dateString);
  const dNum = d.getTime();
  if(!dNum && dNum !== 0) return false; // วันที่ไม่ถูกต้อง
  
  return d.toISOString().slice(0,10) === dateString;
}

// เริ่มต้น Server
app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`)
  console.log(` Health check: http://localhost:${port}/api/health`)
  console.log(` Auth endpoint: http://localhost:${port}/api/auth/login`)  // 🔥 เพิ่มบรรทัดนี้
})
