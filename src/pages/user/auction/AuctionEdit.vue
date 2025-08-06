<template>
  <ButtonBack />
  <Alert
    v-if="showAlert"
    :type="alertType"
    :message="alertMessage"
    @close="showAlert = false"
    :classWidth="'max-w-3xl'"
  />
  <div
    class="p-6 mt-8 mb-8 ml-3 max-w-3xl bg-white rounded-lg shadow-2xl relative"
  >
    <h1 class="text-3xl font-bold mb-8 text-gray-800">
      {{ $t("auction_update") }}
    </h1>

    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <!-- {{ $t('image_main') }} -->
      <div class="mt-4">
        <label class="block text-sm font-medium mb-3 mt-2">{{
          $t("image_main")
        }}</label>
        <label
          for="mainImageInput"
          class="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 cursor-pointer transition duration-200"
        >
          {{ $t("image_upload") }}
        </label>
        <input
          id="mainImageInput"
          type="file"
          accept="image/*"
          class="hidden mb-3"
          @change="handleMainImageUpload"
        />
        <div v-if="mainImagePreview" class="mt-4">
          <img
            :src="mainImagePreview"
            alt="Preview"
            class="relative w-34 h-34 border rounded overflow-hidden shadow-sm"
          />
        </div>
        <p v-if="errors.auctionMainImage" class="text-red-500 text-sm mt-1">
          {{ errors.auctionMainImage }}
        </p>
      </div>

      <!-- Name -->
      <div class="mb-4">
        <label
          for="auctionName"
          class="block text-sm font-semibold text-gray-700 mb-1"
          >{{ $t("auction_name") }}</label
        >
        <input
          id="auctionName"
          name="auctionName"
          v-model="form.auctionName"
          type="text"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter auction name"
        />
        <p v-if="errors.auctionName" class="text-red-500 text-sm mt-1">
          {{ errors.auctionName }}
        </p>
      </div>

      <!-- Description -->
      <div class="mb-4">
        <label
          for="auctionDescription"
          class="block text-sm font-medium mb-1"
          >{{ $t("auction_desc") }}</label
        >
        <textarea
          id="auctionDescription"
          name="auctionDescription"
          v-model="form.auctionDescription"
          placeholder="Enter description"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <p v-if="errors.auctionDescription" class="text-red-500 text-sm mt-1">
          {{ errors.auctionDescription }}
        </p>
      </div>

      <!-- Price -->
      <div class="mb-4">
        <label for="auctionPrice" class="block text-sm font-medium mb-1"
          >{{ $t("auction_price") }} (€)</label
        >
        <input
          id="auctionPrice"
          name="auctionPrice"
          v-model="form.auctionPrice"
          type="number"
          min="0"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter auction name"
        />
        <p v-if="errors.auctionPrice" class="text-red-500 text-sm mt-1">
          {{ errors.auctionPrice }}
        </p>
      </div>

      <!-- Date -->
      <div class="mb-4">
        <label for="auctionDate" class="block text-sm font-medium mb-1">{{
          $t("auction_date")
        }}</label>
        <input
          id="auctionDate"
          name="auctionDate"
          v-model="form.auctionDate"
          type="datetime-local"
          class="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="errors.auctionDate" class="text-red-500 text-sm mt-1">
          {{ errors.auctionDate }}
        </p>
      </div>

      <!-- Gallery -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-3 mt-2">{{
          $t("auction_galerry")
        }}</label>
        <label
          for="galleryInput"
          class="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded"
        >
          {{ $t("images_select") }}
        </label>
        <input
          id="galleryInput"
          type="file"
          multiple
          accept="image/*"
          class="hidden"
          @change="handleImageUpload"
        />
        <div class="flex flex-wrap gap-4 mt-4">
          <!-- Server gallery images -->
          <div
            v-for="(img, index) in serverGalleryPreviews"
            :key="'server-' + index"
            class="relative w-24 h-24 border rounded overflow-hidden"
          >
            <img :src="img" class="object-cover w-full h-full" />
            <button
              @click.prevent="removeImage(index, true)"
              class="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center"
            >
              ×
            </button>
          </div>

          <!-- New uploaded images -->
          <div
            v-for="(img, index) in imagesPreviews"
            :key="'new-' + index"
            class="relative w-24 h-24 border rounded overflow-hidden"
          >
            <img :src="img" class="object-cover w-full h-full" />
            <button
              @click.prevent="removeImage(index, false)"
              class="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        <p v-if="errors.auctionImages" class="text-red-500 text-sm mt-1">
          {{ errors.auctionImages }}
        </p>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        {{ $t("auction_save") }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import Alert from "@/components/shared/Alert.vue";
import ButtonBack from "@/components/shared/ButtonBack.vue";
import { validationAuctionForm } from "@/js/form-validation/auction/auction-create.js";
import { get, post } from "@/js/helper/api.js";
import { getImageUrl } from "@/js/helper/displayImage";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const productId = route.params.id;

const form = ref({
  auctionMainImage: null,
  auctionName: "",
  auctionDescription: "",
  auctionPrice: "",
  auctionDate: "",
  auctionImages: [], // ONLY NEW UPLOADED FILES
});
const mainImagePreview = ref(null);
const imagesPreviews = ref([]); // preview for all images (existing + new)

const serverHasMainImage = ref(false);
const serverHasGalleryImages = ref(false);
const serverGalleryPreviews = ref([]);

const serverGalleryImages = ref([]); // IDs of existing images on server (strings)
const originalData = ref({});

const errors = ref({});
const showAlert = ref(false);
const alertType = ref("success");
const alertMessage = ref("");

let redirectTimeout;

onMounted(async () => {
  try {
    const res = await get(`auction/${productId}`);
    const auction = res.data;

    // Popuni osnovne podatke iz aukcije
    form.value.auctionName = auction.name;
    form.value.auctionDescription = auction.description;
    form.value.auctionPrice = auction.base_price;
    form.value.auctionDate = auction.auction_date.substring(0, 16);

    // Izdvoji slike
    const images = auction.images || [];

    const mainImage = images.find((img) => img.is_primary === 1);
    const galleryImages = images.filter((img) => img.is_primary === 0);

    // Postavi main image preview ako postoji
    if (mainImage) {
      mainImagePreview.value = getImageUrl(mainImage.image_url);
      serverHasMainImage.value = true;
    }

    // Postavi galerijske slike i njihove id-eve
    serverGalleryImages.value = galleryImages.map((img) => img.id.toString());
    serverGalleryPreviews.value = galleryImages.map((img) =>
      getImageUrl(img.image_url)
    );
    serverHasGalleryImages.value = galleryImages.length > 0;

    // Originalni podaci za promene
    originalData.value = {
      auctionName: auction.name,
      auctionDescription: auction.description,
      auctionPrice: auction.base_price,
      auctionDate: auction.auction_date.substring(0, 16),
      hasMainImage: !!mainImage,
      galleryCount: galleryImages.length,
    };
  } catch (err) {
    console.error("Error loading auction:", err);
  }
});
// to check if we have changes in the data
const hasChanges = () => {
  return (
    form.value.auctionName !== originalData.value.auctionName ||
    form.value.auctionDescription !== originalData.value.auctionDescription ||
    form.value.auctionPrice !== originalData.value.auctionPrice ||
    form.value.auctionDate !== originalData.value.auctionDate ||
    !!form.value.auctionMainImage !== !originalData.value.hasMainImage ||
    form.value.auctionImages.length > 0 ||
    serverGalleryImages.value.length !== originalData.value.galleryCount
  );
};

const handleMainImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (!serverHasMainImage.value && mainImagePreview.value) {
      URL.revokeObjectURL(mainImagePreview.value);
    }
    mainImagePreview.value = URL.createObjectURL(file);
    form.value.auctionMainImage = file;
    serverHasMainImage.value = false;
  }
};

const handleImageUpload = (e) => {
  Array.from(e.target.files).forEach((f) => {
    form.value.auctionImages.push(f);
    imagesPreviews.value.push(URL.createObjectURL(f));
  });
};

const removeImage = (index, isServer) => {
  if (isServer) {
    // Uklanjanje postojeće slike sa servera
    serverGalleryImages.value.splice(index, 1);
    URL.revokeObjectURL(serverGalleryPreviews.value[index]);
    serverGalleryPreviews.value.splice(index, 1);
  } else {
    // Uklanjanje nove lokalno dodate slike
    URL.revokeObjectURL(imagesPreviews.value[index]);
    imagesPreviews.value.splice(index, 1);
    form.value.auctionImages.splice(index, 1);
  }
};

onBeforeUnmount(() => {
  if (redirectTimeout) clearTimeout(redirectTimeout);

  imagesPreviews.value.forEach(URL.revokeObjectURL);
  if (!serverHasMainImage.value && mainImagePreview.value) {
    URL.revokeObjectURL(mainImagePreview.value);
  }
  serverGalleryPreviews.value.forEach(URL.revokeObjectURL);
});

const handleSubmit = async () => {
  if (!hasChanges()) {
    alertType.value = "info";
    alertMessage.value = t("no_change");
    showAlert.value = true;
    return;
  }

  const validationData = {
    auctionName: form.value.auctionName,
    auctionDescription: form.value.auctionDescription,
    auctionPrice: form.value.auctionPrice,
    auctionDate: form.value.auctionDate,
    auctionMainImage: form.value.auctionMainImage,
    auctionImages: form.value.auctionImages,
    serverHasMainImage: serverHasMainImage.value,
    serverHasGalleryImages: serverHasGalleryImages.value,
    existingGalleryCount: serverGalleryImages.value.length,
  };

  const { isValid, errors: v } = validationAuctionForm(validationData);

  errors.value = v;
  if (!isValid) return;

  const fd = new FormData();
  fd.append("name", form.value.auctionName);
  fd.append("description", form.value.auctionDescription);
  fd.append("base_price", form.value.auctionPrice);
  fd.append("auction_date", form.value.auctionDate);

  if (form.value.auctionMainImage) {
    fd.append("image_main", form.value.auctionMainImage);
  }

  form.value.auctionImages.forEach((f) => fd.append("images[]", f));
  serverGalleryImages.value.forEach((id) => fd.append("existing_images[]", id));

  try {
    await post(`auction/update/${productId}`, fd);
    alertType.value = "success";
    alertMessage.value = t("auction_updaet_s");
    showAlert.value = true;

    // Delay redirect by 3 seconds
    redirectTimeout = setTimeout(() => {
      router.push({ name: "user.auction.view" });
    }, 3000);
  } catch (err) {
    console.error("Error submitting company data:", err);
    alertType.value = "error";
    alertMessage.value = t('"auction_update_f"');
    showAlert.value = true;
  }
};
</script>
