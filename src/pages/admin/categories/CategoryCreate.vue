<template>
  <ButtonBack />
  <div
    class="p-6 mt-8 mb-8 ml-3 max-w-3xl bg-white rounded-lg shadow-2xl relative"
  >
    <div class="relative">
      <Alert
        v-if="showAlert"
        :type="alertType"
        :message="alertMessage"
        @close="showAlert = false"
      />
    </div>
    <h1 class="text-3xl font-bold mb-8 text-gray-800">Create a new category</h1>

    <form @submit.prevent="handleSubmit">
      <div class="mt-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Category Name</label
        >
        <input
          v-model="categoryName"
          type="text"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter category name"
        />
        <p v-if="errors.categoryName" class="text-sm text-red-600 mt-1">
          {{ errors.categoryName }}
        </p>
      </div>
      <button
        type="submit"
        class="bg-blue-600 text-white mt-2 px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        Create
      </button>
    </form>
  </div>
</template>

<script setup>
import Alert from "@/components/shared/Alert.vue";
import ButtonBack from "@/components/shared/ButtonBack.vue";
import { post } from "@/js/helper/api";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const categoryName = ref("");
const errors = ref("");
// Success message
const showAlert = ref(false);
const alertType = ref(["success", "info"]); // or 'error'
const alertMessage = ref("");

const handleSubmit = async () => {
  errors.value = {};

  if (!categoryName.value.trim()) {
    errors.value.categoryName = "Category name is required.";
    return;
  }

  if (categoryName.value.trim().length < 6) {
    errors.value.categoryName =
      "Category name must be at least 6 characters long.";
    return;
  }

  try {
    await post("category", {
      name: categoryName.value,
    });

    
    // Optionally show success alert
    showAlert.value = true;
    alertType.value = "success";
    alertMessage.value = "✅ Category created successfully!";

    // Redirect or reset form
    categoryName.value = "";
    setTimeout(() => router.push("/admin/categories"), 1500);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      showAlert.value = true;
      alertType.value = "error";
      alertMessage.value = "❌ Failed to create category.";
      console.error(error);
    }
  }
};
</script>
