<template>
  <MainLayout>
    <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
      <div class="breadcrumb-title pe-3">Tables</div>
      <div class="ps-3">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-0 p-0">
            <li class="breadcrumb-item"><a href="/"><i class="bx bx-home-alt"></i></a></li>
            <li class="breadcrumb-item active" aria-current="page"> ADMIT IPD</li>
          </ol>
        </nav>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col-12">
        <h6 class="mb-0 text-uppercase">ค้นหารายชื่อ Admit รวมทุกตึก </h6>
        <hr />
        <div class="card border-top border-0 border-4 border-primary">
          <div class="card-body p-4">
            <div class="card-title d-flex align-items-center">
              <div><i class="bx bxs-calendar-heart me-2 font-22 text-primary"></i></div>
              <h5 class="mb-0 text-primary">เลือกช่วงวันที่ : ถึงวันที่ ที่คุณต้องการค้นหา</h5>
            </div>
            <hr>
            <form class="row g-3">
              <div class="col-md-3">
                <label for="dateStart" class="form-label">วันที่เริ่มต้น</label>
                <flat-pickr 
                  v-model="dateRaw1" 
                  :config="config" 
                  class="form-control"
                  placeholder="เลือกวันที่เริ่มต้น"
                />
              </div>
              <div class="col-md-3">
                <label for="dateEnd" class="form-label">วันที่สิ้นสุด</label>
                <flat-pickr 
                  v-model="dateRaw2" 
                  :config="config" 
                  class="form-control"
                  placeholder="เลือกวันที่สิ้นสุด"
                />
              </div>
              <div class="col-md-6 d-flex align-items-end">
                <button 
                  class="btn btn-primary d-flex align-items-center gap-2" 
                  @click.prevent="fetchData"
                  :disabled="loading"
                >
                  <i class="bx bx-search-alt" :class="{ 'bx-spin': loading }"></i>
                  <span>{{ loading ? 'กำลังค้นหา...' : 'ค้นหาข้อมูล' }}</span>
                </button>
              </div>
            </form>
            
            <!-- แสดงข้อมูลสรุป -->
            <div v-if="patients.length > 0" class="mt-3">
              <div class="alert alert-primary py-2">
                <i class="bx bx-check-circle me-1"></i>
                พบรายชื่อ Admit รวมทุกตึก <strong>{{ patients.length.toLocaleString() }}</strong> ราย 
                ในช่วงวันที่ {{ formatDateRange() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ส่วนตาราง -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h6 class="mb-0 text-uppercase text-primary">
          <i class="bx bx-list-ul me-1"></i>
          รายชื่อ Admit รวม โรงพยาบาลโพนสวรรค์
          <span v-if="patients.length > 0" class="badge bg-primary ms-2">{{ patients.length }} ราย</span>
        </h6>
        <button 
          class="btn btn-primary btn-sm d-flex align-items-center gap-1" 
          @click="exportToExcel"
          :disabled="patients.length === 0"
        >
          <i class="bx bx-export"></i>
          <span>Export Excel</span>
        </button>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">กำลังค้นหา...</span>
          </div>
          <p class="mt-2 text-muted">กำลังค้นหาข้อมูล...</p>
        </div>
        
        <div v-else-if="patients.length === 0 && !loading" class="text-center py-4">
          <i class="bx bx-search-alt display-4 text-muted"></i>
          <p class="mt-2 text-muted">ไม่พบข้อมูล กรุณาเลือกช่วงวันที่และกดค้นหา</p>
        </div>

        <EasyDataTable
          v-else
          :headers="headers"
          :items="patients"
          :rows-per-page="15"
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
import API_ROUTES from '@/constants/apiRoutes'

dayjs.locale('th')

export default {
  name: 'AdmitipdReport',
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
      loading: false,  // แก้จาก isLoading
      currentPage: 1,
      rowsPerPage: 15,  // เพิ่มจาก 10 เป็น 15
      headers: [
        { text: 'ลำดับ', value: 'sequence' },
        { text: 'AN', value: 'an' },
        { text: 'HN', value: 'hn' },
        { text: 'CID', value: 'cid' },
        { text: 'ชื่อ - สกุล', value: 'ptname' },
        { text: 'เพศ', value: 'sex' }, 
        { text: 'อายุ', value: 'age' },  
        { text: 'วันที่รับ', value: 'regdate' },
        { text: 'วันที่กลับ', value: 'dchdate' },
        { text: 'สถานะ', value: 'status' },
        { text: 'ICD', value: 'icd' },
        { text: 'ICDNAME', value: 'icdname' },
        { text: 'เลขที่', value: 'num' },
        { text: 'หมู่', value: 'moo' },
        { text: 'ตำบล', value: 'tum' },
        { text: 'รพ.สต.', value: 'hospital' },

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
        this.loading = true  // แก้จาก isLoading
        
        const res = await api.get(API_ROUTES.ADMITIPD, {
          params: { date1: d1, date2: d2 }
        })
        
        // ปรับให้รองรับ response structure ใหม่
        const responseData = res.data.data || res.data
        
        // เพิ่มลำดับให้กับข้อมูลก่อนแสดงผล
        this.patients = responseData.map((patient, index) => ({
          ...patient,
          sequence: index + 1
        }))
        
        this.currentPage = 1 // รีเซ็ตกลับหน้าแรกเมื่อมีการค้นหาใหม่
        
      } catch (err) {
        console.error('โหลดข้อมูลผิดพลาด:', err)
        alert('เกิดข้อผิดพลาดในการค้นหา: ' + (err.response?.data?.error || err.message))
      } finally {
        this.loading = false
      }
    },

    formatDateTH(dateStr) {
      if (!dateStr) return '-'
      const d = dayjs(dateStr)
      const buddhistYear = d.year() + 543
      return d.format('D MMMM ') + buddhistYear
    },

    formatDateRange() {
      if (!this.dateRaw1 || !this.dateRaw2) return ''
      return `${this.formatDateTH(this.dateRaw1)} ถึง ${this.formatDateTH(this.dateRaw2)}`
    },

    onPageChange(page) {
      this.currentPage = page
    },

    // ส่งออกข้อมูลเป็น Excel Report 
    exportToExcel() {
      try {
        // ตรวจสอบข้อมูล
        if (this.patients.length === 0) {
          alert('ไม่มีข้อมูลสำหรับการส่งออก')
          return
        }
        
        // สร้างข้อมูลสำหรับ Excel
        const dateRange = this.formatDateRange()
        
        const excelData = [
          ['รายงาน Admit รวม โรงพยาบาลโพนสวรรค์'],  
          [`ช่วงวันที่: ${dateRange}`],  // เพิ่มช่วงวันที่
          [`วันที่ออกรายงาน: ${dayjs().format('DD/MM/YYYY HH:mm:ss')}`],
          [`จำนวนผู้ป่วยทั้งหมด: ${this.patients.length} ราย`],
          [], // บรรทัดว่าง
          // Headers
          ['ลำดับ', 'AN','HN', 'CID', 'ชื่อ-สกุล', 'เพศ', 'อายุ', 'วันที่รับ', 'วันที่กลับ', 'สถานะ', 'ICD', 'ICDNAME', 'เลขที่', 'หมู่', 'ตำบล', 'รพ.สต.'],
          // Data
          ...this.patients.map(p => [
            p.sequence, p.an, p.hn, p.cid, p.ptname, p.sex,p.age, p.regdate, p.dchdate,  
            p.status, p.icd, p.icdname, p.num, p.moo, p.tum, p.hospital
          ])
        ]
        
        // สร้าง worksheet และ workbook
        const ws = XLSX.utils.aoa_to_sheet(excelData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Admit IPD')
        
        // กำหนดชื่อไฟล์และดาวน์โหลด
        const fileName = `ADMITIPD_${dayjs(this.dateRaw1).format('YYYYMMDD')}_to_${dayjs(this.dateRaw2).format('YYYYMMDD')}.xlsx`
        XLSX.writeFile(wb, fileName)
        
        alert('ส่งออกข้อมูลเป็น Excel สำเร็จ')
        
      } catch (error) {
        console.error('Excel Export Error:', error)
        alert('เกิดข้อผิดพลาดในการส่งออก: ' + error.message)
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
.custom-table {
  --easy-table-header-font-size: 14px;
  --easy-table-body-row-font-size: 13px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-border {
  width: 2rem;
  height: 2rem;
}
</style>