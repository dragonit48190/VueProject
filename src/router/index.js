import { createRouter, createWebHashHistory } from 'vue-router'
import MyDashboard from '@/components/MyDashboard.vue'
import StrokeReport from '@/views/StrokeReport.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: MyDashboard    //  My Dashboard อยู่ที่ "/"
  },
  {
    path: '/report/stroke',
    name: 'StrokeReport',
    component: StrokeReport
  },
  {
    path: '/report/strokerefer',
    name: 'StrokeRefer',
    component: () => import('@/views/StrokeRefer.vue')
  },
  {
    path: '/report/stemi',
    name: 'StemiReport',
    component: () => import('@/views/StemiReport.vue')
  },
  {
    path: '/report/nonstemi',
    name: 'NonstemiReport',
    component: () => import('@/views/NonstemiReport.vue')
  },
  {
    path: '/report/sepsis',
    name: 'SepsisReport',
    component: () => import('@/views/SepsisReport.vue')
  },
  {
    path: '/report/sepsisadmit',
    name: 'SepsisadmitReport',
    component: () => import('@/views/SepsisadmitReport.vue')
  },
  {
    path: '/report/admit',
    name: 'AdmitReport',
    component: () => import('@/views/AdmitReport.vue')
  },
  {
    path: '/report/readmit',
    name: 'ReadmitReport',
    component: () => import('@/views/ReadmitReport.vue')
  },
  {
    path: '/report/readmitold',
    name: 'ReadmitoldReport',
    component: () => import('@/views/ReadmitoldReport.vue')
  },
  {
    path: '/report/ipdrefer',
    name: 'IpdreferReport',
    component: () => import('@/views/IpdreferReport.vue')
  },
  {
    path: '/report/copder',
    name: 'CopderReport',
    component: () => import('@/views/CopderReport.vue')
  },
  {
    path: '/report/severehi',
    name: 'SeverehiReport',
    component: () => import('@/views/SeverehiReport.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
