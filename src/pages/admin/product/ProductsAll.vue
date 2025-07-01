<template>
  <ButtonBack />
  <Loader v-if="isLoading" />

  <template v-else>
    <div class="px-4 mt-6 max-w-6xl">
      <div class="bg-white shadow-md rounded-md overflow-x-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">📦 All Products</h3>
        </div>
        <!-- <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
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
                {{ product.category?.name || "N/A" }}, <br />
                {{ product.subCategoy?.name || "N/A" }}
              </td>
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
        </table> -->
      </div>
    </div>
  </template>
  <h1>TEST</h1>
</template>

<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import { onMounted, ref } from "vue";

const products = ref([]);
const isLoading = ref(true);

onMounted(async () => {
    isLoading.values = true;
    await fetchAllProducts();
})

const fetchAllProducts = () => {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:8000/api/products`, {
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
</script>
