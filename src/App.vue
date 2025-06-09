<template>
  <div id="app">
    <!-- แสดง router-view ตรงๆ -->
    <router-view />

    <!-- 🔥 Debug Panel -->
    <div v-if="showDebug" class="debug-panel">
      <div class="debug-header">
        <strong>🕐 Session Status</strong>
        <button @click="toggleDebug" class="close-btn">×</button>
      </div>
      <div class="debug-content">
        <div v-if="isLoggedIn">
          <div>👤 User: {{ userName }}</div>
          <div>⏰ Time left: {{ timeLeft }}</div>
          <div>🔄 Last activity: {{ lastActivity }}</div>
          <div class="debug-buttons">
            <button @click="extendSession" class="btn-extend">ต่ออายุ</button>
            <button @click="testTimeout" class="btn-test">ทดสอบ (15วิ)</button>
            <button @click="forceLogout" class="btn-logout">Logout</button>
          </div>
        </div>
        <div v-else>
          <div>👤 ยังไม่ได้ล็อกอิน</div>
        </div>
      </div>
    </div>

    <!-- 🔥 Debug Toggle Button -->
    <div v-if="isDev" class="debug-toggle" @click="toggleDebug">
      🛠️
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showDebug: false,
      isDev: process.env.NODE_ENV === 'development',
      isLoggedIn: false,
      userName: '',
      timeLeft: '00:00:00',
      lastActivity: '',
      updateTimer: null
    }
  },
  mounted() {
    // เช็คสถานะ login เมื่อเริ่มต้น
    this.checkAuthStatus()
    
    // ฟัง auth events
    window.addEventListener('auth-status-changed', this.checkAuthStatus)
    
    // เริ่ม timer อัปเดท debug info
    if (this.isDev) {
      this.startDebugUpdates()
    }
  },
  beforeUnmount() {
    window.removeEventListener('auth-status-changed', this.checkAuthStatus)
    this.stopDebugUpdates()
  },
  methods: {
    // เช็คสถานะ auth
    async checkAuthStatus() {
      try {
        const { authService } = await import('./services/authService.js')
        this.isLoggedIn = authService.isAuthenticated()
        this.userName = authService.getDisplayName()
      } catch (error) {
        console.error('Error checking auth status:', error)
        this.isLoggedIn = false
        this.userName = ''
      }
    },
    
    // เปิด/ปิด debug panel
    toggleDebug() {
      this.showDebug = !this.showDebug
      
      if (this.showDebug) {
        this.updateDebugInfo()
      }
    },
    
    // อัปเดทข้อมูล debug
    async updateDebugInfo() {
      if (!this.isLoggedIn) return
      
      try {
        const { authService } = await import('./services/authService.js')
        const status = await authService.getSessionStatus()
        
        if (status) {
          this.timeLeft = this.formatTime(status.timeRemaining)
          this.lastActivity = status.lastActivity.toLocaleTimeString()
        }
      } catch (error) {
        console.error('Error updating debug info:', error)
      }
    },
    
    // เริ่ม timer อัปเดท
    startDebugUpdates() {
      this.updateTimer = setInterval(() => {
        if (this.showDebug && this.isLoggedIn) {
          this.updateDebugInfo()
        }
      }, 1000) // อัปเดททุกวินาที
    },
    
    // หยุด timer อัปเดท
    stopDebugUpdates() {
      if (this.updateTimer) {
        clearInterval(this.updateTimer)
        this.updateTimer = null
      }
    },
    
    // ต่ออายุ session
    async extendSession() {
      try {
        const { authService } = await import('./services/authService.js')
        const success = await authService.extendSession()
        
        if (success) {
          console.log('🔄 Session extended via debug panel')
          this.updateDebugInfo()
        }
      } catch (error) {
        console.error('Error extending session:', error)
      }
    },
    
    // ทดสอบ timeout
    async testTimeout() {
      try {
        const { sessionTimeoutService } = await import('./services/sessionTimeoutService.js')
        
        // เก็บค่าเดิมไว้
        const originalDuration = sessionTimeoutService.timeoutDuration
        
        // ตั้งเป็น 15 วินาทีชั่วคราว (เพิ่มเวลาให้ปลอดภัย)
        sessionTimeoutService.timeoutDuration = 15 * 1000
        sessionTimeoutService.extend()
        
        console.log('⚠️ Session will timeout in 15 seconds (testing)')
        console.log('🔄 Will auto-reset to 30 minutes after test')
        
        // เปลี่ยนกลับเป็น 30 นาทีหลัง 18 วินาที (ให้เวลาเพียงพอ)
        setTimeout(() => {
          sessionTimeoutService.timeoutDuration = originalDuration
          sessionTimeoutService.extend() // เริ่มใหม่ด้วยเวลาเต็ม
          console.log('✅ Timeout duration reset to 30 minutes')
          console.log('🔄 Session restarted with full 30 minutes')
        }, 18000)
        
      } catch (error) {
        console.error('Error testing timeout:', error)
      }
    },
    
    // บังคับ logout
    async forceLogout() {
      try {
        const { authService } = await import('./services/authService.js')
        await authService.logout()
        console.log('🚪 Force logout via debug panel')
      } catch (error) {
        console.error('Error during logout:', error)
      }
    },
    
    // แปลงเวลาให้อ่านง่าย
    formatTime(milliseconds) {
      if (!milliseconds || milliseconds < 0) return '00:00:00'
      
      const totalSeconds = Math.floor(milliseconds / 1000)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
/* Debug Panel Styles */
.debug-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 15px;
  border-radius: 10px;
  font-size: 12px;
  min-width: 280px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-family: 'Courier New', monospace;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: #ffc107;
  font-size: 13px;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
}

.close-btn:hover {
  color: #ffc107;
}

.debug-content div {
  margin: 5px 0;
  padding: 2px 0;
}

.debug-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}

.debug-buttons button {
  padding: 4px 8px;
  font-size: 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-extend {
  background-color: #28a745;
  color: white;
}

.btn-extend:hover {
  background-color: #218838;
}

.btn-test {
  background-color: #ffc107;
  color: black;
}

.btn-test:hover {
  background-color: #e0a800;
}

.btn-logout {
  background-color: #dc3545;
  color: white;
}

.btn-logout:hover {
  background-color: #c82333;
}

/* Debug Toggle Button */
.debug-toggle {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  z-index: 999;
  transition: all 0.3s;
}

.debug-toggle:hover {
  background: rgba(0, 0, 0, 1);
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 768px) {
  .debug-panel {
    bottom: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
  }
  
  .debug-toggle {
    bottom: 70px;
    left: 10px;
  }
}
</style>