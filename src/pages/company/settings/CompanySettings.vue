<template>
  <div class="p-6 mt-8 mb-8 ml-3 max-w-4xl bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-6 ">Settings Company</h1>
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <!-- Company Logo -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Company Logo</label>
        <input
          @change="handleImageUpload"
          type="file"
          accept="image/*"
          class="w-full"
        />
        <div v-if="companyLogoFile" class="mt-2">
          <img
            v-if="companyLogoFile"
            :src="companyLogoFile"
            alt="Company Logo Preview"
            class="rounded border border-gray-300"
            style="width: 50px; height: 50px; object-fit: cover"
          />
        </div>
        <p v-if="errors.logo" class="text-red-500 text-sm mt-1">
          {{ errors.logo }}
        </p>
      </div>

      <!-- Company Name -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
        <input
          v-model="companyName"
          type="text"
          placeholder="Enter company name"
          class="w-full px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
        />
        <p v-if="errors.companyName" class="text-red-500 text-sm mt-1">{{ errors.companyName }}</p>
      </div>

      <!-- Company Email -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Company Email</label>
        <input
          v-model="companyEmail"
          type="email"
          placeholder="company@example.com"
          class="w-full px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
        />
        <p v-if="errors.companyEmail" class="text-red-500 text-sm mt-1">{{ errors.companyEmail }}</p>
      </div>

      <!-- Company Address -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
        <input
          v-model="companyAddress"
          type="text"
          placeholder="Enter company address"
          class="w-full px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
        />
        <p v-if="errors.companyAddress" class="text-red-500 text-sm mt-1">{{ errors.companyAddress }}</p>
      </div>

      <!-- Country / City / Post Number -->
      <div class="flex flex-wrap -mx-2 mb-4">
        <div class="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select
            v-model="selectedCountry"
            class="w-full px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
          >
            <option disabled value="">Select country</option>
            <option v-for="country in countries" :key="country.id" :value="country.id">
              {{ country.name }}
            </option>
          </select>
          <p v-if="errors.selectedCountry" class="text-red-500 text-sm mt-1">{{ errors.selectedCountry }}</p>
        </div>
        <div class="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
          <select
            v-model="selectedCity"
            class="w-full px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
          >
            <option disabled value="">Select city</option>
            <option v-for="city in filteredCities" :key="city.id" :value="city.id">
              {{ city.name }}
            </option>
          </select>
          <p v-if="errors.selectedCity" class="text-red-500 text-sm mt-1">{{ errors.selectedCity }}</p>
        </div>
        <div class="w-full md:w-1/3 px-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Post Number</label>
          <input
            v-model="companyPost"
            type="text"
            placeholder="Enter post number"
            class="w-full px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
          />
          <p v-if="errors.companyPost" class="text-red-500 text-sm mt-1">{{ errors.companyPost }}</p>
        </div>
      </div>

      <!-- Phone Number -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <div class="flex gap-2">
          <input
            :value="`+${phoneCode}`"
            type="text"
            disabled
            class="w-1/4 px-4 py-2 bg-gray-200 rounded-md border border-gray-300 text-gray-600"
          />
          <input
            v-model="phoneNumber"
            @input="validatePhoneNumber"
            type="text"
            placeholder="Enter phone number"
            class="w-3/4 px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
          />
        </div>
        <p v-if="errors.phoneNumber" class="text-red-500 text-sm mt-1">{{ errors.phoneNumber }}</p>
      </div>

      <!-- Tax and Register Number -->
      <div class="flex flex-wrap -mx-2">
        <div class="w-full md:w-1/2 px-2 mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tax Number</label>
          <input
            v-model="companyTaxNumber"
            type="text"
            placeholder="Enter tax number"
            class="w-full px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
          />
          <p v-if="errors.companyTaxNumber" class="text-red-500 text-sm mt-1">{{ errors.companyTaxNumber }}</p>
        </div>
        <div class="w-full md:w-1/2 px-2 mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Register Number</label>
          <input
            v-model="companyRegisterNumber"
            type="text"
            placeholder="Enter register number"
            class="w-full px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
          />
          <p v-if="errors.companyRegisterNumber" class="text-red-500 text-sm mt-1">{{ errors.companyRegisterNumber }}</p>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="text-right">
        <button
          type="submit"
          class="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Update
        </button>
      </div>
    </form>
  </div>
</template>


<script setup>
import { ref, computed, reactive, watch, onMounted } from "vue";
import { validateCompanyForm } from "@/helper/form-validation/company/company-update";

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
// za phone number
const phoneCode = ref("");
const phoneNumber = ref("");

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

// Static data (replace with API calls as needed)
onMounted(() => {
  fetchCountry();
  fetchCompany();
});

// Filter cities based on selected country
const filteredCities = computed(() =>
  cities.value.filter((city) => city.country_id === selectedCountry.value)
);

const validatePhoneNumber = () => {
  // Ukloni sve osim brojeva
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

  return fetch(`http://localhost:8000/api/cities/${countryId}`, {
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
  fetch("http://localhost:8000/api/countries", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((res) => {
      console.log("Responses ", res);
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
      console.log("GRESKA je: ", err);
    });
};
// fetch phone code in dependent on selected country
const fetchPhoneCode = (countryId) => {
  if (!countryId) return;
  fetch(`http://localhost:8000/api/country/${countryId}/phone-code`, {
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
console.log("logo.value:", logo.value);
console.log("instanceof File:", logo.value instanceof File);
  fetch("http://localhost:8000/api/company/update", {
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
      console.log("Server response:", data);
    })
    .catch((error) => {
      console.error("Error submitting company data:", error);
    });
};

const fetchCompany = () => {
  const token = localStorage.getItem("token");
  fetch("http://localhost:8000/api/company", {
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
      console.log("Company fetch:", data);
      const company = data.data;
      console.log("C:", company);
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
        companyLogoFile.value = `http://localhost:8000/${company.logo}`;
      }
    })
    .catch((error) => {
      console.error("Error submitting company data:", error);
      // Eventualno možeš prikazati grešku korisniku
    });
};
</script>
