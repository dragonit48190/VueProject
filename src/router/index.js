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
    path: '/report/headinjury',
    name: 'HeadinjuryReport',
    component: () => import('@/views/HeadinjuryReport.vue')
  },
  {
    path: '/report/ipddeath',
    name: 'IpddeathReport',
    component: () => import('@/views/IpddeathReport.vue')
  },
  {
    path: '/report/ncdpdxnull',
    name: 'NcdpdxnullReport',
    component: () => import('@/views/NcdpdxnullReport.vue')
  },
  {
    path: '/report/clinicdm',
    name: 'ClinicdmReport',
    component: () => import('@/views/ClinicdmReport.vue')
  },
  {
    path: '/report/clinicht',
    name: 'ClinichtReport',
    component: () => import('@/views/ClinichtReport.vue')
  },
  {
    path: '/report/clinicckd',
    name: 'ClinicckdReport',
    component: () => import('@/views/ClinicckdReport.vue')
  },
  {
    path: '/report/cliniccopd',
    name: 'CliniccopdReport',
    component: () => import('@/views/CliniccopdReport.vue')
  },
  {
    path: '/report/clinicasthma',
    name: 'ClinicasthmaReport',
    component: () => import('@/views/ClinicasthmaReport.vue')
  },
  {
    path: '/report/newdm',
    name: 'NewdmReport',
    component: () => import('@/views/NewdmReport.vue')
  },
  {
    path: '/report/newht',
    name: 'NewhtReport',
    component: () => import('@/views/NewhtReport.vue')
  },
  {
    path: '/report/newckd',
    name: 'NewckdReport',
    component: () => import('@/views/NewckdReport.vue')
  },
  {
    path: '/report/newcopd',
    name: 'NewcopdReport',
    component: () => import('@/views/NewcopdReport.vue')
  },
  {
    path: '/report/newasthma',
    name: 'NewasthmadReport',
    component: () => import('@/views/NewasthmaReport.vue')
  },
  {
    path: '/report/influlotnull',
    name: 'InflulotnullReport',
    component: () => import('@/views/InflulotnullReport.vue')
  },
  {
    path: '/report/dmscreeneye',
    name: 'DmscreeneyeReport',
    component: () => import('@/views/DmscreeneyeReport.vue')
  },
  {
    path: '/report/pttypesum',
    name: 'PttypesumReport',
    component: () => import('@/views/PttypesumReport.vue')
  },
  {
    path: '/report/dmscreenfoot',
    name: 'DmscreenfootReport',
    component: () => import('@/views/DmscreenfootReport.vue')
  },
  {
    path: '/report/childen',
    name: 'ChildenReport',
    component: () => import('@/views/ChildenReport.vue')
  },
  {
    path: '/report/student',
    name: 'StudentReport',
    component: () => import('@/views/StudentReport.vue')
  },
  {
    path: '/report/teenager',
    name: 'TeenagerReport',
    component: () => import('@/views/TeenagerReport.vue')
  },
  {
    path: '/report/workage',
    name: 'WorkageReport',
    component: () => import('@/views/WorkageReport.vue')
  },
  {
    path: '/report/elderly',
    name: 'ElderlyReport',
    component: () => import('@/views/ElderlyReport.vue')
  },
  {
    path: '/report/screenpcu',
    name: 'ScreenpcuReport',
    component: () => import('@/views/ScreenpcuReport.vue')
  },
  {
    path: '/report/screens',
    name: 'ScreensReport',
    component: () => import('@/views/ScreensReport.vue')
  },
  {
    path: '/report/rapid',
    name: 'RapidReport',
    component: () => import('@/views/RapidReport.vue')
  },
  {
    path: '/report/rtpcr',
    name: 'RtpcrReport',
    component: () => import('@/views/RtpcrReport.vue')
  },
  {
    path: '/report/denguefever',
    name: 'DenguefeverReport',
    component: () => import('@/views/DenguefeverReport.vue')
  },
  {
    path: '/report/dengue',
    name: 'DengueReport',
    component: () => import('@/views/DengueReport.vue')
  },
  {
    path: '/report/pdxnuller',
    name: 'PdxnullerReport',
    component: () => import('@/views/PdxnullerReport.vue')
  },
  {
    path: '/report/asthmaer',
    name: 'AsthmaerReport',
    component: () => import('@/views/AsthmaerReport.vue')
  },
  {
    path: '/report/emergencyer',
    name: 'EmergencyerReport',
    component: () => import('@/views/EmergencyerReport.vue')
  },
  {
    path: '/report/ettubeer',
    name: 'EttubeerReport',
    component: () => import('@/views/EttubeerReport.vue')
  },
  {
    path: '/report/cprer',
    name: 'CprerReport',
    component: () => import('@/views/CprerReport.vue')
  },
  {
    path: '/report/castoperer',
    name: 'CastopererReport',
    component: () => import('@/views/CastopererReport.vue')
  },
  {
    path: '/report/defiber',
    name: 'DefiberReport',
    component: () => import('@/views/DefiberReport.vue')
  },
  {
    path: '/report/nber',
    name: 'NberReport',
    component: () => import('@/views/NberReport.vue')
  },
  {
    path: '/report/admit2hour',
    name: 'Admit2hourReport',
    component: () => import('@/views/Admit2hourReport.vue')
  },
  {
    path: '/report/admitipd',
    name: 'AdmitipdReport',
    component: () => import('@/views/AdmitipdReport.vue')
  },
  {
    path: '/report/admitdm',
    name: 'AdmitdmReport',
    component: () => import('@/views/AdmitdmReport.vue')
  },
  {
    path: '/report/readmitdm',
    name: 'ReadmitdmReport',
    component: () => import('@/views/ReadmitdmReport.vue')
  },
  {
    path: '/report/admitdmhypo',
    name: 'AdmitdmhypoReport',
    component: () => import('@/views/AdmitdmhypoReport.vue')
  },
  {
    path: '/report/admitdmhyper',
    name: 'AdmitdmhyperReport',
    component: () => import('@/views/AdmitdmhyperReport.vue')
  },
  {
    path: '/report/admitdhf',
    name: 'AdmitdhfReport',
    component: () => import('@/views/AdmitdhfReport.vue')
  },
  {
    path: '/report/phypttype',
    name: 'PhypttypeReport',
    component: () => import('@/views/PhypttypeReport.vue')
  },
  {
    path: '/report/physicpatient',
    name: 'PhysicpatientReport',
    component: () => import('@/views/PhysicpatientReport.vue')
  },
  {
    path: '/report/physicovertime',
    name: 'PhysicovertimeReport',
    component: () => import('@/views/PhysicovertimeReport.vue')
  },
  {
    path: '/report/clinicdrug',
    name: 'ClinicdrugReport',
    component: () => import('@/views/ClinicdrugReport.vue')
  },
  {
    path: '/report/admitshizo',
    name: 'AdmitshizoReport',
    component: () => import('@/views/AdmitshizoReport.vue')
  },
  {
    path: '/report/screendrink',
    name: 'ScreendrinkReport',
    component: () => import('@/views/ScreendrinkReport.vue')
  },
  {
    path: '/report/pallaitiveca',
    name: 'PallaitivecaReport',
    component: () => import('@/views/PallaitivecaReport.vue')
  },
  {
    path: '/report/pallaitiveckd',
    name: 'PallaitiveckdReport',
    component: () => import('@/views/PallaitiveckdReport.vue')
  },
  {
    path: '/report/pallaitivecopd',
    name: 'PallaitivecopdReport',
    component: () => import('@/views/PallaitivecopdReport.vue')
  },
  {
    path: '/report/pallaitiveheart',
    name: 'PallaitiveheartReport',
    component: () => import('@/views/PallaitiveheartReport.vue')
  },
  {
    path: '/report/telemed',
    name: 'TelemedReport',
    component: () => import('@/views/TelemedReport.vue')
  },
  {
    path: '/report/financenull',
    name: 'FinancenullReport',
    component: () => import('@/views/FinancenullReport.vue')
  },
  {
    path: '/report/strokesmoking',
    name: 'StrokesmokingReport',
    component: () => import('@/views/StrokesmokingReport.vue')
  },
  {
    path: '/report/labcovid',
    name: 'LabcovidReport',
    component: () => import('@/views/LabcovidReport.vue')
  },
  {
    path: '/report/pltpatient',
    name: 'PltpatientReport',
    component: () => import('@/views/PltpatientReport.vue')
  },
  {
    path: '/report/shizoscreen',
    name: 'ShizoscreenReport',
    component: () => import('@/views/ShizoscreenReport.vue')
  },
  {
    path: '/report/clinicshizo',
    name: 'ClinicshizoReport',
    component: () => import('@/views/ClinicshizoReport.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
