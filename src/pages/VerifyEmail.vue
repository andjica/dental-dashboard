<template>
  <Alert
    v-if="alert.message"
    :type="alert.type"
    :message="alert.message"
    @close="alert.message = ''"
  />

  <Loader v-if="loading" />

  <div v-else class="verify-email-page" style="padding: 2rem; text-align: center">
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
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getUserRole } from "@/helper/auth";
import Alert from "@/components/shared/Alert.vue";
import Loader from "@/components/shared/Loader.vue";

const alert = reactive({ type: "", message: "" });
const loading = ref(false);
const success = ref(false);
const error = ref(false);

const route = useRoute();
const router = useRouter();

const user = JSON.parse(localStorage.getItem("user"));

const goToNextRoute = () => {
  const { id, hash } = route.params;
  const query = window.location.search;
  loading.value = true;

  fetch(`http://localhost:8000/api/email/verify/${id}/${hash}${query}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  })
    .then((res) => {
      loading.value = false;
      if (res.ok) {
        success.value = true;
        setTimeout(() => {
          const role = getUserRole();
          if (role === 1) {
            router.push("/admin/dashboard");
          } else if (role === 2) {
            router.push("/company/dashboard");
          } else {
            router.push("/");
          }
        }, 2500);
      } else {
        error.value = true;
        alert.type = "error";
        alert.message = "Invalid verification link.";
      }
    })
    .catch(() => {
      loading.value = false;
      error.value = true;
      alert.type = "error";
      alert.message = "Something went wrong during verification.";
    });
};

const resendEmail = () => {
  if (!user?.email) {
    alert.type = "error";
    alert.message = "User not found in localStorage.";
    return;
  }

  loading.value = true;
  const token = localStorage.getItem("token");

  fetch("http://localhost:8000/api/email/verification-notification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user: user }),
  })
    .then((response) => {
      loading.value = false;
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    })
    .then(() => {
      alert.type = "success";
      alert.message = "Verification email has been resent.";
    })
    .catch((error) => {
      loading.value = false;
      alert.type = "error";
      alert.message = `Resend failed: ${error.message}`;
    });
};

onMounted(() => {
  const { id, hash } = route.params;
  if (id && hash) {
    goToNextRoute();
  }
});
</script>
