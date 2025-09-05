<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p class="mt-2 text-sm text-gray-700">
          Real-time overview of your buildings, apartments, and cheques
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

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Buildings</dt>
              <dd class="text-lg font-medium text-gray-900">{{ summary.totalBuildings }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5v4m8-4v4M8 11v4m8-4v4"></path>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Apartments</dt>
              <dd class="text-lg font-medium text-gray-900">{{ summary.totalApartments }}</dd>
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
              <dd class="text-lg font-medium text-gray-900">{{ summary.totalCheques }}</dd>
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
              <dd class="text-lg font-medium text-gray-900">{{ formatCurrency(summary.totalAmount) }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Cheques by Month Chart -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Cheques by Month</h3>
        <div class="h-64">
          <canvas ref="chequesChart"></canvas>
        </div>
      </div>

      <!-- Buildings Distribution Chart -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Buildings Overview</h3>
        <div class="h-64">
          <canvas ref="buildingsChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Cheques</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apartment</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cheque No</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="cheque in recentCheques" :key="cheque.ChequeID" class="hover:bg-gray-50">
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
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import axios from 'axios'
import { format, parseISO } from 'date-fns'

Chart.register(...registerables)

export default {
  name: 'Dashboard',
  setup() {
    const loading = ref(false)
    const summary = ref({
      totalBuildings: 0,
      totalApartments: 0,
      totalCheques: 0,
      totalAmount: 0
    })
    const recentCheques = ref([])
    const buildings = ref([])
    const apartments = ref([])
    const cheques = ref([])
    const chequesChart = ref(null)
    const buildingsChart = ref(null)

    const fetchSummary = async () => {
      try {
        const [buildingsRes, apartmentsRes, chequesRes, summaryRes] = await Promise.all([
          axios.get('/api/buildings'),
          axios.get('/api/apartments'),
          axios.get('/api/cheques/detail'),
          axios.get('/api/cheques/summary')
        ])

        // Store the data for charts
        buildings.value = buildingsRes.data
        apartments.value = apartmentsRes.data
        cheques.value = chequesRes.data

        // Debug logging
        console.log('Dashboard - Buildings data:', buildingsRes.data)
        console.log('Dashboard - Apartments data:', apartmentsRes.data)
        console.log('Dashboard - Cheques data:', chequesRes.data)
        console.log('Dashboard - Summary data:', summaryRes.data)

        // Try to get from summary first, then fallback to cheques detail
        let totalCheques = summaryRes.data?.NumberOfCheques || summaryRes.data?.numberOfCheques || 0
        let totalAmount = summaryRes.data?.TotalAmount || summaryRes.data?.totalAmount || 0

        // Fallback: calculate from cheques detail if summary is empty
        if (!totalCheques && chequesRes.data.length > 0) {
          totalCheques = chequesRes.data.length
          totalAmount = chequesRes.data.reduce((sum, cheque) => sum + (cheque.Amount || 0), 0)
          console.log('Dashboard - Calculated from cheques:', { totalCheques, totalAmount })
        }

        summary.value = {
          totalBuildings: buildingsRes.data.length,
          totalApartments: apartmentsRes.data.length,
          totalCheques: totalCheques,
          totalAmount: totalAmount
        }
      } catch (error) {
        console.error('Error fetching summary:', error)
      }
    }

    const fetchRecentCheques = async () => {
      try {
        const response = await axios.get('/api/cheques/detail')
        recentCheques.value = response.data.slice(0, 10) // Get first 10
        console.log('Dashboard - Recent cheques:', recentCheques.value)
      } catch (error) {
        console.error('Error fetching recent cheques:', error)
        recentCheques.value = []
      }
    }

    const createCharts = async () => {
      await nextTick()
      
      // Cheques by Month Chart
      if (chequesChart.value) {
        // Calculate cheques by month from real data
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const chequesByMonth = new Array(12).fill(0)
        
        cheques.value.forEach(cheque => {
          if (cheque.ChequeDate) {
            try {
              const date = new Date(cheque.ChequeDate)
              const month = date.getMonth()
              chequesByMonth[month]++
            } catch (e) {
              console.log('Could not parse date:', cheque.ChequeDate)
            }
          }
        })

        new Chart(chequesChart.value, {
          type: 'line',
          data: {
            labels: monthNames,
            datasets: [{
              label: 'Cheques Count',
              data: chequesByMonth,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `Cheques: ${context.parsed.y}`
                  }
                }
              }
            },
                         scales: {
               y: {
                 beginAtZero: true,
                 ticks: {
                   stepSize: 1
                 }
               },
               x: {
                 grid: {
                   display: false
                 }
               }
             }
          }
        })
      }

      // Buildings Chart
      if (buildingsChart.value) {
        // Calculate building statistics for the chart
        const buildingStats = buildings.value.map(building => {
          const buildingApartments = apartments.value.filter(apt => 
            apt.BuildingName === building.BuildingName || 
            apt.buildingName === building.BuildingName
          )
          const buildingCheques = cheques.value.filter(cheque => 
            cheque.BuildingName === building.BuildingName || 
            cheque.buildingName === building.BuildingName
          )
          const totalAmount = buildingCheques.reduce((sum, cheque) => sum + (cheque.Amount || 0), 0)
          
          return {
            name: building.BuildingName,
            apartments: buildingApartments.length,
            cheques: buildingCheques.length,
            amount: totalAmount
          }
        })

        // Sort by amount (highest first) and take top 5 for better chart readability
        const topBuildings = buildingStats
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5)

        new Chart(buildingsChart.value, {
          type: 'doughnut',
          data: {
            labels: topBuildings.map(b => b.name),
            datasets: [{
              data: topBuildings.map(b => b.amount),
              backgroundColor: [
                'rgb(59, 130, 246)',   // Blue
                'rgb(16, 185, 129)',   // Green
                'rgb(245, 158, 11)',   // Yellow
                'rgb(239, 68, 68)',    // Red
                'rgb(139, 92, 246)'    // Purple
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  padding: 20
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const building = topBuildings[context.dataIndex]
                    return [
                      `Building: ${building.name}`,
                      `Total Amount: $${building.amount.toLocaleString()}`,
                      `Apartments: ${building.apartments}`,
                      `Cheques: ${building.cheques}`
                    ]
                  }
                }
              }
            }
          }
        })
      }
    }

    const refreshData = async () => {
      loading.value = true
      try {
        await Promise.all([fetchSummary(), fetchRecentCheques()])
        await createCharts()
      } finally {
        loading.value = false
      }
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
      await refreshData()
    })

    return {
      loading,
      summary,
      recentCheques,
      buildings,
      apartments,
      cheques,
      chequesChart,
      buildingsChart,
      refreshData,
      formatCurrency,
      formatDate
    }
  }
}
</script>
