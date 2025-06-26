<template>
  <ButtonBack />
  <Loader v-if="isLoading" />
  <template v-else>
    <div v-if="auctions.length === 0" class="px-4 mt-6 w-full">
      <div
        class="bg-red-100 border border-red-300 text-red-800 rounded-md shadow p-4 flex items-center gap-3"
      >
        <font-awesome-icon icon="exclamation-circle" class="text-red-600" />
        <span class="text-sm font-medium">
          ⚠️ You currently have no auctions. Please add some to get started.
        </span>
      </div>
    </div>
    <!-- Auction table -->
    <div v-else class="px-4 mt-6 max-w-6xl">
      <div class="bg-white shadow-md rounded-md overflow-x-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">📦 Auctions</h3>
        </div>

        <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead
            class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold"
          >
            <tr>
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">Price (€)</th>
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-gray-800">
            <tr
              v-for="(auction, index) in auctions"
              :key="index"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-4 py-3 font-medium">{{ auction.auctionName }}</td>
              <td class="px-4 py-3">€{{ auction.auctionPrice }}</td>
              <td class="px-4 py-3">{{ formatDate(auction.auctionDate) }}</td>
              <td class="px-4 py-3 text-center space-x-3">
                <button
                  @click="viewAuction(index)"
                  class="text-blue-500 hover:text-blue-700 cursor-pointer"
                  aria-label="View auction"
                  title="View Auction"
                >
                  <font-awesome-icon icon="eye" />
                </button>
                <button
                  @click="deleteAuction(index)"
                  class="text-red-500 hover:text-red-700 cursor-pointer"
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
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ButtonBack from "@/components/shared/ButtonBack.vue";
import Loader from "@/components/shared/Loader.vue";

const auctions = ref([]);
const isLoading = ref(true);
// Fetch auctions from localStorage
onMounted(() => {
  isLoading.value = true;
  const saved = JSON.parse(localStorage.getItem("auctions")) || [];
  auctions.value = saved;
  isLoading.value = false;
});


// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// View auction (for example: show alert or navigate)
const viewAuction = (index) => {
  const auction = auctions.value[index];
  alert(
    `Auction:\nName: ${auction.auctionName}\nPrice: €${
      auction.auctionPrice
    }\nDate: ${formatDate(auction.auctionDate)}`
  );
};

// Delete auction
const deleteAuction = (index) => {
  if (confirm("Are you sure you want to delete this auction?")) {
    auctions.value.splice(index, 1);
    localStorage.setItem("auctions", JSON.stringify(auctions.value));
  }
};
</script>
