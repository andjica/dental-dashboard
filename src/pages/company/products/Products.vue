<template>
  <ButtonBack />
  <Loader v-if="isLoading" />

  <template v-else>
    <!-- Nema proizvoda -->
    <div v-if="products.length === 0" class="px-4 mt-6 w-full">
      <div
        class="bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm p-5 flex items-center gap-3"
      >
        <font-awesome-icon icon="exclamation-circle" class="text-red-500 text-lg" />
        <span class="text-sm font-medium">
          {{ $t("product_no") }}
        </span>
      </div>
    </div>

    <!-- Proizvodi tabela -->
    <div v-else class="px-4 mt-6 max-w-10xl mx-auto">
      <Alert
        v-if="showAlert"
        :type="alertType"
        :message="alertMessage"
        @close="showAlert = false"
        :classWidth="'max-w-7xl'"
      />

      <div class="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <font-awesome-icon icon="box" class="text-blue-500" />
            {{ $t("products") }}
          </h3>
          <span class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            {{ products.length }} {{ $t("active") }}
          </span>
        </div>

        <!-- Tabela -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead class="bg-gray-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("no") }}</th>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("id") }}</th>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("name") }}</th>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("image") }}</th>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("category_name") }}</th>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("product_type") }}</th>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("price") }}</th>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("active") }}</th>
                <th class="px-4 py-3 text-center font-semibold text-gray-600">{{ $t("action") }}</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 text-gray-800">
              <tr
                v-for="(product, index) in paginatedProducts"
                :key="product.id"
                class="hover:bg-gray-50 transition duration-150"
              >
                <td class="px-4 py-3 text-gray-600">{{ index + 1 }}</td>
                <td class="px-4 py-3">{{ product?.id }}</td>
                <td class="px-4 py-3 font-semibold text-gray-900">{{ product?.name }}</td>
                <td class="px-4 py-3">
                  <img
                    :src="getImageUrl(product?.images[0]?.image_url)"
                    :alt="product.name"
                    class="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                </td>
                <td class="px-4 py-3 text-gray-700">
                  {{ product.category?.name || "N/A" }}
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                    {{ product.product_type }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    €{{ product.base_price }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span
                    :class="product.in_stock ? 'bg-green-500' : 'bg-orange-400'"
                    class="inline-block w-3 h-3 rounded-full"
                    :title="product.in_stock ? t('in_stock') : t('out_stock')"
                  ></span>
                </td>
                <td class="px-4 py-3 text-center space-x-4">
                  <button
                    @click="handleView(product)"
                    class="text-blue-500 hover:text-blue-700 cursor-pointer"
                    title="View"
                  >
                    <font-awesome-icon icon="eye" />
                  </button>
                  <button
                    @click="handleEdit(product)"
                    class="text-yellow-500 hover:text-yellow-600 cursor-pointer"
                    title="Edit"
                  >
                    <font-awesome-icon icon="pen-to-square" />
                  </button>
                  <button
                    @click="openDeleteModal(product)"
                    class="text-red-500 hover:text-red-600 cursor-pointer"
                    title="Delete"
                  >
                    <font-awesome-icon icon="trash" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <Pagination
            :page="page"
            :totalPages="totalPages"
            @update:page="page = $event"
          />
        </div>
      </div>
    </div>
  </template>

  <!-- Modal delete -->
  <ActionDelete
    :showDeleteModal="showDeleteModal"
    :auctionToDelete="productToDelete"
    @close="showDeleteModal = false"
    @confirmDelete="confirmDelete"
  />
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Loader from "@/components/shared/Loader.vue";
import ButtonBack from "@/components/shared/ButtonBack.vue";
import Pagination from "@/components/shared/Pagination.vue";
import { get, remove } from "@/js/helper/api.js";
import { getImageUrl } from "@/js/helper/displayImage";
import ActionDelete from "@/modal/ActionDelete.vue";
import Alert from "@/components/shared/Alert.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const products = ref([]);
const user = JSON.parse(localStorage.getItem("user"));

// message alert
const showAlert = ref(false);
const alertType = ref("success");
const alertMessage = ref("");

const showDeleteModal = ref(false);
const productToDelete = ref(null);

const router = useRouter();
const page = ref(1);
const perPage = 6;

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
  router.push({ name: "company.product.edit", params: { id: product.id } });
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
