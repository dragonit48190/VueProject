.total-income {
  background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%);
  border-left: 4px solid #198754;
  border-radius: 8px;
}<template>
  <MainLayout>
    <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
      <div class="breadcrumb-title pe-3">Tables</div>
      <div class="ps-3">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-0 p-0">
            <li class="breadcrumb-item"><a href="/"><i class="bx bx-home-alt"></i></a></li>
            <li class="breadcrumb-item active" aria-current="page">PTTYPE</li>
          </ol>
        </nav>
      </div>
    </div>
    <hr />
    
    <div class="row">
      <div class="col-12">
        <h6 class="mb-0 text-uppercase">ค้นหารายการรักษาแยกตามสิทธิ PTTYPE (Pttype)</h6>
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
                  @click.prevent="fetchPttypeData"
                  :disabled="loading"
                >
                  <i class="bx bx-search-alt" :class="{ 'bx-spin': loading }"></i>
                  <span>{{ loading ? 'กำลังค้นหา...' : 'ค้นหาข้อมูล' }}</span>
                </button>
              </div>
            </form>
            
            <!-- แสดงข้อมูลสรุป -->
              <div v-if="pttypeData.length > 0" class="mt-3">
                <div class="alert alert-primary py-2">
                  <i class="bx bx-check-circle me-1"></i>
                  พบข้อมูล PTTYPE จำนวน <strong>{{ pttypeData.length.toLocaleString() }}</strong> รายการ
                  ในช่วงวันที่ {{ formatDateRange() }}
                  <div class="mt-2">
                    <small class="text-muted">
                      <i class="bx bx-calendar me-1"></i>รวม {{ totalPttypeVisits.toLocaleString() }} ครั้ง 
                      <i class="bx bx-money ms-3 me-1"></i>{{ totalPttypeIncome.toLocaleString() }} บาท
                    </small>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ส่วนตาราง และ กราฟ แบ่ง 2 คอลัมน์ -->
    <div class="row">
      <!-- คอลัมน์ซ้าย - ตาราง -->
      <div class="col-lg-5 col-md-12 mb-3">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="mb-0 text-uppercase text-primary">
              <i class="bx bx-list-ul me-1"></i>
              รายการรักษาแยกตามสิทธิ PTTYPE
              <span v-if="pttypeData.length > 0" class="badge bg-primary ms-2">{{ pttypeData.length }} รายการ</span>
            </h6>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">กำลังค้นหา...</span>
              </div>
              <p class="mt-2 text-muted">กำลังค้นหาข้อมูล...</p>
            </div>
            
            <div v-else-if="pttypeData.length === 0 && !loading" class="text-center py-4">
              <i class="bx bx-search-alt display-4 text-muted"></i>
              <p class="mt-2 text-muted">ไม่พบข้อมูล กรุณาเลือกช่วงวันที่และกดค้นหา</p>
            </div>

            <div v-else>
              <EasyDataTable
                :headers="headers"
                :items="formattedPttypeData || []"
                :rows-per-page="10"
                table-class="custom-table"
                header-text-align="center"
                body-text-align="left"
                @page-change="onPageChange"
              >
                <!-- Custom slot สำหรับคอลัมน์ จำนวนครั้ง -->
                <template #item-visit_formatted="{ item }">
                <span 
                  v-if="item"
                  class="visit-clickable"
                  style="cursor: pointer; color: blue; text-decoration: underline;"
                  @click="fetchDetailByPttype(item.pttype, item.pttype_name || 'สิทธิ ' + item.pttype)"
                  title="คลิกเพื่อดูรายละเอียด"
                >
                  {{ item.visit || '0' }}
                </span>
              </template>
              </EasyDataTable>
              
              <!-- ยอดรวมใต้ตาราง -->
              <div class="mt-3">
                <!-- ยอดรวมจำนวนครั้ง -->
                <div class="p-3 total-summary rounded mb-2">
                  <div class="row align-items-center">
                    <div class="col-8">
                      <h6 class="mb-0">
                        <i class="bx bx-calculator me-1 text-primary"></i>
                        ยอดรวมสิทธิทั้งหมด
                      </h6>
                      <small class="text-muted">จำนวนครั้งการรักษา</small>
                    </div>
                    <div class="col-4 text-end">
                      <h4 class="mb-0 text-primary fw-bold">
                        {{ totalPttypeVisits.toLocaleString() }} ครั้ง
                      </h4>
                    </div>
                  </div>
                </div>
                
                <!-- ยอดรวมค่าใช้จ่าย -->
                <div class="p-3 total-income rounded">
                  <div class="row align-items-center">
                    <div class="col-8">
                      <h6 class="mb-0">
                        <i class="bx bx-money me-1 text-success"></i>
                        ยอดรวมค่าใช้จ่าย
                      </h6>
                      <small class="text-muted">รายได้จากการรักษา</small>
                    </div>
                    <div class="col-4 text-end">
                      <h4 class="mb-0 text-success fw-bold">
                        {{ totalPttypeIncome.toLocaleString() }} บาท
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- คอลัมน์ขวา - กราฟ -->
      <div class="col-lg-7 col-md-12 mb-3">
        <div class="card h-100">
          <div class="card-header">
            <h6 class="mb-0 text-uppercase text-info">
              <i class="bx bx-bar-chart-alt-2 me-1"></i>
              กราฟแสดงข้อมูล PTTYPE
            </h6>
          </div>
          <div class="card-body">
            <!-- ใช้ Chart Component -->
            <div v-if="pttypeData.length > 0">
              <PttypeChart :data="pttypeData" />
            </div>
            
            <!-- เมื่อไม่มีข้อมูล -->
            <div v-else class="text-center py-5">
              <i class="bx bx-bar-chart-alt display-1 text-muted"></i>
              <p class="mt-3 text-muted">กราฟจะแสดงเมื่อมีข้อมูล</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ส่วนตารางรายละเอียด -->
<div class="card" v-if="selectedPttype">
  <div class="card-header d-flex justify-content-between align-items-center">
      <h6 class="mb-0 text-uppercase text-success">
        <i class="bx bx-user-detail me-1"></i>
        รายละเอียดผู้ป่วย {{ selectedPttype?.pttype_name || `สิทธิ ${selectedPttype?.pttype}` }}
        <span v-if="detailData.length > 0" class="badge bg-success ms-2">{{ detailData.length }} ราย</span>
      </h6>
      <div class="d-flex gap-2">
      <button 
        class="btn btn-sm btn-success" 
        @click="exportDetailToExcel"
        :disabled="!detailData || detailData.length === 0"
        title="ส่งออกข้อมูลเป็น Excel"
      >
        <i class="bx bx-download me-1"></i>
        Export Excel
      </button>
    </div>
      <button 
        class="btn btn-sm btn-outline-secondary" 
        @click="selectedPttype = null; detailData = []"
        title="ปิดรายละเอียด"
      >
        <i class="bx bx-x"></i>
      </button>
  </div>
  <div class="card-body">
    <div v-if="loadingDetail" class="text-center py-4">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">กำลังโหลดรายละเอียด...</span>
      </div>
      <p class="mt-2 text-muted">กำลังโหลดรายละเอียดผู้ป่วย...</p>
    </div>
    
    <div v-else-if="detailData.length === 0" class="text-center py-4">
      <i class="bx bx-user-x display-4 text-muted"></i>
      <p class="mt-2 text-muted">ไม่พบข้อมูลผู้ป่วยในสิทธินี้</p>
    </div>

    <div v-else>
        <div class="mb-3 p-2 bg-light rounded">
          <i class="bx bx-info-circle text-success me-2"></i>
          <span class="text-success fw-bold">พบข้อมูลผู้ป่วย {{ detailData.length }} ราย</span> 
        </div>
        <EasyDataTable
          :headers="detailHeaders"
          :items="formattedDetailData"
          :rows-per-page="15"
          table-class="detail-table"
          header-text-align="center"
          body-text-align="left"
        >
        </EasyDataTable>
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
  import PttypeChart from '@/components/PttypeChart.vue'
  import * as XLSX from 'xlsx'

  
  dayjs.locale('th')
  
  export default {
  name: 'PttypesumReport',
  components: {
    MainLayout,
    PttypeChart,
    flatPickr: FlatPickr,
    EasyDataTable
  },
  data() {
    return {
      dateRaw1: null,
      dateRaw2: null,
      pttypeData: [],
      detailData: [],       
      selectedPttype: null,  
      loadingDetail: false, 
      loading: false,
      currentPage: 1,
      rowsPerPage: 10,
      headers: [
        { text: 'ลำดับ', value: 'sequence' },
        { text: 'รหัสสิทธิ', value: 'pttype' },
        { text: 'สิทธิ', value: 'pttype_name' },
        { text: 'รายการค่ารักษา (บาท)', value: 'income_formatted' },
        { text: 'จำนวนครั้ง', value: 'visit' }  
      ],
        detailHeaders: [
        { text: 'ลำดับ', value: 'sequence' },
        { text: 'HN', value: 'hn' },
        { text: 'CID', value: 'cid' },
        { text: 'ชื่อ-สกุล', value: 'ptname' },
        { text: 'อายุ', value: 'age' },
        { text: 'วันที่รักษา', value: 'vstdate' },
        { text: 'ICD', value: 'icd' },
        { text: 'สิทธิ', value: 'pttype_name' },
        { text: 'ค่ารักษา (บาท)', value: 'income_formatted' }
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
    totalPttypeVisits() {
      return this.pttypeData.reduce((sum, item) => {
        return sum + (parseInt(item.visit) || 0)
      }, 0)
    },
    totalPttypeIncome() {
      return this.pttypeData.reduce((sum, item) => {
        return sum + (parseFloat(item.income) || 0)
      }, 0)
    },
    formattedPttypeData() {
  if (!this.pttypeData || this.pttypeData.length === 0) return []
  
  return this.pttypeData.map(item => {
    if (!item) return {}
    
    return {
      ...item,
      visit_formatted: parseInt(item.visit || 0).toLocaleString(),
      income_formatted: parseFloat(item.income || 0).toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  })
},
formattedDetailData() {
    if (!this.detailData || this.detailData.length === 0) return []
    
    return this.detailData.map(item => ({
      ...item,
      income_formatted: parseFloat(item.income || 0).toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }))
  }
  },
  methods: {
  async fetchPttypeData() {
    if (!this.dateRaw1 || !this.dateRaw2) {
      alert('กรุณาเลือกช่วงวันที่')
      return
    }
    
    const d1 = dayjs(this.dateRaw1).format('YYYY-MM-DD')
    const d2 = dayjs(this.dateRaw2).format('YYYY-MM-DD')

    try {
      this.loading = true
      
      const res = await api.get(API_ROUTES.PTTYPESUM, {
        params: { date1: d1, date2: d2 }
      })
      
      // ปรับให้รองรับ response structure ใหม่
      const responseData = res.data.data || res.data
      
      // เพิ่มลำดับให้กับข้อมูลก่อนแสดงผล
      this.pttypeData = responseData.map((item, index) => ({
        ...item,
        sequence: index + 1
      }))
      
      this.$nextTick(() => {
  console.log('Looking for table...')
  
  // ลองหาด้วย selector อื่น
  const table = document.querySelector('table') || 
                document.querySelector('.vue3-easy-data-table__main') ||
                document.querySelector('[table-class="custom-table"]')
                
  console.log('Table found:', table)
  
  if (table) {
    const cells = table.querySelectorAll('tbody td:nth-child(5)')
    console.log('Cells found:', cells.length)
    
    cells.forEach((cell, index) => {
      cell.style.cursor = 'pointer'
      cell.onclick = () => {
        const item = this.pttypeData[index]
        if (item) {
          this.fetchDetailByPttype(item.pttype, item.pttype_name || `สิทธิ ${item.pttype}`)
        }
      }
    })
  }
})
      this.currentPage = 1 // รีเซ็ตกลับหน้าแรกเมื่อมีการค้นหาใหม่
      
    } catch (err) {
      console.error('โหลดข้อมูลผิดพลาด:', err)
      alert('เกิดข้อผิดพลาดในการค้นหา: ' + (err.response?.data?.error || err.message))
    } finally {
      this.loading = false
    }
  },

  async fetchDetailByPttype(pttype, pttype_name) {
    if (!this.dateRaw1 || !this.dateRaw2) {
      alert('กรุณาเลือกช่วงวันที่')
      return
    }
    
    const d1 = dayjs(this.dateRaw1).format('YYYY-MM-DD')
    const d2 = dayjs(this.dateRaw2).format('YYYY-MM-DD')

    try {
      this.loadingDetail = true
      this.selectedPttype = { pttype, pttype_name }
      
      const res = await api.get(API_ROUTES.SUBTYPE, {
        params: { 
          date1: d1, 
          date2: d2, 
          pttype: pttype 
        }
      })
      
      const responseData = res.data.data || res.data
      this.detailData = responseData
      
    } catch (err) {
      console.error('โหลดข้อมูลรายละเอียดผิดพลาด:', err)
      alert('เกิดข้อผิดพลาดในการดึงข้อมูลรายละเอียด: ' + (err.response?.data?.error || err.message))
    } finally {
      this.loadingDetail = false
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
// ส่งออกข้อมูลรายละเอียดผู้ป่วยเป็น Excel
exportDetailToExcel() {
  try {
    // ตรวจสอบข้อมูล
    if (!this.detailData || this.detailData.length === 0) {
      alert('ไม่มีข้อมูลรายละเอียดผู้ป่วยสำหรับการส่งออก')
      return
    }
    
    // สร้างข้อมูลสำหรับ Excel
    const dateRange = this.formatDateRange()
    const pttypeName = this.selectedPttype?.pttype_name || 'ไม่ระบุสิทธิ'
    
    const excelData = [
      [`รายงานรายละเอียดผู้ป่วยตามสิทธิ PTTYPE โรงพยาบาลโพนสวรรค์`],
      [`สิทธิ: ${pttypeName}`],
      [`ช่วงวันที่: ${dateRange}`],
      [`วันที่ออกรายงาน: ${dayjs().format('DD/MM/YYYY HH:mm:ss')}`],
      [`จำนวนผู้ป่วยทั้งหมด: ${this.detailData.length} ราย`],
      [], // บรรทัดว่าง
      // Headers
      ['ลำดับ', 'HN', 'CID', 'ชื่อ-สกุล', 'อายุ', 'วันที่รักษา', 'ICD', 'สิทธิ', 'ค่ารักษา (บาท)'],
      // Data
      ...this.detailData.map((item, index) => [
        index + 1, 
        item.hn, 
        item.cid, 
        item.ptname, 
        item.age, 
        item.vstdate, 
        item.icd, 
        item.pttype_name,
        parseFloat(item.income || 0).toFixed(2)
      ])
    ]
    
    // สร้าง worksheet และ workbook
    const ws = XLSX.utils.aoa_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'รายละเอียดผู้ป่วย')
    
    // กำหนดชื่อไฟล์และดาวน์โหลด
    const pttypeCode = this.selectedPttype?.pttype || 'Unknown'
    const fileName = `PTTYPE_Detail_${pttypeCode}_${dayjs(this.dateRaw1).format('YYYYMMDD')}_to_${dayjs(this.dateRaw2).format('YYYYMMDD')}.xlsx`
    XLSX.writeFile(wb, fileName)
    
    alert('ส่งออกข้อมูลรายละเอียดผู้ป่วยเป็น Excel สำเร็จ')
    
  } catch (error) {
    console.error('Excel Export Error:', error)
    alert('เกิดข้อผิดพลาดในการส่งออก: ' + error.message)
  }
},
  calculateRowIndex(index) {
    return (this.currentPage - 1) * this.rowsPerPage + index + 1
  }
}

}
</script>

<style scoped>
.custom-table {
  --easy-table-header-font-size: 14px;
  --easy-table-body-row-font-size: 13px;
  --easy-table-border: 1px solid #dee2e6;
  --easy-table-row-border: 1px solid #dee2e6;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: #495057;
  --easy-table-header-background-color: #f8f9fa;
  --easy-table-body-even-row-font-color: #212529;
  --easy-table-body-even-row-background-color: #ffffff;
  --easy-table-body-row-font-color: #212529;
  --easy-table-body-row-background-color: #f8f9fa;
  --easy-table-body-row-height: 46px;
  --easy-table-body-row-hover-font-color: #2c5aa0;
  --easy-table-body-row-hover-background-color: #e3f2fd;
}

/* จัดตำแหน่งคอลัมน์ตัวเลขให้อยู่ขวา */
:deep(.custom-table) {
  tbody td:nth-child(4),
  tbody td:nth-child(5) {
    text-align: right !important;
    font-weight: 600;
    font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    letter-spacing: 0.5px;
  }
  
  /* คอลัมน์ค่ารักษา - สีเขียว */
  tbody td:nth-child(4) {
    color: #198754 !important;
    background: rgba(25, 135, 84, 0.05) !important;
  }
  
  /* คอลัมน์จำนวนครั้ง - สีน้ำเงิน + คลิกได้ */
  tbody td:nth-child(5) {
    color: #0d6efd !important;
    background: rgba(13, 110, 253, 0.05) !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
  }
  
  /* เมื่อ hover ที่คอลัมน์จำนวนครั้ง */
  tbody td:nth-child(5):hover {
    background: rgba(13, 110, 253, 0.2) !important;
    color: #0a58ca !important;
    transform: scale(1.05) !important;
  }
  
  /* Header alignment */
  thead th:nth-child(4),
  thead th:nth-child(5) {
    text-align: right !important;
  }
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

.total-income {
  background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%);
  border-left: 4px solid #198754;
  border-radius: 8px;
}
/* Detail table styling */
:deep(.detail-table) {
  --easy-table-header-font-size: 13px;
  --easy-table-body-row-font-size: 12px;
  --easy-table-border: 1px solid #28a745;
  --easy-table-row-border: 1px solid #d4edda;
  --easy-table-header-height: 45px;
  --easy-table-header-font-color: #155724;
  --easy-table-header-background-color: #d4edda;
  --easy-table-body-row-height: 40px;
  --easy-table-body-row-hover-background-color: #f8fff9;
}

:deep(.detail-table) tbody td:nth-child(9) {
  text-align: right !important;
  color: #28a745 !important;
  font-weight: 600;
}
.bx-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>