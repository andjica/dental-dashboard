<template>
  <ButtonBack />
  <Loader v-if="isLoading" />
  <template v-else>
    <div v-if="categories.length === 0" class="px-4 mt-6 w-full">
      <div
        class="bg-red-100 border border-red-300 text-red-800 rounded-md shadow p-4 flex items-center gap-3"
      >
        <font-awesome-icon icon="exclamation-circle" class="text-red-600" />
        <span class="text-sm font-medium">
          ⚠️ You currently have no Categories. Please add some to get started.
        </span>
      </div>
    </div>
    <div v-else class="px-4 mt-6 max-w-6xl">
      <div class="bg-white shadow-md rounded-md overflow-x-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="relative">
            <Alert
              v-if="showAlert"
              :type="alertType"
              :message="alertMessage"
              @close="showAlert = false"
            />
          </div>
          <h3 class="text-lg font-semibold text-gray-800">
            📦 Categories - {{ categories.length }}
          </h3>
        </div>

        <div class="overflow-y-auto max-h-[580px] min-h-[550px]">
          <table class="min-w-full text-sm text-left divide-y divide-gray-200">
            <thead class="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th class="px-4 py-3">Id</th>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3 text-center">Number of Sub-Category</th>
                <th class="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-800">
              <tr
                v-for="category in paginatedAuctions"
                :key="category.id"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-4 py-3 font-medium">{{ category.id }}</td>
                <td class="px-4 py-3 font-medium">{{ category.name }}</td>
                <td class="px-4 py-3 font-medium text-center">
                  {{ category.subCategories }}
                </td>
                <td class="px-4 py-3 text-center space-x-3">
                  <button
                    @click="handleEditCategory(category)"
                    class="text-yellow-500 hover:text-yellow-600 cursor-pointer"
                    title="Edit Auction"
                  >
                    <font-awesome-icon icon="pen-to-square" />
                  </button>
                  <button
                    @click="deleteCategory(category)"
                    class="text-red-500 hover:text-red-700 cursor-pointer"
                    aria-label="Delete auction"
                    title="Delete Auction"
                  >
                    <font-awesome-icon icon="trash" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination
          :page="page"
          :totalPages="totalPages"
          @update:page="page = $event"
        />
      </div>
    </div>
  </template>
  <ActionDelete
    :showDeleteModal="showDeleteModal"
    :auctionToDelete="categoryToDelete"
    @close="showDeleteModal = false"
    @confirmDelete="confirmDelete"
  />
</template>

<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import Loader from "@/components/shared/Loader.vue";
import Alert from "@/components/shared/Alert.vue";
import Pagination from "@/components/shared/Pagination.vue";
import ActionDelete from "@/modal/ActionDelete.vue";
import { computed, onMounted, ref } from "vue";
import { get, remove } from "@/js/helper/api";
import { useRouter } from "vue-router";

const router = useRouter();
const categories = ref([]);

const isLoading = ref(true);

const page = ref(1);
const perPage = 12;

const showAlert = ref(false);
const alertType = ref("success"); // success, error, info
const alertMessage = ref("");

const showDeleteModal = ref(false);
const categoryToDelete = ref(null);

onMounted(async () => {
  isLoading.value = true;
  await fetchCategories();
});

const fetchCategories = async () => {
  isLoading.value = true;
  try {
    const response = await get("categories");
    const rawCategories = response.data;
    console.log(rawCategories.value);

    const categoriesWithCounts = await Promise.all(
      rawCategories.map(async (category) => {
        const count = await fetchSubCategories(category.id);
        return {
          ...category,
          subCategories: count,
        };
      })
    );

    console.log(categories.value);
    categories.value = categoriesWithCounts;
  } catch (err) {
    console.error("Error fetching products: ", err.message);
  } finally {
    isLoading.value = false;
  }
};

const fetchSubCategories = async (categoryId) => {
  try {
    const response = await get(`sub-categories/${categoryId}`);
    return response.data.length;
  } catch (error) {
    console.error(
      `Error fetching subcategories for category ${categoryId}:`,
      error
    );
    return 0;
  }
};

const paginatedAuctions = computed(() => {
  const start = (page.value - 1) * perPage;
  return categories.value.slice(start, start + perPage);
});

const totalPages = computed(() => Math.ceil(categories.value.length / perPage));

const deleteCategory = async (category) => {
  categoryToDelete.value = category;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    await remove(`category/${categoryToDelete.value.id}`);

    categories.value = categories.value.filter(
      (cat) => cat.id !== categoryToDelete.value.id
    );

    showDeleteModal.value = false;
    categoryToDelete.value = null;

    showAlert.value = true;
    alertType.value = "success";
    alertMessage.value = "✅ Category deleted successfully!";

    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
  } catch (err) {
    console.error("Failed to delete category: ", err.message);
    showAlert.value = true;
    alertType.value = "error";
    alertMessage.value = "❌ Failed to delete category.";
    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
  }
};

const handleEditCategory = (category) => {
  console.log("Edit auction", category);
  router.push({ name: "admin.category.edit", params: { id: category.id } });
};
</script>
