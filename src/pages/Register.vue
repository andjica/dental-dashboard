<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <!-- Alert Component -->
      <Alert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''" />
      <h1 class="text-2xl font-bold mb-6 text-center">Register</h1>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- First Name -->
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input v-model="firstName" type="text" id="firstNameRegister"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name" />
          <p v-if="errors.firstName" class="text-red-600 text-sm mt-1">
            {{ errors.firstName }}
          </p>
        </div>
        <!-- Last Name -->
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input v-model="lastName" type="text" id="lastNameRegister"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name" />
          <p v-if="errors.lastName" class="text-red-600 text-sm mt-1">
            {{ errors.lastName }}
          </p>
        </div>
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="email" type="email" id="emailRegister"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com" />
          <p v-if="errors.email" class="text-red-600 text-sm mt-1">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input v-model="password" type="password" id="passwordRegister"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your password" />
          <p v-if="errors.password" class="text-red-600 text-sm mt-1">
            {{ errors.password }}
          </p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="passwordConfirmRegister" class="block text-sm font-medium text-gray-700 mb-1">Confirm
            Password</label>
          <input v-model="passwordConfirm" type="password" id="passwordConfirmRegister"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm your password" />
          <p v-if="errors.passwordConfirm" class="text-red-600 text-sm mt-1">
            {{ errors.passwordConfirm }}
          </p>
        </div>
        <!-- Roles -->
        <div>
          <h4 class="mb-1 font-medium">Your role:</h4>
          <div class="space-y-1">
            <label class="flex items-center space-x-2">
              <input type="radio" id="company" value="2" v-model="role" checked/>
              <span>Company</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="radio" id="user" value="3" v-model="role" />
              <span>User</span>
            </label>
          </div>
          <p v-if="errors.role" class="text-red-600 text-sm mt-1">
            {{ errors.role }}
          </p>
        </div>
        <!-- Submit -->
        <button type="submit"
          class="w-full bg-blue-600 text-white cursor-pointer py-2 rounded hover:bg-blue-700 transition">
          Register
        </button>
      </form>
      <p class="mt-4 text-center">
        If you did register, please go to
        <router-link to="/" class="inline-block font-medium text-blue-600 hover:underline">Login</router-link>.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import Alert from "@/components/shared/Alert.vue";

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const role = ref("2");

const router = useRouter();

const errors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirm: "",
  role: "",
});

const alert = reactive({
  type: "",
  message: "",
});

// Regex to validate email format
const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

// Clear errors while typing
const fields = { firstName, lastName, email, password, passwordConfirm };
Object.entries(fields).forEach(([key, refVar]) => {
  watch(refVar, () => {
    if (errors[key]) errors[key] = "";
  });
});

const handleRegister = async () => {
  // Reset errors and alert
  Object.keys(errors).forEach(key => errors[key] = "");
  alert.message = "";
  alert.type = "";

  let valid = true;

  if (!firstName.value) {
    errors.firstName = "First Name is required!";
    valid = false;
  }

  if (!lastName.value) {
    errors.lastName = "Last Name is required!";
    valid = false;
  }

  if (!email.value) {
    errors.email = "Email is required!";
    valid = false;
  } else if (!isValidEmail(email.value)) {
    errors.email = "Enter a valid email.";
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

  if (!role.value) {
    errors.role = "Select a role.";
    valid = false;
  }

  if (!valid) return;

  try {
    const response = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
        password: password.value,
        role_id: parseInt(role.value),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert.type = "error";
      alert.message = data.message || "Registration failed.";
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user || {
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      role_id: parseInt(role.value),
      is_finished_profile: 0,
    }));

    alert.type = "success";
    alert.message = "Registration successful! Redirecting...";
    
    // Clear form
    firstName.value = "";
    lastName.value = "";
    email.value = "";
    password.value = "";
    passwordConfirm.value = "";
    role.value = "2";

    setTimeout(() => {
      router.push("/verify-email");
    }, 1500);

  } catch (err) {
    console.error("Registration error:", err);
    alert.type = "error";
    alert.message = "Unexpected error. Please try again.";
  }
};

</script>
