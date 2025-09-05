// src/store/auth.js
import { reactive } from 'vue'

export const authStore = reactive({
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  user: JSON.parse(localStorage.getItem('user')),

  login(userData) {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('user', JSON.stringify(userData))
    this.isAuthenticated = true
    this.user = userData
  },

  logout() {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    this.isAuthenticated = false
    this.user = null
  }
})