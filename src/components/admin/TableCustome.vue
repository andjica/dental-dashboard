<template>
  <div class="bg-white">
    <div class="bg-white shadow-md rounded-md max-w-6xl">
  <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
    <thead class="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
      <tr>
        <th class="px-4 py-3">Name</th>
        <th class="px-4 py-3">Country</th>
        <th class="px-4 py-3">City</th>
        <th class="px-4 py-3">Active of products</th>
        <th class="px-4 py-3 text-center">Action</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-100 text-gray-800">
      <tr
        v-for="(item, index) in props.data"
        :key="index"
        class="hover:bg-gray-50 transition"
      >
        <td class="px-4 py-3 font-medium whitespace-nowrap">
          {{ item?.name || item?.user?.first_name + ' ' + item?.user?.last_name }}
        </td>
        <td class="px-4 py-3 whitespace-nowrap">{{ item.country.name }}</td>
        <td class="px-4 py-3 whitespace-nowrap">{{ item.city.name }}</td>
        <td class="px-4 py-3 whitespace-nowrap">{{ item?.active || item?.user?.active_products_count }}</td>
        <td class="px-4 py-3 text-center whitespace-nowrap">
          <div class="flex justify-center space-x-3">
            <button
              class="text-blue-500 hover:text-blue-700 cursor-pointer"
              aria-label="View item"
              title="View"
            >
              <font-awesome-icon icon="eye" />
            </button>
            <button
              @click="openDeleteModal(item)"
              class="text-red-500 hover:text-red-700 cursor-pointer"
              aria-label="Delete item"
              title="Delete"
            >
              <font-awesome-icon icon="trash" />
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>


    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">
          Are you sure you want to delete it?
        </h2>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer transition"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const showDeleteModal = ref(false);
const selectedRow = ref(null);

const openDeleteModal = (item) => {
  selectedRow.value = item;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  // Ovde staviš logiku brisanja ako koristiš dinamičke podatke
  console.log("Deleting:", selectedRow.value);
  showDeleteModal.value = false;
};


</script>
