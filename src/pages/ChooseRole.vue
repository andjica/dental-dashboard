<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">Choose Your Role</h1>

      <p class="text-gray-600 text-center mb-6">
        Please select how you want to use this platform:
      </p>

      <div class="flex flex-col gap-4">
        <button
          @click="chooseRole(2)"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          🚀 Company
        </button>

        <button
          @click="chooseRole(3)"
          class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
        >
          🙋 User
        </button>
      </div>

      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const error = ref("");

const chooseRole = async (roleId) => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!token || !user?.id) {
      error.value = "Not authenticated!";
      return;
    }

    const res = await fetch("http://localhost:8000/api/user/update-role", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role_id: roleId }),
    });

    const data = await res.json();

    if (!res.ok) {
      error.value = data.message || "Something went wrong!";
      return;
    }

    // osveži localStorage
    const updated = { ...user, role_id: roleId };
    localStorage.setItem("user", JSON.stringify(updated));

    // redirect prema roli
    if (roleId === 2) router.push("/company/settings/company"); // ili /company/dashboard ako hoćeš
    else if (roleId === 3) router.push("/user/settings/user");  // ili /user/dashboard
  } catch (err) {
    error.value = "Error: " + err.message;
  }
};

</script>
