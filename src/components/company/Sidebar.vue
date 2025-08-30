<template>
  <transition name="slide">
    <aside
      v-show="isOpen || isDesktop"
      class="fixed md:sticky top-0 left-0 z-40 w-64 h-screen flex flex-col bg-white border-r border-gray-200 shadow-sm"
    >
      <!-- Header -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h1 class="text-xl font-extrabold tracking-wide text-yellow-600">
          Vitelio
        </h1>
        <button
          @click="props.toggleSidebar"
          class="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <font-awesome-icon icon="xmark" size="lg" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 overflow-y-auto">
        <div class="space-y-6">
          <!-- Top links -->
          <div v-for="(link, index) in topLinks" :key="index" class="space-y-2">
            <p class="px-3 text-xs font-semibold uppercase text-gray-400">
              {{ link.title }}
            </p>
            <div class="space-y-1">
              <router-link
                v-for="(item, i) in link.items"
                :key="i"
                :to="item.to"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                active-class="bg-gray-100 text-blue-600 font-semibold"
                :class="{ 'opacity-50 pointer-events-none': item.disabled }"
              >
                <font-awesome-icon :icon="item.icon" class="mr-3 text-gray-500" />
                <span>{{ item.label }}</span>

                <!-- Example badge -->
                <span
                  v-if="item.badge"
                  class="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700"
                >
                  {{ item.badge }}
                </span>
              </router-link>
            </div>
          </div>
        </div>
      </nav>

      <!-- Bottom settings -->
      <div v-if="settingsLink" class="p-4 border-t border-gray-200">
        <p class="px-3 mb-2 text-xs font-semibold uppercase text-gray-400">
          {{ settingsLink.title }}
        </p>
        <div class="space-y-1">
          <router-link
            v-for="(item, i) in settingsLink.items"
            :key="i"
            :to="item.to"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
            active-class="bg-gray-100 text-blue-600 font-semibold"
            :class="{ 'opacity-50 pointer-events-none': item.disabled }"
          >
            <font-awesome-icon :icon="item.icon" class="mr-3 text-gray-500" />
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </div>
    </aside>
  </transition>
</template>

<script setup>
import { ref, provide, onMounted, onBeforeUnmount, computed } from "vue";
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
  get("company")
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
  if (!isFinishedProfile) {
    return to === "/company/settings/company";
  }
  if (iscompanyActive.value === 0) {
    return ["/company/dashboard", "/company/settings/company"].includes(to);
  }
  return true;
};

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
