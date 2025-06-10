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
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/admin/Sidebar.vue'
import Topbar from '@/components/admin/Topbar.vue'

const verify = ref(true)

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
