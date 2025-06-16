export const validateProductForm = (data) => {
  const errors = {};
  let isValid = true;

  if (!data.productName) {
    errors.productName = "Product name is requred.";
    isValid = false;
  }

  if (!data.productDesc) {
    errors.productDesc = "Description of product is requred.";
    isValid = false;
  }

  if (!data.productImages || data.productImages.length === 0) {
    errors.productImages = "Product images is required.";
    isValid = false;
  } else if (data.productImages.length > 5) {
    errors.productImages = "You can upload a maximum of 5 images.";
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
    isNaN(data.productPrice) ||
    Number(data.productPrice) <= 0
  ) {
    errors.productPrice = "Product price must be a number greater than 0.";
    isValid = false;
  }

  return { isValid, errors };
};
