<template>
  <div>
    <!-- Overlay -->
    <div 
      v-if="isVisible" 
      class="login-overlay"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <div 
      :class="[
        'login-sidebar',
        isVisible ? 'login-sidebar-open' : 'login-sidebar-closed'
      ]"
    >
      <!-- Header -->
      <div class="login-header">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="mb-0 text-white">เข้าสู่ระบบ</h4>
          <button 
            @click="closeSidebar"
            class="btn-close-login"
          >
            ×
          </button>
        </div>
        <p class="text-white-50 small mt-2 mb-0">กรุณาเข้าสู่ระบบเพื่อดูรายงาน</p>
      </div>

      <!-- Login Form -->
      <div class="login-body">
        <form @submit.prevent="handleLogin">
          <!-- Username Field -->
          <div class="form-group">
            <label class="form-label">Username</label>
            <input
              v-model="loginForm.loginname"
              type="text"
              class="form-control"
              placeholder="ใส่ username"
              required
              :disabled="isLoading"
            />
          </div>

          <!-- Password Field with Eye Icon -->
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="password-input-wrapper">
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control password-input"
                placeholder="ใส่ password"
                required
                :disabled="isLoading"
              />
              <button
                type="button"
                class="password-toggle-btn"
                @click="togglePasswordVisibility"
                :disabled="isLoading"
              >
                <i :class="showPassword ? 'bx bx-hide' : 'bx bx-show'"></i>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="btn btn-login w-100"
          >
            <span v-if="isLoading">
              <i class="bx bx-loader-alt bx-spin"></i> กำลังเข้าสู่ระบบ...
            </span>
            <span v-else>
              <i class="bx bx-log-in"></i> เข้าสู่ระบบ
            </span>
          </button>
        </form>

        <!-- Footer -->
        <div class="login-footer">
          <h5 class="text-danger text-center">
            ** ใช้ User เดียวกันกับ HOSxP ** <br>
            เข้าใช้งานไม่ได้กรุณาติดต่อ IT 850 </h5>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import { authService } from '../services/authService.js' // 🔥 เพิ่ม import

export default {
  name: 'LoginSidebar',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    requestedRoute: {
      type: String,
      default: ''
    }
  },
  emits: ['close', 'login-success'],
  data() {
    return {
      loginForm: {
        loginname: '',
        password: ''
      },
      isLoading: false,
      errorMessage: '',
      showPassword: false // 🔥 เพิ่ม state สำหรับแสดง/ซ่อน password
    }
  },
  methods: {
    // 🔥 เพิ่ม method สำหรับ toggle password visibility
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },

    closeSidebar() {
      // Clear form และ errors
      this.loginForm.loginname = ''
      this.loginForm.password = ''
      this.errorMessage = ''
      this.showPassword = false // 🔥 รีเซ็ต password visibility
      this.$emit('close')
    },

    async handleLogin() {
      try {
        this.isLoading = true
        this.errorMessage = ''

        console.log('Attempting login...', {
          loginname: this.loginForm.loginname,
        })

        // API call to backend
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          loginname: this.loginForm.loginname,
          password: this.loginForm.password
        })

        if (response.data.success) {
          console.log('Login successful:', response.data)
          
          // 🔥 ใช้ authService.saveUserData() จะเริ่ม session timeout อัตโนมัติ
          await authService.saveUserData(response.data.user)
          
          // ส่ง event แจ้งการ login สำเร็จ
          window.dispatchEvent(new CustomEvent('auth-status-changed'))
          
          // ปิด login sidebar
          this.closeSidebar()
          
          //  SweetAlert สำเร็จ
          await Swal.fire({
            icon: 'success',
            title: 'เข้าสู่ระบบสำเร็จ!',
            html: `ยินดีต้อนรับ <strong>${response.data.user.name}</strong><br>
                   <small class="text-muted">${response.data.user.groupname}</small><br>
                   <small class="text-success">🕐 Session timeout: 30 นาที</small>`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            toast: true,
            position: 'top-end',
            background: '#f8f9fa',
            color: '#495057'
          })
          
          // ส่ง event ไปยัง parent component
          this.$emit('login-success', {
            user: response.data.user,
            requestedRoute: this.requestedRoute
          })
        }
      } catch (error) {
        console.error('❌ Login error:', error)
        
        let errorMsg = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
        
        if (error.response && error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message
        }
        
        // 🔥 SweetAlert ผิดพลาด - ปรับปรุงข้อความ
        await Swal.fire({
          icon: 'error',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          html: `<strong>${errorMsg}</strong><br>
                 <small class="text-muted">กรุณาตรวจสอบ username และ password</small>`,
          confirmButtonText: 'ลองใหม่',
          confirmButtonColor: '#dc3545',
          background: '#fff',
          color: '#495057',
          showClass: {
            popup: 'animate__animated animate__shakeX'
          }
        })
        
        // ล้าง password field
        this.loginForm.password = ''
        this.showPassword = false // รีเซ็ต password visibility เมื่อ error
        
        // 🔥 Focus กลับไปที่ username field สำหรับใส่ใหม่
        this.$nextTick(() => {
          const usernameInput = this.$el.querySelector('input[type="text"]')
          if (usernameInput) {
            usernameInput.focus()
          }
        })
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  transition: opacity 0.3s ease;
}

.login-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background-color: #fff;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  transition: transform 0.3s ease;
  overflow-y: auto;
}

.login-sidebar-open {
  transform: translateX(0);
}

.login-sidebar-closed {
  transform: translateX(100%);
}

.login-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  color: white;
}

.btn-close-login {
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

.btn-close-login:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.login-body {
  padding: 30px 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-control:disabled {
  background-color: #f8f9fa;
  opacity: 0.7;
}

/* 🔥 Password Input Wrapper Styles */
.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  padding-right: 45px !important; /* เพิ่มพื้นที่สำหรับปุ่มตา */
}

.password-toggle-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: color 0.2s, background-color 0.2s;
  font-size: 16px;
}

.password-toggle-btn:hover:not(:disabled) {
  color: #495057;
  background-color: rgba(0, 0, 0, 0.05);
}

.password-toggle-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.password-toggle-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.btn-login {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alert {
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}

.alert-danger {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.login-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

.bx-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .login-sidebar {
    width: 100%;
  }
}
</style>