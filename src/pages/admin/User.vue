<template> 
<div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Korisnici</h1>
    <UserTable :users="dummyUsers" />
  </div>
</template>

<script>
    import UserTable from '@/components/admin/UserTable.vue';

    const dummyUsers = [
  { id: 1, name: 'Ana Jovanović', email: 'ana@example.com', role: 'admin' },
  { id: 2, name: 'Marko Petrović', email: 'marko@example.com', role: 'company' },
  { id: 3, name: 'Sara Nikolić', email: 'sara@example.com', role: 'user' }
]
</script>