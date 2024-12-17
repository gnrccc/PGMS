export const isValidPhoneNumber = (phoneNumber) => {
  return /^09\d{9}$/.test(phoneNumber);
};
