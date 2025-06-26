<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :is-open="isSidebarOpen" :toggle-sidebar="toggleSidebar" />

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <Topbar />
      <!-- Content area is scrollable -->
      <div class="flex-1 overflow-auto">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'
import Sidebar from '@/components/admin/Sidebar.vue'
import Topbar from '@/components/admin/Topbar.vue'

const verify = ref(true)

const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

provide('toggleSidebar', toggleSidebar);
provide('isSidebarOpen', isSidebarOpen);

// Example: fetch verify status on mount
onMounted(async () => {
  try {
    // Simulate API call
    const user = localStorage.getItem("user");
    // const response = await fetch('/api/user-status')
    // const data = await response.json()
    verify.value = user.isVerify === true
  } catch (error) {
    console.error('Failed to fetch verify status:', error)
  }
})
</script>
