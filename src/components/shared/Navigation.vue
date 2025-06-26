<template>
  <div class="w-full mb-6">
    <!-- Divider line (lepša) -->
    <hr class="border-t border-gray-200 my-4 md:min-w-full" />

    <!-- Section title -->
    <h3
      class="md:min-w-full text-gray-500 text-[11px] uppercase tracking-widest font-semibold block pb-3 pl-4"
    >
      {{ title }}
    </h3>

    <!-- Menu items -->
    <ul class="md:flex-col md:min-w-full flex flex-col list-none space-y-1">
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="{
          'opacity-50 cursor-not-allowed pointer-events-none': item.disabled,
        }"
      >
        <router-link :to="item.to" v-slot="{ isActive }">
          <div
            :class="[
              'text-[13px] uppercase py-2 font-semibold transition duration-150 ease-in-out flex items-center gap-3 px-4 rounded-md',
              isActive
                ? 'bg-[#C9A538] text-white shadow-sm'
                : 'text-gray-800 hover:bg-gray-100 hover:text-black',
            ]"
            @click="() => handleClick(item)"
          >
            <font-awesome-icon v-if="item.icon" :icon="item.icon" />
            <span>{{ item.label }}</span>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>


<script setup>
import { inject } from "vue";

const props = defineProps({
  title: String,
  items: Array,
});

const toggleSidebar = inject("toggleSidebar");

function handleClick(item) {
  if (item.disabled) return; // Ne reaguje ako je disabled

  if (window.innerWidth < 768 && toggleSidebar) {
    toggleSidebar();
  }
}
</script>
