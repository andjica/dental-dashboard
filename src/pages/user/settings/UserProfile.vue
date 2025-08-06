<template>
  <ButtonBack />
  <div
    class="p-6 mt-8 mb-8 ml-3 max-w-4xl bg-white rounded-lg shadow-2xl overflow-y-auto"
  >
    <h1 class="text-2xl font-bold mb-4">{{ $t('settings_profile') }}</h1>
    <div class="p-6">
      <div class="mb-16">
        <label  class="block text-sm font-semibold text-gray-700 mb-1"
          >{{ $t('email_adress') }}</label
        >
        <input
          type="email"
          value="freelancer33@gmail.com"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          class="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 float-right cursor-pointer"
        >
          {{ $t('email_update') }}
        </button>
      </div>
      <hr class="my-6 border-t" />
      <div class="space-y-4 mb-20">
        <div>
          <label  class="block text-sm font-semibold text-gray-700 mb-1"
            >{{ $t('password_current') }}</label
          >
          <input
            type="password"
            :placeholder="t('enter_password_current')"
            class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label  class="block text-sm font-semibold text-gray-700 mb-1"
            >{{ $t('password_new') }}</label
          >
          <input
            type="password"
            :placeholder="t('enter_password_new')"
            class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label  class="block text-sm font-semibold text-gray-700 mb-1"
            >{{ $t('password_new_confirm') }}</label
          >
          <input
            type="password"
            :placeholder="t('password_new_confirm')"
            class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          class="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 float-right cursor-pointer"
        >
          {{ $t('password_change') }}
        </button>
      </div>
      <hr class="my-6 border-t" />

      <!-- Forgot Password -->
      <div class="mb-6 text-sm">
        <span class="text-gray-600">{{ $t('password_forgot') }}</span>
        <a href="#" class="text-blue-600 hover:underline ml-1"
          >{{ $t('password_send') }}</a
        >
      </div>

      <!-- Account Type -->
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >{{ $t('account_type') }}</label
        >
        <span
          class="inline-block px-3 py-1 bg-green-100 text-green-600 text-sm rounded"
        >
          {{ $t('user') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
