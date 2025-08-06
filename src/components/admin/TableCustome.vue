<template>
  <div class="bg-white shadow-md rounded-md overflow-x-auto">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800">
        <font-awesome-icon
          v-if="props.icon && props.icon !== ''"
          :icon="props.icon"
          class="mr-2 text-gray-600"
        />
        {{ $t('all') }} {{ props.title }}
      </h3>
    </div>
    <div class="overflow-y-auto max-h-[580px] min-h-[550px]">
      <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
        <thead class="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th class="px-4 py-3">{{ $t('no') }}</th>
            <th class="px-4 py-3">{{ $t('id') }}</th>
            <th class="px-4 py-3">{{ $t('name') }}</th>
            <th class="px-4 py-3">{{ $t('country') }}</th>
            <th class="px-4 py-3">{{ $t('city') }}</th>
            <th class="px-4 py-3">{{ $t('active_product') }}</th>
            <th class="px-4 py-3 text-center">{{ $t('action') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-gray-800">
          <tr
            v-for="(item, index) in props.data"
            :key="item.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-4 py-3 whitespace-nowrap">{{ index + 1}}</td>
            <td class="px-4 py-3 whitespace-nowrap">{{ item.id }}</td>
            <td class="px-4 py-3 font-medium whitespace-nowrap">
              {{
                item?.name ||
                item?.user?.first_name + " " + item?.user?.last_name
              }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap">{{ item.country.name }}</td>
            <td class="px-4 py-3 whitespace-nowrap">{{ item.city.name }}</td>
            <td class="px-4 py-3 whitespace-nowrap">
              {{ item?.active || item?.user?.active_products_count }}
            </td>
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
          {{ $t('question') }} {{ fullName }}?
        </h2>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer transition"
          >
            {{ $t('cancel') }}
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer transition"
          >
            {{ $t('delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { computed } from 'vue'
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  title: String,
  icon: {
    type: String,
    default: "",
  },
});

const route = useRoute();

const showDeleteModal = ref(false);
const selectedRow = ref(null);

const openDeleteModal = (item) => {
  selectedRow.value = item;
  showDeleteModal.value = true;
};

const fullName = computed(() => {
  const item = selectedRow.value;
  if (!item) return ''

  if (route.path.includes('/admin/companies')) {
    return item.name || ''
  } else if (route.path.includes('/admin/users')) {
    return `${item.user?.first_name || ''} ${item.user?.last_name || ''}`.trim()
  }

  return ''
});

const confirmDelete = () => {
  // Ovde staviš logiku brisanja ako koristiš dinamičke podatke
  console.log("Deleting:", selectedRow.value);
  showDeleteModal.value = false;
};
</script>
