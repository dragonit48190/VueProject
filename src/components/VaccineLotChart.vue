<template>
    <div class="chart-container">
      <!-- หัวข้อกราฟ -->
      <div class="text-center mb-3">
        <h6 class="fw-bold text-secondary mb-1">
          กราฟแสดงจำนวนการฉีดวัคซีนแยกตาม LOT
        </h6>
        <small class="text-muted">
          รวมทั้งหมด {{ totalVisits.toLocaleString() }} ครั้ง
        </small>
      </div>
  
      <!-- กราฟ Bar Chart แนวตั้ง ด้วย CSS -->
      <div class="chart-bars-vertical mb-3">
        <div class="chart-container-vertical">
          <div 
            v-for="(item, index) in chartData" 
            :key="index"
            class="bar-column"
          >
            <!-- แท่งกราฟแนวตั้ง -->
            <div class="bar-vertical-container">
              <div 
                class="bar-vertical-fill"
                :style="{ 
                  height: item.percentage + '%', 
                  backgroundColor: item.color 
                }"
              ></div>
            </div>
            
            <!-- ป้ายชื่อ LOT -->
            <div class="bar-vertical-label">
              {{ item.lot_vaccine || 'ไม่ระบุ' }}
            </div>
            
            <!-- จำนวน -->
            <div class="bar-vertical-value">
              {{ item.visit.toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
  
      <!-- สรุปข้อมูล -->
      <div class="summary-box">
        <div class="row text-center">
          <div class="col-6">
            <div class="summary-item">
              <i class="bx bx-list-ul text-primary"></i>
              <div class="fw-bold">{{ chartData.length }}</div>
              <small class="text-muted">จำนวน LOT</small>
            </div>
          </div>
          <div class="col-6">
            <div class="summary-item">
              <i class="bx bx-injection text-success"></i>
              <div class="fw-bold text-success">{{ totalVisits.toLocaleString() }}</div>
              <small class="text-muted">ครั้งทั้งหมด</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'VaccineLotChart',
    props: {
      data: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      chartData() {
        if (!this.data || this.data.length === 0) return []
        
        const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6f42c1']
        const maxVisit = Math.max(...this.data.map(item => parseInt(item.visit) || 0))
        
        return this.data.map((item, index) => {
          const visit = parseInt(item.visit) || 0
          return {
            lot_vaccine: item.lot_vaccine,
            visit: visit,
            percentage: maxVisit > 0 ? (visit / maxVisit) * 100 : 0,
            color: colors[index % colors.length]
          }
        }).sort((a, b) => b.visit - a.visit) // เรียงจากมากไปน้อย
      },
      
      totalVisits() {
        return this.data.reduce((sum, item) => sum + (parseInt(item.visit) || 0), 0)
      }
    }
  }
  </script>
  
  <style scoped>
  .chart-container {
    padding: 1rem;
  }
  
  /* กราฟแนวตั้ง */
  .chart-bars-vertical {
    max-height: 300px;
    overflow-x: auto;
    overflow-y: hidden;
  }
  
  .chart-container-vertical {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 20px;
    height: 200px;
    padding: 10px;
    margin-bottom: 20px;
  }
  
  .bar-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
  }
  
  .bar-vertical-container {
    height: 160px;
    width: 40px;
    background-color: #e9ecef;
    border-radius: 4px 4px 0 0;
    display: flex;
    align-items: flex-end;
    position: relative;
    margin-bottom: 8px;
  }
  
  .bar-vertical-fill {
    width: 100%;
    border-radius: 4px 4px 0 0;
    transition: height 0.8s ease-in-out;
    position: relative;
    min-height: 4px;
  }
  
  .bar-vertical-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #495057;
    text-align: center;
    margin-bottom: 4px;
    word-break: break-word;
    line-height: 1.2;
  }
  
  .bar-vertical-value {
    font-size: 0.875rem;
    font-weight: bold;
    color: #007bff;
    text-align: center;
  }
  
  .summary-box {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 8px;
    padding: 1rem;
    border-left: 4px solid #007bff;
  }
  
  .summary-item {
    padding: 0.5rem;
  }
  
  .summary-item i {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }
  
  .summary-item .fw-bold {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }
  
  /* Animation เมื่อโหลด */
  .bar-vertical-fill {
    animation: fillBarVertical 1.2s ease-out;
  }
  
  @keyframes fillBarVertical {
    from {
      height: 0%;
    }
  }
  
  /* Responsive */
  @media (max-width: 576px) {
    .chart-container-vertical {
      gap: 10px;
    }
    
    .bar-column {
      min-width: 60px;
    }
    
    .bar-vertical-container {
      width: 30px;
      height: 120px;
    }
    
    .bar-vertical-label {
      font-size: 0.6rem;
    }
    
    .bar-vertical-value {
      font-size: 0.75rem;
    }
  }
  </style>