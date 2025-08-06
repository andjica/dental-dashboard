export const validateProductForm = (data) => {

  const errors = {};
  let isValid = true;

  const maxSizeInBytes = 4 * 1024 * 1024; // 4MB

  if (!data.productName) {
    errors.productName = "Product name is requred.";
    isValid = false;
  }

  if(!(data.productMainImage instanceof File)) {
    errors.productMainImage = "Main image for product is required.";
    isValid = false;
  } else if(data.productMainImage && data.productMainImage.size > maxSizeInBytes) {
    errors.productMainImage = "Image size must not exceed 4MB."
  }

  if (!data.productDesc) {
    errors.productDesc = "Description of product is requred.";
    isValid = false;
  }

  if(!data.productCategory) {
    errors.productCategory = "Select category.";
    isValid = false;
  }

  if(!data.productSub) {
    errors.productSub = "Select sub category.";
    isValid = false;
  }

  if (!data.productGallery || data.productGallery.length === 0) {
    errors.productGallery = "At least 2 product images are required.";
    isValid = false;
  } else if (data.productGallery.length < 2) {
    errors.productGallery = "You must upload at least 2 images.";
    isValid = false;
  } else if (data.productGallery.length > 5) {
    errors.productGallery = "You must upload a maximum of 5 images.";
    isValid = false;
  }


  if (
    !data.productQuantity ||
    isNaN(data.productQuantity) ||
    Number(data.productQuantity) <= 0
  ) {
    errors.productQuantity =
      "Product quantity must be a number greater than 0.";
    isValid = false;
  }

  if (
    !data.productPrice ||
    data.productPrice <= 0
  ) {
    errors.productPrice = "Product price must be a number greater than 0.";
    isValid = false;
  }

  if (!data.productLength) {
    errors.productLength = "Product lenght is requred.";
    isValid = false;
  }

  if (!data.productWidth) {
    errors.productWidth = "Product width is requred.";
    isValid = false;
  }

  if (!data.productHeight) {
    errors.productHeight = "Product height is requred.";
    isValid = false;
  }

  if (!data.productWeight) {
    errors.productWeight = "Product weight is requred.";
    isValid = false;
  }

  return { isValid, errors };
};
