mounted() {
  // ตั้งค่าวันที่เริ่มต้นเพื่อให้มีข้อมูลทันที
  // ตั้งค่าวันที่เป็น 1-5 พฤษภาคม 2025 (ช่วงที่มีข้อมูล)
  this.dateRaw1 = '2025-05-01'
  this.dateRaw2 = '2025-05-05'
  
  // โหลดข้อมูลเริ่มต้นทันทีเมื่อโหลดหน้า
  this.fetchData()
}<template>
<MainLayout>
  <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
    <div class="breadcrumb-title pe-3">Tables</div>
    <div class="ps-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-0 p-0">
          <li class="breadcrumb-item"><a href="/"><i class="bx bx-home-alt"></i></a></li>
          <li class="breadcrumb-item active" aria-current="page">STROKE I64 </li>
        </ol>
      </nav>
    </div>
  </div>
  <hr />
  <div class="row row-cols-1 row-cols-2">
    <div class="col-12">
      <h6 class="mb-0 text-uppercase">ค้นหารายชื่อผู้ป่วย STROKE I64 </h6>
      <hr />
      <div class="card border-top border-0 border-4 border-primary">
        <div class="card-body p-5">
          <div class="card-title d-flex align-items-center">
            <div><i class="bx bxs-calendar-heart me-1 font-22 text-primary"></i></div>
            <h5 class="mb-0 text-primary">ค้นหาจากวันที่ : ถึงวันที่ ที่คุณต้องการได้เลย</h5>
          </div>
          <hr>
          <form class="row g-3">
            <div class="col-md-3">
              <label for="inputFirstName" class="form-label">วันที่เริ่มต้น</label>
              <flat-pickr v-model="dateRaw1" :config="config" class="form-control" />
            </div>
            <div class="col-md-3">
              <label for="inputLastName" class="form-label">วันที่สิ้นสุด</label>
              <flat-pickr v-model="dateRaw2" :config="config" class="form-control" />
            </div>
            <div class="col-12 mt-4">
              <button class="btn btn-primary d-flex align-items-center gap-1" @click.prevent="fetchData">
                <i class="bx bx-search-alt"></i>
                <span>กดปุ่มค้นหา</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <h6 class="mb-0 text-uppercase text-primary">รายชื่อผู้ป่วย STROKE I64 โรงพยาบาลโพนสวรรค์ </h6>
  <hr />
  <div class="card">
    <div class="card-body">
      <!-- เพิ่มปุ่ม Export -->
<div class="mb-3 d-flex justify-content-end">
  <div class="btn-group">
    <button class="btn btn-primary me-2" @click="exportToExcel">
      <i class="bx bx-export me-1"></i> Export Excel
    </button>
  </div>
</div>
      <EasyDataTable
        :headers="headers"
        :items="patients"
        :rows-per-page="10"
        table-class="custom-table"
        header-text-align="center"
        body-text-align="left"
        @page-change="onPageChange"
      >
      </EasyDataTable>
    </div>
  </div>
</MainLayout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue'
import api from '@/services/api'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.min.css'
import { Thai } from 'flatpickr/dist/l10n/th.js'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import * as XLSX from 'xlsx'

dayjs.locale('th')

export default {
name: 'StrokeReport',
components: {
  MainLayout,
  flatPickr: FlatPickr,
  EasyDataTable
},
data() {
  return {
    dateRaw1: null,
    dateRaw2: null,
    patients: [],
    currentPage: 1,
    rowsPerPage: 10,
    headers: [
      { text: 'ลำดับ', value: 'sequence' },
      { text: 'HN', value: 'hn' },
      { text: 'CID', value: 'cid' },
      { text: 'ชื่อ - สกุล', value: 'fullname' },
      { text: 'Age', value: 'age' },
      { text: 'วันที่', value: 'vstdate' },
      { text: 'ICD', value: 'icd' },
      { text: 'ICDNAME', value: 'icdname' },
      { text: 'เลขที่', value: 'num' },
      { text: 'หมู่', value: 'moo' },
      { text: 'ตำบล', value: 'tum' },
      { text: 'รพ.สต.', value: 'hospital' }
    ],
    config: {
      locale: Thai,
      dateFormat: 'Y-m-d',
      altInput: true,
      altFormat: 'j F Y',
      onReady(selectedDates, dateStr, instance) {
        const yearSelect = instance.currentYearElement
        if (yearSelect) {
          yearSelect.value = parseInt(yearSelect.value) + 543
        }
      }
    }
  }
},
methods: {
  async fetchData() {
    if (!this.dateRaw1 || !this.dateRaw2) {
      alert('กรุณาเลือกช่วงวันที่')
      return
    }
    const d1 = dayjs(this.dateRaw1).format('YYYY-MM-DD')
    const d2 = dayjs(this.dateRaw2).format('YYYY-MM-DD')

    try {
      console.log('กำลังค้นหาข้อมูลในช่วงวันที่:', d1, 'ถึง', d2)
      
      // ลองเรียกที่เส้นทาง /stroke (ไม่มี /api/ นำหน้า เหมือนกับ /strokerefer)
      console.log('API URL:', '/stroke')
      const res = await api.get('/stroke', {
        params: { date1: d1, date2: d2 }
      })
      
      console.log('ข้อมูลที่ได้จาก API:', res.data)
      
      // ตรวจสอบรูปแบบข้อมูลที่ได้รับ
      let dataToUse = res.data
      
      // กรณีข้อมูลอยู่ในรูปแบบ { success, data, total }
      if (res.data && typeof res.data === 'object' && !Array.isArray(res.data) && res.data.data) {
        console.log('ข้อมูลอยู่ในรูปแบบ object พร้อม data property')
        dataToUse = res.data.data
      }
      
      // ตรวจสอบว่ามีข้อมูลหรือไม่
      if (!dataToUse || dataToUse.length === 0) {
        console.warn('ไม่พบข้อมูลในช่วงวันที่ที่เลือก')
        this.patients = []
        return
      }
      
      // เพิ่มลำดับให้กับข้อมูลก่อนแสดงผล
      this.patients = dataToUse.map((patient, index) => {
        return {
          ...patient,
          sequence: index + 1
        }
      })
      
      console.log('จำนวนข้อมูลที่แสดง:', this.patients.length)
      if (this.patients.length > 0) {
        console.log('ตัวอย่างข้อมูลแรก:', this.patients[0])
      }
      
      this.currentPage = 1 // รีเซ็ตกลับหน้าแรกเมื่อมีการค้นหาใหม่
    } catch (err) {
      console.error('โหลดข้อมูลผิดพลาด:', err)
      
      // แสดงรายละเอียดข้อผิดพลาดเพิ่มเติมเพื่อการดีบัก
      if (err.response) {
        console.error('รายละเอียดข้อผิดพลาด:', {
          status: err.response.status,
          headers: err.response.headers,
          data: err.response.data
        })
      }
      
      // ตรวจสอบความผิดพลาดที่พบบ่อย
      if (err.message && err.message.includes('Network Error')) {
        alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ โปรดตรวจสอบการเชื่อมต่อและการตั้งค่า API URL')
      } else {
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + err.message)
      }
      
      this.patients = []
    }
  },
  formatDateTH(dateStr) {
    if (!dateStr) return '-'
    const d = dayjs(dateStr)
    const buddhistYear = d.year() + 543
    return d.format('D MMMM ') + buddhistYear
  },
  onPageChange(page) {
    this.currentPage = page
  },
  calculateRowIndex(index) {
  // คำนวณลำดับแถวที่ถูกต้องโดยพิจารณาจากหน้าปัจจุบันและจำนวนแถวต่อหน้า
  return (this.currentPage - 1) * this.rowsPerPage + index + 1
},

// เพิ่มฟังก์ชันสำหรับ Export ข้อมูลเป็น Excel
exportToExcel() {
  try {
    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (this.patients.length === 0) {
      alert('ไม่มีข้อมูลสำหรับการส่งออก กรุณาค้นหาข้อมูลก่อน');
      return;
    }
    
    // เตรียมข้อมูลสำหรับส่งออก - เพิ่มหัวเรื่องและสรุป
    const title = [
      ['รายงานผู้ป่วย STROKE I64 โรงพยาบาลโพนสวรรค์'],
      [`วันที่: ${this.dateRaw1 ? this.formatDateTH(this.dateRaw1) : ''} ถึง ${this.dateRaw2 ? this.formatDateTH(this.dateRaw2) : ''}`],
      [''],
      ['รายงานข้อมูลผู้ป่วย:'],
      [`จำนวนผู้ป่วยทั้งหมด: ${this.patients.length} ราย`],
      [`วันที่ออกรายงาน: ${dayjs().format('DD/MM/YYYY')}`],
      ['']
    ];
    
    // เพิ่มส่วนหัวของตาราง
    const headers = [
      ['ลำดับ', 'HN', 'CID', 'ชื่อ-สกุล', 'อายุ', 'วันที่', 'ICD', 'ICDNAME', 'บ้านเลขที่', 'หมู่', 'ตำบล', 'รพ.สต.']
    ];
    
    // เตรียมข้อมูลในรูปแบบ Array
    const data = this.patients.map(patient => [
      patient.sequence,
      patient.hn,
      patient.cid,
      patient.fullname,
      patient.age,
      patient.vstdate,
      patient.icd,
      patient.icdname,
      patient.num,
      patient.moo,
      patient.tum,
      patient.hospital
    ]);
    
    // รวมทั้งหมดเข้าด้วยกัน
    const allData = [...title, ...headers, ...data];
    
    // สร้าง Worksheet จาก Array (แทนการใช้ json_to_sheet)
    const ws = XLSX.utils.aoa_to_sheet(allData);
    
    // ปรับความกว้างของคอลัมน์
    const wscols = [
      { wch: 6 },  // ลำดับ
      { wch: 10 }, // HN
      { wch: 17 }, // CID
      { wch: 25 }, // ชื่อ-สกุล
      { wch: 7 },  // อายุ
      { wch: 15 }, // วันที่
      { wch: 8 },  // ICD
      { wch: 30 }, // ICDNAME
      { wch: 10 }, // บ้านเลขที่
      { wch: 8 },  // หมู่
      { wch: 15 }, // ตำบล
      { wch: 20 }  // รพ.สต.
    ];
    ws['!cols'] = wscols;
    
    // สร้าง Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stroke_I64');
    
    // สร้างชื่อไฟล์
    const d1 = this.dateRaw1 ? dayjs(this.dateRaw1).format('YYYYMMDD') : '';
    const d2 = this.dateRaw2 ? dayjs(this.dateRaw2).format('YYYYMMDD') : '';
    const fileName = `STROKE_I64_${d1}_to_${d2}.xlsx`;
    
    // ดาวน์โหลดไฟล์
    XLSX.writeFile(wb, fileName);
    
    // แจ้งเตือนการส่งออกสำเร็จ
    alert('ส่งออกข้อมูลเป็น Excel สำเร็จ');
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการส่งออกเป็น Excel:', error);
    alert('เกิดข้อผิดพลาดในการส่งออกข้อมูล: ' + error.message);
  }
},

  calculateRowIndex(index) {
    // คำนวณลำดับแถวที่ถูกต้องโดยพิจารณาจากหน้าปัจจุบันและจำนวนแถวต่อหน้า
    return (this.currentPage - 1) * this.rowsPerPage + index + 1
  }
}
}
</script>

<style scoped>
/* เพิ่มตามต้องการ */
</style>