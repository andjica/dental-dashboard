<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
      <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
      <p class="text-sm text-gray-700 mb-4">{{ message }}</p>
      <div class="flex justify-end">
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          @click="handleClose"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  title: String,
  message: String,
});
const emits = defineEmits(["close"]);

const handleClose = () => {
  emits("close");
};
</script>

<style scoped>
/* Možeš dodati fade animaciju ili bilo šta po želji */
</style>
