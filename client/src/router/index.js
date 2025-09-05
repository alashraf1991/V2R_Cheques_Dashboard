import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import ChequesDetail from '../views/ChequesDetail.vue'
import Buildings from '../views/Buildings.vue'
import Apartments from '../views/Apartments.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/cheques',
    name: 'ChequesDetail',
    component: ChequesDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/buildings',
    name: 'Buildings',
    component: Buildings,
    meta: { requiresAuth: true }
  },
  {
    path: '/apartments',
    name: 'Apartments',
    component: Apartments,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  // If not authenticated and trying to access protected route, redirect to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } 
  // If already authenticated and trying to access login, redirect to dashboard
  else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } 
  // If accessing root path without authentication, redirect to login
  else if (to.path === '/' && !isAuthenticated) {
    next('/login')
  }
  // Otherwise, proceed
  else {
    next()
  }
})

export default router
