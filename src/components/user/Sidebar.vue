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
import { computed, onBeforeUnmount, onMounted, provide, ref } from "vue";
import { useI18n } from "vue-i18n";
import { get } from "@/js/helper/api.js";

const { t } = useI18n();

const props = defineProps({
  isOpen: Boolean,
  toggleSidebar: Function,
  isDesktop: Boolean,
});

const iscompanyActive = ref(0);
const isDesktop = ref(window.innerWidth >= 768);
const isFinishedProfile = localStorage.getItem("is_finished_profile") === "1";

provide("toggleSidebar", props.toggleSidebar);

function handleResize() {
  isDesktop.value = window.innerWidth >= 768;
}

onMounted(() => {
  handleResize();
  fetchUser();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

const fetchUser = () => {
  const token = localStorage.getItem("token");
  get("user-info")
    .then((data) => {
      iscompanyActive.value = parseInt(data.data.active);
      const isFinished = data.data.is_finished_profile === 1;
      window.dispatchEvent(new Event("isActiveChanged"));
    })
    .catch((error) => {
      console.error("Error submitting company data:", error);
    });
};

const menuLinks = computed(() => {
  return isFinishedProfile
    ? [
        {
          title: t("dashboard"),
          items: [
            { label: t("home"), to: "/user/dashboard", icon: "house" },
          ],
        },
        {
          title: t("products"),
          items: [
            { label: t("all_products"), to: "/user/products", icon: "shop" },
            { label: t("add_product"), to: "/user/products/create", icon: "cart-plus" },
          ],
        },
        {
          title: t("orders"),
          items: [{ label: t("view_orders"), to: "/user/order/view", icon: "eye" }],
        },
        {
          title: t("auctions"),
          items: [
            { label: t("auction_view"), to: "/user/auction/view", icon: "eye" },
            { label: t("create_auction"), to: "/user/auction/create", icon: "plus" },
          ],
        },
        {
          title: t("settings"),
          items: [
            { label: t("user_settings"), to: "/user/settings/user", icon: "gear" },
            { label: t("profile_settings"), to: "/user/settings/profile", icon: "user" },
            { label: t("payment_settings"), to: "/user/settings/payment", icon: "credit-card" },
          ],
        },
      ]
    : [
        {
          title: t("user_complete_settings"),
          items: [{ label: t("user"), to: "/user/settings/user", icon: "gear" }],
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
