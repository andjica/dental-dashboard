<template>
  <aside class="w-60 bg-gray-200 text-gray-700 h-screen flex flex-col p-4">
    <div class="sidebar-header mb-8 text-center select-none">
      <h2 class="text-2xl font-bold">Admin Panel</h2>
    </div>
    <nav class="sidebar-nav flex-1 overflow-y-auto">
      <ul>
        <li class="mb-4">
          <router-link
            to="/admin/dashboard"
            class="block px-4 py-2 rounded hover:bg-blue-700 font-medium"
            active-class="bg-blue-700"
          >
            Dashboard
          </router-link>
        </li>
        <!-- Dodaj još linkova po potrebi -->
      </ul>
    </nav>
    <div class="sidebar-footer mt-auto text-center">
      <button
        @click="logout"
        class="bg-red-400 hover:bg-red-600 text-white px-4 py-2 rounded font-bold transition"
      >
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  alert('Logging out...');
  localStorage.clear();
  router.push('/');
}
</script>
