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
        <!-- TOOLBAR -->
        <div class="flex flex-wrap items-center gap-2 mb-2 text-sm">
          <button
            @click="toggleBold"
            :class="buttonClass(editor.isActive('bold'))"
          >
            B
          </button>
          <button
            @click="toggleItalic"
            :class="buttonClass(editor.isActive('italic'))"
          >
            <em>I</em>
          </button>
          <button
            @click="toggleUnderline"
            :class="buttonClass(editor.isActive('underline'))"
          >
            <u>U</u>
          </button>
          <button
            @click="toggleStrike"
            :class="buttonClass(editor.isActive('strike'))"
          >
            <s>S</s>
          </button>

          <button
            @click="toggleHeading(1)"
            :class="buttonClass(editor.isActive('heading', { level: 1 }))"
          >
            H1
          </button>
          <button
            @click="toggleHeading(2)"
            :class="buttonClass(editor.isActive('heading', { level: 2 }))"
          >
            H2
          </button>

          <button
            @click="toggleBulletList"
            :class="buttonClass(editor.isActive('bulletList'))"
          >
            • List
          </button>
          <button
            @click="toggleOrderedList"
            :class="buttonClass(editor.isActive('orderedList'))"
          >
            1. List
          </button>
        </div>
        <!-- EDITOR -->
        <EditorContent
          :editor="editor"
          class="border rounded p-3 min-h-[150px]"
        />

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
          @keypress="allowOnlyNumbersAndDot"
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
      <!-- Sub-category -->
      <!-- <div>
        <label class="block text-sm font-medium mb-1">Sub-category</label>
        <select
          v-model="form.category"
          class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option disabled value="">Select a subcategory</option>
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
          {{ form.image.length }} image{{ form.image.length > 1 ? "s" : "" }}
          selected
        </div>
        <p v-if="errors.productImages" class="text-red-500 text-sm mt-1">
          {{ errors.productImages }}
        </p>
      </div>

      <div class="flex flex-wrap -mx-2 mb-4">
        <div class="w-full md:w-1/3 px-2">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Length</label
          >
          <input
          v-model="form.leght"
          type="text"
          class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <p v-if="errors.productLength" class="text-red-500 text-sm mt-1">
          {{ errors.productLength }}
        </p>
        </div>
        <div class="w-full md:w-1/3 px-2">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Width</label
          >
          <input
          v-model="form.width"
          type="text"
          class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <p v-if="errors.productWidth" class="text-red-500 text-sm mt-1">
          {{ errors.productWidth }}
        </p>
        </div>
        <div class="w-full md:w-1/3 px-2">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Height</label
          >
          <input
          v-model="form.height"
          type="text"
          class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <p v-if="errors.productHeight" class="text-red-500 text-sm mt-1">
          {{ errors.productHeight }}
        </p>
        </div>
        <div class="w-full md:w-1/3 px-2">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Weight</label
          >
          <input
          v-model="form.weight"
          type="text"
          class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <p v-if="errors.productWeight" class="text-red-500 text-sm mt-1">
          {{ errors.productWeight }}
        </p>
        </div>
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
import { ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";

import { validateProductForm } from "@/helper/form-validation/product/product-create";

const router = useRouter();
const editor = ref(null);

const form = ref({
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  is_active: false,
  image: [],
  length: "",
  width: "",
  height: "",
  weight: ""
});

const imagePreviews = ref([]);
const displayPrice = ref("");
const errors = ref({});

editor.value = new Editor({
  extensions: [
    StarterKit,
    Underline,
    Heading.configure({ levels: [1, 2, 3] }),
    BulletList,
    OrderedList,
  ],
  editorProps: {
    attributes: {
      class: "min-h-[150px] focus:outline-none",
      placeholder: "Write description of product...",
    },
  },
  onUpdate({ editor }) {
    form.value.description = editor.getHTML();
  },
});

const toggleBold = () => editor.value.chain().focus().toggleBold().run();
const toggleItalic = () => editor.value.chain().focus().toggleItalic().run();
const toggleUnderline = () =>
  editor.value.chain().focus().toggleUnderline().run();
const toggleStrike = () => editor.value.chain().focus().toggleStrike().run();

const toggleHeading = (level) =>
  editor.value.chain().focus().toggleHeading({ level }).run();

const toggleBulletList = () =>
  editor.value.chain().focus().toggleBulletList().run();

const toggleOrderedList = () =>
  editor.value.chain().focus().toggleOrderedList().run();

const buttonClass = (isActive) => {
  return `px-2 py-1 rounded border ${
    isActive
      ? "bg-blue-600 text-white"
      : "bg-white text-gray-800 hover:bg-gray-100"
  }`;
};

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
  // Ukloni sve osim cifara i tačke
  let input = e.target.value.replace(/[^0-9.]/g, "");

  // Samo prva tačka se dozvoljava (decimalna)
  const parts = input.split(".");
  if (parts.length > 2) {
    input = parts[0] + "." + parts[1];
  }

  displayPrice.value = input;
  form.value.price = input ? parseFloat(input).toFixed(2) : "";
};

const allowOnlyNumbersAndDot = (e) => {
  const allowedChars = "0123456789.";
  if (!allowedChars.includes(e.key)) {
    e.preventDefault();
  }
};


const formatDisplayPrice = () => {
  if (displayPrice.value !== "") {
    const formatted = parseFloat(displayPrice.value)
      .toFixed(2)
      .replace(".", ",");
    displayPrice.value = formatted;
  }
};
console.log("Form: ", form);
const handleSubmit = () => {
  const token = localStorage.getItem("token");

  const { isValid, errors: validationErrors } = validateProductForm({
    productName: form.value.name,
    productDesc: form.value.description,
    productImages: form.value.image || [],
    productQuantity: form.value.stock,
    productPrice: form.value.price,
    productLength: form.value.length,
    productWidth: form.value.width,
    productHeight: form.value.height,
    productWeight: form.value.weight
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
    length: form.value.length,
    width: form.value.width,
    height: form.value.height,
    weight: form.value.weight
  };

  // Uzmi postojeci niz iz localStorage ili napravi prazan
  const storedProducts = JSON.parse(localStorage.getItem("companyProduct")) || [];

  // Dodaj novi proizvod u niz
  storedProducts.push(productToStore);

  // Snimi ažurirani niz nazad u localStorage
  localStorage.setItem("companyProduct", JSON.stringify(storedProducts));

  // (opciono) idi dalje
  console.log("Product locally saved:", productToStore);
  router.push({ name: "company.products" });
};

// const cancel = () =>  {
//   router.back()
// }
</script>
