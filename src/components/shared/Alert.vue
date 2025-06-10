<template>
  <div
    v-if="message"
    :class="[
      'text-white mb-4 px-6 py-4 border-0 rounded relative',
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    ]"
  >
    <span class="text-xl inline-block mr-5 align-middle">
      <i :class="type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
    </span>
    <span class="inline-block align-middle mr-8">
      <b class="capitalize">{{ type }}!</b> {{ message }}
    </span>
    <button
      @click="$emit('close')"
      class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-2 mr-4 outline-none focus:outline-none"
    >
      ×
    </button>
  </div>
</template>


<script setup>
defineProps({
  type: {
    type: String,
    default: 'success', // or 'error'
    validator: (val) => ['success', 'error'].includes(val)
  },
  message: {
    type: String,
    required: true
  }
})
defineEmits(['close'])
</script>
