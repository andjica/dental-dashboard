<template>
  <transition name="fade-slide">
    <div
      v-show="visible"
      :class="[
        'flex items-start gap-4 px-6 py-4 rounded-lg shadow-lg border text-sm font-medium sticky top-0',
        type === 'success'
          ? 'bg-green-50 text-green-800 border-green-200'
          : type === 'info'
          ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
          : 'bg-red-50 text-red-800 border-red-200',
      ]"
    >
      <div class="pt-1">
        <i
          :class="[
            'text-xl',
            type === 'success'
              ? 'fas fa-check-circle'
              : type === 'info'
              ? 'fas fa-info-circle'
              : 'fas fa-exclamation-circle',
          ]"
        ></i>
      </div>
      <div class="flex-1">
        <strong class="capitalize">{{ type }}</strong
        >: {{ message }}
      </div>
      <button
        @click="close"
        class="absolute right-3 top-3 text-xl leading-none text-gray-400 hover:text-gray-600"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "success",
    validator: (val) => ["success", "info", "error"].includes(val),
  },
  message: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const visible = ref(true);

const close = () => {
  visible.value = false;
  setTimeout(() => emit("close"), 500);
};

onMounted(() => {
  setTimeout(() => {
    close();
  }, 4000);
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
