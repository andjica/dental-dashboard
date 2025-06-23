<template>
    <ButtonBack />
    <div class="p-6">
<h1 class="text-2xl font-bold mb-4">List of companaes</h1>
<TableCustome :data="staticData" /> 
</div>
</template>

<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
import TableCustome from "@/components/admin/TableCustome.vue";

// Staticki podaci
const staticData = [
  { name: "Unisharp", country: "Serbia", city: "Belgrade", active: 12 },
  { name: "Stark", country: "Serbia", city: "Novi Sad", active: 5 },
  { name: "OzNekretnine", country: "Bosnia", city: "Sarajevo", active: 8 },
];
</script>