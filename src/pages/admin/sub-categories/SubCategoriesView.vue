<template>
  <ButtonBack />
  <Loader v-if="isLoading" />
  <template v-else>
    <div v-if="subcategories.length === 0" class="px-4 mt-6 w-full">
      <div
        class="bg-red-100 border border-red-300 text-red-800 rounded-md shadow p-4 flex items-center gap-3"
      >
        <font-awesome-icon icon="exclamation-circle" class="text-red-600" />
        <span class="text-sm font-medium">
          ⚠️ You currently have no Sub-Categories. Please add some to get
          started.
        </span>
      </div>
    </div>
    <div v-else class="px-4 mt-6 max-w-6xl">
      <div class="bg-white shadow-md rounded-md overflow-x-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">📦 Sub-Categories - {{ subcategories.length }}</h3>
        </div>

        <div class="overflow-y-auto max-h-[580px] min-h-[550px]">
          <table class="min-w-full text-sm text-left divide-y divide-gray-200">
            <thead class="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th class="px-4 py-3">Id</th>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Categoty Group</th>
                <th class="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-800">
              <tr
                v-for="subcategory in paginatedSubCategory"
                :key="subcategory.id"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-4 py-3 font-medium">{{ subcategory.id }}</td>
                <td class="px-4 py-3 font-medium">{{ subcategory.name }}</td>
                <td class="px-4 py-3 font-medium">{{ subcategory.category.name }}</td>
                <td class="px-4 py-3 text-center space-x-3">
                  <button
                    @click="handleEditSubCategory(subcategory)"
                    class="text-yellow-500 hover:text-yellow-600 cursor-pointer"
                    title="Edit Auction"
                  >
                    <font-awesome-icon icon="pen-to-square" />
                  </button>
                  <button
                    @click="deleteSubCategory(subcategory)"
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
    :auctionToDelete="subcategoryToDelete"
    @close="showDeleteModal = false"
    @confirmDelete="confirmDelete"
  />
</template>

<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import Loader from "@/components/shared/Loader.vue";
import Pagination from "@/components/shared/Pagination.vue";
import ActionDelete from "@/modal/ActionDelete.vue";
import { computed, onMounted, ref } from "vue";
import { get } from "@/js/helper/api";
import { useRouter } from "vue-router";

const subcategories = ref([]);
const router = useRouter();
const isLoading = ref(true);

const page = ref(1);
const perPage = 12;

const showDeleteModal = ref(false);
const subcategoryToDelete = ref(null);

onMounted(async () => {
  isLoading.value = true;
  await fetchSubCategories();
});

const fetchSubCategories = async () => {
  isLoading.value = true;
  try {
    const response = await get("subcategories");
    console.log("RESPOSNE: ", response);
    subcategories.value = response.subcategories;
    console.log(response.data);
  } catch (err) {
    console.error("Error fetching products: ", err.message);
  } finally {
    isLoading.value = false;
  }
};

const paginatedSubCategory = computed(() => {
  const start = (page.value - 1) * perPage;
  return subcategories.value.slice(start, start + perPage);
});

const totalPages = computed(() =>
  Math.ceil(subcategories.value.length / perPage)
);

const deleteSubCategory = async (category) => {
  categoryToDelete.value = category;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    await remove(`subcategories/${categoryToDelete.value.id}`);

    categories.value = categories.value.filter(
      (cat) => cat.id !== categoryToDelete.value.id
    );

    showDeleteModal.value = false;
    categoryToDelete.value = null;

    showAlert.value = true;
    alertType.value = "success";
    alertMessage.value = "✅ Sub-Category deleted successfully!";

    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
  } catch (err) {
    console.error("Failed to delete sub-category: ", err.message);
    showAlert.value = true;
    alertType.value = "error";
    alertMessage.value = "❌ Failed to delete sub-category.";
    setTimeout(() => {
      showAlert.value = false;
    }, 3000);
  }
};

const handleEditSubCategory = (subcategory) => {
  console.log("Edit auction", subcategory);
  router.push({ name: "admin.sub-category.edit", params: { id: subcategory.id } });
};

</script>
