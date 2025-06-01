import { ValidationResult } from '@/types/auth';

export class ValidationError extends Error {
  public errors: string[];

  constructor(message: string, errors: string[]) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

// Email validation
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Password validation - more comprehensive
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Şifre gereklidir');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Şifre en az 8 karakter olmalıdır');
  }

  if (password.length > 128) {
    errors.push('Şifre en fazla 128 karakter olabilir');
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Şifre en az 1 küçük harf içermelidir');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Şifre en az 1 büyük harf içermelidir');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Şifre en az 1 rakam içermelidir');
  }

  // Check for common weak passwords
  const weakPasswords = ['password', '12345678', 'qwerty123', 'admin123'];
  if (weakPasswords.includes(password.toLowerCase())) {
    errors.push('Bu şifre çok yaygın kullanılıyor, daha güçlü bir şifre seçin');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Name validation
export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name || typeof name !== 'string') {
    errors.push('İsim gereklidir');
    return { isValid: false, errors };
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    errors.push('İsim en az 2 karakter olmalıdır');
  }

  if (trimmedName.length > 50) {
    errors.push('İsim en fazla 50 karakter olabilir');
  }

  // Check for valid characters (letters, spaces, common Turkish characters)
  if (!/^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+$/.test(trimmedName)) {
    errors.push('İsim sadece harf ve boşluk karakterleri içerebilir');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Comprehensive registration data validation
export const validateRegistrationData = (data: any): ValidationResult => {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Geçersiz veri formatı');
    return { isValid: false, errors };
  }

  const { email, password, name } = data;

  // Email validation
  if (!email) {
    errors.push('Email gereklidir');
  } else if (!isValidEmail(email)) {
    errors.push('Geçerli bir email adresi girin');
  }

  // Password validation
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }

  // Name validation
  const nameValidation = validateName(name);
  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitize input data
export const sanitizeRegistrationData = (data: any) => {
  if (!data || typeof data !== 'object') {
    throw new ValidationError('Geçersiz veri formatı', ['Veri objesi gereklidir']);
  }

  return {
    email: data.email?.trim()?.toLowerCase() || '',
    password: data.password || '',
    name: data.name?.trim() || ''
  };
}; 