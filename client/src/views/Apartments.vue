<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Apartments Management</h1>
        <p class="mt-2 text-sm text-gray-700">
          View and manage all apartment information
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button 
          @click="refreshData"
          :disabled="loading"
          class="btn-primary inline-flex items-center"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Building</label>
          <select 
            v-model="filters.buildingId"
            class="input-field"
            @change="applyFilters"
          >
            <option value="">All Buildings</option>
            <option 
              v-for="building in buildings" 
              :key="building.BuildingID" 
              :value="building.BuildingID"
            >
              {{ building.BuildingName }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input 
            type="text" 
            v-model="filters.search"
            placeholder="Search apartments..."
            class="input-field"
            @input="applyFilters"
          >
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button 
          @click="clearFilters"
          class="btn-secondary mr-2"
        >
          Clear Filters
        </button>
        <button 
          @click="applyFilters"
          :disabled="loading"
          class="btn-primary"
        >
          Apply Filters
        </button>
      </div>
    </div>

    

     <!-- Summary Cards -->
     <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5v4m8-4v4M8 11v4m8-4v4"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Apartments</dt>
              <dd class="text-lg font-medium text-gray-900">{{ filteredApartments.length }}</dd>
            </dl>
          </div>
        </div>
      </div>

      

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Cheques</dt>
              <dd class="text-lg font-medium text-gray-900">{{ totalCheques }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Amount</dt>
              <dd class="text-lg font-medium text-gray-900">{{ formatCurrency(totalAmount) }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Apartments Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <div 
        v-for="apartment in paginatedApartments" 
        :key="apartment.ApartmentID"
        class="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        @click="selectApartment(apartment)"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5v4m8-4v4M8 11v4m8-4v4"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900">{{ apartment.ApartmentName }}</h3>
              <p class="text-sm text-gray-500">{{ getBuildingName(apartment.BuildingID) }}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-green-600">
              {{ apartment.FloorNumber }}
            </div>
            <div class="text-xs text-gray-500">Floor</div>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Apartment #:</span>
              <span class="ml-2 font-medium text-gray-900">
                {{ apartment.ApartmentNumber || 'N/A' }}
              </span>
            </div>
            <div>
              <span class="text-gray-500">Building #:</span>
              <span class="ml-2 font-medium text-gray-900">
                {{ apartment.BuildingNumber || 'N/A' }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-100">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">Cheques</span>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-900">
                {{ getApartmentCheques(apartment.ApartmentID).length }}
              </span>
              <span class="text-xs text-gray-500">|</span>
              <span class="text-sm font-medium text-gray-900">
                {{ formatCurrency(getApartmentAmount(apartment.ApartmentID)) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <div class="flex-1 flex justify-between sm:hidden">
        <button 
          @click="previousPage"
          :disabled="currentPage === 1"
          class="btn-secondary"
        >
          Previous
        </button>
        <button 
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="btn-primary"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing 
            <span class="font-medium">{{ startIndex + 1 }}</span>
            to 
            <span class="font-medium">{{ endIndex }}</span>
            of 
            <span class="font-medium">{{ filteredApartments.length }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button 
              @click="previousPage"
              :disabled="currentPage === 1"
              class="btn-secondary rounded-l-md"
            >
              Previous
            </button>
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="btn-primary rounded-r-md"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Apartment Details Modal -->
    <div v-if="selectedApartment" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ selectedApartment.ApartmentName }} Details
            </h3>
            <button 
              @click="selectedApartment = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Apartment Name</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedApartment.ApartmentName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Apartment Number</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedApartment.ApartmentNumber || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Floor Number</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedApartment.FloorNumber }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Building</label>
                <p class="mt-1 text-sm text-gray-900">{{ getBuildingName(selectedApartment.BuildingID) }}</p>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-md font-medium text-gray-900 mb-3">Cheques History</h4>
              <div class="max-h-60 overflow-y-auto">
                <div 
                  v-for="cheque in getApartmentCheques(selectedApartment.ApartmentID)"
                  :key="cheque.ChequeID"
                  class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <span class="text-sm font-medium text-gray-900">{{ cheque.ChequeNo }}</span>
                    <span class="ml-2 text-xs text-gray-500">{{ formatDate(cheque.ChequeDate) }}</span>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ formatCurrency(cheque.Amount) }}</span>
                </div>
                <div v-if="getApartmentCheques(selectedApartment.ApartmentID).length === 0" class="text-center py-4 text-gray-500">
                  No cheques found for this apartment
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-md font-medium text-gray-900 mb-3">Financial Summary</h4>
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-green-600">
                    {{ getApartmentCheques(selectedApartment.ApartmentID).length }}
                  </div>
                  <div class="text-xs text-gray-500">Total Cheques</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-purple-600">
                    {{ formatCurrency(getApartmentAmount(selectedApartment.ApartmentID)) }}
                  </div>
                  <div class="text-xs text-gray-500">Total Amount</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { format, parseISO } from 'date-fns'

export default {
  name: 'Apartments',
  setup() {
    const loading = ref(false)
    const apartments = ref([])
    const buildings = ref([])
    const cheques = ref([])
    const selectedApartment = ref(null)
    
    
    
         const filters = ref({
       buildingId: '',
       search: ''
     })
    
    const currentPage = ref(1)
    const itemsPerPage = 12

    

    const filteredApartments = computed(() => {
      let filtered = apartments.value

      

             // Don't filter by buildingId since the API already handles that
       // if (filters.value.buildingId) {
       //   filtered = filtered.filter(apt => apt.BuildingID === filters.value.buildingId)
       // }

      if (filters.value.search) {
        const term = filters.value.search.toLowerCase()
        filtered = filtered.filter(apt => 
          apt.ApartmentName?.toLowerCase().includes(term) ||
          apt.ApartmentNumber?.toLowerCase().includes(term) ||
          getBuildingName(apt.BuildingID)?.toLowerCase().includes(term)
        )
      }

      

      return filtered
    })

    const paginatedApartments = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredApartments.value.slice(start, end)
    })

    const totalPages = computed(() => Math.ceil(filteredApartments.value.length / itemsPerPage))
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
    const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredApartments.value.length))
    
     const totalCheques = computed(() => {
       // Count cheques for filtered apartments only
       const filteredApartmentIds = new Set(filteredApartments.value.map(apt => apt.ApartmentID))
       return cheques.value.filter(cheque => filteredApartmentIds.has(cheque.ApartmentID)).length
     })
     const totalAmount = computed(() => {
       // Calculate total amount for filtered apartments only
       const filteredApartmentIds = new Set(filteredApartments.value.map(apt => apt.ApartmentID))
       return cheques.value
         .filter(cheque => filteredApartmentIds.has(cheque.ApartmentID))
         .reduce((sum, cheque) => sum + (cheque.Amount || 0), 0)
     })

    const fetchData = async () => {
      loading.value = true
      try {
        const [buildingsRes, chequesRes] = await Promise.all([
          axios.get('/api/buildings'),
          axios.get('/api/cheques/detail')
        ])

        buildings.value = buildingsRes.data
        cheques.value = chequesRes.data
        
        // Fetch apartments based on current filters
        await fetchApartments()
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        loading.value = false
      }
    }

    const fetchApartments = async () => {
      try {
        const params = {}
        if (filters.value.buildingId) {
          params.buildingId = filters.value.buildingId
        }
        
                 const apartmentsRes = await axios.get('/api/apartments', { params })
         apartments.value = apartmentsRes.data
      } catch (error) {
        console.error('Error fetching apartments:', error)
      }
    }

    const applyFilters = () => {
      currentPage.value = 1
      // Fetch apartments with new filters
      fetchApartments()
    }

         const clearFilters = () => {
       filters.value = {
         buildingId: '',
         search: ''
       }
      currentPage.value = 1
      // Fetch all apartments when filters are cleared
      fetchApartments()
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const selectApartment = (apartment) => {
      selectedApartment.value = apartment
    }

    const refreshData = async () => {
      await fetchData()
      // Also refresh apartments with current filters
      await fetchApartments()
    }

    const getBuildingName = (buildingId) => {
      const building = buildings.value.find(b => b.BuildingID === buildingId)
      return building ? building.BuildingName : 'Unknown Building'
    }

    const getBuildingNumber = (buildingId) => {
      const building = buildings.value.find(b => b.BuildingID === buildingId)
      return building ? building.BuildingNumber : null
    }

    const getApartmentCheques = (apartmentId) => {
      return cheques.value.filter(cheque => cheque.ApartmentID === apartmentId)
    }

    const getApartmentAmount = (apartmentId) => {
      const apartmentCheques = getApartmentCheques(apartmentId)
      return apartmentCheques.reduce((sum, cheque) => sum + (cheque.Amount || 0), 0)
    }

         const formatCurrency = (amount) => {
       return new Intl.NumberFormat('en-AE', {
         style: 'currency',
         currency: 'AED'
       }).format(amount || 0)
     }

    const formatDate = (dateString) => {
      try {
        return format(parseISO(dateString), 'MMM dd, yyyy')
      } catch {
        return dateString
      }
    }

    onMounted(async () => {
             await fetchData()
    })

    watch(filters, (newFilters, oldFilters) => {
      currentPage.value = 1
      
      // Only fetch apartments if buildingId actually changed
      if (newFilters.buildingId !== oldFilters?.buildingId) {
 
        fetchApartments()
      }
    })

    return {
      loading,
      apartments,
      buildings,
      cheques,
      selectedApartment,
      filters,
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      
      filteredApartments,
      paginatedApartments,
      
      totalCheques,
      totalAmount,
      applyFilters,
      clearFilters,
      previousPage,
      nextPage,
      selectApartment,
      refreshData,
      getBuildingName,
      getBuildingNumber,
      getApartmentCheques,
      getApartmentAmount,
      fetchApartments,
      formatCurrency,
      formatDate
    }
  }
}
</script>
