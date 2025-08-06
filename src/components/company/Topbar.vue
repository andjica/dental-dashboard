<template>
  <header
    class="bg-white shadow-md px-6 py-3 flex justify-between items-center"
  >
    <!-- Hamburger za mobilne -->
    <button
      @click="toggleSidebar"
      class="block md:hidden text-black text-2xl cursor-pointer"
    >
      <font-awesome-icon icon="bars" />
    </button>

    <h1 class="text-xl font-semibold text-gray-800">{{ $t("dentail") }}</h1>

    <!-- Dropdown za izbor države (koji postavlja jezik automatski) -->
    <div ref="dropdownRef" class="flex flex-row">
      <div
        @click="isOpen = !isOpen"
        class="flex items-center space-x-2 cursor-pointer mr-2"
      >
        <img
          v-if="selectedCountryFlag"
          :src="selectedCountryFlag"
          alt="flag"
          class="w-6 h-4"
        />
        <svg
          class="w-4 h-4"
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

      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 w-14 bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-y-auto"
      >
        <div
          v-for="country in europeanCountries"
          :key="country.code"
          @click="selectCountry(country)"
          class="px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center"
        >
          <img :src="country.flag" :alt="country.code" class="w-6 h-4" />
        </div>
      </div>
    <button
      @click="logout"
      class="bg-red-400 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition-colors cursor-pointer md:block"
    >
      {{ $t("logout") }}
    </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { inject, onMounted, ref, computed, onUnmounted } from "vue";
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
const toggleSidebar = inject("toggleSidebar");

// Dohvati flag aktivne zemlje
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
    console.log(countries);
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
  router.push("/");
}
</script>
