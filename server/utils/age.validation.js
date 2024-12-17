export const isValidAge = (birthDate) => {
  const today = new Date();
  const userBirthDate = new Date(birthDate);

  // Calculate age considering year, month, and day
  let age = today.getFullYear() - userBirthDate.getFullYear();
  const monthDiff = today.getMonth() - userBirthDate.getMonth();
  const dayDiff = today.getDate() - userBirthDate.getDate();

  // Adjust age if birthday hasn't occurred this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  if (age <= 18 || age >= 55) {
    return true;
  }

  return false;
};
