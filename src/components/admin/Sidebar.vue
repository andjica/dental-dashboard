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
          <h1 class="text-left text-blueGray-600 font-bold uppercase text-sm">
            Dental
          </h1>
          <button
            @click="props.toggleSidebar"
            class="md:hidden text-black focus:outline-none cursor-pointer"
          >
            <font-awesome-icon icon="xmark" />
          </button>
        </div>
        <!-- Navigacija -->
        <Navigation
          v-for="(link, index) in menuLinks"
          :key="index"
          :title="link.title"
          :items="link.items"
        />
      </nav>
    </aside>
  </transition>
</template>

<script setup>
import Navigation from "@/components/shared/Navigation.vue";
import { onBeforeUnmount, onMounted, provide, ref } from "vue";

const props = defineProps({
  isOpen: Boolean,
  toggleSidebar: Function,
});

const isDesktop = ref(window.innerWidth >= 768); // md breakpoint
const isFinishedProfile = JSON.parse(localStorage.getItem("is_finished_profile") || "{}");
provide("toggleSidebar", props.toggleSidebar);

function handleResize() {
  isDesktop.value = window.innerWidth >= 768;
}

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

const menuLinks = isFinishedProfile
  ? [
      {
        title: "Dashboard",
        items: [{ label: "Home", to: "/admin/dashboard", icon: "house" }],
      },
      {
        title: "Products",
        items: [
          { label: "All Products", to: "/admin/products", icon: "shop" },
          {
            label: "Add Product",
            to: "/admin/products/create",
            icon: "cart-plus",
          },
        ],
      },
      {
        title: "View",
        items: [
          { label: "Companies", to: "/admin/companies", icon: "building" },
          { label: "Users", to: "/admin/users", icon: "users" },
        ]
      },
      {
        title: "Order",
        items: [{ label: "View", to: "/admin/order/view", icon: "eye" }],
      },
      {
        title: "Settings",
        items: [{ label: "Company", to: "/admin/settings/company", icon: "gear" },
          { label: "Profile", to: "/admin/settings/profile", icon: "gear" },
          { label: "Payment", to: "/admin/settings/payment", icon: "gear" }
        ],
      },
    ]
  : [
      {
        title: "Settings",
        items: [{ label: "Setting", to: "/admin/settings", icon: "gear" }],
      },
    ];
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
