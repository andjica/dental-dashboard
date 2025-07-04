<template>
  <div class="relative">
    <Alert
      v-if="showSuccessAlert"
      type="success"
      message="✅ Product was successfully created!"
      class="mb-4"
    />
  </div>

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

        <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead
            class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold"
          >
            <tr>
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Name</th>
               <th class="px-4 py-3">Main image</th>
              <th class="px-4 py-3">Category</th>
              <th class="px-4 py-3">Type</th>
              <th class="px-4 py-3">Price</th>
              <th class="px-4 py-3 text-center">Active</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-gray-800">
            <tr
              v-for="product in products"
              :key="product.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-4 py-3">{{ product?.id }}</td>
              <td class="px-4 py-3">{{ product?.name }}</td>
              <td class="px-4 py-3">
                <img :src="getImageUrl(product?.primary_image.image_url)" :alt="product.name" class="w-16 h-16 object-cover rounded-md border border-gray-200" />
              </td>
              <td class="px-4 py-3">{{ product.category?.name || "N/A" }}, <br> {{ product.sub_category?.name || "N/A" }}</td>
              <td class="px-4 py-3">{{ product.product_type }}</td>
              <td class="px-4 py-3 text-center">
                {{ product.base_price }}
              </td>
              <td class="px-4 py-3">
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
    </div>
  </template>

  <!-- Delete Confirmation Modal -->
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-75"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
      <h2 class="text-lg font-semibold mb-4">
        Are you sure you want to delete <strong>{{ productToDelete?.name }}</strong> (ID: {{ productToDelete?.id }})?
      </h2>
      <div class="flex justify-end space-x-4">
        <button
          @click="showDeleteModal = false"
          class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete(productToDelete.id)"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import Loader from "@/components/shared/Loader.vue";
import Alert from "@/components/shared/Alert.vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getImageUrl } from "@/js/helper/displayImage";
import { get, remove } from "@/js/helper/api";

const products = ref([]);
const user = JSON.parse(localStorage.getItem("user"));

const showDeleteModal = ref(false);
const productToDelete = ref(null);

const router = useRouter();
const route = useRoute();
const showSuccessAlert = ref(false);

const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  if (route.query.created === "1") {
    showSuccessAlert.value = true;
    // Očisti query iz URL-a nakon prikaza
    history.replaceState(null, "", route.path);
  }
  await fetchProducts();
});

const handleView = (product) => {
  router.push({ name: 'admin.product.view', params: { id: product.id } });
};

const handleEdit = (product) => {
  router.push({ name: "admin.product.edit", params: { id: product.id } });
};

const openDeleteModal = (product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const fetchProducts = async () => {
  const userId = user.id;
  try {
    const data = await get(`products/${userId}`);
    products.value = data.data;
  } catch (err) {
    console.error("Greška pri fetchovanju proizvoda:", err);
  } finally {
    isLoading.value = false;
  }
};

const confirmDelete = async (productId) => {
  try {
    await remove(`products/${productId}`);

    // Ukloni proizvod iz liste
    products.value = products.value.filter((p) => p.id !== productId);

    showDeleteModal.value = false;
    showSuccessAlert.value = true;

    // (Opcionalno) sakrij alert posle par sekundi
    setTimeout(() => {
      showSuccessAlert.value = false;
    }, 3000);
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

</script>
