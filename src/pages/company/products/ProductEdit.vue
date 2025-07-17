<template>
  <ButtonBack />
    <Alert
      v-if="alert.message"
      :type="alert.type"
      :message="alert.message"
      @close="alert.message = ''"
    />

  <div class="px-4 mt-6 max-w-6xl">
    <div class="bg-white shadow-md rounded-md overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-3xl font-bold mb-8 text-gray-800">🛍️ Edit Product</h3>
      </div>

      <!-- Form Body -->
      <div class="p-6">
        <form
          @submit.prevent="handleEdit"
          class="space-y-6"
          enctype="multipart/form-data"
        >
          <!-- Product Name -->
          <div>
            <label class="block text-sm font-medium mb-1">Product Name</label>
            <input
              v-model="form.productName"
              type="text"
              class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Main Image -->
          <div>
            <label class="block text-sm font-medium mb-1">Main Image</label>
            <label
              for="mainImageInput"
              class="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 cursor-pointer transition"
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
                class="w-24 h-24 border rounded object-cover shadow-sm"
              />
            </div>
            <div v-if="mainImagePreview" class="mt-2">
              <img
                :src="mainImagePreview"
                alt="Preview"
                class="w-24 h-24 border rounded object-cover shadow-sm"
              />
            </div>
          </div>

          <!-- Product Type -->
          <div>
            <label class="block text-sm font-medium mb-1">Product Type</label>
            <div class="flex items-center space-x-6">
              <label class="inline-flex items-center text-sm">
                <input
                  type="radio"
                  value="new"
                  v-model="form.product_type"
                  class="form-radio text-blue-600"
                />
                <span class="ml-2">🆕 New</span>
              </label>
              <label class="inline-flex items-center text-sm">
                <input
                  type="radio"
                  value="used"
                  v-model="form.product_type"
                  class="form-radio text-blue-600"
                />
                <span class="ml-2">♻️ Used</span>
              </label>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
              <!-- Toolbar -->
        <div class="flex flex-wrap gap-2 mb-3">
          <button type="button" @click="toggleBold"
            :class="buttonClass(editor.isActive('bold')) + ' px-2 py-1 rounded hover:bg-gray-100'"
            aria-label="Bold">B</button>
          <button type="button" @click="toggleItalic"
            :class="buttonClass(editor.isActive('italic')) + ' px-2 py-1 rounded hover:bg-gray-100'"
            aria-label="Italic"><em>I</em></button>
          <button type="button" @click="toggleUnderline"
            :class="buttonClass(editor.isActive('underline')) + ' px-2 py-1 rounded hover:bg-gray-100'"
            aria-label="Underline"><u>U</u></button>
          <button type="button" @click="toggleStrike"
            :class="buttonClass(editor.isActive('strike')) + ' px-2 py-1 rounded hover:bg-gray-100'"
            aria-label="Strikethrough"><s>S</s></button>
        </div>
            <div
              class="border border-gray-300 rounded-lg bg-white p-3 shadow-inner focus-within:ring-2 focus-within:ring-blue-500"
            >
              <EditorContent
                :editor="editor"
                class="min-h-[150px] outline-none"
              />
            </div>
          </div>

          <!-- Category & Sub-category -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium mb-1">Category</label>
              <select
                v-model="form.category"
                class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
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
            <div>
              <label class="block text-sm font-medium mb-1">Sub-category</label>
              <select
                v-model="form.subCategory"
                class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
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
          <div class="w-full md:w-1/3">
            <label class="block text-sm font-medium mb-1">Price (€)</label>
            <div class="relative">
              <span
                class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"
                >€</span
              >
              <input
                :value="form.price"
                @input="(e) => cleanNumberInput(e, 'price')"
                @keypress="allowOnlyNumbersAndDot"
                @blur="formatDisplayPrice"
                type="text"
                placeholder="0.00"
                class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>
          </div>

          <!-- Gallery -->
          <div>
            <label class="block text-sm font-medium mb-1">Product Gallery</label>
            <label
              for="imageUpload"
              class="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded cursor-pointer transition"
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
            <div class="flex flex-wrap gap-4 mt-4">
              <div
                v-for="(img, index) in form.image_gallery"
                :key="index"
                class="relative w-24 h-24 border rounded overflow-hidden shadow-sm"
              >
                <img
                  :src="resolveImageSrc(img)"
                  alt="Selected Image"
                  class="object-cover w-full h-full"
                />
                <button
                  @click.prevent="removeImage(index)"
                  class="absolute top-1 right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow hover:bg-red-700 transition"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- Dimensions -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label class="block text-sm font-medium mb-1">Length (cm)</label>
              <input
                v-model="form.length"
                @input="(e) => cleanNumberInput(e, 'length')"
                @keypress="allowOnlyNumbersAndDot"
                type="text"
                class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Width (cm)</label>
              <input
                v-model="form.width"
                @input="(e) => cleanNumberInput(e, 'width')"
                @keypress="allowOnlyNumbersAndDot"
                type="text"
                class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Height (cm)</label>
              <input
                v-model="form.height"
                @input="(e) => cleanNumberInput(e, 'height')"
                @keypress="allowOnlyNumbersAndDot"
                type="text"
                class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Weight (kg)</label>
              <input
                v-model="form.weight"
                @input="(e) => cleanNumberInput(e, 'weight')"
                @keypress="allowOnlyNumbersAndDot"
                type="text"
                placeholder="Example 1.5"
                class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>
          </div>

          <!-- Stock -->
          <div class="w-full md:w-1/3">
            <label class="block text-sm font-medium mb-1">Stock Quantity</label>
            <input
              v-model="product.quantity"
              type="number"
              min="0"
              class="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          <!-- Active -->
          <div class="mb-6">
            <label class="flex items-center cursor-pointer">
            <!-- Switch Container -->
          <div class="relative">
            <input id="is_active" v-model="form.in_stock" type="checkbox" class="sr-only peer" />
            <!-- Background -->
            <div
              class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-600 transition-colors">
            </div>
            <!-- Handle -->
            <div
              class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5">
            </div>
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
    </div>
  </div>
</template>


<script setup>
import ButtonBack from "@/components/shared/ButtonBack.vue";
// import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
// import OrderedList from "@tiptap/extension-ordered-list";
import Alert from "@/components/shared/Alert.vue";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-3";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getImageUrl } from "@/js/helper/displayImage";

const token = localStorage.getItem("token");

const route = useRoute();
const productId = parseInt(route.params.id);
const product = ref({});
const editor = ref(null);
const mainImagePreview = ref(null);

const router = useRouter();
// for alert
const alert = ref({
  message: "",
  type: "success",
});

const showAlert = (type, message) => {
  alert.value.type = type;
  alert.value.message = message;
};

// create new form for update product
const form = ref({
  productName: "",
  image_main: null,
  description: "",
  product_type: "",
  base_price: "",
  category: "",
  image_gallery: [],
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
  fetch(`http://localhost:8000/api/product/${productId}`, {
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
      console.log("Company Product data jone: ", data);
      product.value = data.data;

      form.value.productName = product.value.name;
      form.value.price = product.value.base_price;
      form.value.description = product.value.description;
      form.value.length = product.value.length;
      form.value.width = product.value.width;
      form.value.height = product.value.height;
      form.value.weight = product.value.weight;
      form.value.quantity = product.value.quantity;
      form.value.in_stock = !!product.value.in_stock;
      form.value.product_type = product.value.product_type?.toLowerCase();
      form.value.base_price = product.value.base_price;

      // Set main image
      const mainImage = product.value.images.find(
        (img) => img.is_primary === 1
      );
      form.value.image_main = mainImage?.image_url || null;

      // Set gallery
      form.value.image_gallery = product.value.images
        .filter((img) => img.is_primary === 0)
        .map((img) => img.image_url);

      const catId = product.value.category.id;
      const subCatId = product.value.sub_category.id;

      form.value.category = catId;

      fetchSubcategory(catId).then(() => {
        form.value.subCategory = subCatId;
      });

      // Load description into editor
      if (editor.value && product.value.description) {
        editor.value.commands.setContent(product.value.description);
      }
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
  extensions: [StarterKit, Underline, Heading.configure({ levels: [1, 2, 3] })],
  editorProps: {
    attributes: {
      class: "min-h-[150px] focus:outline-none",
      placeholder: "Write description of product...",
    },
  },
  onUpdate({ editor }) {
    form.value.description = editor.getHTML();
    console.log("Description saved:", form.value.description); // ✅ Provera
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

const handleMainImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    mainImagePreview.value = URL.createObjectURL(file);
    form.value.image_main = file; // ako planiraš da šalješ u formi
  }
};

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
  form.value.image_gallery.push(...files);
};

const removeImage = (index) => {
  form.value.image_gallery.splice(index, 1);
};

const resolveImageSrc = (img) => {
  if (!img) return "";
  if (typeof img === "string") {
    return getImageUrl(img);
  }
  if (img instanceof File) {
    return URL.createObjectURL(img);
  }
  return "";
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

const parsePriceForBackend = (value) => {
  if (typeof value === "string") {
    return value.replace(",", ".");
  }
  return value;
};

// to check if we have changes in the data
// const hasChanges = () => {
//   return (
//     form.value.productName !== originalData.value.productName ||
//     form.value.product_type !== originalData.value.product_type ||
//     form.value.description !== originalData.value.description ||
//     form.value.category !== originalData.value.category_id ||
//     form.value.subCategory !== originalData.value.sub_category_id ||
//     parsePriceForBackend(form.value.price) !== originalData.value.base_price ||
//     form.value.length !== originalData.value.length ||
//     form.value.width !== originalData.value.width ||
//     form.value.height !== originalData.value.height ||
//     form.value.weight !== originalData.value.weight ||
//     form.value.quantity !== originalData.value.quantity ||
//     (form.value.in_stock ? 1 : 0) !== originalData.value.in_stock ||
//     !!form.value.image_main !== !!originalData.value.has_main_image ||
//     form.value.image_gallery.length > 0 || // ima novih slika
//     serverGalleryImages.value.length !== originalData.value.galleryCount // uporedi broj
//   );
// };


const handleEdit = () => {
  // if (!hasChanges()) {
  //   showAlert("info", "No changes to save.");
  //   return;
  // }
  const formData = new FormData();

  formData.append("name", form.value.productName);
  formData.append("product_type", form.value.product_type);
  formData.append("description", form.value.description);
  formData.append("category_id", form.value.category);
  formData.append("sub_category_id", form.value.subCategory);
  formData.append("base_price", parsePriceForBackend(form.value.price));
  formData.append("length", form.value.length);
  formData.append("width", form.value.width);
  formData.append("height", form.value.height);
  formData.append("weight", form.value.weight);
  formData.append("quantity", form.value.quantity);
  formData.append("in_stock", form.value.in_stock ? 1 : 0);

  // ✅ Glavna slika
  if (form.value.image_main instanceof File) {
    formData.append("image_main", form.value.image_main);
  }

  // ✅ Galerija
  form.value.image_gallery.forEach((img) => {
    if (img instanceof File) {
      formData.append("images[]", img);
    } else {
      formData.append("existing_images[]", img);
    }
  });

  fetch(`http://localhost:8000/api/product/${productId}`, {
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
      showAlert("success", "Product is updated successfully!");
      setTimeout(() => {
        router.push({ name: "company.products" });
      }, 1500);
    })
    .catch((error) => {
      showAlert("error", "Failed to update product.");
    });
};

const cancel = () => {
  router.back();
};
</script>
