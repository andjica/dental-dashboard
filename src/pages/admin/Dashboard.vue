<template>
  <div class="relative">
    <Alert v-if="showSuccessMessage" :type="alert.type" :message="alert.message" @close="alert.message = ''" />
    <Alert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''" />

    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <BaseCard title="Welcome" content="This is your admin dashboard." />
    </div>
  </div>

  <template v-if="allData.length === 0">
    <p class="m-4 p-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg shadow-sm">
      ⚠️ There are no companies
    </p>
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

const route = useRoute();
const showSuccessMessage = ref(false);
const token = localStorage.getItem("token");
const allData = ref([]);
const activeCompanies = ref([]);

const alert = reactive({
  type: "",
  message: "",
});

onMounted(() => {
  fetchAll();
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
  fetch("http://localhost:8000/api/admin/inactive/companies", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok!");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Companies list ", data);
      allData.value = data.data.map(item => ({
        ...item,
        status: "", // Dodajemo inicijalni status
      }));
    })
    .catch((error) => {
      console.log(error);
    });
};


const activeCompany = (companyId) => {
  fetch(`http://localhost:8000/api/admin/activate/company/${companyId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok!");
      }
      return response.json();
    })
    .then((data) => {
      console.log("JONE: ",data);
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
  fetch(`http://localhost:8000/api/admin/delete/${companyId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok!");
      }
      return response.json();
    })
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


</script>
