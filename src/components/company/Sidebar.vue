<template>
  <aside class="w-60 bg-blue-900 text-white h-screen flex flex-col p-4">
    <div class="sidebar-header mb-8 text-center select-none">
      <h2 class="text-2xl font-bold">Company Panel</h2>
    </div>
    <nav class="sidebar-nav flex-1 overflow-y-auto">
      <ul>
        <li>
          <!-- Kada je profil završen, koristi router-link -->
          <router-link
            v-if="profileFinished"
            to="/company/dashboard"
            class="w-full text-left px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded text-white font-medium flex justify-between items-center"
            active-class="bg-blue-700"
          >
            Dashboard
          </router-link>

          <!-- Kada nije, prikazuj neaktivni element -->
          <div
            v-else
            class="w-full text-left px-4 py-2 bg-gray-600 rounded text-white/50 hover:bg-blue-700 font-medium flex justify-between items-center cursor-not-allowed"
            title="Complete your company profile to unlock the dashboard"
          >
            Dashboard
          </div>
        </li>
        <hr />
        <Dropdown
          v-for="(link, index) in dropdownLinks"
          :key="index"
          :title="link.title"
          :items="link.items"
          :disabled="!profileFinished.value"
        />
      </ul>
    </nav>
    <div class="sidebar-footer mt-auto text-center">
      <button
        @click="logout"
        class="bg-red-400 hover:bg-red-600 text-white cursor-pointer px-4 py-2 rounded font-bold transition"
      >
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import Dropdown from "@/components/shared/Dropdown.vue";

const router = useRouter();
const profileFinished = ref(true);

console.log("Is finished",profileFinished);

onMounted(async () => {
  const token = localStorage.getItem("token");
  console.log("Token Sidebar:", token);
  try {
    const companyResponse = await fetch("http://localhost:8000/api/company", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!companyResponse.ok) throw new Error("Failed to fetch");

    const data = await companyResponse.json();
    console.log("SIDEBAR data: ",data);
    profileFinished.value = !!data?.data?.is_finished_profile;
    console.log("profileFinished",profileFinished.value);
  } catch (err) {
    console.error("Failed to fetch company profile info", err);
    profileFinished.value = false;
  }
});

function logout() {
  localStorage.clear();
  router.push("/");
}

const dropdownLinks = [
  {
    title: "Products",
    items: [
      { label: "All Products", to: "/company/products" },
      { label: "Create Product", to: "/company/products/create" },
      { label: "Edit Product 1", to: "/company/products/1/edit" },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Company", to: "/company/settings/company" },
      { label: "Profile", to: "/company/settings/profile" },
    ],
  },
];
</script>
