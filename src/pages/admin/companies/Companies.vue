<template>
  <ButtonBack />
  <div class="p-6">
    <template v-if="isLoading">
      <Loader v-if="isLoading" />
    </template>

    <template v-else>
      <template v-if="companyData.length === 0">
        <p
          class="mt-4 p-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg shadow-sm"
        >
          {{t('compnay_no_active')}}
        </p>
      </template>

      <template v-else>
        <h1 class="text-2xl font-bold mb-4">{{t('company_list')}}</h1>
        <TableCustome
          :data="paginatedAuctions"
          :title="companyName"
          icon="building"
        />
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
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const companyData = ref([]);
const isLoading = ref(true);
const companyName = computed(() => t('companies'));

const page = ref(1);
const perPage = 10;

onMounted(async () => {
  isLoading.values = true;
  await fetchCompanies();
});

const fetchCompanies = async () => {
  isLoading.value = true;
  try {
    const response = await get("admin/companies");
    companyData.value = response.data;
  } catch (err) {
    console.error("Error fetching users:", err.message);
  } finally {
    isLoading.value = false;
  }
};

const paginatedAuctions = computed(() => {
  const start = (page.value - 1) * perPage;
  return companyData.value.slice(start, start + perPage);
});

const totalPages = computed(() =>
  Math.ceil(companyData.value.length / perPage)
);
</script>
