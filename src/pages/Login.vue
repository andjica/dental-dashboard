<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">
    <div class="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-200">
      <!-- Route Alert -->
      <div v-if="$route.query.error === 'unauthenticated'"
        class="mb-4 px-4 py-3 rounded-md bg-yellow-50 text-yellow-800 border border-yellow-300 text-sm font-medium">
        ⚠ You must be logged in to access that page.
      </div>

      <!-- Alert Component -->
      <Alert v-if="alert.message" :type="alert.type" :message="alert.message" @close="alert.message = ''" />

      <h1 class="text-3xl font-extrabold mb-6 text-center text-gray-800">Log in to your account</h1>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email -->
        <div>
          <label for="emailLogin" class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input v-model="email" type="email" id="emailLogin"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com" />
          <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label for="passwordLogin" class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input v-model="password" type="password" id="passwordLogin"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your password" />
          <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <!-- Submit -->
        <button type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
          <LoaderIcon v-if="isLoading" />
          <span v-else>Log In</span>
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Don't have an account?
        <router-link to="/register" class="font-medium text-blue-600 hover:underline">
          Register here
        </router-link>
      </p>
    </div>
  </div>
</template>


<script setup>
import { ref, reactive, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Alert from "@/components/shared/Alert.vue";
import LoaderIcon from "@/components/shared/LoaderIcon.vue";

const email = ref("");
const password = ref("");
const isLoading = ref(false);

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
  if (isLoading.value) return; // prevent double submit
  isLoading.value = true;
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

    console.log(loginResponse);
    if ([401, 404].includes(loginResponse.status)) {
      throw new Error(loginResponse.statusText);
    }

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
          console.log("Company ili Admin: ", companyData);
          isFinisheProfile = companyData.data.is_finished_profile;
          localStorage.setItem("is_finished_profile", isFinisheProfile);
          localStorage.setItem("isActive", companyData.data.active);
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
            : router.push("/admin/settings/company");
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
            : router.push("/user/settings/user");
          break;
      }
    }, 1500);
  } catch (error) {
    alert.type = "error";
    alert.message = `Login failed: ${error.message}`;
  } finally {
    isLoading.value = false; // ⬅️ stop loader
  }
};
</script>
