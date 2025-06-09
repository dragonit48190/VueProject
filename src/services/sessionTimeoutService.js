// src/services/sessionTimeoutService.js
import Swal from 'sweetalert2'

class SessionTimeoutService {
  constructor() {
    // 🔧 เพิ่ม browser environment check
    try {
      if (typeof window === 'undefined') {
        console.warn('SessionTimeout: Not in browser environment')
        return
      }
    } catch (error) {
      console.error('SessionTimeout init error:', error)
      return
    }

    this.timeoutDuration = 30 * 60 * 1000 // 30 นาที (milliseconds)
    this.warningTimes = {
      first: 5 * 60 * 1000,    // เหลือ 5 นาที
      second: 2 * 60 * 1000,   // เหลือ 2 นาที  
      final: 30 * 1000         // เหลือ 30 วินาที
    }
    
    this.timers = {
      main: null,
      warning1: null,
      warning2: null,
      final: null
    }
    
    this.isActive = false
    this.lastActivity = Date.now()
    this.recentlyExtended = false
    this.isDestroyed = false // 🔧 เพิ่ม flag สำหรับ cleanup
    
    // Activity tracking
    this.activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    // Bind methods
    this.handleActivity = this.handleActivity.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
    this.syncAcrossTabs = this.syncAcrossTabs.bind(this)
    
    // 🔧 เพิ่ม try-catch สำหรับ event listeners
    try {
      // Listen for storage changes (cross-tab sync)
      window.addEventListener('storage', this.syncAcrossTabs)
      window.addEventListener('visibilitychange', this.handleVisibilityChange)
    } catch (error) {
      console.error('Error adding event listeners:', error)
    }
  }

  // 🚀 เริ่มต้นระบบ timeout
  start() {
    console.log('🕐 Starting session timeout (30 minutes)')
    this.isActive = true
    this.lastActivity = Date.now()
    this.updateStorageActivity()
    this.addActivityListeners()
    this.startTimers()
  }

  // 🛑 หยุดระบบ timeout
  stop() {
    console.log('⏹️ Stopping session timeout')
    this.isActive = false
    this.isDestroyed = true // 🔧 เพิ่ม destroyed flag
    this.clearAllTimers()
    this.removeActivityListeners()
    this.clearStorage()
    
    // 🔧 เพิ่ม cleanup event listeners
    try {
      window.removeEventListener('storage', this.syncAcrossTabs)
      window.removeEventListener('visibilitychange', this.handleVisibilityChange)
    } catch (error) {
      console.error('Error removing event listeners:', error)
    }
  }

  // 🔄 Reset เวลา (ต่ออายุ)
  extend() {
    console.log('🔄 Extending session')
    this.lastActivity = Date.now()
    this.recentlyExtended = true
    this.updateStorageActivity()
    this.clearAllTimers()
    this.startTimers()
    
    // Reset recently extended flag after 5 minutes
    setTimeout(() => {
      this.recentlyExtended = false
    }, 5 * 60 * 1000)
  }

  // 📝 เพิ่ม activity listeners
  addActivityListeners() {
    // 🔧 เพิ่ม try-catch และ check destroyed
    if (this.isDestroyed) return
    
    try {
      this.activityEvents.forEach(event => {
        document.addEventListener(event, this.handleActivity, true)
      })
    } catch (error) {
      console.error('Error adding activity listeners:', error)
    }
  }

  // 🗑️ ลบ activity listeners
  removeActivityListeners() {
    // 🔧 เพิ่ม try-catch
    try {
      this.activityEvents.forEach(event => {
        document.removeEventListener(event, this.handleActivity, true)
      })
    } catch (error) {
      console.error('Error removing activity listeners:', error)
    }
  }

  // 👆 จัดการ user activity
  handleActivity() {
    // 🔧 เพิ่ม checks
    if (!this.isActive || this.isDestroyed) return
    
    try {
      const now = Date.now()
      const timeSinceLastActivity = now - this.lastActivity
      
      // ถ้ามี activity หลังจากไม่มีการใช้งานนาน 1 นาที = ต่ออายุ
      if (timeSinceLastActivity > 60 * 1000) {
        console.log('👆 User activity detected - extending session')
        this.extend()
      }
    } catch (error) {
      console.error('Error handling activity:', error)
    }
  }

  // 👁️ จัดการเมื่อเปลี่ยน tab/window
  handleVisibilityChange() {
    // 🔧 เพิ่ม checks
    if (this.isDestroyed || !this.isActive) return
    
    try {
      if (!document.hidden && this.isActive) {
        // กลับมาใช้งาน - check ว่าหมดเวลาหรือยัง
        const timePassed = Date.now() - this.lastActivity
        if (timePassed >= this.timeoutDuration) {
          this.forceLogout('Session หมดเวลาขณะใช้งาน tab อื่น')
        }
      }
    } catch (error) {
      console.error('Error handling visibility change:', error)
    }
  }

  // 🔗 Sync ข้าม tabs
  syncAcrossTabs(event) {
    // 🔧 เพิ่ม checks
    if (this.isDestroyed || !event) return
    
    try {
      if (event.key === 'session_last_activity') {
        const lastActivity = parseInt(event.newValue)
        if (lastActivity > this.lastActivity) {
          console.log('🔗 Syncing activity from another tab')
          this.lastActivity = lastActivity
          this.extend()
        }
      } else if (event.key === 'session_logout') {
        // Tab อื่น logout แล้ว
        this.forceLogout('Logged out from another tab')
      }
    } catch (error) {
      console.error('Error syncing across tabs:', error)
    }
  }

  // 💾 อัปเดต localStorage
  updateStorageActivity() {
    // 🔧 เพิ่ม try-catch
    try {
      localStorage.setItem('session_last_activity', this.lastActivity.toString())
    } catch (error) {
      console.error('Error updating storage activity:', error)
    }
  }

  // 🗑️ ลบข้อมูลใน storage
  clearStorage() {
    // 🔧 เพิ่ม try-catch
    try {
      localStorage.removeItem('session_last_activity')
      localStorage.removeItem('session_logout')
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  }

  // ⏰ เริ่มต้น timers ทั้งหมด
  startTimers() {
    // Timer หลัก - logout เมื่อครบ 30 นาที
    this.timers.main = setTimeout(() => {
      this.forceLogout('Session timeout')
    }, this.timeoutDuration)

    // Warning 1: เหลือ 5 นาที
    this.timers.warning1 = setTimeout(() => {
      this.showFirstWarning()
    }, this.timeoutDuration - this.warningTimes.first)

    // Warning 2: เหลือ 2 นาที  
    this.timers.warning2 = setTimeout(() => {
      this.showSecondWarning()
    }, this.timeoutDuration - this.warningTimes.second)

    // Final warning: เหลือ 30 วินาที
    this.timers.final = setTimeout(() => {
      this.showFinalWarning()
    }, this.timeoutDuration - this.warningTimes.final)
  }

  // 🧹 ลบ timers ทั้งหมด
  clearAllTimers() {
    // 🔧 เพิ่ม try-catch
    try {
      Object.keys(this.timers).forEach(key => {
        if (this.timers[key]) {
          clearTimeout(this.timers[key])
          this.timers[key] = null
        }
      })
    } catch (error) {
      console.error('Error clearing timers:', error)
    }
  }

  // 🔔 แจ้งเตือนครั้งแรก (5 นาที)
  async showFirstWarning() {
    // 🔧 เพิ่ม checks
    if (!this.isActive || this.recentlyExtended || this.isDestroyed) return

    console.log('⚠️ First warning: 5 minutes left')
    
    try {
      // Toast notification เบาๆ
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'info',
        title: 'เหลือเวลา 5 นาที',
        text: 'Session จะหมดเวลาในอีก 5 นาที'
      })
    } catch (error) {
      console.error('Error showing first warning:', error)
    }
  }

  // ⚠️ แจ้งเตือนครั้งที่สอง (2 นาที)
  async showSecondWarning() {
    // 🔧 เพิ่ม checks
    if (!this.isActive || this.isDestroyed) return

    console.log('⚠️ Second warning: 2 minutes left')

    try {
      const result = await Swal.fire({
        title: 'Session กำลังจะหมดเวลา',
        html: 'Session จะหมดเวลาในอีก <strong>2 นาที</strong><br>ต้องการต่ออายุการใช้งานหรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '<i class="bx bx-refresh"></i> ต่ออายุ 30 นาที',
        cancelButtonText: '<i class="bx bx-x"></i> ยกเลิก',
        reverseButtons: true,
        allowOutsideClick: false,
        backdrop: 'rgba(0,0,0,0.7)'
      })

      if (result.isConfirmed) {
        this.extend()
        
        // แสดงข้อความสำเร็จ
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        })
        
        Toast.fire({
          icon: 'success',
          title: 'ต่ออายุ Session แล้ว',
          text: 'ใช้งานได้อีก 30 นาที'
        })
      }
    } catch (error) {
      console.error('Error showing second warning:', error)
    }
  }

  // 🚨 แจ้งเตือนสุดท้าย (30 วินาที)
  async showFinalWarning() {
    // 🔧 เพิ่ม checks
    if (!this.isActive || this.isDestroyed) return

    console.log('🚨 Final warning: 30 seconds left')

    try {
      let timeLeft = 30
      let timerInterval

      const result = await Swal.fire({
        title: 'กำลังออกจากระบบ',
        html: `Session จะหมดเวลาในอีก <b>${timeLeft}</b> วินาที`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#dc3545',
        confirmButtonText: '<i class="bx bx-refresh"></i> ต่ออายุ',
        cancelButtonText: '<i class="bx bx-log-out"></i> ออกจากระบบ',
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: 'rgba(220,53,69,0.8)',
        timer: 30000,
        timerProgressBar: true,
        didOpen: () => {
          const content = Swal.getHtmlContainer()
          const timer = content.querySelector('b')
          
          timerInterval = setInterval(() => {
            timeLeft--
            timer.textContent = timeLeft
            
            if (timeLeft <= 0) {
              clearInterval(timerInterval)
            }
          }, 1000)
        },
        willClose: () => {
          clearInterval(timerInterval)
        }
      })

      if (result.isConfirmed) {
        this.extend()
        
        Swal.fire({
          icon: 'success',
          title: 'ต่ออายุ Session แล้ว!',
          text: 'ใช้งานได้อีก 30 นาที',
          timer: 2000,
          showConfirmButton: false
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.forceLogout('User chose to logout')
      } else if (result.dismiss === Swal.DismissReason.timer) {
        this.forceLogout('Final warning timeout')
      }
    } catch (error) {
      console.error('Error showing final warning:', error)
      // Fallback logout ถ้า SweetAlert ล้มเหลว
      this.forceLogout('Error in final warning')
    }
  }

  // 🚪 บังคับ logout
  async forceLogout(reason = 'Session timeout') {
    console.log(`🚪 Force logout: ${reason}`)
    
    this.stop()
    
    try {
      // แจ้ง tabs อื่นให้ logout ด้วย
      localStorage.setItem('session_logout', Date.now().toString())
      
      // Import authService dynamically
      const { authService } = await import('./authService.js')
      authService.logout()
      
      // ส่ง event แจ้ง components อื่น
      window.dispatchEvent(new CustomEvent('auth-status-changed'))
      
      // แสดงข้อความแจ้งเตือน
      await Swal.fire({
        icon: 'warning',
        title: 'Session หมดเวลา',
        text: 'คุณถูกออกจากระบบเนื่องจากไม่มีการใช้งานเป็นเวลานาน',
        confirmButtonText: 'ตกลง',
        allowOutsideClick: false,
        backdrop: 'rgba(220,53,69,0.8)'
      })
      
      // กลับไปหน้า dashboard
      if (window.location.pathname !== '/') {
        window.location.href = '/'
      }
      
    } catch (error) {
      console.error('Error during force logout:', error)
      // 🔧 Fallback ที่แข็งแรงกว่า
      try {
        // ลองปิด Swal ที่เปิดอยู่
        Swal.close()
        alert('Session หมดเวลา กรุณา login ใหม่')
      } catch (swalError) {
        console.error('SweetAlert error:', swalError)
      }
      
      // บังคับกลับหน้าแรก
      try {
        window.location.href = '/'
      } catch (navError) {
        console.error('Navigation error:', navError)
        window.location.reload()
      }
    }
  }

  // 📊 ตรวจสอบสถานะ
  getStatus() {
    if (!this.isActive) return null
    
    const now = Date.now()
    const timeElapsed = now - this.lastActivity
    const timeRemaining = this.timeoutDuration - timeElapsed
    
    return {
      isActive: this.isActive,
      timeElapsed,
      timeRemaining,
      lastActivity: new Date(this.lastActivity),
      willExpireAt: new Date(this.lastActivity + this.timeoutDuration)
    }
  }
}

// สร้าง singleton instance
const sessionTimeoutService = new SessionTimeoutService()

export { sessionTimeoutService }