<template>
  <div class="max-w-md mx-auto mt-32 p-6 bg-white rounded shadow-md text-center">
    <h1 class="text-3xl font-semibold mb-4 text-green-600">Email suceessfully verified 🎉</h1>
    <p v-if="email" class="text-gray-700 mb-6">
      Your email: <span class="font-medium">{{ email }}</span>
    </p>
    <p class="mb-6 text-gray-600">You can now login with you acount</p>
    <router-link to="/">
      <button class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition duration-300">
        Go to Login
      </button>
    </router-link>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';

const route = useRoute();
const router = useRouter();

const email = route.query.email || null;

</script>
