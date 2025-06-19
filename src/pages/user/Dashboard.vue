<template>
<div class="p-4">
    <h1 class="text-2xl font-bold mb-4">User Dashboard</h1>
    <BaseCard title="Welcome" content="This is your User dashboard." />
  </div>
</template>

<script setup>
    import BaseCard from '@/components/shared/BaseCard.vue';
    import { ref } from 'vue';


    const isFinished = ref("");

    const fetchProfile = () => {
      const token = localStorage.getItem("token");
      return fetch("http://localhost:8000/api/user-info", {
        method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
      }).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch cities");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Dashboard",data);
      isFinished.value = data.data.is_finished_profile;
      console.log("Dashboard",isFinished.value);
    })
    .catch((err) => {
      console.log("Errro throw fetching cities: ", err);
    });
    }


    fetchProfile();
</script>