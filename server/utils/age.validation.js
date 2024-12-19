export const isValidAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);

  // Set both dates to start of day for accurate comparison
  today.setHours(0, 0, 0, 0);
  birth.setHours(0, 0, 0, 0);

  // Calculate age
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // Adjust age if birthday hasn't occurred this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  // Check if age is between 18 and 55
  return age >= 18 && age <= 55;
};
