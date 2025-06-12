<template>
  <router-view />
</template>

<script setup>
import { useRouter } from 'vue-router'
// provera ako mu je istekao token, treba da ga vrati na Login stranicu
const router = useRouter()

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (!token && to.path !== '/') {
    // Ako nema token i pokušava da uđe bilo gde osim login stranice
    return next('/');
  }

  // Ako postoji token ili ide na login stranicu
  next();
});

</script>