import { createApp } from 'vue'
import App from './App.vue'
import 'vue3-easy-data-table/dist/style.css'

import router from './router'

const app = createApp(App)

// Error handler
app.config.errorHandler = (error, instance, info) => {
  console.error('Vue Error:', error)
  console.error('Info:', info)
}

app.use(router) 

// 🔥 เพิ่ม session check หลัง mount
app.mount('#app')

console.log('🚀 Vue app mounted successfully')

// 🔥 เพิ่ม session initialization
setTimeout(async () => {
  try {
    const { authService } = await import('./services/authService.js')
    console.log('✅ AuthService loaded successfully')
    
    // เช็คว่ามี user login อยู่หรือไม่
    if (authService.isAuthenticated()) {
      console.log('👤 User already logged in:', authService.getDisplayName())
      
      // เริ่ม session timeout
      await authService.initializeSession()
      console.log('🕐 Session initialized')
    } else {
      console.log('👤 No user logged in')
    }
  } catch (error) {
    console.error('❌ Error initializing session:', error)
  }
}, 1000)