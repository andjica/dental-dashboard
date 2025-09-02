<template>
  <!-- Sidebar -->
  <transition name="slide">
    <aside
      v-show="isOpen || isDesktop"
      class="fixed top-0 left-0 z-40 w-64 h-screen overflow-y-auto bg-white shadow-xl text-black flex flex-col p-4 md:relative md:translate-x-0 transition-transform duration-300 ease-in-out"
    >
      <nav class="flex flex-col flex-grow">
        <!-- Mobilni header -->
        <div
          class="flex justify-between items-center px-4 py-3 bg-white shadow md:shadow-none"
        >
          <h1
            class="text-left font-extrabold uppercase text-lg tracking-wide"
            style="color: #c9a538"
          >
            Vitelio
          </h1>
          <button
            @click="props.toggleSidebar"
            class="md:hidden text-black focus:outline-none cursor-pointer"
          >
            <font-awesome-icon icon="xmark" />
          </button>
        </div>
        <!-- Top Navigation -->
        <div class="flex flex-col flex-grow">
          <Navigation
            v-for="(link, index) in topLinks"
            :key="index"
            :title="link.title"
            :items="link.items"
          />
        </div>

        <!-- Settings at Bottom -->
        <div class="mt-auto">
          <Navigation
            v-if="settingsLink"
            :title="settingsLink.title"
            :items="settingsLink.items"
          />
        </div>
      </nav>
    </aside>
  </transition>
</template>

<script setup>
import Navigation from "@/components/shared/Navigation.vue";
import { computed, onBeforeUnmount, onMounted, provide, ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  isOpen: Boolean,
  toggleSidebar: Function,
});

const { t } = useI18n();

const isDesktop = ref(window.innerWidth >= 768);
provide("toggleSidebar", props.toggleSidebar);

// --- helpers ---
const parseBool = (v) =>
  v === true || v === "true" || v === 1 || v === "1" || v === "yes" || v === "on";
const parseNum = (v) => (v == null || v === "" ? null : Number(v));

const roleId = ref(null);
const finishedProfile = ref(false);

function loadAuthSnapshot() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    roleId.value = parseNum(user?.role_id);
    // čitaj i iz LS i iz user objekta (fallback)
    const ls = localStorage.getItem("is_finished_profile");
    finishedProfile.value = ls != null ? parseBool(ls) : parseBool(user?.is_finished_profile);
  } catch {
    roleId.value = null;
    finishedProfile.value = false;
  }
}

function handleResize() {
  isDesktop.value = window.innerWidth >= 768;
}

onMounted(() => {
  handleResize();
  loadAuthSnapshot();
  window.addEventListener("resize", handleResize);
  // re-sync kada neko promeni LS
  window.addEventListener("storage", (e) => {
    if (["user", "is_finished_profile"].includes(e.key)) loadAuthSnapshot();
  });
  window.addEventListener("profileCompleted", loadAuthSnapshot);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("profileCompleted", loadAuthSnapshot);
});

// ADMIN ima uvek full meni
const isAdmin = computed(() => roleId.value === 1);

// Ako je admin -> ignoriši finishedProfile
const showFullMenu = computed(() => isAdmin.value || finishedProfile.value);

// ----- MENU -----
const fullMenu = [
  {
    title: t("dashboard"),
    items: [{ label: t("home"), to: "/admin/dashboard", icon: "house" }],
  },
  {
    title: t("products"),
    items: [
      { label: t("your_products"), to: "/admin/products", icon: "shop" },
      { label: t("add_product"), to: "/admin/products/create", icon: "cart-plus" },
      { label: t("all_products"), to: "/admin/all/products", icon: "eye" },
    ],
  },
  {
    title: t("management"),
    items: [
      { label: t("companies"), to: "/admin/companies", icon: "building" },
      { label: t("users"), to: "/admin/users", icon: "users" },
    ],
  },
  {
    title: t("orders"),
    items: [{ label: t("view_orders"), to: "/admin/orders", icon: "eye" }],
  },
  {
    title: t("category"),
    items: [
      { label: t("view_categories"), to: "/admin/categories", icon: "eye" },
      { label: t("create_category"), to: "/admin/category/create", icon: "plus" },
      { label: t("view_subcategories"), to: "/admin/sub-categories", icon: "eye" },
      { label: t("create_subcategory"), to: "/admin/sub-category/create", icon: "plus" },
    ],
  },
  {
    title: t("auctions"),
    items: [
      { label: t("all_auctions"), to: "/admin/all/auctions", icon: "eye" },
      { label: t("your_auctions"), to: "/admin/auctions", icon: "eye" },
      { label: t("create_auction"), to: "/admin/auction/create", icon: "plus" },
    ],
  },
  {
    title: t("settings"),
    items: [
      { label: t("company_settings"), to: "/admin/settings/company", icon: "gear" },
      { label: t("profile_settings"), to: "/admin/settings/profile", icon: "gear" },
      { label: t("payment_settings"), to: "/admin/settings/payment", icon: "money-bill" },
    ],
  },
];

const limitedMenu = [
  {
    title: t("settings"),
    items: [
      {
        label: t("complete_company"),
        to: "/admin/settings/company",
        icon: "gear",
      },
    ],
  },
];

const menuLinks = computed(() => (showFullMenu.value ? fullMenu : limitedMenu));
const settingsLink = computed(() => menuLinks.value.find((l) => l.title === t("settings")));
const topLinks = computed(() => menuLinks.value.filter((l) => l.title !== t("settings")));
</script>


<style>
/* Slide transition for sidebar */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
