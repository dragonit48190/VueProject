// src/services/authService.js
export const authService = {
  // ตรวจสอบว่า user login หรือยัง
  isAuthenticated() {
    return localStorage.getItem('isLoggedIn') === 'true'
  },

  // ดึงข้อมูล user ที่ login อยู่
  getUser() {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  },

  // 🔥 บันทึกข้อมูลหลัง login สำเร็จ + เริ่ม session timeout + เก็บเวลา login
  async saveUserData(userData) {
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('isLoggedIn', 'true')
    
    // 🔥 เก็บเวลาล็อกอินล่าสุด
    localStorage.setItem('lastLoginTime', new Date().toISOString())
    
    console.log('✅ User data saved:', userData)
    console.log('🕐 Login time recorded:', new Date().toLocaleString('th-TH'))
    
    // เริ่มต้น session timeout
    try {
      const { sessionTimeoutService } = await import('./sessionTimeoutService.js')
      sessionTimeoutService.start()
      console.log('🕐 Session timeout started for user:', userData.name)
    } catch (error) {
      console.error('Error starting session timeout:', error)
    }
  },

  // ตรวจสอบสิทธิ์เข้าดูรายงาน
  canAccessReport(reportType) {
    const user = this.getUser()
    if (!user) {
      console.log('❌ No user logged in')
      return false
    }

    // ผู้ดูแลระบบเข้าดูได้ทั้งหมด
    if (user.groupname === 'ผู้ดูแลระบบ') {
      console.log('Admin access granted')
      return true
    }

    // เช็คสิทธิ์ตาม group
    const accessMap = {
      'PCU': ['รายงาน PCU'],
      'ER': ['รายงาน ER'],
      'กายภาพบำบัด': ['รายงานกายภาพ'],
      'งานการเงินและบัญชี': ['รายงาน การเงิน']
    }

    const allowedReports = accessMap[user.groupname] || []
    const hasAccess = allowedReports.includes(reportType)
    
    console.log(`🔍 Access check: ${user.groupname} → ${reportType} = ${hasAccess}`)
    return hasAccess
  },

  // 🔥 ออกจากระบบ + หยุด session timeout + ลบเวลา login
  async logout() {
    console.log('🚪 Starting logout process...')
    
    // หยุด session timeout ก่อน
    try {
      const { sessionTimeoutService } = await import('./sessionTimeoutService.js')
      sessionTimeoutService.stop()
      console.log('⏹️ Session timeout stopped')
    } catch (error) {
      console.error('Error stopping session timeout:', error)
    }
    
    // ลบข้อมูลจาก localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userAvatar')
    localStorage.removeItem('lastLoginTime') // 🔥 ลบเวลา login ด้วย
    
    console.log('🚪 User logged out successfully')
  },

  // เช็คและเริ่ม session timeout ถ้ามี user login อยู่แล้ว (สำหรับ page reload)
  async initializeSession() {
    if (this.isAuthenticated()) {
      const user = this.getUser()
      console.log('🔄 Initializing session for existing user:', user?.name)
      
      try {
        const { sessionTimeoutService } = await import('./sessionTimeoutService.js')
        
        // เช็คว่า session หมดเวลาหรือยัง (ถ้ามี last activity ใน localStorage)
        const lastActivity = localStorage.getItem('session_last_activity')
        if (lastActivity) {
          const timePassed = Date.now() - parseInt(lastActivity)
          const timeoutDuration = 30 * 60 * 1000 // 30 นาที
          
          if (timePassed >= timeoutDuration) {
            console.log('⏰ Session expired during page reload - forcing logout')
            await this.logout()
            return false
          }
        }
        
        // Session ยังไม่หมดเวลา - เริ่ม timeout service
        sessionTimeoutService.start()
        console.log('🕐 Session timeout resumed for existing session')
        return true
      } catch (error) {
        console.error('Error initializing session:', error)
        return false
      }
    }
    return false
  },

  // ต่ออายุ session manually (สำหรับใช้ใน components)
  async extendSession() {
    if (this.isAuthenticated()) {
      try {
        const { sessionTimeoutService } = await import('./sessionTimeoutService.js')
        sessionTimeoutService.extend()
        console.log('🔄 Session extended manually')
        return true
      } catch (error) {
        console.error('Error extending session:', error)
        return false
      }
    }
    return false
  },

  // ดึงสถานะ session timeout
  async getSessionStatus() {
    if (!this.isAuthenticated()) return null
    
    try {
      const { sessionTimeoutService } = await import('./services/sessionTimeoutService.js')
      return sessionTimeoutService.getStatus()
    } catch (error) {
      console.error('Error getting session status:', error)
      return null
    }
  },

  // 🔥 ดึงเวลาล็อกอินล่าสุด
  getLastLoginTime() {
    const lastLoginTime = localStorage.getItem('lastLoginTime')
    return lastLoginTime ? new Date(lastLoginTime) : null
  },

  // ดึงชื่อผู้ใช้สำหรับแสดงใน Header
  getDisplayName() {
    const user = this.getUser()
    return user ? user.name : 'Guest'
  },

  // ดึงตำแหน่งสำหรับแสดงใน Header
  getPosition() {
    const user = this.getUser()
    return user ? user.entryposition : 'ยังไม่ได้เข้าสู่ระบบ'
  },

  // ดึง group name
  getUserGroup() {
    const user = this.getUser()
    return user ? user.groupname : ''
  },

  // ดึง username
  getUsername() {
    const user = this.getUser()
    return user ? user.loginname : ''
  },

  // ดึงรูปโปรไฟล์จาก API
  async getUserAvatar() {
    try {
      const user = this.getUser()
      if (!user) return null

      // เช็คว่ามีรูปใน localStorage หรือไม่
      const cachedAvatar = localStorage.getItem('userAvatar')
      if (cachedAvatar) {
        return cachedAvatar
      }

      console.log('📸 Fetching avatar from API for username:', user.loginname)
      // ดึงรูปจาก API
      const response = await fetch(`http://localhost:5000/api/auth/avatar/${user.loginname}`)
      console.log('📸 API Response status:', response.status)
      const data = await response.json()
      console.log('📸 API Response data:', data)

      if (data.success && data.hasImage) {
        // เก็บรูปใน localStorage สำหรับใช้ครั้งต่อไป
        localStorage.setItem('userAvatar', data.image)
        return data.image
      }

      console.log('📸 No image found in API response')
      return null // ไม่มีรูป
    } catch (error) {
      console.error('Error fetching avatar:', error)
      return null
    }
  },

  // ดึงข้อมูลโปรไฟล์เต็ม
  async getUserProfile() {
    try {
      const user = this.getUser()
      if (!user) return null

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          loginname: user.loginname
        })
      })

      const data = await response.json()

      if (data.success) {
        return data.profile
      }

      return null
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  },

  // ลบ cache รูปโปรไฟล์ (ใช้เมื่อต้องการรีเฟรช)
  clearAvatarCache() {
    localStorage.removeItem('userAvatar')
  },

  // ดึงรูป default
  getDefaultAvatar() {
    return 'assets/images/avatars/avatar-d.png'
  }
}