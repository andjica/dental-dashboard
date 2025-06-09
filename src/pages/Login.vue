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
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
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

  // treba posle API poziv da se doda
  // Simulated login check
  // if (email.value === 'admin@example.com' && password.value === 'admin123') {
  //   localStorage.setItem('email', email.value)
  //   localStorage.setItem('password', password.value)
  //   localStorage.setItem('rola', '1') // Admin = 1
  //   alert.type = 'success'
  //   alert.message = 'Login successful! Redirecting...'
  //   setTimeout(() => router.push('/admin'), 1500)
  // } else if (email.value === 'user@example.com' && password.value === 'user123') {
  //   localStorage.setItem('email', email.value)
  //   localStorage.setItem('password', password.value)
  //   localStorage.setItem('rola', '2') // User = 2
  //   alert.type = 'success'
  //   alert.message = 'Login successful! Redirecting...'
  //   setTimeout(() => router.push('/dashboard'), 1500)
  // } else {
  //   alert.type = 'error'
  //   alert.message = 'Incorrect email or password.'
  // }

  fetch("http://127.0.0.1/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        // If server responds with error status
        throw new Error("Network response was not ok");
      }
      return response.json(); // parse JSON response body
    })
    .then((data) => {
      console.log("DATA: ", data);
      // Example: assuming API returns { success: true, role: 'admin' or 'user' }
      if (data.success) {
        const user = {
          email: email.value,
          name: data.name, // assuming data.name comes from your API
          role: data.role_id === 1 ? "admin" : "company",
          isVerify: data.email_verified_at ? 1 : 0, // set as 0 initially
        };
        localStorage.setItem("user", JSON.stringify(user));
        alert.type = "success";
        alert.message = "Login successful! Redirecting...";
        setTimeout(() => {
          if (data.role_id === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }, 1500);
      } else {
        alert.type = "error";
        alert.message = data.message || "Incorrect email or password.";
      }
    })
    .catch((error) => {
      // Network or other error
      alert.type = "error";
      alert.message = `Login failed: ${error.message}`;
    });
};
</script>
