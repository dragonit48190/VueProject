<!-- PhytypeChart.vue - ใช้ Highcharts -->
<template>
    <div class="chart-container">
      <div ref="chartContainer" style="height: 400px; width: 100%;"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FinancenullChart',
    props: {
      data: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        chart: null
      }
    },
    computed: {
      chartConfig() {
        if (!this.data || this.data.length === 0) return null;
        
        const chartData = this.data.map((item, index) => {
          return {
            name: item.pttype_name || `สิทธิ ${item.pttype}`,
            y: parseInt(item.visit) || 0,
            color: '#17a2b8'  // สีฟ้าอ่อน Bootstrap Info
          };
        });
  
        return {
          chart: {
            type: 'column',
            backgroundColor: 'transparent',
            style: {
              fontFamily: 'Prompt, sans-serif'
            }
          },
          title: {
            text: 'จำนวนครั้งการรักษาแยกตามสิทธิ PTTYPE',
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#495057'
            }
          },
          subtitle: {
            text: `ข้อมูลทั้งหมด ${this.totalVisits.toLocaleString()} ครั้ง`,
            style: {
              color: '#6c757d'
            }
          },
          xAxis: {
            type: 'category',
            labels: {
              style: {
                fontSize: '12px',
                color: '#000000',
                fontWeight: 'bold'
              },
              rotation: -45,
              useHTML: false
            },
            gridLineWidth: 0,
            lineColor: '#dee2e6',
            tickColor: '#dee2e6'
          },
          yAxis: {
            title: {
              text: 'จำนวนครั้ง',
              style: {
                color: '#6c757d'
              }
            },
            labels: {
              style: {
                fontSize: '12px',
                color: '#6c757d'
              },
              formatter: function() {
                return this.value.toLocaleString();
              }
            },
            gridLineColor: '#e9ecef',
            gridLineDashStyle: 'Dash'
          },
          tooltip: {
            backgroundColor: '#ffffff',
            style: {
              color: '#000000',
              fontSize: '12px'
            },
            borderRadius: 6,
            borderColor: '#333333',
            borderWidth: 1,
            formatter: function() {
              const total = chartData.reduce((sum, item) => sum + item.y, 0);
              const percentage = ((this.y / total) * 100).toFixed(1);
              return `<b style="color: #000000">${this.point.name}</b><br/>
                      จำนวน: <b style="color: #000000">${this.y.toLocaleString()}</b> ครั้ง<br/>
                      สัดส่วน: <b style="color: #000000">${percentage}%</b>`;
            }
          },
          plotOptions: {
            column: {
              borderRadius: 6,
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                style: {
                  fontSize: '10px',
                  fontWeight: '600',
                  color: '#495057',
                  textOutline: 'none'
                },
                formatter: function() {
                  return this.y.toLocaleString();
                }
              },
              pointPadding: 0.15,
              groupPadding: 0.1,
              shadow: {
                color: 'rgba(0,0,0,0.1)',
                offsetX: 2,
                offsetY: 2,
                opacity: 0.3,
                width: 3
              }
            }
          },
          series: [{
            name: 'จำนวนครั้งการรักษา',
            data: chartData,
            showInLegend: false
          }],
          credits: {
            enabled: false
          },
          exporting: {
            enabled: true,
            buttons: {
              contextButton: {
                menuItems: [
                  'viewFullscreen',
                  'separator',
                  'downloadPNG',
                  'downloadJPEG',
                  'downloadPDF',
                  'downloadSVG',
                  'separator',
                  'downloadCSV',
                  'downloadXLS'
                ]
              }
            }
          },
          responsive: {
            rules: [{
              condition: {
                maxWidth: 600
              },
              chartOptions: {
                xAxis: {
                  labels: {
                    rotation: -90,
                    style: {
                      fontSize: '11px',
                      color: '#000000',
                      fontWeight: 'bold'
                    }
                  }
                },
                plotOptions: {
                  column: {
                    dataLabels: {
                      enabled: false
                    }
                  }
                },
                title: {
                  style: {
                    fontSize: '14px'
                  }
                }
              }
            }]
          }
        };
      },
      totalVisits() {
        return this.data.reduce((sum, item) => sum + (parseInt(item.visit) || 0), 0);
      }
    },
    watch: {
      data: {
        handler() {
          this.updateChart();
        },
        deep: true
      }
    },
    mounted() {
      this.createChart();
    },
    beforeUnmount() {
      if (this.chart) {
        this.chart.destroy();
      }
    },
    methods: {
      createChart() {
        if (!this.chartConfig || !window.Highcharts) {
          console.warn('Highcharts not loaded or no data available');
          return;
        }
        
        this.chart = window.Highcharts.chart(this.$refs.chartContainer, this.chartConfig);
      },
      
      updateChart() {
        if (!this.chart) {
          this.createChart();
          return;
        }
        
        this.chart.destroy();
        this.chart = null;
        this.$nextTick(() => {
          this.createChart();
        });
      }
    }
  }
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    width: 100%;
    height: 400px;
  }
  
  /* ปรับแต่ง Highcharts tooltip */
  :deep(.highcharts-tooltip) {
    border-radius: 6px !important;
  }
  
  /* ปรับแต่ง Highcharts legend */
  :deep(.highcharts-legend-item) {
    font-family: 'Kanit', sans-serif !important;
  }
  
  /* บังคับให้ X-axis labels เป็นสีดำ */
  :deep(.highcharts-xaxis-labels text) {
    fill: #000000 !important;
    font-weight: bold !important;
    font-size: 12px !important;
  }
  </style>