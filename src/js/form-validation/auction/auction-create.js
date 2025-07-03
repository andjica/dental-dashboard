export function validationAuctionForm(data) {
  const errors = {};
  let isValid = true;

  // Name
  if (!data.auctionName) {
    errors.auctionName = "Auction name is required.";
    isValid = false;
  }

  // Main Image
  const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

  if (!data.auctionMainImage && !data.serverHasMainImage) {
    errors.auctionMainImage = "Main image is required.";
    isValid = false;
  } else if (data.auctionMainImage && data.auctionMainImage.size > maxSizeInBytes) {
    errors.auctionMainImage = "Image size must not exceed 2MB.";
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
  const hasUploadedImages = data.auctionImages && Array.isArray(data.auctionImages) && data.auctionImages.length > 0;

  if (!hasUploadedImages && !data.serverHasGalleryImages) {
    errors.auctionImages = "You must select more than 2 images for the auction.";
    isValid = false;
  } else if (hasUploadedImages && data.auctionImages.length <= 1) {
    errors.auctionImages = "You must select more than 2 images for the auction.";
    isValid = false;
  } else if (hasUploadedImages) {
    for (let i = 0; i < data.auctionImages.length; i++) {
      const file = data.auctionImages[i];
      if (file.size > maxSizeInBytes) {
        errors.auctionImages = `Image ${i + 1} exceeds the maximum size of 2MB.`;
        isValid = false;
        break;
      }
    }
  }

  return { isValid, errors };
}
