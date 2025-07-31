// Enhanced validation utilities for security
export const ValidationRules = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    maxLength: 254,
  },
  password: {
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
  },
  projectName: {
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-_.()]+$/,
  },
  text: {
    maxLength: 1000,
    pattern: /^[a-zA-Z0-9\s\-_.()!@#$%^&*+={}[\]|\\:";'<>?,.\/]*$/,
  },
  numeric: {
    min: 0,
    max: 999999999999,
  },
  currency: {
    min: 0,
    max: 999999999999,
    decimals: 2,
  }
} as const;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class SecurityValidator {
  // Sanitize text input by removing potentially dangerous characters
  static sanitizeText(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove HTML brackets
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, ValidationRules.text.maxLength);
  }

  // Validate email with comprehensive checks
  static validateEmail(email: string): ValidationResult {
    const sanitized = email.trim().toLowerCase();
    
    if (!sanitized) {
      return { isValid: false, error: 'Email is required' };
    }
    
    if (sanitized.length > ValidationRules.email.maxLength) {
      return { isValid: false, error: 'Email is too long' };
    }
    
    if (!ValidationRules.email.pattern.test(sanitized)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
  }

  // Validate password with security requirements
  static validatePassword(password: string): ValidationResult {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }
    
    if (password.length < ValidationRules.password.minLength) {
      return { isValid: false, error: `Password must be at least ${ValidationRules.password.minLength} characters` };
    }
    
    if (password.length > ValidationRules.password.maxLength) {
      return { isValid: false, error: 'Password is too long' };
    }
    
    if (!ValidationRules.password.pattern.test(password)) {
      return { isValid: false, error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' };
    }
    
    return { isValid: true };
  }

  // Validate project name
  static validateProjectName(name: string): ValidationResult {
    const sanitized = this.sanitizeText(name);
    
    if (!sanitized) {
      return { isValid: false, error: 'Project name is required' };
    }
    
    if (sanitized.length < ValidationRules.projectName.minLength) {
      return { isValid: false, error: 'Project name is required' };
    }
    
    if (sanitized.length > ValidationRules.projectName.maxLength) {
      return { isValid: false, error: `Project name must not exceed ${ValidationRules.projectName.maxLength} characters` };
    }
    
    if (!ValidationRules.projectName.pattern.test(sanitized)) {
      return { isValid: false, error: 'Project name contains invalid characters' };
    }
    
    return { isValid: true };
  }

  // Validate numeric input with bounds checking
  static validateNumeric(value: string | number, field: string = 'Value'): ValidationResult {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) {
      return { isValid: false, error: `${field} must be a valid number` };
    }
    
    if (num < ValidationRules.numeric.min) {
      return { isValid: false, error: `${field} must be greater than or equal to ${ValidationRules.numeric.min}` };
    }
    
    if (num > ValidationRules.numeric.max) {
      return { isValid: false, error: `${field} exceeds maximum allowed value` };
    }
    
    return { isValid: true };
  }

  // Validate currency with specific formatting
  static validateCurrency(value: string | number, field: string = 'Amount'): ValidationResult {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) {
      return { isValid: false, error: `${field} must be a valid amount` };
    }
    
    if (num < ValidationRules.currency.min) {
      return { isValid: false, error: `${field} must be greater than or equal to $${ValidationRules.currency.min}` };
    }
    
    if (num > ValidationRules.currency.max) {
      return { isValid: false, error: `${field} exceeds maximum allowed value` };
    }
    
    // Check decimal places
    const decimals = (num.toString().split('.')[1] || '').length;
    if (decimals > ValidationRules.currency.decimals) {
      return { isValid: false, error: `${field} can have at most ${ValidationRules.currency.decimals} decimal places` };
    }
    
    return { isValid: true };
  }

  // Validate date to prevent future dates where inappropriate
  static validateDate(date: Date | string, allowFuture: boolean = true): ValidationResult {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return { isValid: false, error: 'Please enter a valid date' };
    }
    
    const now = new Date();
    const minDate = new Date('1900-01-01');
    const maxDate = new Date('2100-12-31');
    
    if (dateObj < minDate || dateObj > maxDate) {
      return { isValid: false, error: 'Date is outside valid range' };
    }
    
    if (!allowFuture && dateObj > now) {
      return { isValid: false, error: 'Date cannot be in the future' };
    }
    
    return { isValid: true };
  }
}