<template>
  <div v-if="showSuccessAlert" class="p-4 mb-4 text-green-700 bg-green-100 border border-green-300 rounded">
    {{ successMessage }}
  </div>
  <ButtonBack />
  <Loader v-if="isLoading" />

  <template v-else>
    <div v-if="auctions.length === 0" class="px-4 mt-6 w-full">
      <div class="bg-red-100 border border-red-300 text-red-800 rounded-md shadow p-4 flex items-center gap-3">
        <font-awesome-icon icon="exclamation-circle" class="text-red-600" />
        <span class="text-sm font-medium">
          {{ $t('auction_all_note') }}
        </span>
      </div>
    </div>
    <!-- Auction table -->
    <div v-else class="px-4 mt-6 max-w-6xl">
      <Alert v-if="showAlert" :type="alertType" :message="alertMessage" @close="showAlert = false"
        :classWidth="'max-w-6xl'" />
      <div class="bg-white shadow-md rounded-md overflow-x-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">📦 {{ $t('auction_all') }}</h3>
        </div>

        <div class="overflow-y-auto max-h-[580px] min-h-[618px]">
          <table class="min-w-full text-sm text-left divide-y divide-gray-200">
            <thead class="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th class="px-4 py-3">{{ $t('no') }}</th>
                <th class="px-4 py-3">{{ $t('id') }}</th>
                <th class="px-4 py-3">{{ t('name') }}</th>
                <th class="px-4 py-3">{{ $t('image') }}</th>
                <th class="px-4 py-3">{{ $t('price') }} (€)</th>
                <th class="px-4 py-3">{{ $t('date') }}</th>
                <th class="px-4 py-3">{{ $t('number_reaction') }}</th>
                <th class="px-4 py-3">{{ $t('reaction') }}</th>
                <th class="px-4 py-3">{{ $t('price_max') }}</th>
                <th class="px-4 py-3 text-center">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(auction, index) in paginatedAuctions" :key="auction.id" class="hover:bg-gray-50 transition">
                <td class="px-4 py-3 font-medium">{{ index + 1 }}</td>
                <td class="px-4 py-3 font-medium">{{ auction.id }}</td>
                <td class="px-4 py-3 font-medium">{{ auction.name }}</td>
                <td class="px-4 py-3">
                  <img :src="getImageUrl(auction?.images[0]?.image_url)" :alt="auction.name"
                    class="w-16 h-16 object-cover rounded-md border border-gray-200" />
                </td>
                <td class="px-4 py-3">€{{ auction.base_price }}</td>
                <td class="px-4 py-3">
                  {{ formatDate(auction.auction_date) }}
                </td>
                <td class="px-4 py-3">{{ $t('reaction_number') }}</td>
                <td class="px-4 py-3"><a href="#">{{ $t('link') }}</a></td>
                <td class="px-4 py-3">{{ $t('price_max') }}</td>
                <td class="px-4 py-3 text-center space-x-3">
                  <button @click="handleEditAuction(auction)"
                    class="text-yellow-500 hover:text-yellow-600 cursor-pointer" title="Edit Auction">
                    <font-awesome-icon icon="pen-to-square" />
                  </button>
                  <button @click="deleteAuction(auction)" class="text-red-500 hover:text-red-700 cursor-pointer"
                    aria-label="Delete auction" title="Delete Auction">
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
  <ActionDelete :showDeleteModal="showDeleteModal" :auctionToDelete="auctionToDelete" @close="showDeleteModal = false"
    @confirmDelete="confirmDelete" />
</template>

<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import Loader from "@/components/shared/Loader.vue";
import Pagination from "@/components/shared/Pagination.vue";
import Alert from "@/components/shared/Alert.vue";
import { get, remove } from "@/js/helper/api.js";
import { getImageUrl } from "@/js/helper/displayImage";
import ActionDelete from "@/modal/ActionDelete.vue";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const router = useRouter();
const auctions = ref([]);
const isLoading = ref(true);
// message alert
const showAlert = ref(false);
const alertType = ref("success");
const alertMessage = ref("");

const page = ref(1);
const perPage = 6;

const showSuccessAlert = ref(false);
const successMessage = ref("");

const showDeleteModal = ref(false);
const auctionToDelete = ref(null);

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const fetchAllAuction = async () => {
  isLoading.value = true;
  try {
    const response = await get("auctions");
    auctions.value = response.data;
  } catch (err) {
    console.error("Error fetching products:", err.message);
  } finally {
    isLoading.value = false;
  }
};

const paginatedAuctions = computed(() => {
  const start = (page.value - 1) * perPage;
  return auctions.value.slice(start, start + perPage);
});

const totalPages = computed(() => Math.ceil(auctions.value.length / perPage));

const handleEditAuction = (auction) => {
  router.push({ name: "admin.auction.edit", params: { id: auction.id } });
};

const deleteAuction = (auction) => {
  auctionToDelete.value = auction;
  showDeleteModal.value = true;
};
// Delete auction
const confirmDelete = async () => {
  if (!auctionToDelete.value) return;

  try {
    await remove(`auctions/${auctionToDelete.value.id}`);
    // Ukloni iz lokalnog state-a
    auctions.value = auctions.value.filter(
      (a) => a.id !== auctionToDelete.value.id
    );
    showDeleteModal.value = false;
    auctionToDelete.value = null;

    alertType.value = "success";
    alertMessage.value = t('auction_delete_s');
    showAlert.value = true;
  } catch (err) {
    console.error("Error deleting auction:", err.message);
    alertType.value = "error";
    alertMessage.value = t('auction_delete_f');
    showAlert.value = true;
  }
};

onMounted(async () => {
  isLoading.value = true;
  await fetchAllAuction();
});
</script>
