<template>
  <ButtonBack />
  <div v-if="isLoading">
    <Loader />
  </div>

  <div v-else-if="product">
    <div class="max-w-4xl mt-6 mx-auto p-6 bg-white rounded shadow-md">
      <div class="flex gap-8">
        <!-- Leva kolona sa slikama -->
        <div class="flex-shrink-0 w-48">
          <img
            v-if="mainImage"
            :src="getImageUrl(mainImage.image_url)"
            :alt="product.name"
            class="rounded-md object-cover w-full h-48 mb-4 shadow-lg"
          />
          <div
            v-else
            class="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500"
          >
            No Image
          </div>
          <!-- Slider thumbnails -->
          <div class="flex space-x-2 overflow-x-auto">
            <img
              v-for="img in product.images"
              :key="img.id"
              :src="getImageUrl(img.image_url)"
              :alt="`Thumbnail ${img.id}`"
              class="w-12 h-12 object-cover rounded cursor-pointer border-2"
              :class="
                img.id === mainImage?.id
                  ? 'border-blue-500'
                  : 'border-transparent'
              "
              @click="mainImage = img"
            />
          </div>
        </div>

        <!-- Desna kolona sa informacijama -->
        <div class="flex-grow">
          <h1 class="text-2xl font-bold mb-2">{{ product.name }}</h1>

          <p class="text-gray-700 mb-1">
            <strong>Category:</strong> {{ product.category?.name || "N/A" }}
          </p>
          <p class="text-gray-700 mb-1">
            <strong>Subcategory:</strong>
            {{ product.sub_category?.name || "N/A" }}
          </p>
          <p class="text-gray-700 mb-1">
            <strong>Type:</strong> {{ product.product_type }}
          </p>
          <p class="text-gray-700 mb-1">
            <strong>Price:</strong> ${{ product.base_price }}
          </p>
          <p class="text-gray-700 mb-1">
            <strong>In Stock:</strong>
            <span :class="product.in_stock ? 'text-green-600' : 'text-red-600'">
              {{ product.in_stock ? "Yes" : "No" }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <p>Product not found.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Loader from "@/components/shared/Loader.vue";
import ButtonBack from "@/components/shared/ButtonBack.vue";
import { get } from "@/js/helper/api.js";

const route = useRoute();
const productId = route.params.id;

const product = ref(null);
const isLoading = ref(true);
const mainImage = ref(null);

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("storage")) {
    return `http://164.92.209.125:8000/${path}`;
  }
  return `http://164.92.209.125:8000/storage/${path}`;
};

const fetchProduct = async () => {
  isLoading.value = true;
  try {
    const response = await get(`product/${productId}`); // pozivaš backend za proizvod po ID-u
    console.log(response);
    product.value = response.data;
    mainImage.value =
      product.value.images.find((img) => img.is_primary) ||
      product.value.images[0] ||
      null;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchProduct();
});
</script>
