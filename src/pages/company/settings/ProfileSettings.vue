<template>
  <ButtonBack />

  <!-- ALERT -->
  <Alert
    v-if="showAlert"
    :type="alertType"
    :message="alertMessage"
    :classWidth="'max-w-3xl'"
    @close="showAlert = false"
    class="mb-6"
  />

  <div
    class="p-6 mt-8 mb-8 ml-3 max-w-3xl bg-white rounded-xl shadow-lg overflow-y-auto"
  >
    <!-- Title -->
    <h1 class="text-2xl font-bold mb-6 text-gray-800">
      Profile settings
    </h1>

    <div class="space-y-10">
      <!-- Email update -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Email address
        </label>
        <input
          type="email"
          v-model="form.email"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
        <button
          @click="updateEmail"
          class="mt-3 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition float-right"
        >
          Update email
        </button>
      </div>

      <hr class="border-gray-200" />

      <!-- Password update -->
      <div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Current password
            </label>
            <input
              type="password"
              v-model="form.currentPassword"
              placeholder="Enter your current password"
              class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p v-if="errors.currentPassword" class="text-red-500 text-xs mt-1">{{ errors.currentPassword }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              New password
            </label>
            <input
              type="password"
              v-model="form.newPassword"
              placeholder="Enter new password"
              class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p v-if="errors.newPassword" class="text-red-500 text-xs mt-1">{{ errors.newPassword }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Confirm new password
            </label>
            <input
              type="password"
              v-model="form.confirmPassword"
              placeholder="Confirm new password"
              class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">{{ errors.confirmPassword }}</p>
          </div>
        </div>

        <button
          @click="updatePassword"
          class="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition float-right"
        >
          Change password
        </button>
      </div>

      <hr class="border-gray-200" />

      <!-- Forgot password -->
      <div class="text-sm">
        <span class="text-gray-600">Forgot your password?</span>
        <a href="#" class="text-blue-600 hover:underline ml-1">
          Send reset link
        </a>
      </div>

      <!-- Account type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Account type
        </label>
        <span
          class="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg font-medium"
        >
         Company
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import Alert from "@/components/shared/Alert.vue";
import ButtonBack from "@/components/shared/ButtonBack.vue";
import { reactive, ref, onMounted } from "vue";


onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const message = params.get("message");

  if (status && message) {
    triggerAlert(status, message); // koristi tvoj custom Alert, a ne browser alert
  }

  // ⬇️ refresh user info da povuče novi email
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data) {
      form.email = data.email;
      localStorage.setItem("user", JSON.stringify(data));
    }
  } catch (error) {
    console.error("Failed to refresh user info", error);
  }
});

const form = reactive({
  email: "freelancer33@gmail.com",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const errors = reactive({
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// ALERT state
const showAlert = ref(false);
const alertType = ref("success");
const alertMessage = ref("");

const triggerAlert = (type, message) => {
  alertType.value = type;
  alertMessage.value = message;
  showAlert.value = true;
};

// Email validation regex
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Update Email
const updateEmail = async () => {
  errors.email = "";

  if (!form.email) {
    errors.email = "Email is required";
    return;
  } else if (!validateEmail(form.email)) {
    errors.email = "Please enter a valid email address";
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/user/update-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: form.email }),
    });

    const data = await res.json();

    if (!res.ok) {
      // hvataš poruku sa backenda
      triggerAlert("error", data.message || "Failed to update email");
      return;
    }

    // success case
    triggerAlert("info", data.message || "Verification link has been sent to your new email. Please confirm to update.");
  } catch (err) {
    triggerAlert("error", "Something went wrong. Please try again.");
  }
};


// Update Password
const updatePassword = async () => {
  errors.currentPassword = "";
  errors.newPassword = "";
  errors.confirmPassword = "";

  if (!form.currentPassword) {
    errors.currentPassword = "Current password is required";
  }
  if (!form.newPassword) {
    errors.newPassword = "New password is required";
  } else if (form.newPassword.length < 6) {
    errors.newPassword = "Password must be at least 6 characters long";
  }
  if (form.confirmPassword !== form.newPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (errors.currentPassword || errors.newPassword || errors.confirmPassword) {
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/user/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: form.currentPassword,
        new_password: form.newPassword,
        new_password_confirmation: form.confirmPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.error) {
        triggerAlert("error", data.error);
      } else if (data.errors) {
        Object.keys(data.errors).forEach((key) => {
          errors[key] = data.errors[key][0];
        });
        triggerAlert("error", "Password validation failed");
      } else {
        triggerAlert("error", "Failed to change password");
      }
      return;
    }

    triggerAlert("success", "Password changed successfully");
    form.currentPassword = "";
    form.newPassword = "";
    form.confirmPassword = "";
  } catch (err) {
    triggerAlert("error", "Something went wrong. Please try again.");
  }
};
</script>
