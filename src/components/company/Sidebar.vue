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
            style="color: #C9A538;"
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

const props = defineProps({
  isOpen: Boolean,
  toggleSidebar: Function,
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
  fetchCompany();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

// 🔥 Fetch company active status
const fetchCompany = () => {
  const token = localStorage.getItem("token");
  fetch("http://localhost:8000/api/company", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Fetch error");
      return res.json();
    })
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
          title: "Dashboard",
          items: [
            {
              label: "Home",
              to: "/company/dashboard",
              icon: "house",
              disabled: !canAccess("/company/dashboard"),
            },
          ],
        },
        {
          title: "Products",
          items: [
            {
              label: "All Products",
              to: "/company/products",
              icon: "shop",
              disabled: !canAccess("/company/products"),
            },
            {
              label: "Add Product",
              to: "/company/products/create",
              icon: "cart-plus",
              disabled: !canAccess("/company/products/create"),
            },
          ],
        },
        {
          title: "Order",
          items: [
            {
              label: "View",
              to: "/company/order/view",
              icon: "eye",
              disabled: !canAccess("/company/order/view"),
            },
          ],
        },
        {
          title: "Auctions",
          items: [
            {
              label: "View Auctions",
              to: "/company/auction/view",
              icon: "eye",
              disabled: !canAccess("/company/order/view"),
            },
            {
              label: "Create Auction",
              to: "/company/auction/create",
              icon: "plus",
              disabled: !canAccess("/company/order/view"),
            },
          ],
        },
        {
          title: "Settings",
          items: [
            {
              label: "Company",
              to: "/company/settings/company",
              icon: "gear",
              disabled: !canAccess("/company/settings/company"),
            },
            {
              label: "Profile",
              to: "/company/settings/profile",
              icon: "gear",
              disabled: !canAccess("/company/settings/profile"),
            },
            {
              label: "Payment",
              to: "/company/settings/payment",
              icon: "money-bill",
              disabled: !canAccess("/company/settings/payment"),
            },
          ],
        },
      ]
    : [
        {
          title: "Settings",
          items: [
            {
              label: "User",
              to: "/company/settings/user",
              icon: "gear",
            },
          ],
        },
      ];
});

const settingsLink = computed(() =>
  menuLinks.value.find((link) => link.title === "Settings")
);

const topLinks = computed(() =>
  menuLinks.value.filter((link) => link.title !== "Settings")
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
