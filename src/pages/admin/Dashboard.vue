<template>
  <div class="relative">
    <Alert v-if="showSuccessMessage" :type="alert.type" :message="alert.message" @close="alert.message = ''" />
    <Alert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''" />

    <div class="p-4">
    <!-- Statistic Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="p-4 bg-white rounded-lg shadow border border-gray-200">
          <p class="text-sm text-gray-500 mb-1">Active Products</p>
          <p class="text-2xl font-bold text-blue-600">{{ activeCompanies }}</p>
        </div>
        <div class="p-4 bg-white rounded-lg shadow border border-gray-200">
          <p class="text-sm text-gray-500 mb-1">Total Orders</p>
          <p class="text-2xl font-bold text-green-600">87</p>
        </div>
        <div class="p-4 bg-white rounded-lg shadow border border-gray-200">
          <p class="text-sm text-gray-500 mb-1">Registered Companies</p>
          <p class="text-2xl font-bold text-purple-600">{{ registerConmpany }}</p>
        </div>
        <div class="p-4 bg-white rounded-lg shadow border border-gray-200">
          <p class="text-sm text-gray-500 mb-1">Total Users - buyer od webshop</p>
          <p class="text-2xl font-bold text-yellow-600">{{ totalUsers  }}</p>
        </div>
      </div>

    </div>
  </div>

  <template v-if="allData.length === 0">
   <div class="m-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg shadow-sm">
      <h2 class="text-sm font-semibold text-yellow-800 mb-1">🔔 Current Notifications</h2>
      <p class="text-sm text-yellow-700">There are no new companies at the moment.</p>
    </div>

  </template>
  <template v-else>
  <div class="flex flex-col gap-4 p-4">
    <h2>Notification company</h2>
    <div
      v-for="item in allData"
      :key="item.id"
      class="bg-white shadow-md rounded-xl max-w-md p-6 border border-gray-200"
    >
      <p class="mb-1"><strong>Address:</strong> {{ item.address }}</p>
      <p class="mb-1"><strong>Email:</strong> {{ item.email }}</p>
      <p class="mb-1">
        <strong>Registration number:</strong> {{ item.registration_number }}
      </p>
      <p class="mb-4"><strong>Tax number:</strong> {{ item.tax_number }}</p>

      <div class="flex space-x-3">
        <template v-if="item.status === 'active'">
          <font-awesome-icon icon="check" class="text-green-500 text-2xl" />
        </template>
        <template v-else-if="item.status === 'removed'">
          <font-awesome-icon icon="xmark" class="text-red-500 text-2xl" />
        </template>
        <template v-else>
          <button
            @click="activeCompany(item.id)"
            class="bg-green-400 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
          >
            Activate
          </button>
          <button
            @click="removeCompany(item.id)"
            class="bg-red-400 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
          >
            Remove
          </button>
        </template>
      </div>
    </div>
  </div>
</template>


</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import Alert from "@/components/shared/Alert.vue";
import BaseCard from "@/components/shared/BaseCard.vue";
import { get } from "@/js/helper/api";

const route = useRoute();
const showSuccessMessage = ref(false);
const allData = ref([]);
const activeCompanies = ref(0);
const registerConmpany = ref(0);
const totalUsers = ref(0);

const alert = reactive({
  type: "",
  message: "",
});

onMounted(() => {
  fetchAll();
  fetchActiceProducts();
  fetchRegisteredCompanies();
  fetchTotalBuyers();

  if (route.query.profileUpdated === "1") {
    showSuccessMessage.value = true;
    alert.type = "success";
    alert.message =
      "You have successfully completed your profile and now have access to all pages.";
    // Opciono: ukloni query posle prikaza
    history.replaceState(null, "", route.path);
  }
});

const fetchAll = () => {
  get("admin/inactive/companies")
    .then((data) => {
      allData.value = data.data.map(item => ({
        ...item,
        status: "",
      }));
    })
    .catch((error) => {
      console.error(error);
    });
};



const activeCompany = (companyId) => {
  get(`admin/activate/company/${companyId}`)
    .then((data) => {
      const company = allData.value.find((item) => item.id === companyId);
      if (company) {
        company.status = "active";
      }

      alert.type = "success";
      alert.message = "Company successfully activated!";
    })
    .catch((error) => {
      alert.type = "error";
      alert.message = "Failed to activate company.";
      console.error(error);
    });
};


const removeCompany = (companyId) => {
  get(`admin/delete/${companyId}`)
    .then(() => {
      const company = allData.value.find((item) => item.id === companyId);
      if (company) {
        company.status = "removed";
      }

      alert.type = "success";
      alert.message = "🗑️ Company successfully removed!";
    })
    .catch((error) => {
      alert.type = "error";
      alert.message = "❌ Failed to remove company.";
      console.error(error);
    });
};


const fetchActiceProducts = () => {
  get("admin/active-products")
    .then((data) => {
      activeCompanies.value = data.count;
    })
    .catch((error) => {
      console.error(error);
    });
};


const fetchRegisteredCompanies = () => {
  get("admin/registered-companies")
    .then((data) => {
      registerConmpany.value = data.count;
    })
    .catch((error) => {
      console.error(error);
    });
};


const fetchTotalBuyers = () => {
  get("admin/total-buyers")
    .then((data) => {
      totalUsers.value = data.count;
    })
    .catch((error) => {
      console.error(error);
    });
};



</script>
