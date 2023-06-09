import '@/assets/style/reset.css'
import '@/assets/style/global.css'
import '@/assets/style/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import { ElMessage,ElMessageBox } from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


import App from './App.vue'
import router from './router'
import service from '@/utils/request'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.config.globalProperties.$http = service
app.config.globalProperties.$router = router
app.config.globalProperties.$message = ElMessage
app.config.globalProperties.$messagebox = ElMessageBox

app.mount('#app')
