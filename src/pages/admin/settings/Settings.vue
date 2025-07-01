<template>
  <ButtonBack />
  <div class="p-6 mb-8 ml-3 max-w-4xl bg-white rounded-lg shadow-2xl overflow-y-auto relative">
    <Alert v-if="showAlert" :type="alertType" :message="alertMessage" @close="showAlert = false" />
    <Loader v-if="isLoading" />
    <template v-else>
      <p v-if="isFinishedProfile !== 1"
        class="mt-4 p-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg shadow-sm">
        ⚠️ You must finish settings before you have access to other pages!
      </p>

      <h3 class="text-3xl font-bold mb-8 text-gray-800">🏢 Update Company</h3>
      <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
        <!-- Company Logo -->
        <div class="mt-4">
          <label class="block text-sm font-medium mb-1">Image</label>
          <label for="mainImageInput"
            class="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 cursor-pointer transition duration-200">
            Upload Company Image
          </label>

          <!-- Hidden file input -->
          <input id="mainImageInput" type="file" accept="image/*" @change="handleImageUpload" class="hidden" />
          <div v-if="companyLogoFile" class="mt-2">
            <img v-if="companyLogoFile" :src="companyLogoFile" alt="Company Logo Preview"
              class="rounded border border-gray-300" style="width: 50px; height: 50px; object-fit: cover" />
          </div>
          <p v-if="errors.productMainImage" class="text-red-500 text-sm mt-1">
            {{ errors.productMainImage }}
          </p>
        </div>

        <!-- Company Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input v-model="companyName" type="text" placeholder="Enter company name"
            class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p v-if="errors.companyName" class="text-red-500 text-sm mt-1">
            {{ errors.companyName }}
          </p>
        </div>

        <!-- Company Email -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Email</label>
          <input v-model="companyEmail" type="email" placeholder="company@example.com"
            class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p v-if="errors.companyEmail" class="text-red-500 text-sm mt-1">
            {{ errors.companyEmail }}
          </p>
        </div>

        <!-- Company Address -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
          <input v-model="companyAddress" type="text" placeholder="Enter company address"
            class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p v-if="errors.companyAddress" class="text-red-500 text-sm mt-1">
            {{ errors.companyAddress }}
          </p>
        </div>

        <!-- Country / City / Post Number -->
        <div class="flex flex-wrap -mx-2 mb-4">
          <div class="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select v-model="selectedCountry" class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option disabled value="">Select country</option>
              <option v-for="country in countries" :key="country.id" :value="country.id">
                {{ country.name }}
              </option>
            </select>
            <p v-if="errors.selectedCountry" class="text-red-500 text-sm mt-1">
              {{ errors.selectedCountry }}
            </p>
          </div>
          <div class="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select v-model="selectedCity" class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option disabled value="">Select city</option>
              <option v-for="city in filteredCities" :key="city.id" :value="city.id">
                {{ city.name }}
              </option>
            </select>
            <p v-if="errors.selectedCity" class="text-red-500 text-sm mt-1">
              {{ errors.selectedCity }}
            </p>
          </div>
          <div class="w-full md:w-1/3 px-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Post Number</label>
            <input v-model="companyPost" type="text" placeholder="Enter post number"
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p v-if="errors.companyPost" class="text-red-500 text-sm mt-1">
              {{ errors.companyPost }}
            </p>
          </div>
        </div>

        <!-- Phone Number -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div class="flex gap-2">
            <input :value="`+${phoneCode}`" type="text" disabled
              class="w-1/4 px-4 py-2 bg-gray-200 rounded-md border border-gray-300 text-gray-600" />
            <input v-model="phoneNumber" @input="validatePhoneNumber" type="text" placeholder="Enter phone number"
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <p v-if="errors.phoneNumber" class="text-red-500 text-sm mt-1">
            {{ errors.phoneNumber }}
          </p>
        </div>

        <!-- Tax and Register Number -->
        <div class="flex flex-wrap -mx-2">
          <div class="w-full md:w-1/2 px-2 mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tax Number</label>
            <input v-model="companyTaxNumber" type="text" placeholder="Enter tax number"
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p v-if="errors.companyTaxNumber" class="text-red-500 text-sm mt-1">
              {{ errors.companyTaxNumber }}
            </p>
          </div>
          <div class="w-full md:w-1/2 px-2 mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Register Number</label>
            <input v-model="companyRegisterNumber" type="text" placeholder="Enter register number"
              class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p v-if="errors.companyRegisterNumber" class="text-red-500 text-sm mt-1">
              {{ errors.companyRegisterNumber }}
            </p>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="text-right">
          <button type="submit"
            class="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 cursor-pointer">
            <LoaderIcon v-if="isLoading" />
            <span v-else>Update</span>
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup>
import Alert from "@/components/shared/Alert.vue";
import ButtonBack from "@/components/shared/ButtonBack.vue";
import Loader from "@/components/shared/Loader.vue";
import { validateCompanyForm } from "@/js/form-validation/company/company-update";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

// Router
const router = useRouter();

// Form polja
const companyName = ref("");
const companyEmail = ref("");
const companyAddress = ref("");
const companyTaxNumber = ref("");
const companyRegisterNumber = ref("");
const companyLogoFile = ref(null);
const logo = ref(null);
const companyPost = ref("");
const phoneCode = ref("");
const phoneNumber = ref("");

const countries = ref([]);
const selectedCountry = ref("");
const cities = ref([]);
const selectedCity = ref("");

const isFinishedProfile = ref(0);

// Loader i alert
const isLoading = ref(true);
const showAlert = ref(false);
const alertType = ref("success"); // success, info, error
const alertMessage = ref("");

// Errors
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

// Originalne vrednosti za proveru promena
const originalValues = ref({});

// === Computed ===
const filteredCities = computed(() =>
  cities.value.filter((city) => city.country_id === selectedCountry.value)
);

// === Watcheri ===
watch(selectedCountry, async (newVal) => {
  selectedCity.value = "";
  await fetchCity(newVal);
  await fetchPhoneCode(newVal);
});

// Briši error kad korisnik počne da kuca
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

// === Image Upload ===
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
};

// === Phone Number Validation ===
const validatePhoneNumber = () => {
  phoneNumber.value = phoneNumber.value.replace(/\D/g, "");
  if (phoneNumber.value.length > 10) {
    phoneNumber.value = phoneNumber.value.slice(0, 10);
  }
};

// === Fetch Functions ===
const fetchCountry = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/countries");
    if (!res.ok) throw new Error("Failed to fetch countries");
    const data = await res.json();

    countries.value = data.countries;
    if (data.countries.length > 0) {
      selectedCountry.value = data.countries[0].id;
      await fetchCity(data.countries[0].id);
      await fetchPhoneCode(data.countries[0].id);
    }
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
};

const fetchCity = async (countryId) => {
  if (!countryId) return;
  try {
    const res = await fetch(`http://localhost:8000/api/cities/${countryId}`);
    if (!res.ok) throw new Error("Failed to fetch cities");
    const data = await res.json();
    cities.value = data.cities || [];
  } catch (error) {
    console.error("Error fetching cities:", error);
  }
};

const fetchPhoneCode = async (countryId) => {
  if (!countryId) return;
  try {
    const res = await fetch(`http://localhost:8000/api/country/${countryId}/phone-code`);
    if (!res.ok) throw new Error("Failed to fetch phone code");
    const data = await res.json();
    phoneCode.value = data.phoneCode;
  } catch (error) {
    console.error("Phone code fetch error:", error);
  }
};

const fetchCompany = async () => {
  isLoading.value = true;
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:8000/api/company", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch company data");
    const data = await res.json();
    const company = data.data;

    companyName.value = company.name || "";
    companyEmail.value = company.email || "";
    companyAddress.value = company.address || "";
    companyTaxNumber.value = company.tax_number || "";
    companyRegisterNumber.value = company.registration_number || "";
    selectedCountry.value = company.country_id || "";
    phoneNumber.value = company.phone_code || "";
    companyPost.value = company.postal_code || "";

    await fetchCity(company.country_id);
    const cityExists = cities.value.some((c) => c.id === company.city_id);
    selectedCity.value = cityExists ? company.city_id : "";

    if (company.logo) {
      companyLogoFile.value = `http://localhost:8000/${company.logo}`;
    }

    // Sačuvaj originalne vrednosti
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
  } catch (error) {
    console.error("Error fetching company data:", error);
  } finally {
    isLoading.value = false;
  }
};

// === Check Changes ===
const hasChange = () => {
  return (
    companyName.value !== originalValues.value.companyName ||
    companyEmail.value !== originalValues.value.companyEmail ||
    companyAddress.value !== originalValues.value.companyAddress ||
    companyTaxNumber.value !== originalValues.value.companyTaxNumber ||
    companyRegisterNumber.value !== originalValues.value.companyRegisterNumber ||
    selectedCountry.value !== originalValues.value.selectedCountry ||
    selectedCity.value !== originalValues.value.selectedCity ||
    phoneNumber.value !== originalValues.value.phoneNumber ||
    companyPost.value !== originalValues.value.companyPost ||
    (logo.value && logo.value instanceof File)
  );
};

// === Submit ===
const handleSubmit = async () => {
  const token = localStorage.getItem("token");

  const formValues = {
    companyName: companyName.value,
    companyEmail: companyEmail.value,
    companyAddress: companyAddress.value,
    companyTaxNumber: companyTaxNumber.value,
    companyRegisterNumber: companyRegisterNumber.value,
    selectedCountry: selectedCountry.value,
    selectedCity: selectedCity.value,
    companyPost: companyPost.value,
    phoneNumber: phoneNumber.value,
  };

  const { isValid, errors: validationErrors } = validateCompanyForm(formValues);

  Object.keys(errors).forEach((key) => (errors[key] = ""));
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

  try {
    const res = await fetch("http://localhost:8000/api/company/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to update company profile");
    await res.json();

    localStorage.setItem("is_finished_profile", "1");
    isFinishedProfile.value = 1;

    if (!hasChange()) {
      alertType.value = "info";
      alertMessage.value = "No changes detected.";
      showAlert.value = true;
      return;
    }

    alertType.value = "success";
    alertMessage.value = "Company profile updated successfully!";
    showAlert.value = true;

  } catch (error) {
    console.error("Error updating company profile:", error);
    alertType.value = "error";
    alertMessage.value = "Failed to update company profile.";
    showAlert.value = true;
  }
};

// === onMounted ===
onMounted(async () => {
  isLoading.value = true;
  try {
    await fetchCountry();
    await fetchCompany();
    const userIsFinished = localStorage.getItem("is_finished_profile");
    if (userIsFinished) {
      isFinishedProfile.value = Number(userIsFinished);
    }
  } catch (error) {
    console.error("Error while loading:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>
