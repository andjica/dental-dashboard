<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <!-- Alert Component -->
      <Alert
        v-if="alert.message"
        :type="alert.type"
        :message="alert.message"
        @close="alert.message = ''"
      />
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label
            for="emailLogin"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            id="emailLogin"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
          <p v-if="errors.email" class="text-red-600 text-sm mt-1">
            {{ errors.email }}
          </p>
        </div>
        <div>
          <label
            for="passwordLogin"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            id="passwordLogin"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your password"
          />
          <p v-if="errors.password" class="text-red-600 text-sm mt-1">
            {{ errors.password }}
          </p>
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded cursor-pointer hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </form>
      <p class="mt-4 text-center">
        If you didn't register, please go to
        <router-link
          to="/register"
          class="inline-block font-medium text-blue-600 hover:underline"
        >
          Register </router-link
        >.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import Alert from "@/components/shared/Alert.vue";

const email = ref("");
const password = ref("");
const router = useRouter();

const errors = reactive({
  email: "",
  password: "",
});

const alert = reactive({
  type: "",
  message: "",
});

const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

// Clear errors when typing
watch(email, () => {
  if (errors.email) errors.email = "";
  if (alert.message) alert.message = "";
});
watch(password, () => {
  if (errors.password) errors.password = "";
  if (alert.message) alert.message = "";
});

const handleLogin = () => {
  // Reset errors and alert
  errors.email = "";
  errors.password = "";
  alert.message = "";
  alert.type = "";

  let valid = true;

  if (!email.value) {
    errors.email = "Email is required.";
    valid = false;
  } else if (!isValidEmail(email.value)) {
    errors.email = "Please enter a valid email.";
    valid = false;
  }

  if (!password.value) {
    errors.password = "Password is required.";
    valid = false;
  }

  if (!valid) {
    alert.type = "error";
    alert.message = "Please fix the errors in the form.";
    return;
  }

  fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("DATA: ", data);
      if (data.success) {
        const roleName =
          data.user.role_id === 1
            ? "admin"
            : data.user.role_id === 2
            ? "company"
            : data.user.role_id === 3
            ? "customer"
            : "unknown";

        const user = {
          email: email.value,
          name: data.user.name,
          role_id: data.user.role_id,
          isVerify: data.user.email_verified_at ? 1 : 0,
        };

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", data.token);
        alert.type = "success";
        alert.message = "Login successful! Redirecting...";
        setTimeout(() => {
          if (data.user.role_id === 1) {
            router.push("/admin/dashboard");
          } else if (data.user.role_id === 2) {
            router.push("/company/dashboard");
          }
        }, 1500);
      } else {
        alert.type = "error";
        alert.message = data.message || "Incorrect email or password.";
      }
    })
    .catch((error) => {
      alert.type = "error";
      alert.message = `Login failed: ${error.message}`;
    });
};
</script>
