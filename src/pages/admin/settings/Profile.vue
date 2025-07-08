<template>
  <ButtonBack />
  <div class="p-6 mt-8 mb-8 ml-3 max-w-4xl bg-white rounded-lg shadow-2xl overflow-y-auto">
    <h1 class="text-2xl font-bold mb-4">Settings Profile</h1>
    <div class="p-6">
      <!-- Email Section -->
      <div class="mb-16">
        <label class="block text-sm font-medium mb-1">Email Address</label>
        <input
          v-model="email"
          type="email"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.email" class="text-sm text-red-600 mt-1">
          {{ errors.email }}
        </p>
        <button
          @click="handleEmailUpdate"
          class="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 float-right cursor-pointer"
        >
          Update Email
        </button>
      </div>

      <hr class="my-6 border-t" />

      <!-- Password Section -->
      <div class="space-y-4 mb-20">
        <div>
          <label class="block text-sm font-medium mb-1">Current Password</label>
          <input
            v-model="currentPassword"
            type="password"
            placeholder="Enter your current password"
            class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">New Password</label>
          <input
            v-model="newPassword"
            type="password"
            placeholder="Enter new password"
            class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Confirm New Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div v-if="errors.password" class="text-sm text-red-600">
          {{ errors.password }}
        </div>

        <button
          @click="handlePasswordUpdate"
          class="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 float-right cursor-pointer"
        >
          Change Password
        </button>
      </div>

      <hr class="my-6 border-t" />

      <!-- Forgot Password -->
      <div class="mb-6 text-sm">
        <span class="text-gray-600">Forgot Password?</span>
        <a href="#" class="text-blue-600 hover:underline ml-1">Send Password Reset Link</a>
      </div>

      <!-- Account Type -->
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
        <span class="inline-block px-3 py-1 bg-green-100 text-green-600 text-sm rounded">
          Admin
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import { ref } from "vue";

// Form values
const email = ref("freelancer33@gmail.com");
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

// Error messages
const errors = ref({});

// Email update
const handleEmailUpdate = () => {
  errors.value = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    errors.value.email = "Email is required.";
    return;
  } else if (!emailRegex.test(email.value)) {
    errors.value.email = "Invalid email format.";
    return;
  }

  // Here you would call your API to update the email
  alert("✅ Email updated: " + email.value);
};

// Password update
const handlePasswordUpdate = () => {
  errors.value = {};

  if (!currentPassword.value.trim()) {
    errors.value.password = "Current password is required.";
    return;
  }

  if (newPassword.value.length < 6) {
    errors.value.password = "New password must be at least 6 characters long.";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errors.value.password = "Passwords do not match.";
    return;
  }

  // Here you would call your API to update the password
  alert("✅ Password successfully updated.");
};
</script>
