export function validateUserForm(data) {
    console.log(data);
  const errors = {};
  let isValid = true;

//   if (!data.userImage) {
//     errors.profileImage = "Profile Image is required.";
//     isValid = false;
//   } else if (data.userImage.size > 4 * 1024 * 1024) {
//     errors.profileImage = "Image size must be 4MB or less.";
//     isValid = false;
//   }

  if (!data.userFirstName) {
    errors.userFirstName = "First name is required.";
    isValid = false;
  }

  if (!data.userLastName) {
    errors.userLastName = "Last name is required.";
    isValid = false;
  }

  if (!data.userEmail || !isValidEmail(data.userEmail)) {
    errors.userEmail = "A valid email is required.";
    isValid = false;
  }

  if (!data.userAddress) {
    errors.userAddress = "Address is required.";
    isValid = false;
  }

  if (!data.selectedCountry) {
    errors.selectedCountry = "Country is required.";
    isValid = false;
  }

  if (!data.selectedCity) {
    errors.selectedCity = "City is required.";
    isValid = false;
  }

  if (!data.zipCode) {
    errors.zipCode = "Zip code is required.";
    isValid = false;
  }

  if (!data.phoneNumber) {
    errors.phoneNumber = "Phone number is required.";
    isValid = false;
  } else if (data.phoneNumber.length < 6) {
    errors.phoneNumber = "Phone number must be at least 6 digits.";
    isValid = false;
  }

  return { isValid, errors };
}

// Treba ti i funkcija za validaciju emaila, možeš je ovde ili importovati
function isValidEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
