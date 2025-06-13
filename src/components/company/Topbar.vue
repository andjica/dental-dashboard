<template>
  <header class="bg-white shadow-md px-6 py-3 flex justify-between items-center">
    <!-- Hamburger za mobilne -->
    <button
      @click="toggleSidebar"
      class="block md:hidden text-black text-2xl cursor-pointer"
    >
      <font-awesome-icon icon="bars" />
    </button>

    <h1 class="text-xl font-semibold text-gray-800">Dentail</h1>

    <button
      @click="logout"
      class="bg-red-400 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition-colors md:block"
    >
      Logout
    </button>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { inject } from 'vue';

const router = useRouter();
const toggleSidebar = inject('toggleSidebar');

function logout() {
  localStorage.clear();
  router.push('/');
}
</script>
