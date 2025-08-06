<template>
  <transition name="slide">
    <aside v-show="isOpen || isDesktop"
      class="sticky top-0 z-40 w-64 h-screen overflow-y-auto bg-white shadow-xl text-black flex flex-col p-4 md:relative md:translate-x-0 transition-transform duration-300 ease-in-out">
      <nav class="flex flex-col flex-grow">
        <!-- Header -->
        <div class="flex justify-between items-center px-4 py-3 bg-white shadow md:shadow-none">
          <h1
            class="text-left font-extrabold uppercase text-lg tracking-wide"
            style="color: #c9a538"
          >
            Vitelio
          </h1>
          <button @click="props.toggleSidebar" class="md:hidden text-black focus:outline-none cursor-pointer">
            <font-awesome-icon icon="xmark" />
          </button>
        </div>

        <!-- Top Navigation -->
        <div class="flex flex-col flex-grow">
          <Navigation v-for="(link, index) in topLinks" :key="index" :title="link.title" :items="link.items" />
        </div>

        <!-- Settings at Bottom -->
        <div class="mt-auto">
          <Navigation v-if="settingsLink" :title="settingsLink.title" :items="settingsLink.items" />
        </div>
      </nav>
    </aside>
  </transition>
</template>

<script setup>
import Navigation from "@/components/shared/Navigation.vue";
import { computed, onBeforeUnmount, onMounted, provide, ref } from "vue";
import { useI18n } from 'vue-i18n';
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
  get('user-info')
    .then((data) => {
      iscompanyActive.value = parseInt(data.data.active);
      const isFinished = data.data.is_finished_profile === 1;
      window.dispatchEvent(new Event("isActiveChanged"));
    })
    .catch((error) => {
      console.error("Error submitting company data:", error);
      // Eventualno možeš prikazati grešku korisniku
    });
}

// Tvoj meni
const menuLinks = computed(() => { return isFinishedProfile
  ? [
    {
      title: t("dashboard"),
      items: [{ label: t("home"), to: "/user/dashboard", icon: "house",}],
    },
    {
      title: t("products"),
      items: [
        { label: t("all_products"), to: "/user/products", icon: "shop", },
        { label: t("add_product"), to: "/user/products/create", icon: "cart-plus", },
      ],
    },
    {
      title: t("orders"),
      items: [{ label: t("view_orders"), to: "/user/order/view", icon: "eye", }],
    },
    {
        title: t("auctions"),
        items:[
          {label: t("auction_view"), to: "/user/auction/view", icon: "eye"},
          {label: t("create_auction"), to: "/user/auction/create", icon: "plus"}
        ]
      },
    {
      title: t("settings"),
      items: [
        { label: t('user_settings'), to: "/user/settings/user", icon: "gear", },
        { label: t("profile_settings"), to: "/user/settings/profile", icon: "gear", },
        { label: t("payment_settings"), to: "/user/settings/payment", icon: "money-bill", },
      ],
    },
  ]
  : [
    {
      title: t('user_complete_settings'),
      items: [{ label: t('user'), to: "/user/settings/user", icon: "gear" }],
    },
  ];
});

// Odvoji Settings
const settingsLink = computed(() =>
  menuLinks.value.find((link) => link.title === t("settings"))
);

// Ostali linkovi
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