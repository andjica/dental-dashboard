<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <Topbar />
      <router-view class="flex-1 overflow-auto" />
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/company/Sidebar.vue'
import Topbar from '@/components/company/Topbar.vue'
</script>
