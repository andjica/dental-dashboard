<template>
  <ButtonBack />
  <Loader v-if="isLoading" />
  <template v-else>
    <!-- No products alert -->
    <div v-if="products.length === 0" class="px-4 mt-6 w-full">
      <div
        class="bg-red-100 border border-red-300 text-red-800 rounded-md shadow p-4 flex items-center gap-3"
      >
        <font-awesome-icon icon="exclamation-circle" class="text-red-600" />
        <span class="text-sm font-medium">
          ⚠️ You currently have no products. Please add some to get started.
        </span>
      </div>
    </div>
    <!-- Products table -->
    <div v-else class="px-4 mt-6 max-w-6xl">
      <div class="bg-white shadow-md rounded-md overflow-x-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">📦 Products</h3>
        </div>

        <div class="overflow-y-auto max-h-[580px] min-h-[550px]">
          <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead
              class="bg-gray-100 sticky top-0 z-10"
            >
              <tr>
                <th class="px-4 py-3">No.</th>
                <th class="px-4 py-3">ID</th>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Image</th>
                <th class="px-4 py-3">Category</th>
                <th class="px-4 py-3">Type</th>
                <th class="px-4 py-3">Price</th>
                <th class="px-4 py-3 text-center">Active</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-800">
              <tr
                v-for="(product, index) in paginatedProducts"
                :key="product.id"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-4 py-3">{{ index + 1 }}</td>
                <td class="px-4 py-3">{{ product?.id }}</td>
                <td class="px-4 py-3">{{ product?.name }}</td>
                <td class="px-4 py-3">
                  <img
                    :src="getImageUrl(product?.images[0]?.image_url)"
                    :alt="product.name"
                    class="w-16 h-16 object-cover rounded-md border border-gray-200"
                  />
                </td>
                <td class="px-4 py-3">{{ product.category?.name || "N/A" }}</td>
                <td class="px-4 py-3">{{ product.product_type }}</td>
                <td class="px-4 py-3">{{ product.base_price }}</td>
                <td class="px-4 py-3 text-center">
                  <span
                    :class="product.in_stock ? 'bg-green-500' : 'bg-orange-400'"
                    class="inline-block w-3 h-3 rounded-full"
                  ></span>
                </td>
                <td class="px-4 py-3 text-right space-x-3">
                  <button
                    @click="handleView(product)"
                    class="text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    <font-awesome-icon icon="eye" />
                  </button>
                  <button
                    @click="handleEdit(product)"
                    class="text-yellow-500 hover:text-yellow-600 cursor-pointer"
                  >
                    <font-awesome-icon icon="pen-to-square" />
                  </button>
                  <button
                    @click="openDeleteModal(product)"
                    class="text-red-500 hover:text-red-700 cursor-pointer"
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
  <!-- Delete Modal -->
  <ActionDelete
    :showDeleteModal="showDeleteModal"
    :auctionToDelete="productToDelete"
    @close="showDeleteModal = false"
    @confirmDelete="confirmDelete"
  />
</template>

<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import Loader from "@/components/shared/Loader.vue";
import Pagination from "@/components/shared/Pagination.vue";
import { get } from "@/js/helper/api.js";
import { getImageUrl } from "@/js/helper/displayImage";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ActionDelete from "@/modal/ActionDelete.vue";

const products = ref([]);
const user = JSON.parse(localStorage.getItem("user"));

const showDeleteModal = ref(false);
const productToDelete = ref(null);

const page = ref(1);
const perPage = 12;

const router = useRouter();

const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  await fetchProducts();
});

const handleView = (product) => {
  console.log("View product", product);
  router.push({ name: "product.view", params: { id: product.id } });
};

const handleEdit = (product) => {
  console.log("Edit product", product);
  router.push({ name: "user.product.edit", params: { id: product.id } });
};

const openDeleteModal = (product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const fetchProducts = async () => {
  const userId = user.id;
  isLoading.value = true;
  try {
    const response = await get(`products/${userId}`);
    products.value = response.data;
  } catch (err) {
    console.error("Error fetching users:", err.message);
  } finally {
    isLoading.value = false;
  }
};

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * perPage;
  return products.value.slice(start, start + perPage);
});

const totalPages = computed(() => Math.ceil(products.value.length / perPage));

const confirmDelete = () => {
  const token = localStorage.getItem("token");

  // fetch(`http://localhost:8000/api/products/${userId}`, {
  //   method: "DELETE",
  //   headers: {
  //     Accept: "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  // })
  //   .then((res) => {
  //     if (!res.ok) throw new Error("Failed to delete product");
  //     return res.json();
  //   })
  //   .then((data) => {
  //     console.log("Deleted:", data);
  //     // Emit event or reload list
  //         showDeleteModal.value = false;
  //     showDeleteModal.value = false;
  //   })
  //   .catch((err) => {
  //     console.error("Error deleting:", err);
  //   });
};
</script>
