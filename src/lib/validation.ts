// Shared validation utilities to avoid duplication

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+234|0)[789][01]\d{8}$/; // Nigerian phone format
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6; // Supabase minimum is 6 characters
};

export const formatNigerianPhone = (phone: string): string => {
  return phone.startsWith('+234') ? phone : `+234${phone.replace(/^0/, '')}`;
};

export const validateFullName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validatePrice = (price: number): boolean => {
  return price >= 100000 && price <= 500000; // ₦1,000 to ₦5,000 in kobo
};

export const validateDuration = (duration: number): boolean => {
  return duration >= 30 && duration <= 240; // 30 minutes to 4 hours
};

export const validateRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5;
};

export const formatCurrency = (amount: number): string => {
  return `₦${(amount / 100).toLocaleString()}`; // Convert from kobo to naira
};

export const convertToKobo = (naira: number): number => {
  return Math.round(naira * 100); // Convert naira to kobo
};

export const convertFromKobo = (kobo: number): number => {
  return kobo / 100; // Convert kobo to naira
};