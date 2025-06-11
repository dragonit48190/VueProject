<!-- src/components/Header.vue -->
<template>
  <header>
      <div class="topbar d-flex align-items-center">
          <nav class="navbar navbar-expand">
              <div class="mobile-toggle-menu"><i class='bx bx-menu'></i>
              </div>
              <div class="top-menu-left d-none d-lg-block">
                  <ul class="nav">
                </ul>
               </div>
              <div class="search-bar flex-grow-1">
                  <div class="position-relative search-bar-box">
                      <input type="text" class="form-control search-control" placeholder="Type to search..."> <span class="position-absolute top-50 search-show translate-middle-y"><i class='bx bx-search'></i></span>
                      <span class="position-absolute top-50 search-close translate-middle-y"><i class='bx bx-x'></i></span>
                  </div>
              </div>
              <div class="top-menu ms-auto">
                  <ul class="navbar-nav align-items-center">
                      <li class="nav-item mobile-search-icon">
                          <a class="nav-link" href="#">	<i class='bx bx-search'></i>
                          </a>
                      </li>
                      <li class="nav-item dropdown dropdown-large">
                          <a class="nav-link dropdown-toggle dropdown-toggle-nocaret position-relative" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> <span class="alert-count">7</span>
                              <i class='bx bx-bell'></i>
                          </a>
                          <div class="dropdown-menu dropdown-menu-end">
                              <a href="javascript:;">
                                  <div class="msg-header">
                                      <p class="msg-header-title">Notifications</p>
                                      <p class="msg-header-clear ms-auto">Marks all as read</p>
                                  </div>
                              </a>
                              <div class="header-notifications-list">
                                  <a class="dropdown-item" href="javascript:;">
                                      <div class="d-flex align-items-center">
                                          <div class="notify bg-light-primary text-primary"><i class="bx bx-group"></i>
                                          </div>
                                          <div class="flex-grow-1">
                                              <h6 class="msg-name">New Customers<span class="msg-time float-end">14 Sec
                                          ago</span></h6>
                                              <p class="msg-info">5 new user registered</p>
                                          </div>
                                      </div>
                                  </a>
                              </div>
                              <a href="javascript:;">
                                  <div class="text-center msg-footer">View All Notifications</div>
                              </a>
                          </div>
                      </li>
                      <li class="nav-item dropdown dropdown-large">
                          <div class="dropdown-menu dropdown-menu-end">
                              <div class="header-message-list">                               
                              </div>
                          </div>
                      </li>
                  </ul>
              </div>
              
              <!-- 🔥 เพิ่มส่วน Login Button ก่อน user-box -->
              <div id="login-section" style="margin-right: 15px;">
                  <button onclick="openLoginSidebar()" class="btn bg-gradient-cosmic text-white btn-md">
                      <i class='bx bx-lock-open-alt'></i> เข้าสู่ระบบ
                  </button>
              </div>
              
              <!-- 🔥 แก้ไข user-box เล็กน้อย -->
              <div id="user-section" class="user-box dropdown" style="display: none;">
                  <a class="d-flex align-items-center nav-link dropdown-toggle dropdown-toggle-nocaret" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <img src="assets/images/avatars/dragon.png" class="user-img" alt="user avatar">
                      <div class="user-info ps-3">
                          <p id="user-name" class="user-name mb-0">DragonIT</p>
                          <p id="user-position" class="designattion mb-0">Web Designer</p>
                      </div>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end">
                      <!-- 🔥 เปลี่ยนจาก onclick เป็น @click -->
                      <li><a class="dropdown-item" href="javascript:;" @click="openProfileSidebar"><i class="bx bx-user"></i><span>Profile</span></a>
                      </li>
                      <li>
                          <div class="dropdown-divider mb-0"></div>
                      </li>
                      <li><a class="dropdown-item" href="javascript:;" onclick="handleLogout()"><i class='bx bx-log-out-circle'></i><span>Logout</span></a>
                      </li>
                  </ul>
              </div>
          </nav>
      </div>

      <!-- 🔥 เพิ่ม ProfileSidebar Component -->
      <ProfileSidebar 
        :isVisible="showProfileSidebar"
        @close="closeProfileSidebar"
      />
  </header>
  <!--end header -->
  </template>
  
  <script>
  import ProfileSidebar from './ProfileSidebar.vue' // 🔥 Import ProfileSidebar

  export default {
    name: "AppHeader",
    components: {
      ProfileSidebar // 🔥 Register component
    },
    data() {
      return {
        showProfileSidebar: false // 🔥 State สำหรับ ProfileSidebar
      }
    },
    mounted() {
      // เช็คสถานะ login เมื่อโหลดหน้า
      this.checkAuthStatus()
      
      // ฟัง event เมื่อมีการ login/logout
      window.addEventListener('auth-status-changed', this.checkAuthStatus)
    },
    beforeUnmount() {
      window.removeEventListener('auth-status-changed', this.checkAuthStatus)
    },
    methods: {
      // 🔥 เปิด ProfileSidebar
      openProfileSidebar() {
        console.log('👤 Opening profile sidebar')
        this.showProfileSidebar = true
      },

      // 🔥 ปิด ProfileSidebar
      closeProfileSidebar() {
        console.log('👤 Closing profile sidebar')
        this.showProfileSidebar = false
      },

      async checkAuthStatus() {
        try {
          // Dynamic import เพื่อไม่กระทบ bootstrap
          const { authService } = await import('../services/authService.js')
          
          const loginSection = document.getElementById('login-section')
          const userSection = document.getElementById('user-section')
          const userName = document.getElementById('user-name')
          const userPosition = document.getElementById('user-position')
          
          if (authService.isAuthenticated()) {
            // ซ่อน login button, แสดง user dropdown
            loginSection.style.display = 'none'
            userSection.style.display = 'block'
            
            // อัพเดทข้อมูล user
            userName.textContent = authService.getDisplayName()
            userPosition.textContent = authService.getPosition()
          } else {
            // แสดง login button, ซ่อน user dropdown
            loginSection.style.display = 'block'
            userSection.style.display = 'none'
            
            // 🔥 ปิด ProfileSidebar ถ้า user logout
            this.showProfileSidebar = false
          }
        } catch (error) {
          console.error('Error checking auth status:', error)
        }
      }
    }
  }
  
  // 🔥 Global functions สำหรับ onclick
  window.openLoginSidebar = function() {
    console.log('🔓 Opening login sidebar from header')
    window.dispatchEvent(new CustomEvent('open-login-sidebar'))
  }
  
  // 🔥 เปลี่ยน handleLogout ให้ใช้ SweetAlert
  window.handleLogout = async function() {
    console.log('🚪 Logout clicked')
    
    try {
      // Import SweetAlert
      const Swal = (await import('sweetalert2')).default
      
      // ยืนยันการออกจากระบบด้วย SweetAlert
      const result = await Swal.fire({
        title: 'ออกจากระบบ?',
        text: 'คุณต้องการออกจากระบบหรือไม่?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '<i class="bx bx-log-out"></i> ออกจากระบบ',
        cancelButtonText: '<i class="bx bx-x"></i> ยกเลิก',
        reverseButtons: true,
        buttonsStyling: true,
        background: '#fff',
        color: '#495057'
      })
      
      if (result.isConfirmed) {
        // ทำการ logout
        const { authService } = await import('../services/authService.js')
        authService.logout()
        window.dispatchEvent(new CustomEvent('auth-status-changed'))
        
        // แสดงข้อความสำเร็จ
        await Swal.fire({
          icon: 'success',
          title: 'ออกจากระบบแล้ว',
          text: 'คุณได้ออกจากระบบเรียบร้อยแล้ว',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          toast: true,
          position: 'top-end',
          background: '#d4edda',
          color: '#155724',
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        // กลับไปหน้า dashboard
        setTimeout(() => {
          window.location.href = '/'
        }, 500)
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback ถ้า SweetAlert มีปัญหา
      if (confirm('ต้องการออกจากระบบหรือไม่?')) {
        const { authService } = await import('../services/authService.js')
        authService.logout()
        window.dispatchEvent(new CustomEvent('auth-status-changed'))
        alert('ออกจากระบบเรียบร้อยแล้ว')
        window.location.href = '/'
      }
    }
  }
  </script>
  
  <style scoped>
  .btn-primary {
    background-color: #0d6efd;
    border-color: #0d6efd;
    font-size: 14px;
    padding: 8px 16px;
    border-radius: 6px;
  }
  
  .btn-primary:hover {
    background-color: #0b5ed7;
    border-color: #0a58ca;
  }
  
  /* เพิ่ม style สำหรับ login button */
  .bg-gradient-cosmic {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }
  
  .bg-gradient-cosmic:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  .btn-md {
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 8px;
    font-weight: 500;
  }
  </style>