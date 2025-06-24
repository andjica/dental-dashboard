<template>
  <ButtonBack />
  <div  class="p-6 mt-8 mb-8 ml-3 max-w-4xl bg-white rounded-lg shadow-2xl overflow-y-auto">
    <h1 class="text-2xl font-semibold mb-6">Edit Product</h1>
    <form class="space-y-6" enctype="multipart/form-data">
      <div>
        <label class="block text-sm font-medium mb-1">Product Name</label>
        <input
          v-model="form.productName"
          type="text"
          class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
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

        <input
          id="mainImageInput"
          type="file"
          accept="image/*"
          @change="handleMainImageUpload"
          class="hidden"
        />
        <div v-if="!mainImagePreview && form.image_main" class="mt-2">
          <img
            :src="getImageUrl(form.image_main)"
            alt="Preview"
            class="relative w-34 h-34 border rounded overflow-hidden shadow-sm"
          />
        </div>
      </div>
      <!-- Product Type -->
      <div>
        <label class="block text-sm font-medium mb-1">Product type</label>
        <div class="flex items-center space-x-4 mb-2">
          <label class="inline-flex items-center">
            <input
              type="radio"
              value="new"
              v-model="form.product_type"
              class="form-radio text-blue-600"
            />
            <span class="ml-2">New</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              value="used"
              v-model="form.product_type"
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
          :editor="editor"
          class="border rounded p-3 min-h-[150px]"
        />
      </div>
      <!-- Category -->
      <div class="flex flex-wrap -mx-2 mb-4">
        <div class="w-full md:w-1/3 px-2">
          <label class="block text-sm font-medium mb-1">Category</label>
          <select
            v-model="form.category"
            class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option disabled value="">Select category</option>
            <option
              v-for="cat in form.categories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>
        </div>
        <!-- Sub-category -->
        <div class="w-full md:w-1/3 px-2">
          <label class="block text-sm font-medium mb-1">Sub-category</label>
          <select
            v-model="form.subCategory"
            class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option disabled value="">Select sub-category</option>
            <option
              v-for="sub in form.subCategories"
              :key="sub.id"
              :value="sub.id"
            >
              {{ sub.name }}
            </option>
          </select>
        </div>
      </div>
      <!-- Price -->
      <div class="w-full md:w-1/3 md:pr-2 pr-0">
        <label class="block text-sm font-medium mb-1">Price (€)</label>
        <input
          :value="product.base_price"
          @input="(e) => cleanNumberInput(e, 'price')"
          @keypress="allowOnlyNumbersAndDot"
          @blur="formatDisplayPrice"
          type="text"
          inputmode="numeric"
          class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
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
            v-for="(img, index) in form.image_gallery"
            :key="index"
            class="relative w-24 h-24 border rounded overflow-hidden shadow-sm"
          >
            <img
              :src="
                typeof img === 'string'
                  ? getImageUrl(img)
                  : URL.createObjectURL(img)
              "
              alt="Selected Image"
              class="object-cover w-full h-full"
            />
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
          v-if="form.image_galerry.length"
          class="mt-2 text-sm text-gray-600"
        >
          {{ form.image_galerry.length }} image{{
            form.image_galerry.length > 1 ? "s" : ""
          }}
          selected
        </div>
      </div>
      <!-- Width, Height, Length and Weight-->
      <div class="flex flex-wrap -mx-2 mb-4">
        <div class="w-full md:w-1/3 px-2">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Length (cm)</label
          >
          <input
            v-model="form.length"
            @input="(e) => cleanNumberInput(e, 'length')"
            @keypress="allowOnlyNumbersAndDot"
            type="text"
            class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
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
        </div>
      </div>
      <!-- Stock -->
      <div class="w-full md:w-1/3 md:pr-2 pr-0">
        <label class="block text-sm font-medium mb-1">Stock Quantity</label>
        <input
          v-model="form.quantity"
          type="number"
          min="0"
          class="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>
      <!-- Active -->
      <div class="flex items-center space-x-2">
        <input v-model="form.in_stock" type="checkbox" id="is_active" />
        <label for="is_active" class="text-sm">Active</label>
      </div>
      <!-- Buttons -->
      <div class="flex space-x-4">
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Save
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
import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import OrderedList from "@tiptap/extension-ordered-list";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const token = localStorage.getItem("token");

const route = useRoute();
const id = route.params.id;

const product = ref({});
const editor = ref(null);
const mainImagePreview = ref(null);
// create new form for update product
const form = ref({
  productName: "",
  image_main: null,
  description: "",
  product_type: "",
  category: "",
  image_galerry: [],
  subCategory: "",
  categories: [],
  subCategories: [],
  quantity: "",
  in_stock: 0,
  length: "",
  weight: "",
  height: "",
  width: "",
});

onMounted(() => {
  fetchProduct();
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
// fetch product by id
const fetchProduct = () => {
  fetch(`http://localhost:8000/api/product/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Can't fetch product!");
      }
      return res.json();
    })
    .then((data) => {
      console.log("User Product data: ", data);
      product.value = data.data;

      form.value.productName = product.value.name;
      if (editor.value && product.value.description) {
        editor.value.commands.setContent(product.value.description);
        }
      // to choose main image
      const mainImage = product.value.images.find(
        (img) => img.is_primary === 1
      );
      form.value.image_main = mainImage?.image_url || null;
      form.value.product_type = product.value.product_type?.toLowerCase();
      const catId = product.value.category.id;
      const subCatId = product.value.sub_category.id;

      form.value.category = catId;

      //  to chooes gallery images
      form.value.image_gallery = product.value.images
        .filter((img) => img.is_primary === 0)
        .map((img) => img.image_url);
      // Prvo pozovi subkategorije pa tek onda setuj vrednost
      fetchSubcategory(catId).then(() => {
        form.value.subCategory = subCatId;
      });
      form.value.height = product.value.height;
      form.value.length = product.value.length;
      form.value.weight = product.value.weight;
      form.value.width = product.value.width;

      form.value.in_stock = !!product.value.in_stock;

      form.value.quantity = product.value.quantity;
    })
    .catch((err) => {
      console.error("Error while fetching product:", err);
    });
};
// fetch category
const fetchCategory = () => {
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
// fetch sub category
const fetchSubcategory = (categoryId) => {
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

const handleMainImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    mainImagePreview.value = URL.createObjectURL(file);
    product.value.image_main = file; // ako planiraš da šalješ u formi
  }
};

const removeImage = (index) => {
  form.value.image_gallery.splice(index, 1);
  const url = imagePreviews.value.splice(index, 1)[0];
  URL.revokeObjectURL(url); // očisti memoriju
};

const getImageUrl = (path) => {
  return `http://localhost:8000/storage/${path}`;
};

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

const cancel = () => {
  router.back();
};
</script>
