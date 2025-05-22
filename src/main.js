import { createApp } from 'vue'
import App from './App.vue'
import 'vue3-easy-data-table/dist/style.css'

// ✅ เพิ่ม router
import router from './router'

const app = createApp(App)

// เชื่อม router กับ app
app.use(router) 

app.mount('#app')
