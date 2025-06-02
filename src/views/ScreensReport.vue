<template>
    <MainLayout>
      <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
        <div class="breadcrumb-title pe-3">Tables</div>
        <div class="ps-3">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0 p-0">
              <li class="breadcrumb-item"><a href="/"><i class="bx bx-home-alt"></i></a></li>
              <li class="breadcrumb-item active" aria-current="page">SCREENS REPORT</li>
            </ol>
          </nav>
        </div>
      </div>
      <hr />
      
      <div class="row">
        <div class="col-12">
          <div class="card border-top border-0 border-4 border-primary">
            <div class="card-body p-4">
              <div class="card-title d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div><i class="bx bxs-user-detail me-2 font-22 text-primary"></i></div>
                  <h5 class="mb-0 text-primary">รายชื่อคัดกรองอายุ 35 ปี ขึ้นไป</h5>
                </div>
                <button 
                  class="btn btn-primary d-flex align-items-center gap-2" 
                  @click="fetchData"
                  :disabled="loading"
                >
                  <i class="bx bx-refresh" :class="{ 'bx-spin': loading }"></i>
                  <span>{{ loading ? 'กำลังโหลด...' : 'โหลดข้อมูล' }}</span>
                </button>
              </div>
              <hr>
              <div class="row">
                <div class="col-md-6">
                  <p class="mb-1"><strong>หน่วยงาน :</strong> โรงพยาบาลโพนสวรรค์</p>
                  <p class="mb-1"><strong>คลินิก :</strong> คัดกรองอายุ 35 ปี ขึ้นไป</p>
                  <p class="mb-0"><strong>จำนวน :</strong> {{ patients.length.toLocaleString() }} ราย </p>

                </div>
                <div class="col-md-6">
                  <!-- สถิติจำนวนผู้ป่วย -->
                  <div class="alert bg-gradient-lush text-white text-white py-2 mb-0 mt-2">
                    <i class="bx bx-info-circle me-1"></i>
                    รายงานนี้แสดงข้อมูลปัจจุบันทั้งหมด ไม่ต้องเลือกช่วงวันที่
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0 text-uppercase text-success">
            <i class="bx bx-list-ul me-1"></i>
            รายชื่อคัดกรองอายุ 35 ปี ขึ้นไป 
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
              <span class="visually-hidden">กำลังโหลด...</span>
            </div>
            <p class="mt-2 text-muted">กำลังดึงข้อมูล...</p>
          </div>
          
          <div v-else-if="patients.length === 0 && !loading" class="text-center py-4">
            <i class="bx bx-search-alt display-4 text-muted"></i>
            <p class="mt-2 text-muted">ไม่มีข้อมูล กรุณากดปุ่ม "โหลดข้อมูล" เพื่อดึงข้อมูล</p>
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
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import * as XLSX from 'xlsx'
import API_ROUTES from '@/constants/apiRoutes'

dayjs.locale('th')

export default {
  name: 'ScreensReport',
  components: {
    MainLayout,
    EasyDataTable
  },
  data() {
    return {
      patients: [],
      loading: false,
      currentPage: 1,
      rowsPerPage: 15,
      headers: [
        { text: 'ลำดับ', value: 'sequence' },
        { text: 'HN', value: 'hn' },
        { text: 'CID', value: 'cid' },
        { text: 'ชื่อ - สกุล', value: 'ptname' },
        { text: 'เพศ', value: 'sex' },
        { text: 'อายุ', value: 'age' },
        { text: 'นน.', value: 'bw' },
        { text: 'สูง', value: 'hi' },
        { text: 'รอบเอว', value: 'wait' },
        { text: 'สิทธิ', value: 'tname' },
        { text: 'เลขที่', value: 'num' },
        { text: 'หมู่', value: 'moo' },
        { text: 'บ้าน', value: 'ban' },
        { text: 'สถานะ', value: 'status' }

      ]
    }
  },
  mounted() {
    // โหลดข้อมูลทันทีเมื่อเข้าหน้า
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true
        const res = await api.get(API_ROUTES.SCREENS)
        
        // เพิ่มลำดับให้กับข้อมูลก่อนแสดงผล
        this.patients = res.data.data.map((patient, index) => ({
          ...patient,
          sequence: index + 1
        }))
        
        this.currentPage = 1 // รีเซ็ตกลับหน้าแรก
      } catch (err) {
        console.error('โหลดข้อมูลผิดพลาด:', err)
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + (err.response?.data?.error || err.message))
      } finally {
        this.loading = false
      }
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
        
        const excelData = [
          ['รายงานคัดกรองอายุ 35 ปี ขึ้นไป  โรงพยาบาลโพนสวรรค์'],
          [`วันที่ออกรายงาน: ${dayjs().format('DD/MM/YYYY HH:mm:ss')}`],
          [`จำนวนผู้ป่วยทั้งหมด: ${this.patients.length} ราย`],
          [], // บรรทัดว่าง
          // Headers
          ['ลำดับ', 'HN', 'CID', 'ชื่อ-สกุล', 'เพศ', 'อายุ', 'นน.', 'สูง', 'รอบเอว', 'สิทธิ', 'เลขที่', 'หมู่', 'บ้าน', 'สถานะ'],
          // Data
          ...this.patients.map(p => [
            p.sequence, p.hn, p.cid, p.ptname, p.sex, p.age, p.bw, 
            p.hi, p.wait, p.tname, p.num, p.moo, p.ban, p.status
          ])
        ]
        
        // สร้าง worksheet และ workbook
        const ws = XLSX.utils.aoa_to_sheet(excelData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'SCREENS 35')
        
        // กำหนดชื่อไฟล์และดาวน์โหลด
        const fileName = `SCREENS_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`
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