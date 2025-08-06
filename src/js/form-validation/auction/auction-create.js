export function validationAuctionForm(data, mode = "create") {
  const errors = {};
  let isValid = true;

  const maxSizeInBytes = 4 * 1024 * 1024; // 4MB
  console.log("Auction validacion: ", data);
  // Name
  if (!data.auctionName) {
    errors.auctionName = "Auction name is required.";
    isValid = false;
  }

  // Main Image
  if (!data.auctionMainImage && !data.serverHasMainImage) {
    errors.auctionMainImage = "Main image is required.";
    isValid = false;
  } else if (data.auctionMainImage && data.auctionMainImage.size > maxSizeInBytes) {
    errors.auctionMainImage = "Image size must not exceed 4MB.";
    isValid = false;
  }

  // Description
  if (!data.auctionDescription) {
    errors.auctionDescription = "Auction description is required.";
    isValid = false;
  }

  // Price
  if (!data.auctionPrice) {
    errors.auctionPrice = "Auction price is required.";
    isValid = false;
  } else if (isNaN(data.auctionPrice) || Number(data.auctionPrice) <= 10) {
    errors.auctionPrice = "Auction price must be greater than 10.";
    isValid = false;
  }

  // Date
  if (!data.auctionDate) {
    errors.auctionDate = "Auction date is required.";
    isValid = false;
  } else {
    const now = new Date();
    const auctionDate = new Date(data.auctionDate);
    const diffInHours = (auctionDate - now) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      errors.auctionDate = "Auction date must be at least 24 hours from now.";
      isValid = false;
    }
  }

  // Gallery Images
  const hasUploadedImages = Array.isArray(data.auctionImages) && data.auctionImages.length > 0;
  const totalImages = (data.existingGalleryCount || 0) + (hasUploadedImages ? data.auctionImages.length : 0);

  if (totalImages < 2) {
    errors.auctionImages = "You must have at least 2 images in the gallery.";
    isValid = false;
  }

  if (hasUploadedImages) {
    for (let i = 0; i < data.auctionImages.length; i++) {
      const file = data.auctionImages[i];
      if (file.size > maxSizeInBytes) {
        errors.auctionImages = `Image ${i + 1} exceeds the maximum size of 4MB.`;
        isValid = false;
        break;
      }
    }
  }

  return { isValid, errors };
}
