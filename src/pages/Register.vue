<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-4">
    <div class="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-200">
      <!-- Alert Component -->
      <Alert
        v-if="alert.message"
        :type="alert.type"
        :message="alert.message"
        @close="alert.message = ''"
      />
      <h1 class="text-3xl font-extrabold mb-6 text-center text-gray-800">Create Your Account</h1>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <!-- First Name -->
        <div>
          <label for="firstName" class="text-sm font-semibold text-gray-700 mb-1 block">First Name</label>
          <input
            v-model="firstName"
            type="text"
            id="firstNameRegister"
            class="input"
            placeholder="John"
          />
          <p v-if="errors.firstName" class="text-red-600 text-sm mt-1">{{ errors.firstName }}</p>
        </div>

        <!-- Last Name -->
        <div>
          <label for="lastName" class="text-sm font-semibold text-gray-700 mb-1 block">Last Name</label>
          <input
            v-model="lastName"
            type="text"
            id="lastNameRegister"
            class="input"
            placeholder="Doe"
          />
          <p v-if="errors.lastName" class="text-red-600 text-sm mt-1">{{ errors.lastName }}</p>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
          <input
            v-model="email"
            type="email"
            id="emailRegister"
            class="input"
            placeholder="you@example.com"
          />
          <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="text-sm font-semibold text-gray-700 mb-1 block">Password</label>
          <input
            v-model="password"
            type="password"
            id="passwordRegister"
            class="input"
            placeholder="••••••••"
          />
          <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="passwordConfirmRegister" class="text-sm font-semibold text-gray-700 mb-1 block">Confirm Password</label>
          <input
            v-model="passwordConfirm"
            type="password"
            id="passwordConfirmRegister"
            class="input"
            placeholder="••••••••"
          />
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

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-xl font-semibold flex items-center justify-center"
        >
          <LoaderIcon v-if="isLoading" />
          <span v-else>Register</span>
        </button>
      </form>

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
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import Alert from "@/components/shared/Alert.vue";
import LoaderIcon from "@/components/shared/LoaderIcon.vue";

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const role = ref("2");
const isLoading = ref(false);

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
  Object.keys(errors).forEach((key) => (errors[key] = ""));
  alert.message = "";
  alert.type = "";

  let isValid = true;

  if (!firstName.value) {
    errors.firstName = "First Name is required!";
    isValid = false;
  }

  if (!lastName.value) {
    errors.lastName = "Last Name is required!";
    isValid = false;
  }

  if (!email.value) {
    errors.email = "Email is required!";
    isValid = false;
  } else if (!isValidEmail(email.value)) {
    errors.email = "Enter a valid email.";
    isValid = false;
  }

  if (!password.value) {
    errors.password = "Password is required!";
    isValid = false;
  } else if (password.value.length < 6) {
    errors.password = "Password must have at least 6 characters.";
    isValid = false;
  }

  if (!passwordConfirm.value) {
    errors.passwordConfirm = "Confirm password is required.";
    isValid = false;
  } else if (password.value !== passwordConfirm.value) {
    errors.passwordConfirm = "Passwords are not matching.";
    isValid = false;
  }

  if (!role.value) {
    errors.role = "Select a role.";
    isValid = false;
  }

  if (!isValid) {
    alert.type = "error";
    alert.message = "Please fix the errors in the form.";
    return;
  }

  try {
    isLoading.value = true;
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

    if ([422, 500].includes(response.status)) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    if (!response.ok) {
      alert.type = "error";
      alert.message = data.message || "Registration failed.";
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify(
        data.user || {
          first_name: firstName.value,
          last_name: lastName.value,
          email: email.value,
          role_id: parseInt(role.value),
        }
      )
    );
    localStorage.setItem("is_finished_profile", 0);
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
  } catch (error) {
    alert.type = "error";
    alert.message = `Unexpected error.${error.message}`;
  } finally {
    console.log("finally");
    isLoading.value = false;
  }
};
</script>
