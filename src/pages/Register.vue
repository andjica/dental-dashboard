<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">
    <div class="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-200">
      <!-- Alert Component -->
      <Alert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''" />

      <h1 class="text-3xl font-extrabold mb-6 text-center text-gray-800">Create Your Account</h1>

      <!-- Forma -->
      <form @submit.prevent="handleRegister" class="space-y-5">
        <!-- First Name -->
        <div>
          <label class="text-sm font-semibold text-gray-700 mb-1 block">First Name</label>
          <input v-model="firstName" type="text" class="input" placeholder="John" />
          <p v-if="errors.firstName" class="text-red-600 text-sm mt-1">{{ errors.firstName }}</p>
        </div>

        <!-- Last Name -->
        <div>
          <label class="text-sm font-semibold text-gray-700 mb-1 block">Last Name</label>
          <input v-model="lastName" type="text" class="input" placeholder="Doe" />
          <p v-if="errors.lastName" class="text-red-600 text-sm mt-1">{{ errors.lastName }}</p>
        </div>

        <!-- Email -->
        <div>
          <label class="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
          <input v-model="email" type="email" class="input" placeholder="you@example.com" />
          <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label class="text-sm font-semibold text-gray-700 mb-1 block">Password</label>
          <input v-model="password" type="password" class="input" placeholder="••••••••" />
          <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="text-sm font-semibold text-gray-700 mb-1 block">Confirm Password</label>
          <input v-model="passwordConfirm" type="password" class="input" placeholder="••••••••" />
          <p v-if="errors.passwordConfirm" class="text-red-600 text-sm mt-1">{{ errors.passwordConfirm }}</p>
        </div>

        <!-- Role -->
        <div>
          <label class="text-sm font-semibold text-gray-700 mb-1 block">Select Role</label>
          <div class="flex space-x-4">
            <label class="flex items-center space-x-2">
              <input type="radio" value="2" v-model="role" />
              <span>Company</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="radio" value="3" v-model="role" />
              <span>User</span>
            </label>
          </div>
          <p v-if="errors.role" class="text-red-600 text-sm mt-1">{{ errors.role }}</p>
        </div>

        <!-- Submit -->
        <button type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-xl font-semibold flex items-center justify-center cursor-pointer">
          <LoaderIcon v-if="isLoading" />
          <span v-else>Register</span>
        </button>
      </form>

      <!-- Google Sign In -->
      <div class="mt-6">
        <div id="googleButton" class="w-full flex justify-center"></div>
      </div>

      <p class="mt-6 text-center text-sm text-gray-600">
        Already have an account?
        <router-link to="/" class="text-blue-600 hover:underline font-medium">
          Login
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import Alert from "@/components/shared/Alert.vue";
import LoaderIcon from "@/components/shared/LoaderIcon.vue";

// .env vrednosti
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const router = useRouter();
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const role = ref("");
const isLoading = ref(false);

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

// Google login init
onMounted(() => {
  if (window.google) {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      { theme: "outline", size: "large"}
    );
  }
});

// Google callback
const handleGoogleCallback = async (response) => {
  try {
    const idToken = response.credential;
    console.log("andjica", idToken);
    const res = await fetch("http://localhost:8000/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ token: idToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert.type = "error";
      alert.message = data.message || "Google login failed.";
      return;
    }

    // snimi podatke
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("auth_provider", "google");

    // (opciono) postavi Authorization header za sledeće API pozive
    // import axios from "axios";
    // axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    // normalizuj role_id
    const roleId = data?.user?.role_id == null ? null : Number(data.user.role_id);
    console.log("rola je", roleId);
    // routing
    if (roleId === null) {
      // nema rolu → ide na choose-role
      router.push("/choose-role").catch(() => {
        window.location.href = "/choose-role";
      });
      console.log("upada ovde");
    } else if (roleId === 1) {
      router.push("/admin/dashboard").catch(() => (window.location.href = "/admin/dashboard"));
    } else if (roleId === 2) {
      router.push("/company/dashboard").catch(() => (window.location.href = "/company/dashboard"));
    } else if (roleId === 3) {
      router.push("/user/dashboard").catch(() => (window.location.href = "/user/dashboard"));
    } else {
        console.log("upada ovde na login");
      router.push("/").catch(() => (window.location.href = "/"));
    }
  }
catch (err) {
    alert.type = "error";
    alert.message = "Google login error: " + err.message;
  }
};

// Email/password register
const handleRegister = async () => {
  Object.keys(errors).forEach((key) => (errors[key] = ""));
  alert.message = "";
  alert.type = "";

  let isValid = true;
  if (!firstName.value) { errors.firstName = "First Name is required!"; isValid = false; }
  if (!lastName.value) { errors.lastName = "Last Name is required!"; isValid = false; }
  if (!email.value) { errors.email = "Email is required!"; isValid = false; }
  if (!password.value) { errors.password = "Password is required!"; isValid = false; }
  if (password.value !== passwordConfirm.value) { errors.passwordConfirm = "Passwords are not matching."; isValid = false; }
  if (!role.value) { errors.role = "Select a role."; isValid = false; }

  if (!isValid) {
    alert.type = "error";
    alert.message = "Please fix the errors in the form.";
    return;
  }

  try {
    isLoading.value = true;
    const response = await fetch("http://164.92.209.125:8000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
        password: password.value,
        role_id: parseInt(role.value),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert.type = "error";
      alert.message = data.message || "Registration failed.";
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("is_finished_profile", 0);

    alert.type = "success";
    alert.message = "Registration successful! Redirecting...";

    setTimeout(() => {
      router.push("/verify-email");
    }, 1500);
  } catch (err) {
    alert.type = "error";
    alert.message = "Unexpected error: " + err.message;
  } finally {
    isLoading.value = false;
  }
};
</script>
