<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>
    <BaseCard title="Welcome" content="This is your admin dashboard." />
  </div>

  <!-- <div v-else class="p-4 text-center">
    <p class="mb-4 text-red-600 font-semibold">
      Your account is not verified yet.
    </p>
    <router-link to="/verify" class="text-blue-600 underline">
      Click here to verify your account.
    </router-link>
  </div> -->
</template>

<script setup>
import { ref } from 'vue'
import BaseCard from '@/components/shared/BaseCard.vue'

const rawUser = localStorage.getItem("user");

const user = rawUser ? JSON.parse(rawUser) : null;
const verify = ref(user?.isVerify || 0);
// Later, fetch verify status from API and set verify.value accordingly
// fetch('http://localhost:8000/api/email/resend',{})
</script>
