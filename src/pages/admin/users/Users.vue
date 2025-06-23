<template> 
<ButtonBack />
<div class="p-6">
    <h1 class="text-2xl font-bold mb-4">List of users</h1>
     <TableCustome :data="dummyUsers" /> 
  </div>
</template>

<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import TableCustome from "@/components/admin/TableCustome.vue";
//     import UserTable from '@/components/admin/Table.vue';

    const dummyUsers = [
  { id: 1, name: 'Ana Jovanović', country: "Serbia", city: "Belgrade", active: 12 },
  { id: 2, name: 'Marko Petrović', country: "Croatia", city: "Zagreb", active: 5 },
  { id: 3, name: 'Sara Nikolić', country: "Bosnia", city: "Sarajevo", active: 8 }
]
</script>