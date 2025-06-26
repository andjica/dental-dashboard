<template>
  <ButtonBack />
  <div class="p-6">
    <template v-if="isLoading">
      <Loader v-if="isLoading" />
    </template>

    <template v-else>
      <template v-if="companyData.length === 0">
        <p
          class="mt-4 p-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg shadow-sm"
        >
          ⚠️ There are no active companies
        </p>
      </template>

      <template v-else>
        <h1 class="text-2xl font-bold mb-4">List of companies</h1>
        <TableCustome :data="companyData" />
      </template>
    </template>
  </div>
</template>


<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import TableCustome from "@/components/admin/TableCustome.vue";
import Loader from "@/components/shared/Loader.vue";
import { ref } from "vue";

const companyData = ref([]);
const isLoading = ref(true);
const token = localStorage.getItem("token");

const fetchCompanies = () => {
  fetch("http://localhost:8000/api/admin/companies", {
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
      companyData.value = data.data;
    })
    .catch((error) => {
      console.log(error);
    }).finally(() => {
      isLoading.value = false;
    });
};

fetchCompanies();
</script>
