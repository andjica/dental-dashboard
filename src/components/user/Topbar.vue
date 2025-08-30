<template>
  <header
    class="bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-40"
  >
    <!-- Hamburger za mobilne -->
    <button
      @click="toggleSidebar"
      class="block md:hidden text-gray-600 hover:text-gray-800 text-2xl cursor-pointer"
    >
      <font-awesome-icon icon="bars" />
    </button>

    <!-- Logo -->
    <h1 class="text-xl font-extrabold text-gray-800 tracking-wide">
      {{ $t("dentail") }}
    </h1>

    <!-- Right side controls -->
    <div ref="dropdownRef" class="flex items-center space-x-4 relative">
      <!-- Country selector -->
      <div
        @click="isOpen = !isOpen"
        class="flex items-center space-x-2 cursor-pointer px-2 py-1 border rounded-md hover:bg-gray-50 transition"
      >
        <img
          v-if="selectedCountryFlag"
          :src="selectedCountryFlag"
          alt="flag"
          class="w-6 h-4 rounded-sm shadow-sm"
        />
        <svg
          class="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <!-- Dropdown menu -->
      <div
        v-if="isOpen"
        class="absolute right-0 top-12 z-50 w-28 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
      >
        <div
          v-for="country in europeanCountries"
          :key="country.code"
          @click="selectCountry(country)"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
        >
          <img :src="country.flag" :alt="country.code" class="w-6 h-4 rounded-sm" />
          <span class="text-sm font-medium text-gray-700">{{ country.code }}</span>
        </div>
      </div>

      <!-- Logout button -->
      <button
        @click="logout"
        class="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow transition-colors cursor-pointer"
      >
        {{ $t("logout") }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { inject, onMounted, ref, computed, onUnmounted } from 'vue';
import { useI18n } from "vue-i18n";
import { fetchEuropeanCountries } from "@/js/services/fetchCountries";
import { detectCountryByIP } from "@/js/services/geo";
import { changeLangByCountry } from "@/js/helper/language";

const { locale } = useI18n();
const europeanCountries = ref([]);
const selectedCountryCode = ref("");
const isOpen = ref(false);
const dropdownRef = ref(null);

const currentLang = ref(locale.value);
const router = useRouter();
const toggleSidebar = inject('toggleSidebar');

const selectedCountryFlag = computed(() => {
  const country = europeanCountries.value.find(
    (c) => c.code === selectedCountryCode.value
  );
  return country?.flag || "";
});

function setLanguageByCountryCode(code) {
  const lang = changeLangByCountry(code);
  currentLang.value = lang;
  locale.value = lang;
  localStorage.setItem("lang", lang);
}

function selectCountry(country) {
  selectedCountryCode.value = country.code;
  setLanguageByCountryCode(country.code);
  isOpen.value = false;
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
}

onMounted(async () => {
  try {
    document.addEventListener("click", handleClickOutside);
    const countries = await fetchEuropeanCountries();
    europeanCountries.value = countries.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const userCountryCode = await detectCountryByIP();
    const isInEurope = countries.some((c) => c.code === userCountryCode);
    selectedCountryCode.value = isInEurope ? userCountryCode : "SR";
    setLanguageByCountryCode(selectedCountryCode.value);
  } catch (err) {
    console.error("Initialization error:", err);
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

function logout() {
  localStorage.clear();
  router.push('/');
}
</script>
