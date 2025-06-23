<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md relative">
      <!-- Alert from route query -->
      <div
        v-if="$route.query.error === 'unauthenticated'"
        class="mb-4 p-3 rounded bg-yellow-100 text-yellow-800 border border-yellow-300 text-sm"
      >
        ⚠ You must be logged in to access that page.
      </div>
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
          Logi In
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
import { useRouter, useRoute } from "vue-router";
import Alert from "@/components/shared/Alert.vue";

const email = ref("");
const password = ref("");

const router = useRouter();
const route = useRoute();

const errors = reactive({
  email: "",
  password: "",
});

const alert = reactive({
  type: "",
  message: "",
});

const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
watch(
  () => route.query.error,
  (val) => {
    if (!val && alert.message.includes("logged in")) {
      alert.message = "";
      alert.type = "";
    }
  }
);
// Clear errors when typing
const fields = { email, password };
Object.entries(fields).forEach(([key, refVar]) => {
  watch(refVar, () => {
    if (errors[key]) errors[key] = "";
  });
});

const handleLogin = async () => {
  // Resetuj validaciju i alert poruke
  errors.email = "";
  errors.password = "";
  alert.message = "";
  alert.type = "";

  // Validacija forme
  let isValid = true;

  if (!email.value) {
    errors.email = "Email is required.";
    isValid = false;
  } else if (!isValidEmail(email.value)) {
    errors.email = "Please enter a valid email.";
    isValid = false;
  }

  if (!password.value) {
    errors.password = "Password is required.";
    isValid = false;
  }

  if (!isValid) {
    alert.type = "error";
    alert.message = "Please fix the errors in the form.";
    return;
  }

  try {
    // Login request
    const loginResponse = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    if (!loginResponse.ok) throw new Error("Login request failed");

    const loginData = await loginResponse.json();

    if (!loginData.success) {
      alert.type = "error";
      alert.message = loginData.message || "Incorrect email or password.";
      return;
    }

    const token = loginData.token;
    const baseUser = loginData.user;
    const isVerified = !!baseUser.email_verified_at;
    let isFinisheProfile = "";
    let fullUser = {
      ...baseUser,
      isVerify: isVerified,
      is_finished_profile: isFinisheProfile,
    };
    console.log("Ko se ulogovao: ", baseUser);
    // Ako je kompanija, uzmi dodatne podatke o profilu
    if (baseUser.role_id === 2 || baseUser.role_id === 1) {
      try {
        const companyResponse = await fetch(
          "http://localhost:8000/api/company",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!companyResponse.ok) {
          console.warn("Company info not found or error occurred");
          isFinisheProfile = 0; // fallback ako nema podataka
        } else {
          const companyData = await companyResponse.json();
          console.log("Compnay ili Admin: ",companyData);
          isFinisheProfile = companyData.data.is_finished_profile;
          localStorage.setItem("is_finished_profile", isFinisheProfile);
        }
      } catch (error) {
        console.error("Company fetch error:", error);
        isFinisheProfile = 0;
      }
    } else {
      try {
        const userResponse = await fetch(
          "http://localhost:8000/api/user-info",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );  

        if (!userResponse.ok) {
          console.warn("User info not found or error occurred");
          isFinisheProfile = 0;
        } else {
          const userData = await userResponse.json();
          console.log("User: ", userData);
          isFinisheProfile = userData.data.is_finished_profile;
          localStorage.setItem("is_finished_profile", isFinisheProfile);
        }
      } catch (error) {
        console.error("User fetch errror: ", error);
        isFinisheProfile = 0;
      }
    }

    // Sačuvaj korisnika i token
    localStorage.setItem("user", JSON.stringify(fullUser));
    localStorage.setItem("token", token);

    alert.type = "success";
    alert.message = "Login successful! Redirecting...";

    setTimeout(() => {
      if (!isVerified) {
        router.push("/verify-email");

        // Pošalji zahtev za verifikaciju emaila
        fetch("http://localhost:8000/api/email/verification-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: fullUser.id }),
        }).catch((error) => {
          console.error("Verification email resend failed:", error.message);
        });

        return;
      }

      // Redirekcija po roli
      switch (fullUser.role_id) {
        case 1:
          isFinisheProfile
          ? router.push("/admin/dashboard")
          : router.push("/admin/settings");
          break;
        case 2:
          isFinisheProfile
            ? router.push("/company/dashboard")
            : router.push("/company/settings/company");
          break;
        case 3:
        default:
          isFinisheProfile
            ? router.push("/user/dashboard")
            : router.push("/user/settings/profile");
          break;
      }
    }, 1500);
  } catch (error) {
    alert.type = "error";
    alert.message = `Login failed: ${error.message}`;
    console.error("Login error:", error);
  }
};
</script>
