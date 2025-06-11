<template>
  <!--start Row IPD Ward Cards -->
  <div class="row">
    <!-- Admit LR -->
    <div class="col-xl-2 col-md-6 mb-4">
      <div class="card radius-10">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="flex-grow-1">
              <p class="mb-0 text-primary">Admit LR</p>
              <h4 class="font-weight-bold text-primary">
                {{ formatNumber(wardData.admit_lr) }} คน
              </h4>
              <p class="text-secondary mb-0 font-13">Admit LR</p>
            </div>
            <div class="widgets-icons bg-primary text-white">
              <i class='bx bx-face'></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Admit WARD ล่าง -->
    <div class="col-xl-2 col-md-6 mb-4">
      <div class="card radius-10">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="flex-grow-1">
              <p class="mb-0">Admit WARD ล่าง</p>
              <h4 class="font-weight-bold">
                {{ formatNumber(wardData.admit_ward1) }} คน
              </h4>
              <p class="text-secondary mb-0 font-13">Admit WARD 1</p>
            </div>
            <div class="widgets-icons bg-gradient-moonlit text-white">
              <i class='bx bx-hotel'></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- มินิธัญญารักษ์ -->
    <div class="col-xl-2 col-md-6 mb-4">
      <div class="card radius-10">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="flex-grow-1">
              <p class="mb-0 text-success">มินิธัญญารักษ์</p>
              <h4 class="font-weight-bold text-success">
                {{ formatNumber(wardData.admit_mini) }} คน
              </h4>
              <p class="text-secondary mb-0 font-13">Admit มินิฯ</p>
            </div>
            <div class="widgets-icons bg-success text-white">
              <i class='bx bx-group'></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Admit WARD 2 -->
    <div class="col-xl-2 col-md-6 mb-4">
      <div class="card radius-10">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="flex-grow-1">
              <p class="mb-0 text-info">Admit WARD 2</p>
              <h4 class="font-weight-bold text-info">
                {{ formatNumber(wardData.admit_ward2) }} คน
              </h4>
              <p class="text-secondary mb-0 font-13">Admit WARD บน</p>
            </div>
            <div class="widgets-icons bg-info text-white">
              <i class='bx bxs-home-heart'></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Admit HOME WARD -->
    <div class="col-xl-2 col-md-6 mb-4">
      <div class="card radius-10">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="flex-grow-1">
              <p class="mb-0 text-primary">Admit HOME WARD</p>
              <h4 class="font-weight-bold text-primary">
                {{ formatNumber(wardData.admit_home) }} คน
              </h4>
              <p class="text-secondary mb-0 font-13">จำนวน HOME WARD</p>
            </div>
            <div class="widgets-icons bg-primary text-white">
              <i class='bx bxs-home-smile'></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- HOME WARD ยาเสพติด -->
    <div class="col-xl-2 col-md-6 mb-4">
      <div class="card radius-10">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="flex-grow-1">
              <p class="mb-0 text-warning">HOME WARD ยาเสพติด</p>
              <h4 class="font-weight-bold text-warning">
                {{ formatNumber(wardData.admit_drug) }} คน
              </h4>
              <p class="text-secondary mb-0 font-13">HOME WARD ยาเสพติด</p>
            </div>
            <div class="widgets-icons bg-warning text-white">
              <i class='bx bxs-donate-heart'></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end row IPD Ward Cards -->
</template>

<script>
export default {
  name: 'WardCards',
  data() {
    return {
      wardData: {
        admit_lr: 0,
        admit_ward1: 0,
        admit_mini: 0,
        admit_ward2: 0,
        admit_home: 0,
        admit_drug: 0
      },
      loading: true,
      error: null
    }
  },
  async mounted() {
    await this.$nextTick()
    this.loadWardData()
  },
  methods: {
    async loadWardData() {
      try {
        console.log('🔍 เริ่มเรียก Ward API...')
        this.loading = true
        this.error = null

        // เรียก API
        const apiUrl = 'http://localhost:5000/api/ward-statistics/current-admits'
        console.log('📡 กำลังเรียก:', apiUrl)
        
        const response = await fetch(apiUrl)
        console.log('📊 Response status:', response.status)
        console.log('📊 Response ok:', response.ok)
        
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`)
        }
        
        const result = await response.json()
        console.log('✅ Ward Data received:', result)

        if (!result.success) {
          throw new Error(result.message || 'ไม่สามารถดึงข้อมูลได้')
        }

        // เก็บข้อมูล Ward
        this.wardData = {
          admit_lr: result.data.admit_lr,
          admit_ward1: result.data.admit_ward1,
          admit_mini: result.data.admit_mini,
          admit_ward2: result.data.admit_ward2,
          admit_home: result.data.admit_home,
          admit_drug: result.data.admit_drug
        }
        
      } catch (error) {
        console.error('❌ Error loading ward data:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    formatNumber(number) {
      if (!number) return '0'
      return number.toLocaleString()
    },

    // Method สำหรับ refresh ข้อมูล
    async refreshData() {
      await this.loadWardData()
    }
  }
}
</script>

<style scoped>
/* Custom styles สำหรับ Ward Cards */
.widgets-icons {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 12px;
}

.card-body {
  padding: 1rem;
}

.font-13 {
  font-size: 13px;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .col-xl-2 {
    margin-bottom: 1rem;
  }
}

/* Loading state (ถ้าต้องการ) */
.ward-loading {
  text-align: center;
  padding: 1rem;
  color: #6c757d;
}

/* Error state (ถ้าต้องการ) */
.ward-error {
  text-align: center;
  padding: 1rem;
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 0.25rem;
  margin: 1rem;
}
</style>