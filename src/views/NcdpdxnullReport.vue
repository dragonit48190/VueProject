<template>
  <MainLayout>
    <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
      <div class="breadcrumb-title pe-3">Tables</div>
      <div class="ps-3">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-0 p-0">
            <li class="breadcrumb-item"><a href="/"><i class="bx bx-home-alt"></i></a></li>
            <li class="breadcrumb-item active" aria-current="page"> NCD PDX NULL </li>
          </ol>
        </nav>
      </div>
    </div>
    <hr />
    <div class="row row-cols-1 row-cols-2">
      <div class="col-12">
        <h6 class="mb-0 text-uppercase">ค้นหารายชื่อ ยังไม่ลงวินิจฉัย แผนก NCDs  </h6>
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

    <h6 class="mb-0 text-uppercase text-primary">รายชื่อผู้ป่วยยังไม่ลงวินิจฉัย แผนก NCDs โรงพยาบาลโพนสวรรค์ </h6>
    <hr />
    <div class="card">
      <div class="card-body">
        <div class="mb-3 d-flex justify-content-end">
  <button class="btn btn-primary" @click="exportToExcel">
    <i class="bx bx-export me-1"></i> Export Excel
  </button>
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
// นำเข้า constants ที่เราสร้าง
import API_ROUTES from '@/constants/apiRoutes';

dayjs.locale('th')

export default {
  name: 'NcdpdxnullReport',
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
        { text: 'ชื่อ - สกุล', value: 'ptname' },
        { text: 'วันที่', value: 'vstdate' },
        { text: 'เวลา', value: 'vsttime' },
        { text: 'สิทธิ', value: 'pttype' },
        { text: 'ICD', value: 'icd' },
        { text: 'ซักประวัติ', value: 'cc' },
        { text: 'ค่ารักษา', value: 'income' },
        { text: 'แผนก', value: 'department' }
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
        this.isLoading = true;
        // ใช้ constants แทนการเขียน string โดยตรง
        const res = await api.get(API_ROUTES.NCDPDXNULL, {
          params: { date1: d1, date2: d2 }
        });
        
        // เพิ่มลำดับให้กับข้อมูลก่อนแสดงผล
        this.patients = res.data.map((patient, index) => {
          return {
            ...patient,
            sequence: index + 1
          }
        })
        this.currentPage = 1 // รีเซ็ตกลับหน้าแรกเมื่อมีการค้นหาใหม่
      } catch (err) {
        console.error('โหลดข้อมูลผิดพลาด:', err)
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

    // ส่งออกข้อมูลเป็น Excel Report 
    exportToExcel() {
  try {
    // ตรวจสอบข้อมูล
    if (this.patients.length === 0) {
      alert('ไม่มีข้อมูลสำหรับการส่งออก กรุณาค้นหาข้อมูลก่อน');
      return;
    }
    
    // สร้างข้อมูลสำหรับ Excel
    const dateRange = `${this.formatDateTH(this.dateRaw1)} ถึง ${this.formatDateTH(this.dateRaw2)}`;
    
    const excelData = [
      ['รายงานผู้ป่วยแผนก NCD ยังไม่ลงวินิจฉัย โรงพยาบาลโพนสวรรค์'],
      [`วันที่: ${dateRange}`],
      [`จำนวนผู้ป่วยทั้งหมด: ${this.patients.length} ราย | วันที่ออกรายงาน: ${dayjs().format('DD/MM/YYYY')}`],
      [], // บรรทัดว่าง
      // Headers
      ['ลำดับ', 'HN', 'CID', 'ชื่อ-สกุล','วันที่', 'เวลา', 'สิทธิ', 'ICD', 'ซักประวัติ', 'ค่ารักษา', 'แผนก'],
      // Data
      ...this.patients.map(p => [
        p.sequence, p.hn, p.cid, p.ptname, p.vstdate, 
        p.vsttime, p.pttype, p.icd, p.cc, p.income, p.department
      ])
    ];
    
    // สร้าง worksheet และ workbook
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'NCD Pdx Null');
    
    // กำหนดชื่อไฟล์และดาวน์โหลด
    const fileName = `COPDER_${dayjs(this.dateRaw1).format('YYYYMMDD')}_to_${dayjs(this.dateRaw2).format('YYYYMMDD')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    alert('ส่งออกข้อมูลเป็น Excel สำเร็จ');
    
  } catch (error) {
    console.error('Excel Export Error:', error);
    alert('เกิดข้อผิดพลาด: ' + error.message);
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