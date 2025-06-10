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
            class="block px-4 py-2 rounded font-medium relative underline-hover"
            active-class="text-white"
          >
            Dashboard
          </router-link>
        </li>
        <li class="mb-4">
          <router-link
            to="/admin/settings"
            class="block px-4 py-2 rounded font-medium relative underline-hover"
            active-class="text-white"
          >
            Settings
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

<style>

.underline-hover::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0; /* počinje sa leve strane */
  height: 2px; /* debljina linije */
  width: 0; /* počinje sa 0 širine */
  background-color: currentColor; /* ista boja kao tekst */
  transition: width 0.3s ease, right 0.3s ease;
}

.underline-hover:hover::after {
  width: 100%; /* proširi na celu širinu teksta */
  left: 0; /* animira se s levo na desno */
}
</style>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  alert('Logging out...');
  localStorage.clear();
  router.push('/login');
}
</script>
