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

        <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead
            class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold"
          >
            <tr>
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Name</th>
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
    </div>
  </template>
  <!-- Delete Modal -->
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 bg-opacity-40 z-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
      <h2 class="text-lg font-semibold mb-4 text-gray-800">Delete Product</h2>
      <p class="text-sm text-gray-600 mb-6">
        Are you sure you want to delete
        <strong>{{ productToDelete?.name }}</strong
        >?
      </p>
      <div class="flex justify-end space-x-3">
        <button
          @click="showDeleteModal = false"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Loader from "@/components/shared/Loader.vue";
import ButtonBack from "@/components/shared/ButtonBack.vue";

const products = ref([]);
const user = JSON.parse(localStorage.getItem("user"));

const showDeleteModal = ref(false);
const productToDelete = ref(null);

const router = useRouter();

const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  await fetchProducts();
});

const handleView = (product) => {
  console.log("View product", product);
  // router.push({ name: "product.view", params: { id: product.id } });
};

const handleEdit = (product) => {
  console.log("Edit product", product);
  router.push({ name: "user.product.edit", params: { id: product.id } });
};

const openDeleteModal = (product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const fetchProducts = () => {
  const userId = user.id;
  const token = localStorage.getItem("token");

  fetch(`http://localhost:8000/api/products/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Something is wrong!");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Products data: ", data.data);
      products.value = data.data;
      isLoading.value = false;
    })
    .catch((err) => {
      console.log("Error throw fetching products: ", err);
    });
};

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
