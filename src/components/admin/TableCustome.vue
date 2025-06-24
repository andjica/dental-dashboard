<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white shadow rounded">
      <thead>
        <tr class="bg-gray-100 text-left text-sm font-bold text-gray-600">
          <th class="py-2 px-4">Name</th>
          <th class="py-2 px-4">Country</th>
          <th class="py-2 px-4">City</th>
          <th class="py-2 px-4">Active of products</th>
          <th class="py-2 px-4">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-t" v-for="(item, index) in props.data" :key="index">
          <td class="py-2 px-4">{{ item?.name || item?.user?.first_name + " " + item?.user?.last_name}}</td>
          <td class="py-2 px-4">{{ item.country.name }}</td>
          <td class="py-2 px-4">{{ item.city.name }}</td>
          <td class="py-2 px-4">{{ item?.active || item?.user?.active_products_count }}</td>
          <td class="py-2 px-4 flex gap-2">
            <button class="text-blue-600 hover:underline cursor-pointer">
              <font-awesome-icon icon="eye" />
            </button>
            <button
              @click="openDeleteModal(item)"
              class="text-red-600 hover:underline cursor-pointer"
            >
              <font-awesome-icon icon="trash" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-75"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
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
