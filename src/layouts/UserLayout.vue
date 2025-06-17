<template>
  <div class="flex h-screen">
    <Sidebar :is-open="isSidebarOpen" :toggle-sidebar="toggleSidebar" />
    <div class="flex-1 flex flex-col">
      <Topbar />
      <router-view class="flex-1 overflow-auto" />
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
