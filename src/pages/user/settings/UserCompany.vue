<template>
  <Loader v-if="isLoading" />
  <Alert
    v-if="showAlert"
    :type="alertType"
    :message="alertMessage"
    @close="showAlert = false"
  />
  <div
    class="p-6 mt-8 mb-8 ml-3 max-w-4xl bg-white rounded-lg shadow-md"
  >
    <h1 class="text-2xl font-bold mb-6">User Profile</h1>
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <!-- User Profile -->
      <!-- <div class="mb-4">
        <label class="block text-sm font-medium mb-1">User Profile</label>
        <input
          @change="handleImageUpload"
          type="file"
          accept="image/*"
          class="w-full"
        />
        <div v-if="userProfile.profileImage" class="mt-2">
          <img
            v-if="userProfile.profileImage"
            :src="userProfile.profileImage"
            alt="Company Logo Preview"
            class="rounded border border-gray-300"
            style="width: 50px; height: 50px; object-fit: cover"
          />
        </div>
        <p v-if="errors.profileImage" class="text-red-500 text-sm mt-1">
          {{ errors.profileImage }}
        </p>
      </div> -->
      <!-- User Name -->
      <div class="flex flex-wrap -mx-2 mb-4">
        <div class="w-full md:w-1/3 px-2">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >First Name</label
          >
          <input
            v-model="userProfile.userFirstName"
            type="text"
            placeholder="Enter first name"
            disabled
            class="w-full px-4 py-2 bg-gray-300 rounded-md border border-gray-300 cursor-no-drop"
          />
          <p v-if="errors.userFirstName" class="text-red-500 text-sm mt-1">
            {{ errors.userFirstName }}
          </p>
        </div>
        <div class="w-full md:w-1/3 px-2">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Last Name</label
          >
          <input
            v-model="userProfile.userLastName"
            type="text"
            disabled
            placeholder="Enter last name"
            class="w-full px-4 py-2 bg-gray-300 rounded-md border border-gray-300 cursor-no-drop"
          />
          <p v-if="errors.userLastName" class="text-red-500 text-sm mt-1">
            {{ errors.userLastName }}
          </p>
        </div>
      </div>

      <!-- Company Email -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Email</label
        >
        <input
          v-model="userProfile.userEmail"
          type="email"
          disabled
          placeholder="user@example.com"
          class="w-full px-4 py-2 bg-gray-300 rounded-md border border-gray-300 cursor-no-drop"
        />
        <p v-if="errors.userEmail" class="text-red-500 text-sm mt-1">
          {{ errors.userEmail }}
        </p>
      </div>
      <!-- User Address -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Address</label
        >
        <input
          v-model="userProfile.userAddress"
          type="text"
          placeholder="Enter your address"
          class="w-full px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
        />
        <p v-if="errors.userAddress" class="text-red-500 text-sm mt-1">
          {{ errors.userAddress }}
        </p>
      </div>
      <div class="flex flex-wrap -mx-2 mb-4">
        <div class="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Country</label
          >
          <select
            v-model="selectedCountry"
            class="w-full px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
          >
            <option disabled value="">Select country</option>
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
        <div class="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >City</label
          >
          <select
            v-model="selectedCity"
            class="w-full px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
          >
            <option disabled value="">Select city</option>
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
        <div class="w-full md:w-1/3 px-2">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Post Number</label
          >
          <input
            v-model="userProfile.zipCode"
            type="text"
            placeholder="Enter post number"
            class="w-full px-4 py-2 bg-gray-100 rounded-md border border-gray-300"
          />
          <p v-if="errors.zipCode" class="text-red-500 text-sm mt-1">
            {{ errors.zipCode }}
          </p>
        </div>
      </div>
      <!-- Phone Number -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Phone Number</label
        >
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
        <p v-if="errors.phoneNumber" class="text-red-500 text-sm mt-1">
          {{ errors.phoneNumber }}
        </p>
      </div>
      <div class="text-right">
        <button
          type="submit"
          class="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 cursor-pointer"
        >
          Update
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted, computed } from "vue";
import Alert from "@/components/shared/Alert.vue";
import Loader from "@/components/shared/Loader.vue";
import { validateUserForm } from "@/helper/form-validation/user/proflle-update";

// za alert
const showAlert = ref(false);
const alertType = ref("success"); // ili 'error'
const alertMessage = ref("");

const userProfile = reactive({
  //   profileImage: null,
  //   _profileImageFile: null,
  userFirstName: "",
  userLastName: "",
  userEmail: "",
  userAddress: "",
  zipCode: "",
});

const selectedCountry = ref("");
const selectedCity = ref("");

const countries = ref([]);
const cities = ref([]);

const phoneCode = ref("");
const phoneNumber = ref("");

const isLoading = ref(true);

const errors = reactive({
  //   image: "",
  userFirstName: "",
  userLastName: "",
  userEmail: "",
  userImage: null,
  userAddress: "",
  phoneNumber: "",
  zipCode: "",
});




watch(selectedCountry, (newVal) => {
  selectedCity.value = ""; // reset selected city
  fetchCity(newVal);
  fetchPhoneCode(newVal);
});

// const handleImageUpload = (event) => {
//   const file = event.target.files[0];
//   if (file && file.size <= 4 * 1024 * 1024) {
//     userProfile.profileImage = URL.createObjectURL(file);
//     userProfile._profileImageFile = file;
//   } else {
//     errors.image = "Image must be 4MB or less.";
//     userProfile.profileImage = null;
//   }
// };

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
      //   selectedCity.value = "";
    })
    .catch((err) => console.error("Error fetching cities:", err));
};

const fetchCountry = () => {
  return fetch("http://localhost:8000/api/countries", {
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
      console.log("Countries: ", data);
      countries.value = data.countries;
      if (data.countries.length > 0) {
        selectedCountry.value = data.countries[0].id;
        fetchCity(data.countries[0].id);
      }
    })
    .catch((err) => console.error("Error fetching countries:", err));
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

watch(
  () => userProfile.selectedCountry,
  (newVal) => {
    fetchCity(newVal);
  }
);

onMounted(async () => {
  isLoading.value = true;
  await fetchCountry();
  await fetchUser();

  const userIsFinished = localStorage.getItem("is_finished_profile");
  if (userIsFinished) {
    isFinishedProfile.value = Number(userIsFinished); // konvertuj u broj za svaki slučaj
  }
  
  isLoading.value = false;
});

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

Object.keys(errors).forEach((key) => {
  watch(
    () => userProfile[key],
    () => {
      if (errors[key]) errors[key] = "";
    }
  );
});

const handleSubmit = () => {
  const token = localStorage.getItem("token");

  const { isValid, errors: validationErrors } = validateUserForm({
    // userImage: userProfile._profileImageFile,
    userFirstName: userProfile.userFirstName,
    userLastName: userProfile.userLastName,
    userEmail: userProfile.userEmail,
    userAddress: userProfile.userAddress,
    selectedCountry: selectedCountry.value,
    selectedCity: selectedCity.value,
    zipCode: userProfile.zipCode,
    phoneNumber: phoneNumber.value, // ako imaš
  });

  // Reset i primena error-a
  Object.keys(errors).forEach((key) => (errors[key] = ""));
  Object.assign(errors, validationErrors);

  if (!isValid) return;

  const formData = new FormData();
  formData.append("name", userProfile.userFirstName + userProfile.userLastName);
  formData.append("email", userProfile.userEmail);
  formData.append("address", userProfile.userAddress);
  formData.append("country_id", selectedCountry.value);
  formData.append("city_id", selectedCity.value);
  formData.append("phone", phoneNumber.value);
  formData.append("zip_code", userProfile.zipCode);
  formData.append("is_finished_profile", 1);

  //   if(userProfile._profileImageFile){
  //     formData.append("image",userProfile._profileImageFile);
  //   }

  fetch("http://localhost:8000/api/user-info", {
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
      console.log("User update data: ", data);
      alertType.value = "success";
      alertMessage.value = "User profile update successfully!";
    })
    .catch((error) => {
      console.error("Error submitting user data:", error);
      alertType.value = "error";
      alertMessage.value = "Failed to update user profile.";
      showAlert.value = true;
    });

  localStorage.setItem("userProfile", JSON.stringify(formData));
  alertMessage.value = "Profile successfully saved!";
  alertType.value = "success";
  showAlert.value = true;
};

const fetchUser = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("Iz local storage", user);
  return fetch("http://localhost:8000/api/user-info", {
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
      const userData = data.data;
      console.log("Fetch user: ", userData);
      // userProfile._profileImageFile,
      userProfile.userFirstName = userData.first_name || user.first_name || "";
      userProfile.userLastName = userData.last_name || user.last_name || "";
      userProfile.userEmail = userData.email || user.email || "";
      userProfile.userAddress = userData.address || "";
      selectedCountry.value = userData.country_id || "";
      fetchCity(userData.country_id).then(() => {
        const cityExists = cities.value.some((c) => c.id === userData.city_id);
        selectedCity.value = cityExists ? userData.city_id : "";
      });
      (userProfile.zipCode = userData.zip_code),
        (phoneNumber.value = userData.phone);
    })
    .catch((error) => {
      console.error("Error submitting company data:", error);
      // Eventualno možeš prikazati grešku korisniku
    });
};
</script>
