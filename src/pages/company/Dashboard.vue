<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Company Dashboard</h1>
    <BaseCard title="Welcome" content="This is your Company dashboard." />
  </div>
  <div class="p-0" v-if="isActive === 0">
    <p
      class="m-4 p-4 text-sm text-green-700 bg-green-100 border border-green-300 rounded-lg shadow-sm"
    >
      {{ t('admin_info') }}
    </p>
  </div>
</template>

<script setup>
import BaseCard from "@/components/shared/BaseCard.vue";
import { onMounted, ref } from "vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const isActive = ref(0);

onMounted(() => {
  isActive.value = JSON.parse(localStorage.getItem("isActive")) || 0;
});

window.addEventListener("isActiveChanged", () => {
  isActive.value = JSON.parse(localStorage.getItem("isActive"));
});
</script>
