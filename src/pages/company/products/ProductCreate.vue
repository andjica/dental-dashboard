<template>
  <div class="p-6 bg-white shadow rounded-lg mt-8">
    <h1 class="text-2xl font-semibold mb-6">Create a New Product</h1>

    <form
      @submit.prevent="handleSubmit"
      class="space-y-6"
      enctype="multipart/form-data"
    >
      <!-- Product Name -->
      <div>
        <label class="block text-sm font-medium mb-1">Product Name</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <p v-if="errors.productName" class="text-red-500 text-sm mt-1">
          {{ errors.productName }}
        </p>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium mb-1">Description</label>
        <Ckeditor v-model="description" />
        <p v-if="errors.productDesc" class="text-red-500 text-sm mt-1">
          {{ errors.productDesc }}
        </p>
      </div>

      <!-- Price -->
      <div>
        <label class="block text-sm font-medium mb-1">Price ($)</label>
        <input
          :value="displayPrice"
          @input="onPriceInput"
          @blur="formatDisplayPrice"
          type="text"
          inputmode="numeric"
          class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <p v-if="errors.productPrice" class="text-red-500 text-sm mt-1">
          {{ errors.productPrice }}
        </p>
      </div>

      <!-- Category -->
      <!-- <div>
        <label class="block text-sm font-medium mb-1">Category</label>
        <select
          v-model="form.category"
          class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option disabled value="">Select a category</option>
          <option>Electronics</option>
          <option>Clothing</option>
          <option>Books</option>
          <option>Accessories</option>
        </select>
        <p v-if="errors.productDesc" class="text-red-500 text-sm mt-1">
          {{ errors.productDesc }}
        </p>
      </div> -->

      <!-- Image -->
      <div>
        <label class="block text-sm font-medium mb-1">Product Image</label>
        <div>
          <label
            for="imageUpload"
            class="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded cursor-pointer transition duration-200"
          >
            Select Images
          </label>
          <input
            id="imageUpload"
            @change="handleImageUpload"
            type="file"
            multiple
            accept="image/*"
            class="hidden"
          />
        </div>
        <div class="flex flex-wrap gap-4 mt-4">
          <div
            v-for="(img, index) in imagePreviews"
            :key="index"
            class="relative w-24 h-24 border rounded overflow-hidden shadow-sm"
          >
            <img
              :src="img"
              alt="Selected Image"
              class="object-cover w-full h-full"
            />
            <!-- Dugme za uklanjanje -->
            <button
              @click.prevent="removeImage(index)"
              class="absolute top-1 right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow hover:bg-red-700 transition cursor-pointer"
              title="Remove"
            >
              ×
            </button>
          </div>
        </div>
        <div v-if="form.image.length" class="mt-2 text-sm text-gray-600">
            {{ form.image.length }} image{{ form.image.length > 1 ? 's' : '' }} selected
          </div>
        <p v-if="errors.productImages" class="text-red-500 text-sm mt-1">
          {{ errors.productImages }}
        </p>
      </div>

      <!-- Stock -->
      <div>
        <label class="block text-sm font-medium mb-1">Stock Quantity</label>
        <input
          v-model="form.stock"
          type="number"
          min="0"
          class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <p v-if="errors.productQuantity" class="text-red-500 text-sm mt-1">
          {{ errors.productQuantity }}
        </p>
      </div>

      <!-- Active -->
      <div class="flex items-center space-x-2">
        <input v-model="form.is_active" type="checkbox" id="is_active" />
        <label for="is_active" class="text-sm">Active</label>
      </div>

      <!-- Buttons -->
      <div class="flex space-x-4">
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Create
        </button>
        <button
          type="button"
          @click="cancel"
          class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import { validateProductForm } from "@/helper/form-validation/product/product-create";
import Ckeditor from "@/components/shared/Ckeditor.vue";

const router = useRouter();

const form = ref({
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  is_active: false,
  image: [],
});

const imagePreviews = ref([]);
const displayPrice = ref(""); 
const errors = ref({});

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    form.value.image.push(file);
    imagePreviews.value.push(URL.createObjectURL(file));
  });
};

const removeImage = (index) => {
  form.value.image.splice(index, 1);
  const url = imagePreviews.value.splice(index, 1)[0];
  URL.revokeObjectURL(url); // očisti memoriju
};

onBeforeUnmount(() => {
  imagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
});

const onPriceInput = (e) => {
  // Dozvoli samo brojeve (0–9)
  const raw = e.target.value.replace(/\D/g, "");
  displayPrice.value = raw;
  form.value.price = raw ? parseFloat(raw).toFixed(2) : "";
};

const formatDisplayPrice = () => {
  if (displayPrice.value !== "") {
    const formatted = parseFloat(displayPrice.value).toFixed(2).replace('.', ',');
    displayPrice.value = formatted;
  }
};
console.log("Form: ",form);
const handleSubmit = () => {
  const token = localStorage.getItem("token");

  const { isValid, errors: validationErrors } = validateProductForm({
    productName: form.value.name,
    productDesc: form.value.description,
    productImages: form.value.image || [],
    productQuantity: form.value.stock,
    productPrice: form.value.price,
  });

  errors.value = validationErrors;
  console.log(errors.value);
  if (!isValid) return;

  // Napravi objekat koji se može sačuvati i da pazim kako sa backe-a se zovu kolone
  const productToStore = {
    name: form.value.name,
    description: form.value.description,
    price: form.value.price,
    category: form.value.category,
    stock: form.value.stock,
    is_active: form.value.is_active,
    images: form.value.image.map((file) => file.name), // samo imena slika
    created_at: new Date().toISOString(),
  };

  // Uzmi postojeci niz iz localStorage ili napravi prazan
  const storedProducts = JSON.parse(localStorage.getItem("company")) || [];

  // Dodaj novi proizvod u niz
  storedProducts.push(productToStore);

  // Snimi ažurirani niz nazad u localStorage
  localStorage.setItem("company", JSON.stringify(storedProducts));

  // (opciono) idi dalje
  console.log("Product locally saved:", productToStore);
  router.push({ name: "company.products" });
};

// const cancel = () =>  {
//   router.back()
// }
</script>
