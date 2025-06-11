<template>
  <!-- Alert Component -->
  <Alert
    v-if="alert.message"
    :type="alert.type"
    :message="alert.message"
    @close="alert.message = ''"
  />
  <div class="verify-email-page" style="padding: 2rem; text-align: center">
    <h2>Please verify your email</h2>
    <p>
      We have sent a verification email to your inbox. <br />
      You need to verify your email address before accessing the dashboard.
    </p>
    <p>If you have already verified, please refresh the page.</p>

    <button
      type="button"
      class="w-full bg-blue-600 text-white py-2 rounded cursor-pointer hover:bg-blue-700 transition"
      @click="resendEmail"
    >
      Resend email again
    </button>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import Alert from "@/components/shared/Alert.vue";

const alert = reactive({
  type: "",
  message: "",
});
const user = localStorage.getItem("user");

const resendEmail = () => {
  fetch("http://localhost:8000/api/email/verification-notification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("What we send: ", data);
      alert.type = "success";
      alert.message = "Successful resend email!";
    })
    .catch((error) => {
      alert.type = "error";
      alert.message = `Login failed: ${error.message}`;
    });
};
</script>
