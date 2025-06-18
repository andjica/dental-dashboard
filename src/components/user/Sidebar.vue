<template>
  <!-- Sidebar -->
  <transition name="slide">
    <aside
      v-show="isOpen || isDesktop"
      class="fixed top-0 left-0 z-40 w-64 h-full bg-white shadow-xl text-black flex flex-col p-4 md:relative md:translate-x-0 transition-transform duration-300 ease-in-out"
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
import { ref, provide, onMounted, onBeforeUnmount } from "vue";
import Navigation from "@/components/shared/Navigation.vue";

const props = defineProps({
  isOpen: Boolean,
  toggleSidebar: Function,
});

const isDesktop = ref(window.innerWidth >= 768); // md breakpoint

// ✅ Provide mora biti pozvan odmah, van funkcije:
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

const menuLinks = [
  {
    title: "Dashboard",
    items: [{ label: "Home", to: "/user/dashboard", icon: "house" }],
  },
  {
    title: "Settings",
    items: [{ label: "Profile", to: "/user/settings/profile", icon: "gear" }],
  },
  {
    title: "Product",
    items: [
      { label: "All Products", to: "/user/products", icon: "shop" },
      { label: "Add Product", to: "/user/products/create", icon: "cart-plus" },
    ],
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
