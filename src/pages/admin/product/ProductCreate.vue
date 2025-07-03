<template>
  <ButtonBack />
  <div
    class="p-6 mt-8 mb-8 ml-3 max-w-4xl bg-white rounded-lg shadow-2xl overflow-y-auto"
  >
    <h1 class="text-3xl font-bold mb-8 text-gray-800">
      🛍️ Create a New Product
    </h1>

    <form
      @submit.prevent="handleSubmit"
      class="space-y-6"
      enctype="multipart/form-data"
    >
      <!-- Product Name -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Product Name</label
        >
        <input
          v-model="form.name"
          type="text"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Product Type</label
        >
        <div class="flex items-center space-x-6">
          <label class="inline-flex items-center text-sm">
            <input
              type="radio"
              value="new"
              v-model="form.type"
              class="form-radio text-blue-600"
            />
            <span class="ml-2">🆕 New</span>
          </label>
          <label class="inline-flex items-center text-sm">
            <input
              type="radio"
              value="used"
              v-model="form.type"
              class="form-radio text-blue-600"
            />
            <span class="ml-2">♻️ Used</span>
          </label>
        </div>
      </div>

      <!-- Product Description -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2"
          >Product Description</label
        >
        <!-- Toolbar -->
        <div class="flex flex-wrap gap-2 mb-3">
          <button
            type="button"
            @click="toggleBold"
            :class="
              buttonClass(editor.isActive('bold')) +
              ' px-2 py-1 rounded hover:bg-gray-100'
            "
            aria-label="Bold"
          >
            B
          </button>
          <button
            type="button"
            @click="toggleItalic"
            :class="
              buttonClass(editor.isActive('italic')) +
              ' px-2 py-1 rounded hover:bg-gray-100'
            "
            aria-label="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            @click="toggleUnderline"
            :class="
              buttonClass(editor.isActive('underline')) +
              ' px-2 py-1 rounded hover:bg-gray-100'
            "
            aria-label="Underline"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            @click="toggleStrike"
            :class="
              buttonClass(editor.isActive('strike')) +
              ' px-2 py-1 rounded hover:bg-gray-100'
            "
            aria-label="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>
        <!-- Editor Container -->
        <div
          class="border border-gray-300 rounded-lg bg-white p-3 shadow-inner focus-within:ring-2 focus-within:ring-blue-500"
        >
          <EditorContent :editor="editor" class="min-h-[150px] outline-none" />
        </div>
        <p v-if="errors.productDesc" class="text-red-500 text-sm mt-2">
          {{ errors.productDesc }}
        </p>
      </div>

      <!-- Category & Sub-category -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Category -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1"
            >Product Category</label
          >
          <div class="relative">
            <select
              v-model="form.category"
              class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
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
            <svg
              class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <p v-if="errors.productCategory" class="text-red-600 text-sm mt-1">
            {{ errors.productCategory }}
          </p>
        </div>

        <!-- Sub-category -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1"
            >Product Sub-category</label
          >
          <div class="relative">
            <select
              v-model="form.subCategory"
              class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
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
            <svg
              class="pointer-events-none absolute right-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <p v-if="errors.productSub" class="text-red-600 text-sm mt-1">
            {{ errors.productSub }}
          </p>
        </div>
      </div>

      <!-- Price -->
      <div class="w-full md:w-1/3 md:pr-2 pr-0">
        <label
          for="priceInput"
          class="block text-sm font-semibold text-gray-700 mb-1"
        >
          Price (€)
        </label>
        <div class="relative">
          <!-- Euro symbol inside -->
          <span
            class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"
            >€</span
          >
          <input
            id="priceInput"
            :value="form.price"
            @input="(e) => cleanNumberInput(e, 'price')"
            @keypress="allowOnlyNumbersAndDot"
            @blur="formatDisplayPrice"
            type="text"
            inputmode="numeric"
            placeholder="0.00"
            class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>
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

      <!-- Dimensions & Stock -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <!-- Length -->
        <div>
          <label
            for="lengthInput"
            class="block text-sm font-semibold text-gray-700 mb-1"
            >Length (cm)</label
          >
          <div class="relative">
            <input
              id="lengthInput"
              v-model="form.length"
              @input="(e) => cleanNumberInput(e, 'length')"
              @keypress="allowOnlyNumbersAndDot"
              type="text"
              placeholder="0"
              class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <span
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >cm</span
            >
          </div>
          <p v-if="errors.productLength" class="text-red-500 text-sm mt-1">
            {{ errors.productLength }}
          </p>
        </div>

        <!-- Width -->
        <div>
          <label
            for="widthInput"
            class="block text-sm font-semibold text-gray-700 mb-1"
            >Width (cm)</label
          >
          <div class="relative">
            <input
              id="widthInput"
              v-model="form.width"
              @input="(e) => cleanNumberInput(e, 'width')"
              @keypress="allowOnlyNumbersAndDot"
              type="text"
              placeholder="0"
              class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <span
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >cm</span
            >
          </div>
          <p v-if="errors.productWidth" class="text-red-500 text-sm mt-1">
            {{ errors.productWidth }}
          </p>
        </div>

        <!-- Height -->
        <div>
          <label
            for="heightInput"
            class="block text-sm font-semibold text-gray-700 mb-1"
            >Height (cm)</label
          >
          <div class="relative">
            <input
              id="heightInput"
              v-model="form.height"
              @input="(e) => cleanNumberInput(e, 'height')"
              @keypress="allowOnlyNumbersAndDot"
              type="text"
              placeholder="0"
              class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <span
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >cm</span
            >
          </div>
          <p v-if="errors.productHeight" class="text-red-500 text-sm mt-1">
            {{ errors.productHeight }}
          </p>
        </div>

        <!-- Weight -->
        <div>
          <label
            for="weightInput"
            class="block text-sm font-semibold text-gray-700 mb-1"
            >Weight (kg)</label
          >
          <div class="relative">
            <input
              id="weightInput"
              v-model="form.weight"
              @input="(e) => cleanNumberInput(e, 'weight')"
              @keypress="allowOnlyNumbersAndDot"
              type="text"
              placeholder="e.g. 1.5"
              class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <span
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >kg</span
            >
          </div>
          <p v-if="errors.productWeight" class="text-red-500 text-sm mt-1">
            {{ errors.productWeight }}
          </p>
        </div>
      </div>

      <!-- Stock Quantity -->
      <div class="w-full md:w-1/3 mb-6">
        <label
          for="stockInput"
          class="block text-sm font-semibold text-gray-700 mb-1"
          >Stock Quantity</label
        >
        <input
          id="stockInput"
          v-model="form.stock"
          type="number"
          min="0"
          placeholder="0"
          class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
        <p v-if="errors.productQuantity" class="text-red-500 text-sm mt-1">
          {{ errors.productQuantity }}
        </p>
      </div>

      <!-- Active Toggle -->
      <div class="mb-6">
        <label class="flex items-center cursor-pointer">
          <!-- Switch Container -->
          <div class="relative">
            <input
              id="is_active"
              v-model="form.is_active"
              type="checkbox"
              class="sr-only peer"
            />
            <!-- Background -->
            <div
              class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-600 transition-colors"
            ></div>
            <!-- Handle -->
            <div
              class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"
            ></div>
          </div>
          <span class="ml-3 text-sm font-semibold text-gray-700">Active</span>
        </label>
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
import ButtonBack from "@/components/shared/ButtonBack.vue";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import { validateProductForm } from "@/js/form-validation/product/product-create";

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

editor.value = new Editor({
  extensions: [StarterKit, Underline, Heading.configure({ levels: [1, 2, 3] })],
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

// const toggleHeading = (level) =>
//   editor.value.chain().focus().toggleHeading({ level }).run();

// const toggleBulletList = () =>
//   editor.value.chain().focus().toggleBulletList().run();

// const toggleOrderedList = () =>
//   editor.value.chain().focus().toggleOrderedList().run();

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

  editor.value.destroy();
});

const cleanNumberInput = (e, field) => {
  // Ukloni sve osim cifara i tačke
  let input = e.target.value.replace(/[^0-9.]/g, "");

  // Samo prva tačka se dozvoljava (decimalna)
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
      console.log("User product: ", data);
      alertType.value = "success";
      alertMessage.value = "Product is create successfully!";
      showAlert.value = true;

      router.push({ name: "admin.products" });
    })
    .catch((error) => {
      console.error("Error submitting company data:", error);
      alertType.value = "error";
      alertMessage.value = error;
      showAlert.value = true;
    });
};

// const cancel = () =>  {
//   router.back()
// }
</script>
