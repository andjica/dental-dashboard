<template>
  <div class="relative inline-flex w-full flex-col">
    <button
      ref="btnDropdownRef"
      @click="handleClick"
      class="w-full text-left px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded text-white font-medium flex justify-between items-center"
      :class="[
        disabled
          ? 'bg-gray-500 cursor-not-allowed text-white/50'
          : 'bg-blue-800 hover:bg-blue-700 text-white',
      ]"
      :disabled="disabled"
    >
      {{ title }}
      <svg
        class="w-4 h-4 ml-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
    <hr />

    <transition name="fade-scale">
      <div
        v-show="dropdownPopoverShow"
        ref="popoverDropdownRef"
        class="w-full bg-white text-black rounded shadow-lg mt-2 z-10"
      >
        <ul class="py-1">
          <li v-for="(item, index) in items" :key="index">
            <router-link
              :to="disabled ? '' : item.to"
              class="block px-4 py-2 text-sm hover:bg-gray-100"
              :class="
                disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'hover:bg-gray-100 text-black'
              "
              @click.prevent="disabled ? null : (dropdownPopoverShow = false)"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    items: Array,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dropdownPopoverShow: false,
    };
  },
  methods: {
    toggleDropdown() {
      console.log("Click");
      this.dropdownPopoverShow = !this.dropdownPopoverShow;
    },
    handleClick(){
      if(!this.disabled) {
        this.toggleDropdown();
      }
    }
  },
};
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 200ms ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
