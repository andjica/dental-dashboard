<template>
  <!-- Back Button -->
  <ButtonBack />
  <!-- Warning if profile not completed -->
  <Alert
    v-if="showAlert"
    :type="alertType"
    :message="alertMessage"
    @close="showAlert = false"
    :classWidth="'max-w-4xl'"
  />
  <div
    class="mb-8 ml-3 max-w-4xl bg-white rounded-lg shadow-1xl overflow-y-auto"
  >
    <!-- Alert Message -->
    <p
      v-if="isFinishedProfile === 0"
      class="mx-4 my-4 p-4 flex items-center gap-2 text-sm text-red-800 bg-red-100 border border-red-300 rounded-md shadow-md"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-red-700"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9 4a1 1 0 102 0 1 1 0 00-2 0zm1-9a1 1 0 00-.993.883L9 6v4a1 1 0 001.993.117L11 10V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      <span>{{ t("profile_finished") }}</span>
    </p>
  </div>
  <!-- <template  v-if="isLoading">
  <Loader /> 
</template>-->
  <!-- Main Form Container -->
  <div
    class="p-6 mb-8 ml-3 max-w-4xl bg-white relative rounded-lg shadow-2xl overflow-y-auto"
  >
    <div class="px-6">
      <h3 class="text-3xl font-bold mb-8 text-gray-800">
        {{ t("company_update") }}
      </h3>
    </div>

    <div class="p-6">
      <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
        <!-- Company Logo Upload -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-1">{{ t("image") }}</label>
          <label
            for="mainImageInput"
            class="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 cursor-pointer transition duration-200"
          >
            {{ t("compnay_image") }}
          </label>
          <input
            id="mainImageInput"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="hidden"
          />
          <div v-if="companyLogoFile" class="mt-2">
            <img
              :src="companyLogoFile"
              alt="Company Logo Preview"
              class="rounded border border-gray-300 w-14 h-14 object-cover"
            />
          </div>
          <p v-if="errors.logo" class="text-red-500 text-sm mt-1">
            {{ errors.logo }}
          </p>
        </div>

        <!-- Company Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            t("compnay_name")
          }}</label>
          <input
            v-model="companyName"
            type="text"
            placeholder="Enter company name"
            class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors.companyName" class="text-red-500 text-sm mt-1">
            {{ errors.companyName }}
          </p>
        </div>

        <!-- Company Email -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            t("compnay_email")
          }}</label>
          <input
            v-model="companyEmail"
            type="email"
            placeholder="company@example.com"
            class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors.companyEmail" class="text-red-500 text-sm mt-1">
            {{ errors.companyEmail }}
          </p>
        </div>

        <!-- Company Address -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            t("compnay_address")
          }}</label>
          <input
            v-model="companyAddress"
            type="text"
            placeholder="Enter company address"
            class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors.companyAddress" class="text-red-500 text-sm mt-1">
            {{ errors.companyAddress }}
          </p>
        </div>

        <!-- Country, City, Post Number -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <!-- Country -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
              t("country")
            }}</label>
            <select
              v-model="selectedCountry"
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option disabled value="">{{ t("select_country") }}</option>
              <option
                v-for="country in countries"
                :key="country.id"
                :value="country.id"
              >
                {{ country.name }}
              </option>
            </select>
            <p v-if="errors.selectedCountry" class="text-red-500 text-sm mt-1">
              {{ errors.selectedCountry }}
            </p>
          </div>

          <!-- City -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
              t("city")
            }}</label>
            <select
              v-model="selectedCity"
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option disabled value="">{{ t("select_city") }}</option>
              <option
                v-for="city in filteredCities"
                :key="city.id"
                :value="city.id"
              >
                {{ city.name }}
              </option>
            </select>
            <p v-if="errors.selectedCity" class="text-red-500 text-sm mt-1">
              {{ errors.selectedCity }}
            </p>
          </div>

          <!-- Post Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
              t("compnay_post_number")
            }}</label>
            <input
              v-model="companyPost"
              type="text"
              placeholder="Enter post number"
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p v-if="errors.companyPost" class="text-red-500 text-sm mt-1">
              {{ errors.companyPost }}
            </p>
          </div>
        </div>

        <!-- Phone Number -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            t("company_phone_number")
          }}</label>
          <div class="flex gap-2">
            <input
              :value="`+${phoneCode}`"
              type="text"
              disabled
              class="w-1/4 px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-600"
            />
            <input
              v-model="phoneNumber"
              @input="validatePhoneNumber"
              type="text"
              placeholder="Enter phone number"
              class="w-3/4 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p v-if="errors.phoneNumber" class="text-red-500 text-sm mt-1">
            {{ errors.phoneNumber }}
          </p>
        </div>

        <!-- Tax and Register Number -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
              t("compnay_tax_number")
            }}</label>
            <input
              v-model="companyTaxNumber"
              type="text"
              placeholder="Enter tax number"
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p v-if="errors.companyTaxNumber" class="text-red-500 text-sm mt-1">
              {{ errors.companyTaxNumber }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
              t("compnay_register_number")
            }}</label>
            <input
              v-model="companyRegisterNumber"
              type="text"
              placeholder="Enter register number"
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p
              v-if="errors.companyRegisterNumber"
              class="text-red-500 text-sm mt-1"
            >
              {{ errors.companyRegisterNumber }}
            </p>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="text-right mt-6">
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            {{ t("update") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { validateCompanyForm } from "@/js/form-validation/company/company-update";
import Alert from "@/components/shared/Alert.vue";
// import Loader from "@/components/shared/Loader.vue";
import ButtonBack from "@/components/shared/ButtonBack.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// Fields
const companyName = ref("");
const companyEmail = ref("");
const companyAddress = ref("");
const companyTaxNumber = ref("");
const companyRegisterNumber = ref("");
const companyLogoFile = ref(null);
const logo = ref(null);
const companyPost = ref("");
const countries = ref([]);
const selectedCountry = ref("");
const cities = ref([]);
const selectedCity = ref("");
// for phone number
const phoneCode = ref("");
const phoneNumber = ref("");

// for alert
const showAlert = ref(false);
const alertType = ref(["success", "info"]); // or 'error'
const alertMessage = ref("");

const originalValues = ref({});
const isFinishedProfile = ref("");
console.log(isFinishedProfile);
// Error handling
const errors = reactive({
  logo: "",
  companyName: "",
  companyEmail: "",
  companyAddress: "",
  companyTaxNumber: "",
  companyRegisterNumber: "",
  selectedCountry: "",
  selectedCity: "",
  companyPost: "",
  phoneNumber: "",
});

const router = useRouter();

const isLoading = ref(true);

// Static data (replace with API calls as needed)
onMounted(async () => {
  isLoading.value = true;
  await fetchCountry();
  await fetchCompany();

  const userIsFinished = localStorage.getItem("is_finished_profile");
  if (userIsFinished) {
    isFinishedProfile.value = Number(userIsFinished); // konvertuj u broj za svaki slučaj
  }
});

// Filter cities based on selected country
const filteredCities = computed(() =>
  cities.value.filter((city) => city.country_id === selectedCountry.value)
);

const validatePhoneNumber = () => {
  // Remove only speciale character
  phoneNumber.value = phoneNumber.value.replace(/\D/g, "");

  // Ograniči dužinu na 10 cifara
  if (phoneNumber.value.length > 10) {
    phoneNumber.value = phoneNumber.value.slice(0, 10);
  }
};

const fields = {
  companyName,
  companyEmail,
  companyAddress,
  companyTaxNumber,
  companyRegisterNumber,
  selectedCountry,
  selectedCity,
  companyPost,
  phoneNumber,
};

Object.entries(fields).forEach(([key, refVar]) => {
  watch(refVar, () => {
    if (errors[key]) errors[key] = "";
  });
});

watch(selectedCountry, (newVal) => {
  selectedCity.value = ""; // reset selected city
  fetchCity(newVal);
  fetchPhoneCode(newVal);
});

// Image handler
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.size <= 4 * 1024 * 1024) {
    companyLogoFile.value = URL.createObjectURL(file);
    logo.value = file;
  } else {
    errors.logo = "Image must be 4MB or less.";
    event.target.value = null;
    companyLogoFile.value = null;
  }
  console.log("andjica", typeof file);
};
// Fetch City
const fetchCity = (countryId) => {
  if (!countryId) return Promise.resolve();

  return fetch(`http://164.92.209.125:8000/api/cities/${countryId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch cities");
      }
      return res.json();
    })
    .then((data) => {
      cities.value = data.cities || [];
    })
    .catch((err) => {
      console.log("Errro throw fetching cities: ", err);
    });
};
// Fetch Country
const fetchCountry = () => {
  fetch("http://164.92.209.125:8000/api/countries", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Something is wrong!");
      }
      return res.json();
    })
    .then((data) => {
      // const eurCountries = data.countries.filter((country) => country.currency === "EUR");
      countries.value = data.countries;
      if (data.countries.length > 0) {
        selectedCountry.value = data.countries[0].id;
        fetchCity(data.countries[0].id);
      }
    })
    .catch((err) => {
      console.log("Errro throw fetching country: ", err);
    });
};
// fetch phone code in dependent on selected country
const fetchPhoneCode = (countryId) => {
  if (!countryId) return;
  fetch(`http://164.92.209.125:8000/api/country/${countryId}/phone-code`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch phone code");
      return res.json();
    })
    .then((data) => {
      phoneCode.value = data.phoneCode;
    })
    .catch((err) => {
      console.log("Phone code fetch error:", err);
    });
};

// To check if there is change in values
const hasChange = () => {
  return (
    companyName.value !== originalValues.value.companyName ||
    companyEmail.value !== originalValues.value.companyEmail ||
    companyAddress.value !== originalValues.value.companyAddress ||
    companyTaxNumber.value !== originalValues.value.companyTaxNumber ||
    companyRegisterNumber.value !==
      originalValues.value.companyRegisterNumber ||
    selectedCountry.value !== originalValues.value.selectedCountry ||
    selectedCity.value !== originalValues.value.selectedCity ||
    phoneNumber.value !== originalValues.value.phoneNumber ||
    companyPost.value !== originalValues.value.companyPost ||
    (logo.value && logo.value instanceof File) // ako se uploaduje novi logo
  );
};

// Form submit handler
const handleSubmit = () => {
  const token = localStorage.getItem("token");

  const formValues = {
    companyName: companyName.value,
    companyEmail: companyEmail.value,
    companyAddress: companyAddress.value,
    companyTaxNumber: companyTaxNumber.value,
    companyRegisterNumber: companyRegisterNumber.value,
    selectedCountry: selectedCountry.value,
    selectedCity: selectedCity.value,
    phoneNumber: phoneNumber.value,
    companyPost: companyPost.value,
  };

  const { isValid, errors: validationErrors } = validateCompanyForm(formValues);

  // Clear old errors and assign new ones
  for (const key in errors) errors[key] = "";
  Object.assign(errors, validationErrors);

  if (!isValid) return;

  const formData = new FormData();
  formData.append("name", companyName.value);
  formData.append("email", companyEmail.value);
  formData.append("address", companyAddress.value);
  formData.append("tax_number", companyTaxNumber.value);
  formData.append("registration_number", companyRegisterNumber.value);
  formData.append("country_id", selectedCountry.value);
  formData.append("city_id", selectedCity.value);
  formData.append("phone_code", phoneNumber.value);
  formData.append("postal_code", companyPost.value);
  formData.append("is_finished_profile", 1);

  if (logo.value) {
    formData.append("logo", logo.value);
  }

  fetch("http://164.92.209.125:8000/api/company/update", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok!");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Company response:", data);
      const userData = localStorage.getItem("user");
      let user = userData ? JSON.parse(userData) : {};
      isFinishedProfile.value = data.data.is_finished_profile;

      if (isFinishedProfile.value == true) {
        localStorage.setItem("is_finished_profile", 1);
      }

      localStorage.setItem("user", JSON.stringify(user));

      if (!hasChange()) {
        alertType.value = "info";
        alertMessage.value = t("no_change");
        showAlert.value = true;
        return;
      }

      alertType.value = "success";
      alertMessage.value = t("profile_s");
      showAlert.value = true;

      setTimeout(() => {
        window.location.href = "/company/dashboard";
      }, 2000);
    })
    .catch((error) => {
      console.error("Error submitting company data:", error);
      alertType.value = "error";
      alertMessage.value = t("profile_f");
      showAlert.value = true;
    });
};

const fetchCompany = () => {
  const token = localStorage.getItem("token");
  fetch("http://164.92.209.125:8000/api/company", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok!");
      }
      return response.json();
    })
    .then((data) => {
      const company = data.data;
      companyName.value = company.name || "";
      companyEmail.value = company.email || "";
      companyAddress.value = company.address || "";
      companyTaxNumber.value = company.tax_number || "";
      companyRegisterNumber.value = company.registration_number || "";
      selectedCountry.value = company.country_id || "";
      fetchCity(company.country_id).then(() => {
        const cityExists = cities.value.some((c) => c.id === company.city_id);
        selectedCity.value = cityExists ? company.city_id : "";
      });
      phoneNumber.value = company.phone_code || "";
      companyPost.value = company.postal_code || "";

      if (company.logo) {
        companyLogoFile.value = `http://164.92.209.125:8000/${company.logo}`;
      }

      originalValues.value = {
        companyName: company.name || "",
        companyEmail: company.email || "",
        companyAddress: company.address || "",
        companyTaxNumber: company.tax_number || "",
        companyRegisterNumber: company.registration_number || "",
        selectedCountry: company.country_id || "",
        selectedCity: company.city_id || "",
        phoneNumber: company.phone_code || "",
        companyPost: company.postal_code || "",
      };

      isLoading.value = false;
    })
    .catch((error) => {
      console.error("Error submitting company data:", error);
      // Eventualno možeš prikazati grešku korisniku
    });
};
</script>
