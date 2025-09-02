<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Company Dashboard</h1>
    <BaseCard title="Welcome" content="This is your Company dashboard." />
  </div>
  <div class="p-0" v-if="isActive === 0">
    <p
      class="m-4 p-4 text-sm text-green-700 bg-green-100 border border-green-300 rounded-lg shadow-sm"
    >
      {{ t('admin_info') }}
    </p>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onBeforeUnmount, computed } from "vue";
import { get } from "@/js/helper/api.js";
import { useI18n } from "vue-i18n";

const props = defineProps({
  isOpen: Boolean,
  toggleSidebar: Function,
});

const { t } = useI18n();
provide("toggleSidebar", props.toggleSidebar);

// ---------- Helpers ----------
const parseBool = (v) =>
  v === true || v === "true" || v === 1 || v === "1" || v === "yes" || v === "on";
const toBool = (v) => {
  // backend nekad šalje 0/1, true/false, "0"/"1"
  if (v === 0 || v === "0" || v === false || v == null) return false;
  if (v === 1 || v === "1" || v === true) return true;
  return parseBool(v);
};

// ---------- Reactive state ----------
const isDesktop = ref(window.innerWidth >= 768);
const companyActive = ref(false);           // <-- BOOLEANS, ne brojevi
const isFinishedProfile = ref(false);       // <-- reaktivno

// inicijalno očitaj iz LS/user-a
function initFromLocalStorage() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const finishedLS = localStorage.getItem("is_finished_profile");
    const activeLS = localStorage.getItem("isActive"); // kompatibilnost sa ostatkom app-a

    isFinishedProfile.value = finishedLS
      ? toBool(finishedLS)
      : toBool(user?.is_finished_profile);

    companyActive.value = activeLS
      ? toBool(activeLS)
      : toBool(user?.is_active); // fallback ako backend šalje user.is_active

    // osveži LS u kanonski format
    localStorage.setItem("is_finished_profile", isFinishedProfile.value ? "1" : "0");
    localStorage.setItem("isActive", companyActive.value ? "true" : "false");
  } catch {
    isFinishedProfile.value = false;
    companyActive.value = false;
  }
}

// ---------- Resize handler ----------
function handleResize() {
  isDesktop.value = window.innerWidth >= 768;
}

// ---------- Fetch iz backenda: status firme ----------
const fetchCompany = () => {
  get("company")
    .then((res) => {
      const active = toBool(res?.data?.active);
      companyActive.value = active;

      // sinhronizuj LS + obavesti ostatak app-a
      localStorage.setItem("isActive", active ? "true" : "false");
      window.dispatchEvent(new Event("isActiveChanged"));
    })
    .catch((err) => {
      console.warn("Error fetching company:", err);
    });
};

// ---------- Access kontrola ----------
const canAccess = (to) => {
  // 1) Ako profil nije završen → dozvoli samo kompletiranje firme
  if (!isFinishedProfile.value) {
    return to === "/company/settings/company";
  }
  // 2) Ako firma nije aktivna → dozvoli Dashboard i Company Settings
  if (!companyActive.value) {
    return ["/company/dashboard", "/company/settings/company"].includes(to);
  }
  // 3) Inače sve dozvoljeno
  return true;
};

// ---------- Meniji ----------
const menuLinks = computed(() => {
  return isFinishedProfile.value
    ? [
        {
          title: t("dashboard"),
          items: [
            {
              label: t("home"),
              to: "/company/dashboard",
              icon: "house",
              disabled: !canAccess("/company/dashboard"),
            },
          ],
        },
        {
          title: t("products"),
          items: [
            {
              label: t("all_products"),
              to: "/company/products",
              icon: "shop",
              disabled: !canAccess("/company/products"),
            },
            {
              label: t("add_product"),
              to: "/company/products/create",
              icon: "cart-plus",
              disabled: !canAccess("/company/products/create"),
            },
          ],
        },
        {
          title: t("orders"),
          items: [
            {
              label: t("view_orders"),
              to: "/company/order/view",
              icon: "eye",
              disabled: !canAccess("/company/order/view"),
            },
          ],
        },
        {
          title: t("auctions"),
          items: [
            {
              label: t("auction_view"),
              to: "/company/auction/view",
              icon: "eye",
              disabled: !canAccess("/company/auction/view"),
            },
            {
              label: t("create_auction"),
              to: "/company/auction/create",
              icon: "plus",
              disabled: !canAccess("/company/auction/create"),
            },
          ],
        },
        {
          title: t("settings"),
          items: [
            {
              label: t("company_settings"),
              to: "/company/settings/company",
              icon: "gear",
              disabled: !canAccess("/company/settings/company"),
            },
            {
              label: t("profile_settings"),
              to: "/company/settings/profile",
              icon: "gear",
              disabled: !canAccess("/company/settings/profile"),
            },
            {
              label: t("payment_settings"),
              to: "/company/settings/payment",
              icon: "money-bill",
              disabled: !canAccess("/company/settings/payment"),
            },
          ],
        },
      ]
    : [
        {
          title: t("settings"),
          items: [
            {
              label: t("complete_company"),
              to: "/company/settings/company",
              icon: "gear",
              disabled: false,
            },
          ],
        },
      ];
});

const settingsLink = computed(() =>
  menuLinks.value.find((link) => link.title === t("settings"))
);
const topLinks = computed(() =>
  menuLinks.value.filter((link) => link.title !== t("settings"))
);

// ---------- Lifecycle ----------
onMounted(() => {
  initFromLocalStorage();
  fetchCompany();

  handleResize();
  window.addEventListener("resize", handleResize);

  // Ako drugi delovi app-a menjaju LS, odavde se re-sync
  window.addEventListener("isActiveChanged", initFromLocalStorage);
  window.addEventListener("storage", (e) => {
    if (["isActive", "is_finished_profile", "user"].includes(e.key)) {
      initFromLocalStorage();
    }
  });

  // DEBUG: vidi realne vrednosti
  console.table({
    companyActive: companyActive.value,
    isFinishedProfile: isFinishedProfile.value,
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("isActiveChanged", initFromLocalStorage);
});
</script>

