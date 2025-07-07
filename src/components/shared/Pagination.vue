<template>
  <div  v-if="totalPages > 1" class="flex justify-center items-center gap-4 my-6">
    <button
      @click="goToPreviousPage"
      :disabled="page <= 1"
      :class="[
        'px-4 py-2 bg-gray-200 rounded hover:bg-gray-300',
        page <= 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ]"
    >
      Previous
    </button>

    <span>Page {{ page }} <span v-if="totalPages > 1">of {{ totalPages }}</span>
</span>

    <button
      @click="goToNextPage"
      :disabled="page >= totalPages"
      :class="[
        'px-4 py-2 bg-gray-200 rounded hover:bg-gray-300',
        page >= totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ]"
    >
      Next
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  page: Number,
  totalPages: Number,
});

const emit = defineEmits(["update:page"]);

const goToPreviousPage = () => {
  if (props.page > 1) {
    emit("update:page", props.page - 1);
  }
};

const goToNextPage = () => {
  if (props.page < props.totalPages) {
    emit("update:page", props.page + 1);
  }
};
</script>
