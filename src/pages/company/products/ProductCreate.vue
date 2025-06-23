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

      <!-- Product main image -->
      <div class="mt-4">
        <label class="block text-sm font-medium mb-1">Main Image</label>
        <label
          for="mainImageInput"
          class="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 cursor-pointer transition duration-200"
        >
          Upload Image
        </label>

        <!-- Hidden file input -->
        <input
          id="mainImageInput"
          type="file"
          accept="image/*"
          @change="handleMainImageUpload"
          class="hidden"
        />
        <div v-if="mainImagePreview" class="mt-2">
          <img
            :src="mainImagePreview"
            alt="Preview"
            class="relative w-34 h-34 border rounded overflow-hidden shadow-sm"
          />
        </div>
        <p v-if="errors.productMainImage" class="text-red-500 text-sm mt-1">
          {{ errors.productMainImage }}
        </p>
      </div>
      <!-- Product Type -->
      <div>
        <label class="block text-sm font-medium mb-1">Product type</label>
        <div class="flex items-center space-x-4 mb-2">
          <label class="inline-flex items-center">
            <input
              type="radio"
              value="new"
              v-model="form.type"
              class="form-radio text-blue-600"
            />
            <span class="ml-2">New</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              value="used"
              v-model="form.type"
              class="form-radio text-blue-600"
            />
            <span class="ml-2">Used</span>
          </label>
        </div>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium mb-1">Description</label>
        <!-- TOOLBAR -->
        <div class="flex flex-wrap items-center gap-2 mb-2 text-sm">
          <button
            type="button"
            @click="toggleBold"
            :class="buttonClass(editor.isActive('bold'))"
          >
            B
          </button>
          <button
            type="button"
            @click="toggleItalic"
            :class="buttonClass(editor.isActive('italic'))"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            @click="toggleUnderline"
            :class="buttonClass(editor.isActive('underline'))"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            @click="toggleStrike"
            :class="buttonClass(editor.isActive('strike'))"
          >
            <s>S</s>
          </button>

          <button
            type="button"
            @click="toggleHeading(1)"
            :class="buttonClass(editor.isActive('heading', { level: 1 }))"
          >
            H1
          </button>
          <button
            type="button"
            @click="toggleHeading(2)"
            :class="buttonClass(editor.isActive('heading', { level: 2 }))"
          >
            H2
          </button>

          <button
            type="button"
            @click="toggleBulletList"
            :class="buttonClass(editor.isActive('bulletList'))"
          >
            • List
          </button>
          <button
            type="button"
            @click="toggleOrderedList"
            :class="buttonClass(editor.isActive('orderedList'))"
          >
            1. List
          </button>
        </div>
        <!-- EDITOR -->
        <EditorContent
          :editor="editor.value"
          class="border rounded p-3 min-h-[150px]"
        />

        <p v-if="errors.productDesc" class="text-red-500 text-sm mt-1">
          {{ errors.productDesc }}
        </p>
      </div>

      <!-- Category -->
      <div class="flex flex-wrap -mx-2 mb-4">
        <div class="w-full md:w-1/3 px-2">
          <label class="block text-sm font-medium mb-1">Product Category</label>
          <select
            v-model="form.category"
            class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option disabled value="">Select a category</option>
            <option
              v-for="category in form.categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
          <p v-if="errors.productCategory" class="text-red-500 text-sm mt-1">
            {{ errors.productCategory }}
          </p>
        </div>
        <!-- Sub-category -->
        <div class="w-full md:w-1/3 px-2">
          <label class="block text-sm font-medium mb-1"
            >Product Sub-category</label
          >
          <select
            v-model="form.subCategory"
            class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option disabled value="">Select a subcategory</option>
            <option
              v-for="subCategory in form.subCategories"
              :key="subCategory.id"
              :value="subCategory.id"
            >
              {{ subCategory.name }}
            </option>
          </select>
          <p v-if="errors.productSub" class="text-red-500 text-sm mt-1">
            {{ errors.productSub }}
          </p>
        </div>
      </div>

      <!-- Price -->
      <div class="w-full md:w-1/3 md:pr-2 pr-0">
        <label class="block text-sm font-medium mb-1">Price (€)</label>
        <input
          :value="form.price"
          @input="(e) => cleanNumberInput(e, 'price')"
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

      <!-- Images -->
      <div>
        <label class="block text-sm font-medium mb-1">Product Gallery</label>
        <div>
          <label
            for="imageUpload"
            class="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded cursor-pointer transition duration-200"
          >
            Select Images
          </label>
          <input
            id="imageUpload"
            name="images[]"
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
        <div
          v-if="form.image_gallery.length"
          class="mt-2 text-sm text-gray-600"
        >
          {{ form.image_gallery.length }} image{{
            form.image_gallery.length > 1 ? "s" : ""
          }}
          selected
        </div>
        <p v-if="errors.productGallery" class="text-red-500 text-sm mt-1">
          {{ errors.productGallery }}
        </p>
      </div>

      <div class="flex flex-wrap -mx-2 mb-4">
        <div class="w-full md:w-1/3 px-2">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Length (cm)</label
          >
          <input
            v-model="form.leght"
            @input="(e) => cleanNumberInput(e, 'length')"
            @keypress="allowOnlyNumbersAndDot"
            type="text"
            class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
          <p v-if="errors.productLength" class="text-red-500 text-sm mt-1">
            {{ errors.productLength }}
          </p>
        </div>
        <div class="w-full md:w-1/3 md:mt-0 mt-2 px-2">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Width (cm)</label
          >
          <input
            v-model="form.width"
            @input="(e) => cleanNumberInput(e, 'width')"
            @keypress="allowOnlyNumbersAndDot"
            type="text"
            class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
          <p v-if="errors.productWidth" class="text-red-500 text-sm mt-1">
            {{ errors.productWidth }}
          </p>
        </div>
        <div class="w-full md:w-1/3 md:mt-0 mt-2 px-2">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Height (cm)</label
          >
          <input
            v-model="form.height"
            @input="(e) => cleanNumberInput(e, 'height')"
            @keypress="allowOnlyNumbersAndDot"
            type="text"
            class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
          <p v-if="errors.productHeight" class="text-red-500 text-sm mt-1">
            {{ errors.productHeight }}
          </p>
        </div>
        <div class="w-full md:w-1/3 px-2 mt-2">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Weight (kg)</label
          >
          <input
            v-model="form.weight"
            @input="(e) => cleanNumberInput(e, 'weight')"
            @keypress="allowOnlyNumbersAndDot"
            placeholder="example 1.5"
            type="text"
            class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
          <p v-if="errors.productWeight" class="text-red-500 text-sm mt-1">
            {{ errors.productWeight }}
          </p>
        </div>
      </div>
      <!-- Stock -->
      <div class="w-full md:w-1/3 md:pr-2 pr-0">
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
import { ref, onBeforeUnmount, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";

import { validateProductForm } from "@/helper/form-validation/product/product-create";

const router = useRouter();
const editor = ref(null);

const form = ref({
  name: "",
  image_main: null,
  type: "new",
  description: "",
  price: "",
  category: "",
  categories: [],
  subCategory: "",
  subCategories: [],
  stock: "",
  is_active: false,
  image_gallery: [],
  length: "",
  width: "",
  height: "",
  weight: "",
});

const mainImagePreview = ref(null);
const imagePreviews = ref([]);
const errors = ref({});

// for alert
const showAlert = ref(false);
const alertType = ref(["success"]); // or 'error'
const alertMessage = ref("");

const toggleBold = () => editor.value.chain().focus().toggleBold().run();
const toggleItalic = () => editor.value.chain().focus().toggleItalic().run();
const toggleUnderline = () =>
  editor.value.chain().focus().toggleUnderline().run();
const toggleStrike = () => editor.value.chain().focus().toggleStrike().run();

const toggleHeading = (level) =>
  editor.value.chain().focus().toggleHeading({ level }).run();

const toggleBulletList = () =>
  editor.chain().focus().toggleBulletList().run();

const toggleOrderedList = () =>
  editor.chain().focus().toggleOrderedList().run();

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
    form.value.image_gallery.push(file);
    imagePreviews.value.push(URL.createObjectURL(file));
  });
};

const handleMainImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.image_main = file; // poveži sa formom

    // Kreiraj preview URL
    mainImagePreview.value = URL.createObjectURL(file);
  } else {
    mainImagePreview.value = null;
    form.value.image_main = "";
  }
};

const removeImage = (index) => {
  form.value.image_gallery.splice(index, 1);
  const url = imagePreviews.value.splice(index, 1)[0];
  URL.revokeObjectURL(url); // očisti memoriju
};

onMounted(() => {
  fetchCategory();

  editor.value = new Editor({
  extensions: [
    StarterKit,
    Underline,
    Heading.configure({ levels: [1, 2, 3] }),
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
});

watch(
  () => form.value.category,
  (newCategoryId) => {
    if (newCategoryId) {
      form.value.subCategory = ""; // reset subcategory
      fetchSubcategory(newCategoryId);
    } else {
      form.value.subCategories = [];
      form.value.subCategory = "";
    }
  }
);

onBeforeUnmount(() => {
  imagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
  if (mainImagePreview.value) {
    URL.revokeObjectURL(mainImagePreview.value);
  }
});

const cleanNumberInput = (e, field) => {
  let input = e.target.value.replace(/[^0-9.]/g, "");

  const parts = input.split(".");
  if (parts.length > 2) {
    input = parts[0] + "." + parts[1];
  }

  form.value[field] = input;
};

const allowOnlyNumbersAndDot = (e) => {
  const allowedChars = "0123456789.";
  if (!allowedChars.includes(e.key)) {
    e.preventDefault();
  }
};

const formatDisplayPrice = () => {
  if (form.value.price !== "") {
    const formatted = parseFloat(form.value.price).toFixed(2).replace(".", ",");
    form.value.price = formatted;
  }
};

const fetchCategory = () => {
  const token = localStorage.getItem("token");
  return fetch("http://localhost:8000/api/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch cities");
      }
      return res.json();
    })
    .then((data) => {
      form.value.categories = data.data || [];
    })
    .catch((err) => {
      console.log("Errro throw fetching category: ", err);
    });
};

const fetchSubcategory = (categoryId) => {
  const token = localStorage.getItem("token");
  return fetch(`http://localhost:8000/api/sub-categories/${categoryId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch sub category");
      }
      return res.json();
    })
    .then((data) => {
      form.value.subCategories = data.data || [];
    })
    .catch((err) => {
      console.log("Errro throw fetching sub-category: ", err);
    });
};
const handleSubmit = () => {
  const token = localStorage.getItem("token");

  const { isValid, errors: validationErrors } = validateProductForm({
    productName: form.value.name,
    productMainImage: form.value.image_main,
    productType: form.value.type,
    productDesc: form.value.description,
    productCategory: form.value.category,
    productSub: form.value.subCategory,
    productGallery: form.value.image_gallery || [],
    productQuantity: form.value.stock,
    productPrice: form.value.price,
    productLength: form.value.length,
    productWidth: form.value.width,
    productHeight: form.value.height,
    productWeight: form.value.weight,
  });

  errors.value = validationErrors;
  console.log(errors.value);
  if (!isValid) return;

  const formData = new FormData();
  formData.append("name", form.value.name);
  formData.append("description", form.value.description);
  formData.append("main_image", form.value.image_main);
  formData.append("product_type", form.value.type);
  formData.append("category_id", form.value.category);
  formData.append("sub_category_id", form.value.subCategory);
  formData.append("base_price", form.value.price);
  formData.append("barcode", "11114444");
  form.value.image_gallery.forEach((file) => {
    formData.append("images[]", file);
  });
  formData.append("quantity", form.value.stock);
  formData.append("length", form.value.length);
  formData.append("width", form.value.width);
  formData.append("height", form.value.height);
  formData.append("weight", form.value.weight);
  formData.append("in_stock", form.value.is_active ? "1" : "0");

  fetch("http://localhost:8000/api/products", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok!");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Server response:", data);
      alertType.value = "success";
      alertMessage.value = "Product is create successfully!";
      showAlert.value = true;
      router.push({ name: "company.products" });
    })
    .catch((error) => {
      console.error("Error submitting company data:", error);
      alertType.value = "error";
      alertMessage.value = "Failed to create product.";
      showAlert.value = true;
    });
  // (opciono) idi dalje
  console.log("Product locally saved:", formData);
};

// const cancel = () =>  {
//   router.back()
// }
</script>
