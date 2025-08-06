<template>
  <ButtonBack />
  <Loader v-if="isLoading" />

  <template v-else>
    <!-- No products alert -->
    <div v-if="products.length === 0" class="px-4 mt-6 w-full">
      <div class="bg-red-100 border border-red-300 text-red-800 rounded-md shadow p-4 flex items-center gap-3">
        <font-awesome-icon icon="exclamation-circle" class="text-red-600" />
        <span class="text-sm font-medium">
          {{ $t('product_no') }}
        </span>
      </div>
    </div>

    <!-- Products table -->
    <div v-else class="px-4 mt-6 max-w-6xl">
      <Alert v-if="showAlert" :type="alertType" :message="alertMessage" @close="showAlert = false"
        :classWidth="'max-w-6xl'" />
      <div class="bg-white shadow-md rounded-md overflow-x-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">📦 {{ $t('products') }}</h3>
        </div>

        <div class="overflow-y-auto max-h-[580px] min-h-[550px]">
          <table class="min-w-full text-sm text-left divide-y divide-gray-200">
            <thead class="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th class="px-4 py-3">{{ $t('no') }}</th>
                <th class="px-4 py-3">{{ $t('id') }}</th>
                <th class="px-4 py-3">{{ $t('name') }}</th>
                <th class="px-4 py-3">{{ $t('image') }}</th>
                <th class="px-4 py-3">{{ $t('category_name') }}</th>
                <th class="px-4 py-3">{{ $t('product_type') }}</th>
                <th class="px-4 py-3">{{ $t('price') }}</th>
                <th class="px-4 py-3 text-center">{{ $t('active') }}</th>
                <th class="px-4 py-3 text-right">{{ $t('action') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-800">
              <tr v-for="(product, index) in paginatedAuctions" :key="product.id" class="hover:bg-gray-50 transition">
                <td class="px-4 py-3">{{ index + 1 }}</td>
                <td class="px-4 py-3">{{ product.id }}</td>
                <td class="px-4 py-3">{{ product?.name }}</td>
                <td class="px-4 py-3">
                  <img :src="getImageUrl(product?.primary_image.image_url)" :alt="product.name"
                    class="w-16 h-16 object-cover rounded-md border border-gray-200" />
                </td>
                <td class="px-4 py-3">{{ product.category?.name || "N/A" }}, <br> {{ product.sub_category?.name || "N/A"
                  }}</td>
                <td class="px-4 py-3">{{ product.product_type }}</td>
                <td class="px-4 py-3 text-center">
                  {{ product.base_price }}
                </td>
                <td class="px-4 py-3">
                  <span :class="product.in_stock ? 'bg-green-500' : 'bg-orange-400'"
                    class="inline-block w-3 h-3 rounded-full"></span>
                </td>
                <td class="px-4 py-3 text-right space-x-3">
                  <button @click="handleView(product)" class="text-blue-500 hover:text-blue-700 cursor-pointer">
                    <font-awesome-icon icon="eye" />
                  </button>
                  <button @click="handleEdit(product)" class="text-yellow-500 hover:text-yellow-600 cursor-pointer">
                    <font-awesome-icon icon="pen-to-square" />
                  </button>
                  <button @click="openDeleteModal(product)" class="text-red-500 hover:text-red-700 cursor-pointer">
                    <font-awesome-icon icon="trash" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :page="page" :totalPages="totalPages" @update:page="page = $event" />
      </div>
    </div>
  </template>

  <!-- Delete Confirmation Modal -->
  <ActionDelete :productToDelete="productToDelete" :showDeleteModal="showDeleteModal" @close="showDeleteModal = false"
    @confirm="confirmDelete" />
</template>


<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import Loader from "@/components/shared/Loader.vue";
import Alert from "@/components/shared/Alert.vue";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getImageUrl } from "@/js/helper/displayImage";
import { get, remove } from "@/js/helper/api";
import ActionDelete from "@/modal/ActionDelete.vue";
import Pagination from "@/components/shared/Pagination.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const products = ref([]);
const user = JSON.parse(localStorage.getItem("user"));

// message alert
const showAlert = ref(false);
const alertType = ref("success");
const alertMessage = ref("");

const showDeleteModal = ref(false);
const productToDelete = ref(null);

const page = ref(1);
const perPage = 6;

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
  console.log(product);
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

const paginatedAuctions = computed(() => {
  const start = (page.value - 1) * perPage;
  return products.value.slice(start, start + perPage);
});

const totalPages = computed(() => Math.ceil(products.value.length / perPage));

const confirmDelete = async () => {
  if (!productToDelete.value) return;

  try {
    await remove(`products/${productToDelete.value.id}`);

    // Ukloni proizvod iz liste
    products.value = products.value.filter((p) => p.id !== productId);

    showDeleteModal.value = false;
    productToDelete.value = null;

    alertType.value = "success";
    alertMessage.value = t('product_success_delete');
    showAlert.value = true;
  } catch (error) {
    console.error("Error deleting product:", error);
    alertType.value = "error";
    alertMessage.value = t('product_failed_delete');
    showAlert.value = true;
  }
};

</script>
