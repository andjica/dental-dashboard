<template>
  <ButtonBack />
  <div class="p-6">
    <template v-if="isLoading">
      <Loader v-if="isLoading" />
    </template>
    <template v-else>
      <template v-if="usersData.length === 0">
        <p
          class="mt-4 p-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg shadow-sm"
        >
          ⚠️ There are no active users
        </p>
      </template>

      <template class="p-6" v-else>
        <TableCustome :data="paginatedAuctions" title="Users" icon="users" />
        <Pagination
          :page="page"
          :totalPages="totalPages"
          @update:page="page = $event"
        />
      </template>
    </template>
  </div>
</template>

<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import TableCustome from "@/components/admin/TableCustome.vue";
import Loader from "@/components/shared/Loader.vue";
import { computed, onMounted, ref } from "vue";
import { get } from "@/js/helper/api.js";
import Pagination from "@/components/shared/Pagination.vue";

const usersData = ref([]);
const isLoading = ref(true);

const page = ref(1);
const perPage = 12;

onMounted(async () => {
  isLoading.values = true;
  await fetchUsers();
});

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const response = await get("admin/users");
    usersData.value = response.data;
  } catch (err) {
    console.error("Error fetching users:", err.message);
  } finally {
    isLoading.value = false;
  }
};

const paginatedAuctions = computed(() => {
  const start = (page.value - 1) * perPage;
  return usersData.value.slice(start, start + perPage);
});

const totalPages = computed(() => Math.ceil(usersData.value.length / perPage));
</script>
