<template>
  <transition name="slide">
    <aside
      v-show="isOpen || isDesktop"
      class="fixed top-0 left-0 z-40 w-64 h-screen overflow-y-auto bg-white text-gray-800 shadow-2xl border-r border-gray-200 flex flex-col p-4 md:relative md:translate-x-0 transition-transform duration-300 ease-in-out"
    >
      <nav class="flex flex-col flex-grow">
        <!-- Header -->
        <div
          class="flex justify-between items-center px-4 py-3 border-b border-gray-200"
        >
          <h1
            class="text-left font-extrabold uppercase text-lg tracking-wide"
            style="color: #c9a538"
          >
            Vitelio
          </h1>
          <button
            @click="props.toggleSidebar"
            class="md:hidden text-gray-700 hover:text-gold focus:outline-none"
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
import { ref, provide, onMounted, onBeforeUnmount, computed } from "vue";
import Navigation from "@/components/shared/Navigation.vue";
import { get } from "@/js/helper/api.js";
import { useI18n } from "vue-i18n";

const props = defineProps({
  isOpen: Boolean,
  toggleSidebar: Function,
});

const iscompanyActive = ref(0);
const isDesktop = ref(window.innerWidth >= 768);
const isFinishedProfile = localStorage.getItem("is_finished_profile") === "1";

const { t } = useI18n();
provide("toggleSidebar", props.toggleSidebar);

function handleResize() {
  isDesktop.value = window.innerWidth >= 768;
}

onMounted(() => {
  handleResize();
  fetchCompany();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

// 🔥 Fetch company active status
const fetchCompany = () => {
  get('company')
    .then((data) => {
      console.log(data.data.active);
      iscompanyActive.value = data.data.active;
      window.dispatchEvent(new Event("isActiveChanged"));
    })
    .catch((err) => {
      console.log("Error fetching company:", err);
    });
};

// 🔥 Access control logic
const canAccess = (to) => {
  // Ako profil NIJE završen, samo Company Settings
  if (!isFinishedProfile) {
    return to === "/company/settings/company";
  }

  // Ako je firma NEaktivna (0), dozvoljeni Dashboard i Company Settings
  if (iscompanyActive.value === 0) {
    return ["/company/dashboard", "/company/settings/company"].includes(to);
  }

  // Ako je firma aktivna (1), sve je dostupno
  return true;
};

console.log(iscompanyActive.value);
// 🔥 Menu with disabled flags
const menuLinks = computed(() => {
  return isFinishedProfile
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
              disabled: !canAccess("/company/order/view"),
            },
            {
              label: t("create_auction"),
              to: "/company/auction/create",
              icon: "plus",
              disabled: !canAccess("/company/order/view"),
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
              to: "/company/settings/user",
              icon: "gear",
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
</script>

<style>
  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.3s ease;
  }
  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(-100%);
  }
</style>
