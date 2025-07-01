<template>
  <ButtonBack />
  <div
    class="p-6 mt-8 mb-8 ml-3 max-w-3xl bg-white rounded-lg shadow-2xl relative"
  >
    <Alert
      v-if="showAlert"
      :type="alertType"
      :message="alertMessage"
      @close="showAlert = false"
    />
    <h1 class="text-3xl font-bold mb-8 text-gray-800">Create a New Auction</h1>

    <form @submit.prevent="handleSubmit">
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
import { ref } from "vue";

// Form state
const form = ref({
  auctionName: "",
  auctionDescription: "",
  auctionPrice: "",
  auctionDate: "",
});

// Validation errors
const errors = ref({});

// Success message
const showAlert = ref(false);
const alertType = ref(["success", "info"]); // or 'error'
const alertMessage = ref("");

// Submit handler
const handleSubmit = () => {
  const { isValid, errors: validationErrors } = validationAuctionForm(form.value);
  errors.value = validationErrors;

  if (isValid) {
    let auctions = JSON.parse(localStorage.getItem("auctions"));

    // Proveri da li je auctions niz, ako nije inicijalizuj
    if (!Array.isArray(auctions)) {
      auctions = [];
    }

    auctions.push(form.value);

    localStorage.setItem("auctions", JSON.stringify(auctions));

    alertType.value = "success";
    alertMessage.value = "Auction created successfully!";
    showAlert.value = true;

    form.value = {
      auctionName: "",
      auctionDescription: "",
      auctionPrice: "",
      auctionDate: "",
    };

    errors.value = {};
  } else {
    alertType.value = "error";
    alertMessage.value = "Complete the form correctly!";
    showAlert.value = true;
  }
};

</script>
