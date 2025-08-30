<template>
  <ButtonBack />
  <Loader v-if="isLoading" />

  <template v-else>
    <!-- Nema aukcija -->
    <div v-if="auctions.length === 0" class="px-4 mt-6 w-full">
      <div
        class="bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm p-5 flex items-center gap-3"
      >
        <font-awesome-icon icon="exclamation-circle" class="text-red-500 text-lg" />
        <span class="text-sm font-medium">
          {{ $t("auction_note") }}
        </span>
      </div>
    </div>

    <!-- Aukcije -->
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
            <font-awesome-icon icon="gavel" class="text-yellow-500" />
            {{ $t("auctions") }}
          </h3>
          <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            {{ auctions.length }} {{ $t("active") }}
          </span>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead class="bg-gray-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("no") }}</th>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("id") }}</th>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ t("name") }}</th>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("image") }}</th>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("price") }}</th>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("date") }}</th>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("number_reaction") }}</th>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("reaction") }}</th>
                <th class="px-4 py-3 font-semibold text-gray-600">{{ $t("price_max") }}</th>
                <th class="px-4 py-3 text-center font-semibold text-gray-600">{{ $t("actions") }}</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 text-gray-800">
              <tr
                v-for="(auction, index) in paginatedAuctions"
                :key="auction.id"
                class="hover:bg-gray-50 transition duration-150"
              >
                <td class="px-4 py-3 font-medium text-gray-600">{{ index + 1 }}</td>
                <td class="px-4 py-3">{{ auction.id }}</td>
                <td class="px-4 py-3 font-semibold text-gray-900">{{ auction.name }}</td>
                <td class="px-4 py-3">
                  <img
                    :src="getImageUrl(auction?.images[0]?.image_url)"
                    :alt="auction.name"
                    class="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                </td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                    €{{ auction.base_price }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-600">
                  {{ formatDate(auction.auction_date) }}
                </td>
                <td class="px-4 py-3 text-gray-600">Number of reaction</td>
                <td class="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                  <a href="#">Link</a>
                </td>
                <td class="px-4 py-3 text-gray-700">Max Price</td>
                <td class="px-4 py-3 text-center space-x-4">
                  <button
                    @click="handleEditAuction(auction)"
                    class="text-yellow-500 hover:text-yellow-600 cursor-pointer"
                    title="Edit Auction"
                  >
                    <font-awesome-icon icon="pen-to-square" />
                  </button>
                  <button
                    @click="deleteAuction(auction)"
                    class="text-red-500 hover:text-red-600 cursor-pointer"
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

  <!-- Delete modal -->
  <ActionDelete
    :showDeleteModal="showDeleteModal"
    :auctionToDelete="auctionToDelete"
    @close="showDeleteModal = false"
    @confirmDelete="confirmDelete"
  />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getImageUrl } from "@/js/helper/displayImage";
import ButtonBack from "@/components/shared/ButtonBack.vue";
import Loader from "@/components/shared/Loader.vue";
import { get, remove } from "@/js/helper/api.js";
import { useRouter } from "vue-router";
import Pagination from "@/components/shared/Pagination.vue";
import ActionDelete from "@/modal/ActionDelete.vue";
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

const user = JSON.parse(localStorage.getItem("user"));
const showDeleteModal = ref(false);
const auctionToDelete = ref(null);

const page = ref(1);
const perPage = 12;

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
  router.push({ name: "company.edit.view", params: { id: auction.id } });
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
