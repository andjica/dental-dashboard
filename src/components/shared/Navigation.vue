<template>
  <div class="w-full mb-4">
    <hr class="my-4 md:min-w-full" />
    <h3
      class="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4"
    >
      {{ title }}
    </h3>
    <ul class="md:flex-col md:min-w-full flex flex-col list-none">
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
              'text-xs uppercase py-3 font-bold block transition duration-150 ease-in-out flex items-center gap-2 px-4 rounded',
              isActive
                ? 'text-white green-custom'
                : 'text-blueGray-700 hover-light-gray hover:text-black',
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
