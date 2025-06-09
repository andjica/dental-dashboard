<template>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white shadow rounded">
      <thead>
        <tr class="bg-gray-100 text-left text-sm font-bold text-gray-600">
          <th class="py-2 px-4">ID</th>
          <th class="py-2 px-4">Ime</th>
          <th class="py-2 px-4">Email</th>
          <th class="py-2 px-4">Uloga</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="border-t">
          <td class="py-2 px-4">{{ user.id }}</td>
          <td class="py-2 px-4">{{ user.name }}</td>
          <td class="py-2 px-4">{{ user.email }}</td>
          <td class="py-2 px-4">{{ user.role }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  users: Array
})
</script>