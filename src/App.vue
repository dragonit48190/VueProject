<template>
  <div id="app">
    <!-- แสดง router-view ตรงๆ -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // ฟัง auth events เพื่อให้ระบบยังทำงาน
    window.addEventListener('auth-status-changed', this.handleAuthChange)
  },
  beforeUnmount() {
    window.removeEventListener('auth-status-changed', this.handleAuthChange)
  },
  methods: {
    // จัดการเมื่อมีการเปลี่ยนแปลง auth status
    handleAuthChange() {
      console.log('🔔 Auth status changed')
    }
  }
}
</script>

<style scoped>
/* Clean production-ready App.vue - no debug styles */
#app {
  min-height: 100vh;
}
</style>