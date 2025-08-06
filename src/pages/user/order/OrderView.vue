<template>
    <ButtonBack />
    <div class="p-6 mt-8 mb-8 ml-3 bg-white rounded-lg shadow-2xl overflow-y-auto">
            <h1>This is Order View page for User</h1>
    </div>
</template>

<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>