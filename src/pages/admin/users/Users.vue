<template>
  <ButtonBack />
  <div class="p-6">
    <template v-if="usersData.length === 0">
      <p
        class="mt-4 p-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg shadow-sm"
      >
        ⚠️ There are no active users
      </p>
    </template>
    
    <template class="p-6" v-else>
      <h1 class="text-2xl font-bold mb-4">List of users</h1>
      <TableCustome :data="usersData" />
    </template>
  </div>
</template>

<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import TableCustome from "@/components/admin/TableCustome.vue";
import { ref } from "vue";

const usersData = ref([]);
const token = localStorage.getItem("token");

const fetchUsers = () => {
  fetch("http://localhost:8000/api/admin/users", {
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
      console.log("User list ", data);
      usersData.value = data.data;
      console.log("C ", usersData);
    })
    .catch((error) => {
      console.log(error);
    });
};

fetchUsers();
</script>
