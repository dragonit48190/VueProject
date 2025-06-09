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

  // บันทึกข้อมูลหลัง login สำเร็จ
  saveUserData(userData) {
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('isLoggedIn', 'true')
    console.log('✅ User data saved:', userData)
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

  // ออกจากระบบ
  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userAvatar') // 🔥 เพิ่ม: ลบรูปโปรไฟล์ด้วย
    console.log('🚪 User logged out')
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
    return user ? user.loginnaam : ''
  },

  // 🔥 ดึงรูปโปรไฟล์จาก API
  async getUserAvatar() {
    try {
      const user = this.getUser()
      if (!user) return null

      // เช็คว่ามีรูปใน localStorage หรือไม่
      const cachedAvatar = localStorage.getItem('userAvatar')
      if (cachedAvatar) {
        return cachedAvatar
      }

      console.log('📸 Fetching avatar from API for username:', user.loginname) // เพิ่ม
      // ดึงรูปจาก API
      const response = await fetch(`http://localhost:5000/api/auth/avatar/${user.loginnaam}`)
      console.log('📸 API Response status:', response.status) // เพิ่ม
      const data = await response.json()
      console.log('📸 API Response data:', data) // เพิ่ม

      if (data.success && data.hasImage) {
        // เก็บรูปใน localStorage สำหรับใช้ครั้งต่อไป
        localStorage.setItem('userAvatar', data.image)
        return data.image
      }

      console.log('📸 No image found in API response') // เพิ่ม
      return null // ไม่มีรูป
    } catch (error) {
      console.error('Error fetching avatar:', error)
      return null
    }
  },

  // 🔥 ดึงข้อมูลโปรไฟล์เต็ม
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
          loginnaam: user.loginnaam
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

  // 🔥 ลบ cache รูปโปรไฟล์ (ใช้เมื่อต้องการรีเฟรช)
  clearAvatarCache() {
    localStorage.removeItem('userAvatar')
  },

  // 🔥 ดึงรูป default
  getDefaultAvatar() {
    return 'assets/images/avatars/avatar-d.png'
  }
}