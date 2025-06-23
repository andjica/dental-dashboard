<template>
  <button
    @click="goBack"
    class="m-4 px-4 py-2 w-15 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
  ><font-awesome-icon icon="arrow-left" />
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>
