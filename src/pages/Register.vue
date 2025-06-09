<template>
  <!-- Alert Component -->
  <Alert
    v-if="alert.message"
    :type="alert.type"
    :message="alert.message"
    @close="alert.message = ''"
  />
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Register</h1>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Email -->
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            id="emailRegister"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
          <p v-if="errors.email" class="text-red-600 text-sm mt-1">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            id="passwordRegister"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your password"
          />
          <p v-if="errors.password" class="text-red-600 text-sm mt-1">
            {{ errors.password }}
          </p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label
            for="passwordConfirm"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Confirm Password</label
          >
          <input
            v-model="passwordConfirm"
            type="password"
            id="passwordConfirmRegister"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm your password"
          />
          <p v-if="errors.passwordConfirm" class="text-red-600 text-sm mt-1">
            {{ errors.passwordConfirm }}
          </p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
      <p class="mt-4 text-center">If you did register, please go to <router-link  to="/"
            class="inline-block font-medium text-blue-600 hover:underline"
            >Login</router-link>.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import Alert from "@/components/shared/Alert.vue";

const email = ref("")
const password = ref("")
const passwordConfirm = ref("")
const errors = reactive({
  email: "",
  password: "",
  passwordConfirm: "",
});
const alert = reactive({
  type: "",
  message: "",
});

// Regex to validate email format
const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

// Clear errors while typing
watch(email, (newVal) => {
  if (errors.email) errors.email = "";
});

watch(password, (newVal) => {
  if (errors.password) errors.password = "";
});

watch(passwordConfirm, (newVal) => {
  if (errors.passwordConfirm) errors.passwordConfirm = "";
});

const handleRegister = () => {
  // Reset all errors
  errors.email = "";
  errors.password = "";
  errors.passwordConfirm = "";
  alert.message = "";
  alert.type = "";

  let valid = true;

  if (!email.value) {
    errors.email = "Email is required!";
    valid = false;
  } else if (!isValidEmail(email.value)) {
    errors.email = "Enter valid email.";
    valid = false;
  }

  if (!password.value) {
    errors.password = "Password is required!";
    valid = false;
  } else if (password.value.length < 6) {
    errors.password = "Password must have at least 6 characters.";
    valid = false;
  }

  if (!passwordConfirm.value) {
    errors.passwordConfirm = "Confirm password is required.";
    valid = false;
  } else if (password.value !== passwordConfirm.value) {
    errors.passwordConfirm = "Passwords are not matching.";
    valid = false;
  }

  if (valid) {
    // treba posle API poziv da se doda
    const formData = {
      email: email.value,
      password: password.value,
    };

    fetch("https://127.0.0.1/api/register", {})

    localStorage.setItem("user", JSON.stringify(formData));
    alert.message = "Registration successful!";
    alert.type = "success";
    console.log("Register is successfully:", {
      email: email.value,
      password: password.value,
    });
    email.value = "";
    password.value = "";
    passwordConfirm.value = "";
  } else {
    alert.type = "error";
    alert.message = "Please fix the errors in the form.";
  }
};
</script>
