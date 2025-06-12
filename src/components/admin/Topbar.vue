<template>
  <header class="bg-white shadow-md px-6 py-3 flex justify-between items-center">
    <h1 class="text-xl font-semibold text-gray-800">Admin Panel</h1>
    <button
      @click="logout"
      class="bg-red-400 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition-colors"
    >
      Logout
    </button>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  localStorage.clear();
  router.push('/');
}
</script>
