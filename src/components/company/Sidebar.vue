<template>
  <aside class="w-60 bg-blue-900 text-white h-screen flex flex-col p-4">
    <div class="sidebar-header mb-8 text-center select-none">
      <h2 class="text-2xl font-bold">Company Panel</h2>
    </div>
    <nav class="sidebar-nav flex-1 overflow-y-auto">
      <ul>
        <li class="mb-4">
          <router-link
            to="/company/dashboard"
            class="block px-4 py-2 rounded hover:bg-blue-700 font-medium"
            active-class="bg-blue-700"
          >
            Dashboard
          </router-link>
        </li>
        <li class="mb-4">
          <router-link
            to="/company/products"
            class="block px-4 py-2 rounded hover:bg-blue-700 font-medium"
            active-class="bg-blue-700"
          >
            Products
          </router-link>
        </li>
        <li class="mb-4">
          <router-link
            to="/company/settings"
            class="block px-4 py-2 rounded hover:bg-blue-700 font-medium"
            active-class="bg-blue-700"
          >
            Settings
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="sidebar-footer mt-auto text-center">
      <button
        @click="logout"
        class="bg-red-400 hover:bg-red-600 text-white cursor-pointer px-4 py-2 rounded font-bold transition"
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
  router.push('/login');
}
</script>
