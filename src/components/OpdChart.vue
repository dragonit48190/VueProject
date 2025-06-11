<template>
  <!--Start row Highcharts OPD-->  
  <div class="row">
    <div class="col-12 col-xl-8 d-flex">
      <div class="card radius-10 w-100">
        <div class="card-body"> 
          <div id="opdChart" ref="chartContainer">
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

    <div class="col-12 col-xl-4 d-flex">
      <div class="card radius-10 w-100">
        <div class="card-header py-3">
          <h5 class="m-0 font-weight-bold text-primary">
            สรุปยอดผู้ป่วยนอก ปีงบ 2568 โรงพยาบาลโพนสวรรค์
          </h5>
        </div>
        <div class="card-body">
          <strong>รวมทั้งหมด : </strong> 
          <strong><span> {{ formatNumber(summaryData.totalAllVisits) }} </span> ครั้ง </strong> 
          <hr>
          
          <strong>เดือนที่มากที่สุด :</strong> 
          <span v-if="summaryData.maxMonth">
            {{ summaryData.maxMonth.month }} 
            {{ formatNumber(summaryData.maxMonth.patients) }} คน 
            ({{ formatNumber(summaryData.maxMonth.visits) }} ครั้ง)
          </span>
          
          <p>
            <strong>เดือนที่น้อยที่สุด : </strong> 
            <span v-if="summaryData.minMonth">
               {{ summaryData.minMonth.month }} 
               {{ formatNumber(summaryData.minMonth.patients) }} คน 
               ({{ formatNumber(summaryData.minMonth.visits) }} ครั้ง)
            </span>
          </p>
          
          <strong>ข้อมูลทุกเดือน :</strong>
          <div class="month-list">
            <div v-for="month in monthlyDetails" :key="month.month" class="mb-2">
              <strong>{{ month.month }}</strong> : 
              {{ formatNumber(month.patients) }} คน 
              ({{ formatNumber(month.visits) }} ครั้ง)
            </div>
          </div>
          
          <hr>
          สรุปยอดผู้ป่วยนอก ปีงบ 2568 โรงพยาบาลโพนสวรรค์
        </div>
      </div>
    </div>
  </div>
  <!--End row Highcharts OPD-->
</template>

<script>
export default {
  name: 'OpdChart',
  data() {
    return {
      chartData: null,
      summaryData: {
        totalAllVisits: 0,
        totalAllPatients: 0,
        maxMonth: null,
        minMonth: null
      },
      monthlyDetails: [],
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
        console.log('🔍 เริ่มเรียก API...')
        this.loading = true
        this.error = null

        // 🔥 เปลี่ยนเป็น absolute URL
        const apiUrl = 'http://localhost:5000/api/patient-chart/opd-statistics'
        console.log('📡 กำลังเรียก:', apiUrl)
        
        const response = await fetch(apiUrl)
        console.log('Response status:', response.status)
        console.log('Response ok:', response.ok)
        
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
        this.monthlyDetails = result.data.monthlyDetails

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
        console.log('chartData:', !!this.chartData)
        console.log('Highcharts:', !!window.Highcharts)
        return
      }

      console.log('🎨 สร้าง Highcharts...')

      // ลบ chart เดิม (ถ้ามี)
      const existingChart = window.Highcharts.charts.find(chart => 
        chart && chart.renderTo && chart.renderTo.id === 'opdChart'
      )
      if (existingChart) {
        existingChart.destroy()
      }

      // สร้าง Highcharts ใหม่
      window.Highcharts.chart('opdChart', {
        chart: { 
          type: 'line',
          backgroundColor: 'transparent',
          height: 400
        },
        title: { 
          text: 'ผู้ป่วยนอก รายเดือน (ปีงบ 2568)',
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            fontFamily: 'Prompt, sans-serif'
          }
        },
        xAxis: { 
          categories: this.chartData.labels,
          title: {
            text: null
          },
          labels: {
            style: {
              fontFamily: 'Prompt, sans-serif'
            }
          }
        },
        yAxis: {
          title: { 
            text: 'จำนวน',
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
          shared: true,
          useHTML: true,
          style: {
            fontFamily: 'Prompt, sans-serif'
          },
          formatter: function() {
            let tooltip = `<b>${this.x}</b><br/>`
            this.points.forEach(point => {
              tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y.toLocaleString()}</b><br/>`
            })
            return tooltip
          }
        },
        plotOptions: {
          series: {
            marker: {
              enabled: true,
              radius: 5,
              symbol: 'circle',
              states: {
                hover: {
                  enabled: true,
                  radius: 8,
                  lineColor: '#000',
                  lineWidth: 1
                }
              }
            },
            states: {
              hover: {
                lineWidthPlus: 1
              }
            }
          }
        },
        legend: {
          enabled: true,
          align: 'center',
          verticalAlign: 'bottom',
          layout: 'horizontal',
          itemStyle: {
            fontFamily: 'Prompt, sans-serif'
          }
        },
        credits: {
          enabled: false
        },
        series: [
          {
            name: 'จำนวนครั้ง',
            data: this.chartData.totalVisits,
            color: '#00bfff', // ฟ้า
            marker: {
              fillColor: '#9932cc' // ม่วง
            }
          },
          {
            name: 'จำนวนคน',
            data: this.chartData.totalPatients,
            color: '#32cd32', // เขียว
            marker: {
              fillColor: '#32cd32' // marker เขียวด้วย
            }
          }
        ]
      })

      console.log('✅ Highcharts สร้างเสร็จแล้ว')
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
      chart && chart.renderTo && chart.renderTo.id === 'opdChart'
    )
    if (existingChart) {
      existingChart.destroy()
    }
  }
}
</script>

<style scoped>
.month-list {
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
#opdChart {
  min-height: 400px;
}
</style>