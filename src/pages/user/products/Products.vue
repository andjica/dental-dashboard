<template>
  <ButtonBack />
  <Loader v-if="isLoading" />

  <template v-else>
    <!-- No products alert -->
    <div v-if="products.length === 0" class="px-6 mt-10 w-full flex justify-center">
      <div
        class="bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-md p-5 flex items-center gap-3 w-full max-w-3xl"
      >
        <font-awesome-icon icon="exclamation-circle" class="text-red-600 text-lg" />
        <span class="text-sm font-medium">
          {{ $t("product_no") }}
        </span>
      </div>
    </div>

    <!-- Products table -->
    <div v-else class="px-6 mt-10 max-w-10xl mx-auto">
      <!-- Alert -->
      <Alert
        v-if="showAlert"
        :type="alertType"
        :message="alertMessage"
        @close="showAlert = false"
        :classWidth="'max-w-7xl'"
        class="mb-6"
      />

      <!-- Card -->
      <div class="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            📦 {{ $t("products") }}
          </h3>
          <button
            @click="$router.push('/user/products/create')"
            class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition"
          >
            + {{ $t("add_product") }}
          </button>
        </div>

        <!-- Table wrapper -->
        <div class="overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300">
          <table class="min-w-full text-sm text-left">
            <thead class="bg-gray-100 sticky top-0 z-10 text-gray-600">
              <tr>
                <th class="px-4 py-3 font-semibold">{{ $t("no") }}</th>
                <th class="px-4 py-3 font-semibold">{{ $t("id") }}</th>
                <th class="px-4 py-3 font-semibold">{{ $t("name") }}</th>
                <th class="px-4 py-3 font-semibold">{{ $t("image") }}</th>
                <th class="px-4 py-3 font-semibold">{{ $t("category_name") }}</th>
                <th class="px-4 py-3 font-semibold">{{ $t("product_type") }}</th>
                <th class="px-4 py-3 font-semibold">{{ $t("price") }}</th>
                <th class="px-4 py-3 text-center font-semibold">{{ $t("active") }}</th>
                <th class="px-4 py-3 text-right font-semibold">{{ $t("action") }}</th>
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
                <td class="px-4 py-3 font-medium">{{ product?.name }}</td>
                <td class="px-4 py-3">
                  <img
                    :src="getImageUrl(product?.images[0]?.image_url)"
                    :alt="product.name"
                    class="w-14 h-14 object-cover rounded-md border border-gray-200 shadow-sm"
                  />
                </td>
                <td class="px-4 py-3">{{ product.category?.name || "N/A" }}</td>
                <td class="px-4 py-3">{{ product.product_type }}</td>
                <td class="px-4 py-3 font-semibold text-gray-700">
                  {{ product.base_price }} €
                </td>
                <td class="px-4 py-3 text-center">
                  <span
                    :class="product.in_stock ? 'bg-green-500' : 'bg-orange-400'"
                    class="inline-block w-3 h-3 rounded-full"
                  ></span>
                </td>
                <td class="px-4 py-3 text-right space-x-4">
                  <button
                    @click="handleView(product)"
                    class="text-blue-500 hover:text-blue-700 transition"
                  >
                    <font-awesome-icon icon="eye" />
                  </button>
                  <button
                    @click="handleEdit(product)"
                    class="text-yellow-500 hover:text-yellow-600 transition"
                  >
                    <font-awesome-icon icon="pen-to-square" />
                  </button>
                  <button
                    @click="openDeleteModal(product)"
                    class="text-red-500 hover:text-red-700 transition"
                  >
                    <font-awesome-icon icon="trash" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Pagination
            :page="page"
            :totalPages="totalPages"
            @update:page="page = $event"
          />
        </div>
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
import { get, remove } from "@/js/helper/api.js";
import { getImageUrl } from "@/js/helper/displayImage";
import ActionDelete from "@/modal/ActionDelete.vue";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Alert from "@/components/shared/Alert.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const products = ref([]);
const user = JSON.parse(localStorage.getItem("user"));
const showAlert = ref(false);
const alertType = ref("success");
const alertMessage = ref("");
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
  router.push({ name: "product.view", params: { id: product.id } });
};

const handleEdit = (product) => {
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
    console.error("Error fetching products:", err.message);
  } finally {
    isLoading.value = false;
  }
};

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * perPage;
  return products.value.slice(start, start + perPage);
});

const totalPages = computed(() => Math.ceil(products.value.length / perPage));

const confirmDelete = async () => {
  if (!productToDelete.value) return;

  try {
    await remove(`products/${productToDelete.value.id}`);
    products.value = products.value.filter(
      (p) => p.id !== productToDelete.value.id
    );
    showDeleteModal.value = false;
    productToDelete.value = null;
    alertType.value = "success";
    alertMessage.value = t("product_success_delete");
    showAlert.value = true;
  } catch (err) {
    console.error("Error deleting product:", err.message);
    alertType.value = "error";
    alertMessage.value = t("product_failed_delete");
    showAlert.value = true;
  }
};
</script>
