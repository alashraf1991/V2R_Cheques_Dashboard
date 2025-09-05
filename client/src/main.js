import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import axios from 'axios'

// Set production API base URL
//if (window.location.hostname === 'hamdan.v2r.systems') {
  // Use relative URLs to avoid mixed-content issues
  axios.defaults.baseURL = 'https://system.v2r.ae'
  console.log('🚀 Using production API:', axios.defaults.baseURL)
//}

const app = createApp(App)
app.use(router)
app.mount('#app')
