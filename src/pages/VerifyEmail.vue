<template>
  <Alert
    v-if="alert.message"
    :type="alert.type"
    :message="alert.message"
    @close="alert.message = ''"
  />

  <Loader v-if="loading" />

  <div
    v-else
    class="max-w-lg mx-auto mt-28 p-10 bg-white shadow-2xl rounded-2xl border border-gray-200 text-center"
  >
    <div class="mb-6">
      <svg
        class="mx-auto h-14 w-14 text-blue-600"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21.75 6.75l-9.75 6.75L2.25 6.75m19.5 0v10.5a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 17.25V6.75m19.5 0L12 13.5 2.25 6.75"
        />
      </svg>
    </div>

    <h2 class="text-2xl font-extrabold text-gray-800 mb-3">
      Please verify your email
    </h2>
    <p class="text-gray-600 mb-6 leading-relaxed">
      We've sent a confirmation link to your inbox. <br />
      You must verify your email before continuing.
    </p>

    <button
      type="button"
      @click="resendEmail"
      class="inline-block w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-150 cursor-pointer"
    >
      Resend verification email
    </button>
  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getUserRole } from "@/js/auth";
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

  fetch(`http://164.92.209.125:8000/api/email/verify/${id}/${hash}${query}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  })
    .then((res) => {
      loading.value = false;
      if (res.ok) {
        success.value = true;
          const u = JSON.parse(localStorage.getItem("user") || "{}");
          u.email_verified_at = new Date().toISOString();
          localStorage.setItem("user", JSON.stringify(u));
          
        setTimeout(() => {
          const role = getUserRole();
          if (role === 1) {
            router.push("/admin/dashboard");
          } else if (role === 2) {
            router.push("/company/dashboard");
          } else if (role === 3){
            router.push("/user/dashboard");
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

  fetch("http://164.92.209.125:8000/api/email/verification-notification", {
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
