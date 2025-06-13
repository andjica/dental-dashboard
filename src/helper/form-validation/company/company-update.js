export function validateCompanyForm(data) {
  const errors = {};
  let isValid = true;

  if (!data.companyName) {
    errors.companyName = "Company name is required.";
    isValid = false;
  }

  if (!data.companyEmail || !isValidEmail(data.companyEmail)) {
    errors.companyEmail = "A valid email is required.";
    isValid = false;
  }

  if (!data.companyAddress) {
    errors.companyAddress = "Address is required.";
    isValid = false;
  }

  if (!data.companyTaxNumber) {
    errors.companyTaxNumber = "Tax number is required.";
    isValid = false;
  }

  if (!data.companyRegisterNumber) {
    errors.companyRegisterNumber = "Register number is required.";
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
