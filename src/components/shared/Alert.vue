<template>
  <transition name="fade">
    <div
      v-show="visible"
      :class="[
        'mb-4 px-6 py-4 border-0 rounded absolute w-full top-0',
        type === 'success' ? 'text-green-700 bg-green-100 border border-green-300' : type === 'info' ? 'text-orange-700 bg-orange-100 border border-orange-300' : 'text-red-700 bg-red-100 border border-red-300'
      ]"
    >
      <span class="text-xl inline-block mr-5 align-middle">
        <i :class="type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
      </span>
      <span class="inline-block align-middle mr-8">
        <b class="capitalize">{{ type }}!</b> {{ message }}
      </span>
      <button
        @click="close"
        class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-2 mr-4 outline-none focus:outline-none"
      >
        ×
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'success',
    validator: (val) => ['success', 'error'].includes(val)
  },
  message: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const visible = ref(true)

const close = () => {
  visible.value = false
  setTimeout(() => emit('close'), 500) // Emit after fade-out
}

onMounted(() => {
  setTimeout(() => close(), 3000)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
