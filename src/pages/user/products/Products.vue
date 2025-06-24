<template>
  <Loader v-if="isLoading" />
  <div v-else>
    <div
      v-if="products.length === 0"
      class="px-4 mt-5 md:px-10 mx-auto w-full relative"
    >
      <p
        class="mt-4 p-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg shadow-sm"
      >
        ⚠️ You don't have products in your store!
      </p>
    </div>
    <div v-else class="px-4 mt-5 md:px-10 mx-auto w-full -m-24">
      <div class="flex flex-wrap mt-4">
        <div class="w-full mb-12 px-4">
          <div
            class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
          >
            <div class="rounded-t mb-0 px-4 py-3 border-0">
              <h3 class="font-semibold text-lg text-blueGray-700">
                Products Table
              </h3>
            </div>
            <div class="block overflow-x-auto w-full">
              <table class="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th
                      class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    >
                      Id
                    </th>
                    <th
                      class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    >
                      Name
                    </th>
                    <th
                      class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    >
                      Category
                    </th>
                    <th
                      class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    >
                      Type
                    </th>
                    <th
                      class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    >
                      Price
                    </th>
                    <th
                      class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    >
                      Active
                    </th>
                    <th
                      class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in products" :key="product.id">
                    <td
                      class="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4"
                    >
                      {{ product?.id }}
                    </td>
                    <td
                      class="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4"
                    >
                      {{ product?.name }}
                    </td>
                    <td
                      class="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4"
                    >
                      {{ product.category?.name || "N/A" }}
                    </td>

                    <td
                      class="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4"
                    >
                      {{ product.product_type }}
                    </td>

                    <td
                      class="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4"
                    >
                      {{ product.base_price }}
                    </td>
                    <td
                      class="border-t-0 px-6 align-middle text-center text-xs whitespace-nowrap p-4"
                    >
                      <span
                        :class="{
                          'bg-green-500': product.in_stock === 1,
                          'bg-orange-400': product.in_stock === 0,
                        }"
                        class="inline-block w-3 h-3 rounded-full"
                      ></span>
                    </td>
                    <td
                      class="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4 text-right"
                    >
                      <div class="flex justify-end items-center space-x-4">
                        <!-- View -->
                        <button
                          @click="handleView(product)"
                          class="text-blue-500 hover:text-blue-700 cursor-pointer"
                        >
                          <font-awesome-icon icon="eye" />
                        </button>

                        <!-- Edit -->
                        <button
                          @click="handleEdit(product)"
                          class="text-yellow-500 hover:text-yellow-600 cursor-pointer"
                        >
                          <font-awesome-icon icon="pen-to-square" />
                        </button>

                        <!-- Delete -->
                        <button
                          @click="openDeleteModal(product)"
                          class="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <font-awesome-icon icon="trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <!-- Delete Confirmation Modal -->
                <div
                  v-if="showDeleteModal"
                  class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-75"
                >
                  <div
                    class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
                  >
                    <h2 class="text-lg font-semibold mb-4">
                      Are you sure you want to delete it?
                    </h2>
                    <div class="flex justify-end space-x-4">
                      <button
                        @click="showDeleteModal = false"
                        class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        @click="confirmDelete"
                        class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Loader from "@/components/shared/Loader.vue";

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
