<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Buildings Management</h1>
        <p class="mt-2 text-sm text-gray-700">
          Overview and management of all buildings
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="refreshData"
          :disabled="loading"
          class="btn-primary inline-flex items-center"
        >
          <svg
            v-if="loading"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <svg
            v-else
            class="-ml-1 mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
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
            <div
              class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                Total Buildings
              </dt>
              <dd class="text-lg font-medium text-gray-900">
                {{ buildings.length }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5v4m8-4v4M8 11v4m8-4v4"
                />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                Total Apartments
              </dt>
              <dd class="text-lg font-medium text-gray-900">
                {{ totalApartments }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                Total Cheques
              </dt>
              <dd class="text-lg font-medium text-gray-900">
                {{ totalCheques }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                Total Amount
              </dt>
              <dd class="text-lg font-medium text-gray-900">
                {{ formatCurrency(totalAmount) }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Buildings Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="building in buildings"
        :key="building.BuildingID"
        class="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        @click="selectBuilding(building)"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div
              class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900">
                {{ building.BuildingName }}
              </h3>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-primary-600">
              {{ getBuildingStats(building.BuildingName).apartments }}
            </div>
            <div class="text-xs text-gray-500">Apartments</div>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Cheques:</span>
              <span class="ml-2 font-medium text-gray-900">{{
                getBuildingStats(building.BuildingName).cheques
              }}</span>
            </div>
            <div>
              <span class="text-gray-500">Amount:</span>
              <span class="ml-2 font-medium text-gray-900">{{
                formatCurrency(getBuildingStats(building.BuildingName).amount)
              }}</span>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-100">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-500">Occupancy Rate</span>
            <div class="flex items-center">
              <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  class="bg-primary-600 h-2 rounded-full"
                  :style="{
                    width: getOccupancyRate(building.BuildingName) + '%',
                  }"
                ></div>
              </div>
              <span class="text-sm font-medium text-gray-900"
                >{{ getOccupancyRate(building.BuildingName) }}%</span
              >
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>
              <span class="text-green-600 font-medium">{{
                getOccupancyDetails(building.BuildingName).occupied
              }}</span>
              occupied
            </div>
            <div>
              <span class="text-red-600 font-medium">{{
                getOccupancyDetails(building.BuildingName).vacant
              }}</span>
              vacant
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Building Details Modal -->
    <div
      v-if="selectedBuilding"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
      >
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ selectedBuilding.BuildingName }} Details
            </h3>
            <button
              @click="selectedBuilding = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Building Name</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedBuilding.BuildingName }}
                </p>
              </div>
              <!-- <div>
                <label class="block text-sm font-medium text-gray-700">Building Number</label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedBuilding.BuildingNumber || 'N/A' }}</p>
              </div> -->
            </div>

            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-md font-medium text-gray-900 mb-3">
                Apartment List
              </h4>
              <div class="max-h-60 overflow-y-auto">
                <div
                  v-for="apartment in getBuildingApartments(
                    selectedBuilding.BuildingName
                  )"
                  :key="apartment.ApartmentID"
                  class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <span class="text-sm font-medium text-gray-900">{{
                      apartment.ApartmentName
                    }}</span>
                    <!-- <span class="ml-2 text-xs text-gray-500"
                      >Floor {{ apartment.FloorName }}</span
                    > -->
                  </div>
                  <!-- <span class="text-xs text-gray-500">{{
                    apartment.ApartmentNumber || "N/A"
                  }}</span> -->
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-md font-medium text-gray-900 mb-3">
                Occupancy Summary
              </h4>
              <div class="grid grid-cols-2 gap-4 text-center mb-4">
                <div>
                  <div class="text-2xl font-bold text-green-600">
                    {{
                      getOccupancyDetails(selectedBuilding.BuildingName)
                        .occupied
                    }}
                  </div>
                  <div class="text-xs text-gray-500">Occupied</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-red-600">
                    {{
                      getOccupancyDetails(selectedBuilding.BuildingName).vacant
                    }}
                  </div>
                  <div class="text-xs text-gray-500">Vacant</div>
                </div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary-600">
                  {{ getOccupancyDetails(selectedBuilding.BuildingName).rate }}%
                </div>
                <div class="text-sm text-gray-500">Overall Occupancy Rate</div>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <h4 class="text-md font-medium text-gray-900 mb-3">
                Financial Summary
              </h4>
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-primary-600">
                    {{
                      getBuildingStats(selectedBuilding.BuildingName).apartments
                    }}
                  </div>
                  <div class="text-xs text-gray-500">Apartments</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-green-600">
                    {{
                      getBuildingStats(selectedBuilding.BuildingName).cheques
                    }}
                  </div>
                  <div class="text-xs text-gray-500">Cheques</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-purple-600">
                    {{
                      formatCurrency(
                        getBuildingStats(selectedBuilding.BuildingName).amount
                      )
                    }}
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
import { ref, computed, onMounted } from "vue";
import axios from "axios";

export default {
  name: "Buildings",
  setup() {
    const loading = ref(false);
    const buildings = ref([]);
    const apartments = ref([]);
    const cheques = ref([]);
    const selectedBuilding = ref(null);

    const totalApartments = computed(() => apartments.value.length);
    const totalCheques = computed(() => cheques.value.length);
    const totalAmount = computed(() => {
      return cheques.value.reduce(
        (sum, cheque) => sum + (cheque.Amount || 0),
        0
      );
    });

    const fetchData = async () => {
      loading.value = true;
      try {
        const [buildingsRes, apartmentsRes, chequesRes] = await Promise.all([
          axios.get("/api/buildings"),
          axios.get("/api/apartments"),
          axios.get("/api/cheques/detail"),
        ]);

        buildings.value = buildingsRes.data;
        apartments.value = apartmentsRes.data;
        cheques.value = chequesRes.data;

        // Debug logging
        console.log("Buildings - Buildings data:", buildingsRes.data);
        console.log("Buildings - Apartments data:", apartmentsRes.data);
        console.log("Buildings - Cheques data:", chequesRes.data);
        console.log(
          "Buildings - Sample building name:",
          buildingsRes.data[0]?.BuildingName
        );
        console.log(
          "Buildings - Sample apartment BuildingName:",
          apartmentsRes.data[0]?.BuildingName
        );
        console.log(
          "Buildings - Sample cheque BuildingName:",
          chequesRes.data[0]?.BuildingName
        );

        // Debug IsOccupied column
        if (apartmentsRes.data.length > 0) {
          console.log(
            "Buildings - Sample apartment IsOccupied:",
            apartmentsRes.data[0]?.IsOccupied
          );
          console.log(
            "Buildings - Sample apartment isOccupied:",
            apartmentsRes.data[0]?.isOccupied
          );
          console.log(
            "Buildings - Apartments with IsOccupied true:",
            apartmentsRes.data.filter(
              (apt) => apt.IsOccupied === true || apt.IsOccupied === 1
            ).length
          );
          console.log(
            "Buildings - Apartments with IsOccupied false:",
            apartmentsRes.data.filter(
              (apt) => apt.IsOccupied === false || apt.IsOccupied === 0
            ).length
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        loading.value = false;
      }
    };

    const getBuildingStats = (buildingName) => {
      // Debug logging for this specific building
      console.log(
        `Buildings - Getting stats for BuildingName: ${buildingName}`
      );
      console.log(`Buildings - Available apartments:`, apartments.value);
      console.log(`Buildings - Available cheques:`, cheques.value);

      // Filter apartments by building name
      const buildingApartments = apartments.value.filter(
        (apt) =>
          apt.BuildingName === buildingName || apt.buildingName === buildingName
      );

      // Filter cheques by building name
      const buildingCheques = cheques.value.filter(
        (cheque) =>
          cheque.BuildingName === buildingName ||
          cheque.buildingName === buildingName
      );

      const totalAmount = buildingCheques.reduce(
        (sum, cheque) => sum + (cheque.Amount || 0),
        0
      );

      const stats = {
        apartments: buildingApartments.length,
        cheques: buildingCheques.length,
        amount: totalAmount,
      };

      console.log(`Buildings - Stats for BuildingName ${buildingName}:`, stats);
      console.log(`Buildings - Found apartments:`, buildingApartments);
      console.log(`Buildings - Found cheques:`, buildingCheques);

      return stats;
    };

    const getBuildingApartments = (buildingName) => {
      // Filter apartments by building name
      return apartments.value.filter(
        (apt) =>
          apt.BuildingName === buildingName || apt.buildingName === buildingName
      );
    };

    const getOccupancyRate = (buildingName) => {
      // Calculate real occupancy rate using the IsOccupied column from sp_GetApartments
      const buildingApartments = apartments.value.filter(
        (apt) =>
          apt.BuildingName === buildingName || apt.buildingName === buildingName
      );

      if (buildingApartments.length === 0) return 0;

      // Count apartments where IsOccupied is true
      const occupiedApartments = buildingApartments.filter(
        (apt) =>
          apt.IsOccupied === true ||
          apt.IsOccupied === 1 ||
          apt.isOccupied === true ||
          apt.isOccupied === 1
      );

      // Calculate occupancy rate: (Occupied Apartments / Total Apartments) × 100
      const occupancyRate =
        (occupiedApartments.length / buildingApartments.length) * 100;

      console.log(`Buildings - Occupancy calculation for ${buildingName}:`, {
        totalApartments: buildingApartments.length,
        occupiedApartments: occupiedApartments.length,
        occupancyRate: Math.round(occupancyRate),
      });

      return Math.round(occupancyRate);
    };

    // Alternative: Calculate occupancy based on recent activity (last 3 months)
    const getRecentOccupancyRate = (buildingName) => {
      const buildingApartments = apartments.value.filter(
        (apt) =>
          apt.BuildingName === buildingName || apt.buildingName === buildingName
      );

      if (buildingApartments.length === 0) return 0;

      // For recent occupancy, we can still use the IsOccupied column
      // This assumes that IsOccupied reflects current status
      const recentlyOccupiedApartments = buildingApartments.filter(
        (apt) =>
          apt.IsOccupied === true ||
          apt.IsOccupied === 1 ||
          apt.isOccupied === true ||
          apt.isOccupied === 1
      );

      const recentOccupancyRate =
        (recentlyOccupiedApartments.length / buildingApartments.length) * 100;

      console.log(
        `Buildings - Recent occupancy calculation for ${buildingName}:`,
        {
          totalApartments: buildingApartments.length,
          recentlyOccupiedApartments: recentlyOccupiedApartments.length,
          recentOccupancyRate: Math.round(recentOccupancyRate),
        }
      );

      return Math.round(recentOccupancyRate);
    };

    // Get detailed occupancy information for a building
    const getOccupancyDetails = (buildingName) => {
      const buildingApartments = apartments.value.filter(
        (apt) =>
          apt.BuildingName === buildingName || apt.buildingName === buildingName
      );

      if (buildingApartments.length === 0)
        return { total: 0, occupied: 0, vacant: 0, rate: 0 };

      const occupiedApartments = buildingApartments.filter(
        (apt) =>
          apt.IsOccupied === true ||
          apt.IsOccupied === 1 ||
          apt.isOccupied === true ||
          apt.isOccupied === 1
      );

      const vacantApartments = buildingApartments.filter(
        (apt) =>
          apt.IsOccupied === false ||
          apt.IsOccupied === 0 ||
          apt.isOccupied === false ||
          apt.isOccupied === 0
      );

      return {
        total: buildingApartments.length,
        occupied: occupiedApartments.length,
        vacant: vacantApartments.length,
        rate: Math.round(
          (occupiedApartments.length / buildingApartments.length) * 100
        ),
      };
    };

    const selectBuilding = (building) => {
      selectedBuilding.value = building;
    };

    const refreshData = async () => {
      await fetchData();
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("en-AE", {
        style: "currency",
        currency: "AED",
      }).format(amount || 0);
    };

    onMounted(() => {
      fetchData();
    });

    return {
      loading,
      buildings,
      apartments,
      cheques,
      selectedBuilding,
      totalApartments,
      totalCheques,
      totalAmount,
      getBuildingStats,
      getBuildingApartments,
      getOccupancyRate,
      getRecentOccupancyRate,
      getOccupancyDetails,
      selectBuilding,
      refreshData,
      formatCurrency,
    };
  },
};
</script>
