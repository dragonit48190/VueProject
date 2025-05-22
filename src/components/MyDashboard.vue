<template>
    <!--wrapper-->
    <div class="wrapper">
        <AppSidebar />
        <AppHeader />
        <AppButton />
        <AppFooter />
        <AppMain
          :authen-total="authenTotal"
          :notauthen="notauthen"
          :authened="authened"
          :opd="opd"
          :dent="dent"
          :er="er"
        />
        <AppSwitcher />   
    </div>
    <!--end wrapper-->
  </template>
  
  <!--Script MyDashboard Vue -->

  <script>
  import AppSidebar from './Sidebar.vue'
  import AppHeader from './Header.vue'
  import AppButton from './Button.vue'
  import AppFooter from './Footer.vue'
  import AppMain from './Main.vue'
  import AppSwitcher from './Switcher.vue'
  import api from '@/services/api'  // เพิ่มบรรทัดนี้เพื่อเรียก backend
  
  export default {
    name: 'MyDashboard',
  
    components: {
      AppSidebar,
      AppHeader,
      AppButton,
      AppFooter,
      AppMain,
      AppSwitcher,
    },
  
    data() {
      return {
        authenTotal: null,  // ตัวแปรเก็บค่าจาก backend
        notauthen: null,     // ยังไม่ขอ Authen HOSxP 
        intervalId: null,  // ใช้เก็บ setInterval ID Refresh ทุก 10 วิ
        authened: null,
        opd: null,
        dent: null,
        er: null,
      }
    },
  
    mounted() {
      this.loadAuthenData()
      this.intervalId = setInterval(this.loadAuthenData, 10000)  // 🔄 ทุก 10 วิ
    },
    beforeUnmount() {
      clearInterval(this.intervalId)  // ❌ ล้างเมื่อ component ถูกปิด
    },

    methods: {
      async loadAuthenData() {
        try {
      // Refresh ดึงข้อมูลทุก 10 วิ
      const [
        authenRes,
        notauthenRes,
        authenedRes,
        opdRes,
        dentRes,
        erRes
      ] = await Promise.all([
        api.get('/authen'),
        api.get('/notauthen'),
        api.get('/authened'),
        api.get('/opd'),
        api.get('/dent'),
        api.get('/er')
      ])

      //  เก็บค่าลงตัวแปร
      this.authenTotal = authenRes.data.total_visit_today
      this.notauthen = notauthenRes.data.notauthen
      this.authened = authenedRes.data.authened
      this.opd = opdRes.data.opd
      this.dent = dentRes.data.dent
      this.er = erRes.data.er

        } catch (error) {
          console.error('โหลดข้อมูลไม่สำเร็จ:', error)
        }
      }
    }
  }
  </script>
  