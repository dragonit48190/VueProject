<template>
    <MainLayout>
      <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
        <div class="breadcrumb-title pe-3">Tables</div>
        <div class="ps-3">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0 p-0">
              <li class="breadcrumb-item"><a href="/"><i class="bx bx-home-alt"></i></a></li>
              <li class="breadcrumb-item active" aria-current="page">INFLUENZA VACCINE</li>
            </ol>
          </nav>
        </div>
      </div>
      <hr />
      
      <div class="row">
        <div class="col-12">
          <h6 class="mb-0 text-uppercase">ค้นหาฉีดวัคซีนไข้หวัดใหญ่ INFLUENZA (Influenza Vaccine)</h6>
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
                  พบฉีด Influenza Vaccine จำนวน <strong>{{ patients.length.toLocaleString() }}</strong> รายการ
                  ในช่วงวันที่ {{ formatDateRange() }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- ส่วนตาราง และ กราฟ แบ่ง 2 คอลัมน์ -->
      <div class="row">
        <!-- คอลัมน์ซ้าย - ตาราง -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h6 class="mb-0 text-uppercase text-primary">
                <i class="bx bx-list-ul me-1"></i>
                ฉีด Vaccine Influenza
                <span v-if="patients.length > 0" class="badge bg-primary ms-2">{{ patients.length }} รายการ</span>
              </h6>
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
  
              <div v-else>
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
                
                <!-- ยอดรวมใต้ตาราง -->
                <div class="mt-3 p-3 total-summary rounded">
                  <div class="row align-items-center">
                    <div class="col-8">
                      <h6 class="mb-0">
                        <i class="bx bx-calculator me-1 text-primary"></i>
                        ยอดรวมครั้งที่ฉีดทั้งหมด
                      </h6>
                      <small class="text-muted">จากข้อมูลที่แสดงในตาราง</small>
                    </div>
                    <div class="col-4 text-end">
                      <h4 class="mb-0 text-primary fw-bold">
                        {{ totalVisits.toLocaleString() }} ครั้ง
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- คอลัมน์ขวา - กราฟ -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header">
              <h6 class="mb-0 text-uppercase text-info">
                <i class="bx bx-bar-chart-alt-2 me-1"></i>
                กราฟแสดงข้อมูล Vaccine Lot
              </h6>
            </div>
            <div class="card-body">
              <!-- ใช้ Chart Component -->
              <VaccineLotChart v-if="patients.length > 0" :data="patients" />
              
              <!-- เมื่อไม่มีข้อมูล -->
              <div v-else class="text-center py-5">
                <i class="bx bx-bar-chart-alt display-1 text-muted"></i>
                <p class="mt-3 text-muted">กราฟจะแสดงเมื่อมีข้อมูล</p>
              </div>
            </div>
          </div>
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
  import API_ROUTES from '@/constants/apiRoutes'
  import VaccineLotChart from '@/components/VaccineLotChart.vue'
  
  dayjs.locale('th')
  
  export default {
    name: 'InflulotnullReport',
    components: {
      MainLayout,
      flatPickr: FlatPickr,
      EasyDataTable,
      VaccineLotChart
    },
    data() {
      return {
        dateRaw1: null,
        dateRaw2: null,
        patients: [],
        loading: false,
        currentPage: 1,
        rowsPerPage: 10,
        headers: [
          { text: 'ลำดับ', value: 'sequence' },
          { text: 'VACCINE', value: 'vaccine' },
          { text: 'LOT', value: 'lot_vaccine' },
          { text: 'จำนวน', value: 'visit' }
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
    computed: {
      // คำนวณยอดรวมครั้งที่ฉีด
      totalVisits() {
        return this.patients.reduce((sum, patient) => {
          return sum + (parseInt(patient.visit) || 0)
        }, 0)
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
          this.loading = true
          
          const res = await api.get(API_ROUTES.INFLULOTNULL, {
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
  
  .total-summary {
    background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
    border-left: 4px solid #1976d2;
    border-radius: 8px;
  }
  </style>