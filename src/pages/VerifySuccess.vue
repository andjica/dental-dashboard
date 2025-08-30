<template>
  <div class="max-w-md mx-auto mt-40 p-8 bg-white rounded-2xl shadow-2xl text-center animate-fade-in">
    <div class="text-green-600 text-4xl mb-4">✅</div>
    <h1 class="text-2xl font-bold mb-2 text-gray-800">
      Email Successfully Verified 🎉
    </h1>

    <p v-if="email" class="text-gray-700 text-sm mb-4">
      Your email: <span class="font-medium text-black">{{ email }}</span>
    </p>

    <p class="mb-6 text-gray-600 text-sm">
      You can now continue to your account.
    </p>

    <button
      @click="goNext"
      class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-8 rounded-lg shadow-lg transition-all duration-300 cursor-pointer"
    >
      Continue
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const email = route.query.email || null;

/**
 * 1) Na mount povuci svežeg user-a sa backenda (da ima email_verified_at),
 *    a ako API nije dostupan, lokalno markiraj verifikaciju.
 */
onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:8000/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const freshUser = await res.json();
      localStorage.setItem("user", JSON.stringify(freshUser));
    } else {
      // fallback: lokalno upiši da je verifikovan
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      u.email_verified_at = new Date().toISOString();
      localStorage.setItem("user", JSON.stringify(u));
    }
  } catch {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    u.email_verified_at = new Date().toISOString();
    localStorage.setItem("user", JSON.stringify(u));
  }
});

/**
 * 2) Na klik vodi korisnika na ispravnu rutu u zavisnosti od role.
 */
const goNext = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const roleId = user?.role_id == null ? null : Number(user.role_id);

  if (roleId == null)       return router.push("/choose-role");
  if (roleId === 1)         return router.push("/admin/dashboard");
  if (roleId === 2)         return router.push("/company/settings/company");
  if (roleId === 3)         return router.push("/user/settings/user");
  return router.push("/");
};
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
</style>
