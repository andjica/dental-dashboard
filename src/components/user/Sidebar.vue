<template>
  <transition name="slide">
    <aside v-show="isOpen || isDesktop"
      class="sticky top-0 z-40 w-64 h-screen overflow-y-auto bg-white shadow-xl text-black flex flex-col p-4 md:relative md:translate-x-0 transition-transform duration-300 ease-in-out">
      <nav class="flex flex-col flex-grow">
        <!-- Header -->
        <div class="flex justify-between items-center px-4 py-3 bg-white shadow md:shadow-none">
          <h1 class="text-left text-blueGray-600 font-bold uppercase text-sm">
            Dental
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
  fetch("http://localhost:8000/api/user-info", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok!");
      }
      return response.json();
    })
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
const menuLinks = isFinishedProfile
  ? [
    {
      title: "Dashboard",
      items: [{ label: "Home", to: "/user/dashboard", icon: "house",}],
    },
    {
      title: "Product",
      items: [
        { label: "All Products", to: "/user/products", icon: "shop", },
        { label: "Add Product", to: "/user/products/create", icon: "cart-plus", },
      ],
    },
    {
      title: "Order",
      items: [{ label: "View", to: "/user/order/view", icon: "eye", }],
    },
    {
        title: "Auctions",
        items:[
          {label: "View Auctions", to: "/user/auction/view", icon: "eye"},
          {label: "Create Auction", to: "/user/auction/create", icon: "plus"}
        ]
      },
    {
      title: "Settings",
      items: [
        { label: "User", to: "/user/settings/user", icon: "gear", },
        { label: "Profile", to: "/user/settings/profile", icon: "gear", },
        { label: "Payment", to: "/user/settings/payment", icon: "money-bill", },
      ],
    },
  ]
  : [
    {
      title: "Settings",
      items: [{ label: "User", to: "/user/settings/user", icon: "gear" }],
    },
  ];

// Odvoji Settings
const settingsLink = computed(() =>
  menuLinks.find((link) => link.title === "Settings")
);

// Ostali linkovi
const topLinks = computed(() =>
  menuLinks.filter((link) => link.title !== "Settings")
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