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
import { ref, provide } from 'vue';

import Sidebar from '@/components/user/Sidebar.vue';
import Topbar from '@/components/user/Topbar.vue';

const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

provide('toggleSidebar', toggleSidebar);
provide('isSidebarOpen', isSidebarOpen);
</script>
