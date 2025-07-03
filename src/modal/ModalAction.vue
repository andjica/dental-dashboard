<template>
<!-- Delete Confirmation Modal -->
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-75"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
      <h2 class="text-lg font-semibold mb-4">
        Are you sure you want to delete
        <strong>{{ auctionToDelete?.name }}</strong>?
      </h2>
      <div class="flex justify-end space-x-4">
        <button
          @click="closeModal"
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
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps({
  showDeleteModal: Boolean,
  auctionToDelete: Object,
});

const emits = defineEmits(["close", "confirmDelete"]);

const closeModal = () => {
  emits("close");
};

const confirmDelete = () => {
  emits("confirmDelete");
};
</script>