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
        :classWidth="'max-w-3xl'"
      />
    </div>
    <h1 class="text-3xl font-bold mb-8 text-gray-800">{{ $t('category_update') }}</h1>

    <form @submit.prevent="handleSubmit">
      <div class="mt-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >{{ $t('category_name_only') }}</label
        >
        <input
          v-model="categoryName"
          type="text"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          :placeholder="t('category_name_enter')"
        />
        <p v-if="errors.categoryName" class="text-sm text-red-600 mt-1">
          {{ errors.categoryName }}
        </p>
      </div>
      <button
        type="submit"
        class="bg-blue-600 text-white mt-2 px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        {{t('save')}}
      </button>
    </form>
  </div>
</template>

<script setup>
import Alert from "@/components/shared/Alert.vue";
import ButtonBack from "@/components/shared/ButtonBack.vue";
import { get, put } from "@/js/helper/api";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const router = useRouter();
const route = useRoute();
const categoryId = route.params.id;

const categoryName = ref("");
const originalCategoryName = ref("");
const errors = ref("");
// Success message
const showAlert = ref(false);
const alertType = ref(["success", "info"]); // or 'error'
const alertMessage = ref("");

const fetchCategory = async () => {
  try {
    const response = await get(`category/${categoryId}`);
    categoryName.value = response.category.name;
    originalCategoryName.value = response.category.name;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchCategory();
});

const handleSubmit = async () => {
  errors.value = {};

  if (!categoryName.value.trim()) {
    errors.value.categoryName = t('category_required');
    return;
  }

  if (categoryName.value.trim().length < 6) {
    errors.value.categoryName =
      t('category_name_min');
    return;
  }

  if (categoryName.value.trim() === originalCategoryName.value.trim()) {
    alertMessage.value = t('category_no_change');
    alertType.value = "info";
    showAlert.value = true;
    return;
  }

  try {
    await put(`category/${categoryId}`, {
      name: categoryName.value,
    });

    // Optionally show success alert
    showAlert.value = true;
    alertType.value = "success";
    alertMessage.value = t('category_update_success');

    // Redirect or reset form
    categoryName.value = "";
    setTimeout(() => router.push("/admin/categories"), 1500);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      showAlert.value = true;
      alertType.value = "error";
      alertMessage.value = t('category_update_failed');
      console.error(error);
    }
  }
};
</script>
