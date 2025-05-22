<template>
    <div class="wrapper">
      <!-- Sidebar & Header -->
      <AppSidebar />
      <AppHeader />
      <!-- เนื้อหาหลัก -->
      <div class="page-wrapper">
        <div class="page-content">
          <slot />  <!-- เนื้อหาของแต่ละหน้าจะมาแสดงตรงนี้ -->
        </div>
      </div>
  <!-- Footer  -->
      <AppFooter />
      <AppSwitcher />
    </div>
  </template>
  
  <script>
  import AppSidebar from '@/components/Sidebar.vue'
  import AppHeader from '@/components/Header.vue'
  import AppFooter from '@/components/Footer.vue'
  import AppSwitcher from '@/components/Switcher.vue'
  
  export default {
    name: 'MainLayout',
    components: {
      AppSidebar,
      AppHeader,
      AppFooter,
      AppSwitcher
    }
  }
  </script>
  