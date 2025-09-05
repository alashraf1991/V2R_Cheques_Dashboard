<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation - Only show when authenticated -->
    <nav v-if="isAuthenticated" class="bg-white shadow-soft border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold text-gradient">V2R Dashboard</h1>
            </div>
            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <router-link 
                v-for="item in navigation" 
                :key="item.name"
                :to="item.href"
                :class="[
                  $route.path === item.href
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200'
                ]"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-500">
             
            </div>
            <button
              @click="handleLogout"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Navigation - Only show when authenticated -->
    <div v-if="isAuthenticated" class="md:hidden bg-white border-b border-gray-200">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          :class="[
            $route.path === item.href
              ? 'bg-primary-50 border-primary-500 text-primary-700'
              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
            'block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200'
          ]"
        >
          {{ item.name }}
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <main v-if="isAuthenticated" class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <router-view />
    </main>
    
    <!-- Show router-view without wrapper when not authenticated (for login page) -->
    <router-view v-if="!isAuthenticated" />
  </div>
</template>

<script>
import { ref, computed  } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { authStore } from './store/auth'

export default {
  name: 'App',
  setup() {
    const router = useRouter()

    
    const navigation = ref([
      { name: 'Dashboard', href: '/' },
      { name: 'Cheques Detail', href: '/cheques' },
      { name: 'Buildings', href: '/buildings' }
    ])

    const currentDate = computed(() => {
      return format(new Date(), 'EEEE, MMMM do, yyyy')
    })

  

    const handleLogout = () => {
       authStore.logout()
      
      // Redirect to login
      router.push('/login')
    }

    return {
      navigation,
      currentDate,
      isAuthenticated: computed(() => authStore.isAuthenticated),
      handleLogout
    }
  }
}
</script>
