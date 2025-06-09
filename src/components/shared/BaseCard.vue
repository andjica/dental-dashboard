<template>
    <div class="bg-white rounded shadow p-4">
    <h2 class="text-xl font-semibold mb-2">{{ title }}</h2>
    <p>{{ content }}</p>
  </div>
</template>

<script setup>
defineProps(['title', 'content'])

</script>