<template>
  <div class="relative">
  <Alert
        v-if="showSuccessMessage"
        :type="alert.type"
        :message="alert.message"
        @close="alert.message = ''"
      />
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>
    <BaseCard title="Welcome" content="This is your admin dashboard." />
  </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import Alert from "@/components/shared/Alert.vue";
import BaseCard from '@/components/shared/BaseCard.vue';

const route = useRoute();
const showSuccessMessage = ref(false);

const alert = reactive({
  type: "",
  message: "",
});

onMounted(() => {
  if (route.query.profileUpdated === '1') {
    showSuccessMessage.value = true;
    alert.type = "success";
    alert.message = "You have successfully completed your profile and now have access to all pages.";
    // Opciono: ukloni query posle prikaza
    history.replaceState(null, '', route.path);
  }
});
</script>
