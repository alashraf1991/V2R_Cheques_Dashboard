<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Cheques Detail</h1>
        <p class="mt-2 text-sm text-gray-700">
          View and filter detailed cheque information
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button 
          @click="exportData"
          :disabled="loading"
          class="btn-secondary inline-flex items-center"
        >
          <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Export
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
          <input 
            type="date" 
            v-model="filters.fromDate"
            class="input-field"
            @change="applyFilters"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
          <input 
            type="date" 
            v-model="filters.toDate"
            class="input-field"
            @change="applyFilters"
          >
        </div>
                 <div>
           <label class="block text-sm font-medium text-gray-700 mb-2">Building</label>
           <select 
             v-model="filters.buildingName"
             class="input-field"
             @change="applyFilters"
           >
             <option value="">All Buildings</option>
             <option 
               v-for="building in buildings" 
               :key="building.BuildingID" 
               :value="building.BuildingName"
             >
               {{ building.BuildingName }}
             </option>
           </select>
         </div>
         <div>
           <label class="text-sm font-medium text-gray-700 mb-2">Apartment</label>
           <select 
             v-model="filters.apartmentName"
             class="input-field"
             @change="applyFilters"
             :disabled="!filters.buildingName"
           >
             <option value="">All Apartments</option>
             <option 
               v-for="apartment in filteredApartments" 
               :key="apartment.ApartmentID" 
               :value="apartment.ApartmentName"
             >
               {{ apartment.ApartmentName }}
             </option>
           </select>
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
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Cheques</dt>
              <dd class="text-lg font-medium text-gray-900">{{ (summary.NumberOfCheques || summary.numberOfCheques || cheques.length || 0) }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Amount</dt>
              <dd class="text-lg font-medium text-gray-900">{{ formatCurrency(summary.TotalAmount || summary.totalAmount || (cheques.length > 0 ? cheques.reduce((sum, cheque) => sum + (cheque.Amount || 0), 0) : 0)) }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Average Amount</dt>
              <dd class="text-lg font-medium text-gray-900">{{ formatCurrency(averageAmount) }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="card">
      <div class="sm:flex sm:items-center sm:justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Cheques Data</h3>
        <div class="mt-3 sm:mt-0 sm:ml-4">
          <div class="flex rounded-md shadow-sm">
            <input 
              type="text" 
              v-model="searchTerm"
              placeholder="Search cheques..."
              class="input-field rounded-r-none"
            >
            <button class="btn-primary rounded-l-none">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apartment</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cheque No</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="cheque in filteredCheques" :key="cheque.ChequeID" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(cheque.ChequeDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ cheque.BuildingName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ cheque.ApartmentName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ cheque.ChequeNo }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ cheque.BankName }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(cheque.Amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
              <span class="font-medium">{{ totalCheques.length }}</span>
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
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { format, parseISO } from 'date-fns'

export default {
  name: 'ChequesDetail',
  setup() {
    const loading = ref(false)
    const cheques = ref([])
    const buildings = ref([])
    const apartments = ref([])
    const summary = ref({})
    
         const filters = ref({
       fromDate: '',
       toDate: '',
       buildingName: '',
       apartmentName: ''
     })
    
    const searchTerm = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 20

         const filteredApartments = computed(() => {
       if (!filters.value.buildingName) return []
       return apartments.value.filter(apt => apt.BuildingName === filters.value.buildingName)
     })

    const filteredCheques = computed(() => {
      let filtered = cheques.value

      // Apply search filter
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase()
        filtered = filtered.filter(cheque => 
          cheque.ChequeNo?.toLowerCase().includes(term) ||
          cheque.BuildingName?.toLowerCase().includes(term) ||
          cheque.ApartmentName?.toLowerCase().includes(term)
        )
      }

      return filtered
    })

    const totalCheques = computed(() => filteredCheques.value)
    const totalPages = computed(() => Math.ceil(totalCheques.value.length / itemsPerPage))
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
    const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalCheques.value.length))
    const averageAmount = computed(() => {
      // Debug logging to see what's in summary
      console.log('Summary data:', summary.value)
      console.log('Cheques data length:', cheques.value.length)
      
      // Try to get from summary first
      let numberOfCheques = summary.value?.NumberOfCheques || summary.value?.numberOfCheques || 0
      let totalAmount = summary.value?.TotalAmount || summary.value?.totalAmount || 0
      
      // Fallback: calculate from cheques data if summary is empty
      if (!numberOfCheques && cheques.value.length > 0) {
        numberOfCheques = cheques.value.length
        totalAmount = cheques.value.reduce((sum, cheque) => sum + (cheque.Amount || 0), 0)
        console.log('Calculated from cheques:', { numberOfCheques, totalAmount })
      }
      
      if (!numberOfCheques || numberOfCheques === 0) return 0
      return totalAmount / numberOfCheques
    })

    const fetchData = async () => {
      loading.value = true
      try {
        const [buildingsRes, apartmentsRes, chequesRes, summaryRes] = await Promise.all([
          axios.get('/api/buildings'),
          axios.get('/api/apartments'),
          axios.get('/api/cheques/detail'),
          axios.get('/api/cheques/summary')
        ])

        buildings.value = buildingsRes.data
        apartments.value = apartmentsRes.data
        cheques.value = chequesRes.data
        summary.value = summaryRes.data
        
        // Debug logging
        console.log('Buildings data:', buildingsRes.data)
        console.log('Apartments data:', apartmentsRes.data)
        console.log('Cheques data:', chequesRes.data)
        console.log('Summary data:', summaryRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        loading.value = false
      }
    }

         const applyFilters = async () => {
       loading.value = true
       try {
         const params = {}
         if (filters.value.fromDate) params.fromDate = filters.value.fromDate
         if (filters.value.toDate) params.toDate = filters.value.toDate
         if (filters.value.buildingName) params.buildingName = filters.value.buildingName
         if (filters.value.apartmentName) params.apartmentName = filters.value.apartmentName

         const [chequesRes, summaryRes] = await Promise.all([
           axios.get('/api/cheques/detail', { params }),
           axios.get('/api/cheques/summary', { params })
         ])

         cheques.value = chequesRes.data
         summary.value = summaryRes.data
         currentPage.value = 1
       } catch (error) {
         console.error('Error applying filters:', error)
       } finally {
         loading.value = false
       }
     }

         const clearFilters = () => {
       filters.value = {
         fromDate: '',
         toDate: '',
         buildingName: '',
         apartmentName: ''
       }
       searchTerm.value = ''
       fetchData()
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

    const exportData = () => {
      const csvContent = generateCSV(filteredCheques.value)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'cheques_export.csv'
      link.click()
    }

    const generateCSV = (data) => {
      const headers = ['Date', 'Building', 'Apartment', 'Cheque No', 'Amount']
      const rows = data.map(cheque => [
        formatDate(cheque.ChequeDate),
        cheque.BuildingName,
        cheque.ApartmentName,
        cheque.ChequeNo,
        cheque.Amount
      ])
      
      return [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')
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

    onMounted(() => {
      fetchData()
    })

         watch(filters, () => {
       if (filters.value.buildingName && filters.value.apartmentName) {
         filters.value.apartmentName = ''
       }
     })

    return {
      loading,
      cheques,
      buildings,
      apartments,
      summary,
      filters,
      searchTerm,
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      averageAmount,
      filteredApartments,
      filteredCheques,
      totalCheques,
      applyFilters,
      clearFilters,
      previousPage,
      nextPage,
      exportData,
      formatCurrency,
      formatDate
    }
  }
}
</script>
