<template>
  <div
    class="max-w-md mx-auto mt-40 p-8 bg-white rounded-2xl shadow-2xl text-center animate-fade-in"
  >
    <div class="text-green-600 text-4xl mb-4">✅</div>
    <h1 class="text-2xl font-bold mb-2 text-gray-800">
      Email Successfully Verified 🎉
    </h1>

    <p v-if="email" class="text-gray-700 text-sm mb-4">
      Your email: <span class="font-medium text-black">{{ email }}</span>
    </p>

    <p class="mb-6 text-gray-600 text-sm">
      You can now log in to your account and start using the app.
    </p>

    <router-link to="/">
      <button
        class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-8 rounded-lg shadow-lg transition-all duration-300 cursor-pointer"
      >
        Go to Login
      </button>
    </router-link>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const email = route.query.email || null;
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
</style>
