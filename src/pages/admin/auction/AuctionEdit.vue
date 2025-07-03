<template>
  <ButtonBack />
  <div class="p-6 mt-8 mb-8 ml-3 max-w-3xl bg-white rounded-lg shadow-2xl relative">
    <Alert
      v-if="showAlert"
      :type="alertType"
      :message="alertMessage"
      @close="showAlert = false"
    />

    <h1 class="text-3xl font-bold mb-8 text-gray-800">Update Auction</h1>

    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <!-- Main Image -->
      <div class="mt-4">
        <label class="block text-sm font-medium mb-1">Main Image</label>
        <label for="mainImageInput" class="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded">
          Upload Image
        </label>
        <input
          id="mainImageInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleMainImageUpload"
        />
        <div v-if="mainImagePreview" class="mt-2">
          <img :src="mainImagePreview" class="w-34 h-34 rounded border shadow" />
        </div>
        <p v-if="errors.auctionMainImage" class="text-red-500 text-sm mt-1">
          {{ errors.auctionMainImage }}
        </p>
      </div>

      <!-- Name -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Auction Name</label>
        <input v-model="form.auctionName" type="text" class="w-full px-4 py-2 border rounded" />
        <p v-if="errors.auctionName" class="text-red-500 text-sm mt-1">
          {{ errors.auctionName }}
        </p>
      </div>

      <!-- Description -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Description</label>
        <textarea v-model="form.auctionDescription" class="w-full px-4 py-2 border rounded"></textarea>
        <p v-if="errors.auctionDescription" class="text-red-500 text-sm mt-1">
          {{ errors.auctionDescription }}
        </p>
      </div>

      <!-- Price -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Base Price (€)</label>
        <input v-model="form.auctionPrice" type="number" min="0" class="w-full px-4 py-2 border rounded" />
        <p v-if="errors.auctionPrice" class="text-red-500 text-sm mt-1">
          {{ errors.auctionPrice }}
        </p>
      </div>

      <!-- Date -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Auction Date</label>
        <input v-model="form.auctionDate" type="datetime-local" class="w-full px-4 py-2 border rounded" />
        <p v-if="errors.auctionDate" class="text-red-500 text-sm mt-1">
          {{ errors.auctionDate }}
        </p>
      </div>

      <!-- Gallery -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Gallery Images</label>
        <label for="galleryInput" class="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded">
          Select Images
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
          <div
            v-for="(img, index) in imagesPreviews"
            :key="index"
            class="relative w-24 h-24 border rounded overflow-hidden"
          >
            <img :src="img" class="object-cover w-full h-full" />
            <button
              @click.prevent="removeImage(index)"
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
      <button type="submit" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
        Save Auction
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

const route = useRoute();
// const router = useRouter();
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

const serverGalleryImages = ref([]); // IDs of existing images on server (strings)
const originalData = ref({});

const errors = ref({});
const showAlert = ref(false);
const alertType = ref("success");
const alertMessage = ref("");

onMounted(async () => {
  try {
    const res = await get(`auction/${productId}`);
    const auction = res.data;

    form.value.auctionName = auction.name;
    form.value.auctionDescription = auction.description;
    form.value.auctionPrice = auction.base_price;
    form.value.auctionDate = auction.auction_date.substring(0, 16);

    originalData.value = {
      auctionName: auction.name,
      auctionDescription: auction.description,
      auctionPrice: auction.base_price,
      auctionDate: auction.auction_date.substring(0, 16),
      hasMainImage: !!auction.images?.[0],
      galleryCount: (auction.images?.length || 0) - 1,
    };

    if (auction.images && auction.images.length > 0) {
      mainImagePreview.value = getImageUrl(auction.images[0].image_url);
      serverHasMainImage.value = true;

      const gallery = auction.images.slice(1);
      imagesPreviews.value = gallery.map(img => getImageUrl(img.image_url));
      serverGalleryImages.value = gallery.map(img => img.id.toString());
      serverHasGalleryImages.value = gallery.length > 0;
    }
  } catch (err) {
    console.error("Error loading auction:", err);
  }
});

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
  serverHasGalleryImages.value = false;
};

const removeImage = (index) => {
  if (index < serverGalleryImages.value.length) {
    // Remove existing server image
    serverGalleryImages.value.splice(index, 1);
  } else {
    // Remove new local image
    const localIndex = index - serverGalleryImages.value.length;
    form.value.auctionImages.splice(localIndex, 1);
  }
  // Remove preview URL and revoke
  URL.revokeObjectURL(imagesPreviews.value.splice(index, 1)[0]);
};

onBeforeUnmount(() => {
  imagesPreviews.value.forEach(URL.revokeObjectURL);
  if (!serverHasMainImage.value && mainImagePreview.value) {
    URL.revokeObjectURL(mainImagePreview.value);
  }
});

const handleSubmit = async () => {
  if (!hasChanges()) {
    alertType.value = "info";
    alertMessage.value = "No changes detected.";
    showAlert.value = true;
    return;
  }

  const { isValid, errors: v } = validationAuctionForm({
    ...form.value,
    serverHasMainImage: serverHasMainImage.value,
    serverHasGalleryImages: serverHasGalleryImages.value,
  });

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

  form.value.auctionImages.forEach(f => fd.append("images[]", f));
serverGalleryImages.value.forEach(id => fd.append("existing_images[]", id));

  try {
    await post(`auction/update/${productId}`, fd);
    alertType.value = "success";
    alertMessage.value = "Auction updated successfully!";
    showAlert.value = true;
    sessionStorage.setItem("auctionCreatedMessage", alertMessage.value);
    // router.push({ name: "admin.auctions" });
  } catch (err) {
    alertType.value = "error";
    alertMessage.value = "Failed to update auction.";
    showAlert.value = true;
  }
};
</script>
