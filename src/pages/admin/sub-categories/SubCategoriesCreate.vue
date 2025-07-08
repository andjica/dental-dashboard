<template>
  <ButtonBack />
  <div class="p-6 mt-8 mb-8 ml-3 max-w-3xl bg-white rounded-lg shadow-2xl relative">
    <div class="relative">
      <Alert
        v-if="showAlert"
        :type="alertType"
        :message="alertMessage"
        @close="showAlert = false"
      />
    </div>

    <h1 class="text-3xl font-bold mb-8 text-gray-800">Create a new Sub-Category</h1>

    <form @submit.prevent="handleSubmit">
      <!-- Sub-category name -->
      <div class="mt-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1">
          Sub-Category Name
        </label>
        <input
          v-model="subCategoryName"
          type="text"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter sub-category name"
        />
        <p v-if="errors.subCategoryName" class="text-sm text-red-600 mt-1">
          {{ errors.subCategoryName }}
        </p>
      </div>

      <!-- Category dropdown -->
      <div class="mt-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1">
          Category
        </label>
        <select
          v-model="selectedCategory"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option disabled value="">Select a category</option>
          <option
            v-for="category in sortedCategories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <p v-if="errors.selectedCategory" class="text-sm text-red-600 mt-1">
          {{ errors.selectedCategory }}
        </p>
      </div>

      <button
        type="submit"
        class="bg-blue-600 text-white mt-4 px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        Create
      </button>
    </form>
  </div>
</template>

<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import Alert from "@/components/shared/Alert.vue";
import { get, post } from "@/js/helper/api";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
// Form values
const subCategoryName = ref("");
const selectedCategory = ref("");

// Category list
const categoryList = ref([]);
const isLoading = ref(true);

// Alert state
const showAlert = ref(false);
const alertType = ref("success");
const alertMessage = ref("");

// Error state
const errors = ref({});

// Sort categories by name (descending)
const sortedCategories = computed(() => {
  return [...categoryList.value].sort((a, b) => b.name.localeCompare(a.name));
});

// Fetch categories on mount
onMounted(async () => {
  await fetchCategories();
});

const fetchCategories = async () => {
  isLoading.value = true;
  try {
    const response = await get("categories");
    categoryList.value = response.data;
  } catch (err) {
    console.error("Error fetching categories:", err.message);
  } finally {
    isLoading.value = false;
  }
};

// Submit logic
const handleSubmit = async () => {
  errors.value = {};

  if (!subCategoryName.value.trim()) {
    errors.value.subCategoryName = "Sub-category name is required.";
  }

  if (!selectedCategory.value) {
    errors.value.selectedCategory = "Please select a category.";
  }

  if (Object.keys(errors.value).length > 0) return;

  try {
    await post("subcategories", {
      name: subCategoryName.value,
      category_id: selectedCategory.value,
    });

    // Reset
    subCategoryName.value = "";
    selectedCategory.value = "";

    setTimeout(() => router.push("/admin/sub-categories"), 1500);
    // Success alert
    showAlert.value = true;
    alertType.value = "success";
    alertMessage.value = "✅ Sub-category created successfully!";
  } catch (error) {
    showAlert.value = true;
    alertType.value = "error";
    alertMessage.value = "❌ Failed to create sub-category.";
    console.error(error);
  }
};
</script>
