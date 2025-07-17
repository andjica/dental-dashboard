<template>
  <ButtonBack />
  <Alert
      v-if="showAlert"
      :type="alertType"
      :message="alertMessage"
      @close="showAlert = false"
    />
  <div
    class="p-6 mt-8 mb-8 ml-3 max-w-3xl bg-white rounded-lg shadow-2xl relative"
  >
    <h1 class="text-3xl font-bold mb-8 text-gray-800">Create a New Auction</h1>

    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <!-- Auction main image -->
      <div class="mt-4">
        <label class="block text-sm font-medium mb-1">Main Image</label>
        <label
          for="mainImageInput"
          class="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 cursor-pointer transition duration-200"
        >
          Upload Image
        </label>

        <!-- Hidden file input -->
        <input
          id="mainImageInput"
          type="file"
          accept="image/*"
          @change="handleMainImageUpload"
          class="hidden"
        />
        <div v-if="mainImagePreview" class="mt-2">
          <img
            :src="mainImagePreview"
            alt="Preview"
            class="relative w-34 h-34 border rounded overflow-hidden shadow-sm"
          />
        </div>
        <p v-if="errors.auctionMainImage" class="text-red-500 text-sm mt-1">
          {{ errors.auctionMainImage }}
        </p>
      </div>
      <!-- Auction Name -->
      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1">Auction Name</label>
        <input
          v-model="form.auctionName"
          type="text"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter auction name"
        />
        <p v-if="errors.auctionName" class="text-red-600 text-sm mt-1">
          {{ errors.auctionName }}
        </p>
      </div>

      <!-- Auction Description -->
      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Auction Description</label
        >
        <textarea
          v-model="form.auctionDescription"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description"
        ></textarea>
        <p v-if="errors.auctionDescription" class="text-red-600 text-sm mt-1">
          {{ errors.auctionDescription }}
        </p>
      </div>

      <!-- Auction Price -->
      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1">Base Price (€)</label>
        <input
          v-model="form.auctionPrice"
          type="number"
          min="0"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter base price"
        />
        <p v-if="errors.auctionPrice" class="text-red-600 text-sm mt-1">
          {{ errors.auctionPrice }}
        </p>
      </div>

      <!-- Auction Date -->
      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1">Auction Date</label>
        <input
          v-model="form.auctionDate"
          type="datetime-local"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.auctionDate" class="text-red-600 text-sm mt-1">
          {{ errors.auctionDate }}
        </p>
      </div>
      <!-- Images -->
      <div>
        <label class="block text-sm font-medium mb-1">Product Gallery</label>
        <div>
          <label
            for="imageUpload"
            class="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded cursor-pointer transition duration-200"
          >
            Select Images
          </label>
          <input
            id="imageUpload"
            name="images[]"
            @change="handleImageUpload"
            type="file"
            multiple
            accept="image/*"
            class="hidden"
          />
        </div>
        <div class="flex flex-wrap gap-4 mt-4">
          <div
            v-for="(img, index) in imagePreviews"
            :key="index"
            class="relative w-24 h-24 border rounded overflow-hidden shadow-sm"
          >
            <img
              :src="img"
              alt="Selected Image"
              class="object-cover w-full h-full"
            />
            <!-- Dugme za uklanjanje -->
            <button
              @click.prevent="removeImage(index)"
              class="absolute top-1 right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow hover:bg-red-700 transition cursor-pointer"
              title="Remove"
            >
              ×
            </button>
          </div>
        </div>
        <div
          v-if="form.auctionImages"
          class="mt-2 text-sm text-gray-600"
        >
          {{ form.auctionImages.length }} image{{
            form.auctionImages.length > 1 ? "s" : ""
          }}
          selected
        </div>
        <p v-if="errors.auctionImages" class="text-red-500 text-sm mt-1">
          {{ errors.auctionImages }}
        </p>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        Save Auction
      </button>
    </form>
  </div>
</template>

<script setup>
import Alert from "@/components/shared/Alert.vue";
import ButtonBack from "@/components/shared/ButtonBack.vue";
import { validationAuctionForm } from "@/js/form-validation/auction/auction-create.js";
import { onBeforeUnmount, ref } from "vue";
import { post } from "@/js/helper/api.js";
import { useRouter } from "vue-router";

const router = useRouter();
// Form state
const form = ref({
  auctionMainImage: null,
  auctionName: "",
  auctionDescription: "",
  auctionPrice: "",
  auctionDate: "",
  auctionImages: []
});

const mainImagePreview = ref(null);
const imagePreviews = ref([]);
// Validation errors
const errors = ref({});

// Success message
const showAlert = ref(false);
const alertType = ref(["success", "info"]); // or 'error'
const alertMessage = ref("");

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    form.value.auctionImages.push(file);
    imagePreviews.value.push(URL.createObjectURL(file));
  });
};

const handleMainImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.auctionMainImage = file; // poveži sa formom

    // Kreiraj preview URL
    mainImagePreview.value = URL.createObjectURL(file);
  } else {
    mainImagePreview.value = null;
    form.value.auctionMainImage = "";
  }
};

const removeImage = (index) => {
  form.value.auctionImages.splice(index, 1);
  const url = imagePreviews.value.splice(index, 1)[0];
  URL.revokeObjectURL(url); // očisti memoriju
};

onBeforeUnmount(() => {
  imagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
  if (mainImagePreview.value) {
    URL.revokeObjectURL(mainImagePreview.value);
  }
});

// Submit handler
const handleSubmit = async () => {
  const { isValid, errors: validationErrors } = validationAuctionForm(form.value);
  errors.value = validationErrors;

  if (!isValid) return;

  const formData = new FormData();
  formData.append("name", form.value.auctionName);
  formData.append("description", form.value.auctionDescription);
  formData.append("base_price", form.value.auctionPrice);
  formData.append("auction_date", form.value.auctionDate);
  formData.append("image_main", form.value.auctionMainImage);

  // Pretpostavljam da su slike u form.value.auctionImages kao File objekti
  form.value.auctionImages.forEach((file) => {
    formData.append("images[]", file);
  });

  try {
    await post("auction", formData);

    alertType.value = "success";
    alertMessage.value = "Auction created successfully!";
    showAlert.value = true;

    form.value = {
      auctionName: "",
      auctionDescription: "",
      auctionPrice: "",
      auctionDate: "",
      auctionImages: [],
    };
    errors.value = {};
    sessionStorage.setItem('auctionCreatedMessage', alertMessage.value);
    router.push({ name: "user.auction.view" });
  } catch (err) {
    console.error("Error submitting auction:", err.message);

    alertType.value = "error";
    alertMessage.value = "Failed to create auction.";
    showAlert.value = true;
  }
};

</script>
