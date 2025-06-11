<template>
  <!--Start row Bar Chart IPD Doctors-->  
  <div class="row">
    <div class="col-12 col-xl-4 d-flex">
      <div class="card radius-10 w-100">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">
            สรุปยอดแพทย์ Admit ปีงบ 2568 โรงพยาบาลโพนสวรรค์
          </h6>
        </div>
        <div class="card-body">
          <strong>รวมทั้งหมด :</strong> 
          <span>{{ formatNumber(summaryData.totalAllVisits) }}</span> คน
          <hr>
          
          <strong>แพทย์ที่รวมมากที่สุด :</strong> 
          <span v-if="summaryData.maxDoctor">
            {{ summaryData.maxDoctor.name }} 
            ({{ formatNumber(summaryData.maxDoctor.visits) }} คน)
          </span>
          
          <p>
            <strong>แพทย์ที่รวมน้อยที่สุด :</strong> 
            <span v-if="summaryData.minDoctor">
              {{ summaryData.minDoctor.name }} 
              ({{ formatNumber(summaryData.minDoctor.visits) }} คน)
            </span>
          </p>
          
          <strong>ข้อมูลรายแพทย์ :</strong>
          <div class="doctor-list">
            <div v-for="doctor in doctorDetails" :key="doctor.code" class="mb-2">
              <strong>{{ doctor.name }}</strong> : 
              {{ formatNumber(doctor.visits) }} คน
            </div>
          </div>
          
          <hr>
          สรุปยอดแพทย์ Admit ปีงบ 2568 โรงพยาบาลโพนสวรรค์
        </div>
      </div>
    </div>
    <div class="col-12 col-xl-8 d-flex">
      <div class="card radius-10 w-100">
        <div class="card-body"> 
          <div id="ipdChart" ref="chartContainer">
            <!-- Loading state -->
            <div v-if="loading" class="loading">
              <p>📊 กำลังโหลดข้อมูล...</p>
            </div>
            <!-- Error state -->
            <div v-if="error" class="error">
              <p>❌ {{ error }}</p>
              <button @click="refreshChart" class="btn btn-sm btn-primary">ลองใหม่</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--End row Bar Chart IPD Doctors-->
</template>

<script>
export default {
  name: 'IpdChart',
  data() {
    return {
      chartData: null,
      summaryData: {
        totalAllVisits: 0,
        totalDoctors: 0,
        maxDoctor: null,
        minDoctor: null
      },
      doctorDetails: [],
      loading: true,
      error: null
    }
  },
  async mounted() {
    // รอให้ DOM render เสร็จก่อน
    await this.$nextTick()
    this.loadChartData()
  },
  methods: {
    async loadChartData() {
      try {
        console.log('🔍 เริ่มเรียก IPD API...')
        this.loading = true
        this.error = null

        // เรียก API
        const apiUrl = 'http://localhost:5000/api/doctor-chart/ipd-doctors'
        console.log('📡 กำลังเรียก:', apiUrl)
        
        const response = await fetch(apiUrl)
        console.log('📊 Response status:', response.status)
        console.log('📊 Response ok:', response.ok)
        
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`)
        }
        
        const result = await response.json()
        console.log('✅ Data received:', result)

        if (!result.success) {
          throw new Error(result.message || 'ไม่สามารถดึงข้อมูลได้')
        }

        // เก็บข้อมูล
        this.chartData = result.data
        this.summaryData = result.data.summary
        this.doctorDetails = result.data.doctorDetails

        // รอสักครู่แล้วสร้าง Chart
        await this.$nextTick()
        this.createChart()
        
      } catch (error) {
        console.error('❌ Error loading chart data:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    createChart() {
      if (!this.chartData || !window.Highcharts) {
        console.error('❌ ข้อมูลหรือ Highcharts ไม่พร้อม')
        console.log('📊 chartData:', !!this.chartData)
        console.log('📊 Highcharts:', !!window.Highcharts)
        return
      }

      console.log('🎨 สร้าง IPD Bar Chart...')

      // ลบ chart เดิม (ถ้ามี)
      const existingChart = window.Highcharts.charts.find(chart => 
        chart && chart.renderTo && chart.renderTo.id === 'ipdChart'
      )
      if (existingChart) {
        existingChart.destroy()
      }

      // สร้าง Bar Chart ใหม่
      window.Highcharts.chart('ipdChart', {
        chart: { 
          type: 'column', // Bar Chart
          backgroundColor: 'transparent',
          height: 400
        },
        title: { 
          text: 'จำนวน Admit รายแพทย์ (ปีงบ 2568)',
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            fontFamily: 'Prompt, sans-serif'
          }
        },
        xAxis: { 
          categories: this.chartData.labels,
          title: {
            text: 'แพทย์',
            style: {
              fontFamily: 'Prompt, sans-serif'
            }
          },
          labels: {
            rotation: -45, // หมุนข้อความเพื่อไม่ให้ทับกัน
            style: {
              fontFamily: 'Prompt, sans-serif',
              fontSize: '11px'
            }
          }
        },
        yAxis: {
          title: { 
            text: 'จำนวน Admit (คน)',
            style: {
              fontSize: '14px',
              fontFamily: 'Prompt, sans-serif'
            }
          },
          labels: {
            formatter: function() {
              return this.value.toLocaleString()
            },
            style: {
              fontFamily: 'Prompt, sans-serif'
            }
          }
        },
        tooltip: {
          useHTML: true,
          style: {
            fontFamily: 'Prompt, sans-serif'
          },
          formatter: function() {
            return `<b>${this.x}</b><br/>จำนวน Admit: <b>${this.y.toLocaleString()}</b> คน`
          }
        },
        plotOptions: {
          column: {
            color: '#17A2B8', // สีฟ้า-เขียว เดียวสำหรับทุกแท่ง
            dataLabels: {
              enabled: true,
              style: {
                fontFamily: 'Prompt, sans-serif',
                fontSize: '11px'
              }
            }
          }
        },
        legend: {
          enabled: false // ไม่ต้องการ legend สำหรับ single series
        },
        credits: {
          enabled: false
        },
        colors: [
          '#8A2BE2', // ม่วง (แท่งแรก - สูงสุด)
          '#DC143C', // แดง
          '#FFD700', // เหลือง/ทอง
          '#32CD32', // เขียว
          '#2F4F4F', // ดำ/เทาเข้ม
          '#00CED1', // ฟ้า/เขียวอ่อน
          '#708090', // เทา
          '#FF1493', // ชมพูเข้ม
          '#20B2AA', // เขียวอมฟ้า
          '#4682B4', // น้ำเงิน
          '#9370DB'  // ม่วงอ่อน
        ], // สีตามภาพ
        series: [
          {
            name: 'จำนวน Admit',
            data: this.chartData.visitCounts
          }
        ]
      })

      console.log('✅ IPD Bar Chart สร้างเสร็จแล้ว')
    },

    formatNumber(number) {
      if (!number) return '0'
      return number.toLocaleString()
    },

    // Method สำหรับ refresh ข้อมูล
    async refreshChart() {
      await this.loadChartData()
    }
  },

  // Cleanup เมื่อ component ถูก destroy
  beforeUnmount() {
    const existingChart = window.Highcharts.charts.find(chart => 
      chart && chart.renderTo && chart.renderTo.id === 'ipdChart'
    )
    if (existingChart) {
      existingChart.destroy()
    }
  }
}
</script>

<style scoped>
.doctor-list {
  max-height: 300px;
  overflow-y: auto;
}

.card-header h6 {
  color: #6f42c1 !important;
  font-size: 14px;
}

.card-body {
  font-size: 13px;
}

.card-body strong {
  color: #495057;
}

/* Loading state */
.loading {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}

.loading p {
  font-size: 16px;
  margin: 0;
}

/* Error state */
.error {
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 0.25rem;
  margin: 1rem;
}

.error p {
  margin-bottom: 1rem;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .col-xl-8, .col-xl-4 {
    margin-bottom: 1rem;
  }
}

/* Chart container */
#ipdChart {
  min-height: 400px;
}
</style>