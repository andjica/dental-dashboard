<template>
  <ButtonBack />
  <Loader v-if="isLoading" />

  <template v-else>
    <!-- Empty state -->
    <div v-if="auctions.length === 0" class="px-6 mt-20 flex justify-center">
      <div
        class="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 rounded-xl shadow-lg p-6 flex items-center gap-4 max-w-xl"
      >
        <font-awesome-icon icon="exclamation-circle" class="text-red-500 text-2xl" />
        <div>
          <p class="text-lg font-semibold">{{ $t("auction_note") }}</p>
          <p class="text-sm text-gray-600">{{ $t("auction_add_hint") }}</p>
        </div>
      </div>
    </div>

    <!-- Auction table -->
    <div v-else class="px-6 mt-10 max-w-10xl mx-auto">
      <Alert
        v-if="showAlert"
        :type="alertType"
        :message="alertMessage"
        @close="showAlert = false"
        :classWidth="'max-w-7xl'"
        class="mb-6"
      />

      <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            📦 {{ $t("auctions") }}
          </h3>
          <button
            @click="$router.push('/user/auction/create')"
            class="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
          >
            + {{ $t("create_auction") }}
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300">
          <table class="min-w-full text-sm text-left">
            <thead class="bg-gray-50 sticky top-0 z-10 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th class="px-5 py-3">{{ $t("no") }}</th>
                <th class="px-5 py-3">{{ $t("id") }}</th>
                <th class="px-5 py-3">{{ $t("name") }}</th>
                <th class="px-5 py-3">{{ $t("image") }}</th>
                <th class="px-5 py-3">{{ $t("price") }} (€)</th>
                <th class="px-5 py-3">{{ $t("date") }}</th>
                <th class="px-5 py-3">{{ $t("number_reaction") }}</th>
                <th class="px-5 py-3">{{ $t("price_max") }}</th>
                <th class="px-5 py-3 text-center">{{ $t("actions") }}</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 text-gray-800">
              <tr
                v-for="(auction, index) in paginatedAuctions"
                :key="index"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-5 py-3 font-medium">{{ index + 1 }}</td>
                <td class="px-5 py-3">{{ auction.id }}</td>
                <td class="px-5 py-3 font-semibold">{{ auction.name }}</td>
                <td class="px-5 py-3">
                  <img
                    :src="getImageUrl(auction?.images[0]?.image_url)"
                    :alt="auction.name"
                    class="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                </td>
                <td class="px-5 py-3 font-bold text-gray-700">€{{ auction.base_price }}</td>
                <td class="px-5 py-3">{{ formatDate(auction.auction_date) }}</td>
                <td class="px-5 py-3 text-center">
                  <span
                    class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-semibold"
                  >
                    {{ auction.reactions_count || 0 }}
                  </span>
                </td>
                <td class="px-5 py-3 font-bold text-green-600">
                  {{ auction.max_price || '—' }}
                </td>
                <td class="px-5 py-3 text-center space-x-2">
                  <button
                    @click="handleEditAuction(auction)"
                    class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                    title="Edit Auction"
                  >
                    <font-awesome-icon icon="pen-to-square" />
                  </button>
                  <button
                    @click="deleteAuction(auction)"
                    class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
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

  <!-- Delete modal -->
  <ActionDelete
    :showDeleteModal="showDeleteModal"
    :auctionToDelete="auctionToDelete"
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

const router = useRouter();
const auctions = ref([]);
const isLoading = ref(true);
// message alert
const showAlert = ref(false);
const alertType = ref("success");
const alertMessage = ref("");

const page = ref(1);
const perPage = 6;

const user = JSON.parse(localStorage.getItem("user"));
const showDeleteModal = ref(false);
const auctionToDelete = ref(null);

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const fetchYourAuctions = async () => {
  isLoading.value = true;
  try {
    const response = await get(`auctions/${user.id}`);
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
  router.push({ name: "user.auction.edit", params: { id: auction.id } });
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
    alertMessage.value = t("auction_delete_s");
    showAlert.value = true;
  } catch (err) {
    console.error("Error deleting auction:", err.message);
    alertType.value = "error";
    alertMessage.value = t("auction_delete_f");
    showAlert.value = true;
  }
};

onMounted(async () => {
  isLoading.value = true;
  await fetchYourAuctions();
});
</script>
