<script setup>
import { ref, onMounted } from "vue";
import GlobalModal from "@/components/GlobalModal.vue";

const showModal = ref(false);

const modalTitle = "Session Expired";
const modalMessage = "Your session has expired. Please log in again.";

const onTokenExpired = () => {
  showModal.value = true;
};

const handleModalClose = () => {
  showModal.value = false;
  localStorage.clear();
  window.location.href = "/";
};

onMounted(() => {
  window.addEventListener("tokenExpired", onTokenExpired);
});
</script>

<template>
  <router-view />
  
  <!-- GlobalModal sa kontrolisanim prikazom -->
  <GlobalModal
    :show="showModal"
    :title="modalTitle"
    :message="modalMessage"
    @close="handleModalClose"
  />
</template>
