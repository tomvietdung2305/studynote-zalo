// Email validation
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Phone validation
export const isValidPhone = (phone: string): boolean => {
  const regex = /^[\d\s\-\+\(\)]+$/;
  return regex.length >= 9 && regex.test(phone);
};

// Required field validation
export const isRequired = (value: string | null | undefined): boolean => {
  return !!value && value.trim().length > 0;
};

// Message validation
export const isValidMessage = (message: string): boolean => {
  return isRequired(message) && message.trim().length <= 5000;
};
