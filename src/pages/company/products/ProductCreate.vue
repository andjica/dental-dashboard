<template>
<div class="p-6 bg-white shadow rounded-lg mt-8">
    <h1 class="text-2xl font-semibold mb-6">Create a New Product</h1>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Product Name -->
      <div>
        <label class="block text-sm font-medium mb-1">Product Name</label>
        <input v-model="form.name" type="text" required class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200" />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium mb-1">Description</label>
        <textarea v-model="form.description" rows="4" class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"></textarea>
      </div>

      <!-- Price -->
      <div>
        <label class="block text-sm font-medium mb-1">Price ($)</label>
        <input v-model="form.price" type="number" min="0" step="0.01" required class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200" />
      </div>

      <!-- Category -->
      <div>
        <label class="block text-sm font-medium mb-1">Category</label>
        <select v-model="form.category" class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200">
          <option disabled value="">Select a category</option>
          <option>Electronics</option>
          <option>Clothing</option>
          <option>Books</option>
          <option>Accessories</option>
        </select>
      </div>

      <!-- Image -->
      <div>
        <label class="block text-sm font-medium mb-1">Product Image</label>
        <input @change="handleImageUpload" type="file" accept="image/*" class="w-full" />
      </div>

      <!-- Stock -->
      <div>
        <label class="block text-sm font-medium mb-1">Stock Quantity</label>
        <input v-model="form.stock" type="number" min="0" class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200" />
      </div>

      <!-- Active -->
      <div class="flex items-center space-x-2">
        <input v-model="form.is_active" type="checkbox" id="is_active" />
        <label for="is_active" class="text-sm">Active</label>
      </div>

      <!-- Buttons -->
      <div class="flex space-x-4">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create</button>
        <button type="button" @click="cancel" class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  is_active: false,
  image: null,
})

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  form.value.image = file
}

const handleSubmit = ( ) => {
  console.log("Submitting product:", form.value)
  // You can send `form.value` to your API here (with FormData if uploading)

  // Example: redirect to product list
  router.push({ name: 'company.products' })
}

// const cancel = () =>  {
//   router.back()
// }
</script>