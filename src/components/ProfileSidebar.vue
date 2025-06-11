<!-- src/components/ProfileSidebar.vue -->
<template>
  <div>
    <!-- Overlay -->
    <div 
      v-if="isVisible" 
      class="profile-overlay"
      @click="closeSidebar"
    ></div>

    <!-- Profile Sidebar -->
    <div 
      :class="[
        'profile-sidebar',
        isVisible ? 'profile-sidebar-open' : 'profile-sidebar-closed'
      ]"
    >
      <!-- Header -->
      <div class="profile-header">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="mb-0 text-white">ข้อมูลโปรไฟล์</h4>
          <button 
            @click="closeSidebar"
            class="btn-close-profile"
          >
            ×
          </button>
        </div>
        <p class="text-white-50 small mt-2 mb-0">ข้อมูลส่วนตัวและสิทธิ์การใช้งาน</p>
      </div>

      <!-- Profile Body -->
      <div class="profile-body">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-section">
          <div class="loading-spinner"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>

        <!-- Profile Content -->
        <div v-else-if="profileData" class="profile-content">
          
          <!-- Section 1: ข้อมูลส่วนตัว -->
          <div class="profile-section">
            <h5 class="section-title">
              <i class="bx bx-user"></i> ข้อมูลส่วนตัว
            </h5>
            
            <!-- Avatar -->
            <div class="avatar-section">
              <div class="avatar-container">
                <img 
                  :src="profileAvatar" 
                  :alt="profileData.name"
                  class="profile-avatar"
                  @error="handleImageError"
                />
                <div class="avatar-status">
                  <i class="bx bx-check-circle" v-if="profileData.hasImage"></i>
                  <i class="bx bx-user-circle" v-else></i>
                </div>
              </div>
            </div>

            <!-- Personal Info -->
            <div class="info-grid">
              <div class="info-item">
                <label>ชื่อ-นามสกุล</label>
                <p>{{ profileData.name || '-' }}</p>
              </div>
              
              <div class="info-item">
                <label>ชื่อผู้ใช้</label>
                <p>{{ profileData.loginname || '-' }}</p>
              </div>
              
              <div class="info-item">
                <label>ตำแหน่ง</label>
                <p>{{ profileData.entryposition || '-' }}</p>
              </div>
              
              <div class="info-item">
                <label>กลุ่ม/แผนก</label>
                <p>{{ profileData.groupname || '-' }}</p>
              </div>
              
              <div class="info-item">
                <label>เบอร์โทร</label>
                <p>{{ formatPhoneNumber(profileData.hometel) }}</p>
              </div>
              
              <div class="info-item">
                <label>รหัสแพทย์</label>
                <p>{{ profileData.doctorcode || '-' }}</p>
              </div>
              
              <div class="info-item full-width">
                <label>ที่อยู่</label>
                <p>{{ profileData.informaddr || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Section 2: ข้อมูลระบบ -->
          <div class="profile-section">
            <h5 class="section-title">
              <i class="bx bx-time"></i> ข้อมูลระบบ
            </h5>
            
            <div class="info-grid">
              <div class="info-item">
                <label>ล็อกอินล่าสุด</label>
                <p>{{ formatLastLogin(lastLoginTime) }}</p>
              </div>
              
              <div class="info-item">
                <label>สถานะ Session</label>
                <p class="session-status" :class="sessionStatusClass">
                  <i :class="sessionStatusIcon"></i>
                  {{ sessionStatusText }}
                </p>
              </div>
              
              <div class="info-item full-width" v-if="sessionTimeLeft">
                <label>เวลาเหลือ</label>
                <p class="time-left">{{ sessionTimeLeft }}</p>
              </div>
            </div>
          </div>

          <!-- Section 3: สิทธิ์การเข้าถึง -->
          <div class="profile-section">
            <h5 class="section-title">
              <i class="bx bx-shield-check"></i> สิทธิ์การเข้าถึง
            </h5>
            
            <div class="permissions-list">
              <div 
                v-for="permission in userPermissions" 
                :key="permission.name"
                class="permission-item"
                :class="{ 'has-access': permission.hasAccess }"
              >
                <i :class="permission.hasAccess ? 'bx bx-check-circle' : 'bx bx-x-circle'"></i>
                <span>{{ permission.name }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Error State -->
        <div v-else class="error-section">
          <i class="bx bx-error-circle"></i>
          <h5>ไม่สามารถโหลดข้อมูลได้</h5>
          <p>กรุณาลองใหม่อีกครั้ง</p>
          <button @click="loadProfileData" class="btn btn-retry">
            <i class="bx bx-refresh"></i> ลองใหม่
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '../services/authService.js'

export default {
  name: 'ProfileSidebar',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  data() {
    return {
      isLoading: false,
      profileData: null,
      profileAvatar: null,
      lastLoginTime: null,
      sessionStatus: null,
      sessionTimeLeft: '',
      updateTimer: null,
      userPermissions: [
        { name: 'รายงาน HA', hasAccess: false },
        { name: 'รายงาน NCDs', hasAccess: false },
        { name: 'รายงาน PCU', hasAccess: false },
        { name: 'รายงาน ER', hasAccess: false },
        { name: 'รายงาน IPD', hasAccess: false },
        { name: 'รายงานกายภาพ', hasAccess: false },
        { name: 'รายงานจิตเวชฯ', hasAccess: false },
        { name: 'รายงาน การเงิน', hasAccess: false }
      ]
    }
  },
  computed: {
    sessionStatusClass() {
      if (!this.sessionStatus) return 'status-inactive'
      return this.sessionStatus.isActive ? 'status-active' : 'status-inactive'
    },
    
    sessionStatusIcon() {
      if (!this.sessionStatus) return 'bx bx-x-circle'
      return this.sessionStatus.isActive ? 'bx bx-check-circle' : 'bx bx-x-circle'
    },
    
    sessionStatusText() {
      if (!this.sessionStatus) return 'ไม่ได้เชื่อมต่อ'
      return this.sessionStatus.isActive ? 'ใช้งานอยู่' : 'ไม่ได้ใช้งาน'
    }
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.loadProfileData()
        this.startSessionUpdates()
      } else {
        this.stopSessionUpdates()
      }
    }
  },
  beforeUnmount() {
    this.stopSessionUpdates()
  },
  methods: {
    // ปิด sidebar
    closeSidebar() {
      this.stopSessionUpdates()
      this.$emit('close')
    },

    // โหลดข้อมูลโปรไฟล์
    async loadProfileData() {
      try {
        this.isLoading = true
        
        // โหลดข้อมูลโปรไฟล์จาก API
        const profile = await authService.getUserProfile()
        
        if (profile) {
          this.profileData = profile
          
          // โหลดรูปโปรไฟล์
          if (profile.hasImage && profile.image) {
            this.profileAvatar = profile.image
          } else {
            this.profileAvatar = authService.getDefaultAvatar()
          }
        } else {
          // ถ้าไม่มีข้อมูลจาก API ใช้ข้อมูลพื้นฐาน
          const user = authService.getUser()
          this.profileData = {
            name: user.name,
            loginname: user.loginname,
            entryposition: user.entryposition,
            groupname: user.groupname,
            hasImage: false
          }
          this.profileAvatar = authService.getDefaultAvatar()
        }

        // โหลดข้อมูลเพิ่มเติม
        this.loadLastLoginTime()
        this.updateSessionInfo()
        this.updatePermissions()
        
      } catch (error) {
        console.error('Error loading profile data:', error)
        this.profileData = null
      } finally {
        this.isLoading = false
      }
    },

    // โหลดเวลาล็อกอินล่าสุด
    loadLastLoginTime() {
      const lastLogin = localStorage.getItem('lastLoginTime')
      this.lastLoginTime = lastLogin ? new Date(lastLogin) : new Date()
    },

    // อัปเดทข้อมูล session
    async updateSessionInfo() {
      try {
        this.sessionStatus = await authService.getSessionStatus()
        
        if (this.sessionStatus && this.sessionStatus.timeRemaining > 0) {
          this.sessionTimeLeft = this.formatTime(this.sessionStatus.timeRemaining)
        } else {
          this.sessionTimeLeft = '00:00:00'
        }
      } catch (error) {
        console.error('Error updating session info:', error)
        this.sessionStatus = null
        this.sessionTimeLeft = ''
      }
    },

    // อัปเดทสิทธิ์ผู้ใช้
    updatePermissions() {
      this.userPermissions = this.userPermissions.map(permission => ({
        ...permission,
        hasAccess: authService.canAccessReport(permission.name)
      }))
    },

    // เริ่ม timer อัปเดท session
    startSessionUpdates() {
      this.updateTimer = setInterval(() => {
        this.updateSessionInfo()
      }, 1000) // อัปเดททุกวินาที
    },

    // หยุด timer อัปเดท session
    stopSessionUpdates() {
      if (this.updateTimer) {
        clearInterval(this.updateTimer)
        this.updateTimer = null
      }
    },

    // จัดการเมื่อรูปโหลดไม่ได้
    handleImageError() {
      this.profileAvatar = authService.getDefaultAvatar()
    },

    // จัดรูปแบบเบอร์โทร
    formatPhoneNumber(phone) {
      if (!phone) return '-'
      
      // ลบอักขระที่ไม่ใช่ตัวเลข
      const cleaned = phone.toString().replace(/\D/g, '')
      
      // ถ้าเป็นเบอร์ 10 หลัก จัดรูปแบบเป็น xxx-xxx-xxxx
      if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
      }
      
      // ถ้าเป็นเบอร์ 9 หลัก จัดรูปแบบเป็น xx-xxx-xxxx
      if (cleaned.length === 9) {
        return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
      }
      
      // ถ้าไม่ตรงรูปแบบ ส่งกลับเป็นต้นฉบับ
      return phone
    },

    // จัดรูปแบบวันเวลาล็อกอิน
    formatLastLogin(date) {
      if (!date) return '-'
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
      return new Date(date).toLocaleDateString('th-TH', options)
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
/* Overlay */
.profile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  transition: opacity 0.3s ease;
}

/* Profile Sidebar */
.profile-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 480px;
  height: 100%;
  background-color: #fff;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  transition: transform 0.3s ease;
  overflow-y: auto;
}

.profile-sidebar-open {
  transform: translateX(0);
}

.profile-sidebar-closed {
  transform: translateX(100%);
}

/* Header */
.profile-header {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  padding: 20px;
  color: white;
}

.btn-close-profile {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn-close-profile:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Body */
.profile-body {
  padding: 0;
  min-height: calc(100vh - 100px);
}

/* Loading */
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6c757d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-left: 3px solid #6c757d;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Profile Content */
.profile-content {
  display: flex;
  flex-direction: column;
}

/* Profile Section */
.profile-section {
  padding: 25px;
  border-bottom: 1px solid #e9ecef;
}

.profile-section:last-child {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #495057;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
}

.section-title i {
  color: #6c757d;
  font-size: 18px;
}

/* Avatar Section */
.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e9ecef;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-status {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e9ecef;
}

.avatar-status i {
  font-size: 14px;
  color: #28a745;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.info-item p {
  font-size: 14px;
  color: #212529;
  margin: 0;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
  word-break: break-word;
}

/* Session Status */
.session-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.status-active {
  color: #28a745;
}

.status-inactive {
  color: #dc3545;
}

.time-left {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  color: #495057;
}

/* Permissions List */
.permissions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f8f9fa;
  font-size: 14px;
  transition: all 0.2s;
}

.permission-item.has-access {
  background-color: #d4edda;
  color: #155724;
}

.permission-item i {
  font-size: 16px;
}

.permission-item.has-access i {
  color: #28a745;
}

.permission-item:not(.has-access) i {
  color: #dc3545;
}

/* Error Section */
.error-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6c757d;
  text-align: center;
}

.error-section i {
  font-size: 48px;
  color: #dc3545;
  margin-bottom: 15px;
}

.error-section h5 {
  color: #495057;
  margin-bottom: 8px;
}

.btn-retry {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s;
  margin-top: 15px;
}

.btn-retry:hover {
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .profile-sidebar {
    width: 100%;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-section {
    padding: 20px 15px;
  }
}
</style>