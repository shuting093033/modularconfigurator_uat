// Enhanced error handling utilities for security
export interface SecureError {
  userMessage: string;
  logMessage: string;
  code?: string;
}

export class ErrorHandler {
  // Map of sensitive errors to generic user messages
  private static sensitiveErrorMap: Record<string, string> = {
    'Invalid login credentials': 'Authentication failed. Please check your credentials.',
    'User not found': 'Authentication failed. Please check your credentials.',
    'Invalid email or password': 'Authentication failed. Please check your credentials.',
    'Email not confirmed': 'Please check your email and confirm your account.',
    'Rate limit exceeded': 'Too many requests. Please try again later.',
    'Database connection failed': 'Service temporarily unavailable. Please try again.',
    'Permission denied': 'You do not have permission to perform this action.',
    'Resource not found': 'The requested resource was not found.',
  };

  // Generic error messages for different categories
  private static genericMessages = {
    auth: 'Authentication failed. Please try again.',
    validation: 'Please check your input and try again.',
    network: 'Network error. Please check your connection.',
    server: 'Service temporarily unavailable. Please try again.',
    permission: 'You do not have permission to perform this action.',
    notFound: 'The requested resource was not found.',
    default: 'An unexpected error occurred. Please try again.',
  };

  // Sanitize error for user display
  static sanitizeError(error: any): SecureError {
    const errorMessage = error?.message || error?.error_description || error || 'Unknown error';
    const errorString = typeof errorMessage === 'string' ? errorMessage : String(errorMessage);
    
    // Check for mapped sensitive errors
    const mappedMessage = this.sensitiveErrorMap[errorString];
    if (mappedMessage) {
      return {
        userMessage: mappedMessage,
        logMessage: errorString,
      };
    }

    // Categorize error types
    if (this.isAuthError(errorString)) {
      return {
        userMessage: this.genericMessages.auth,
        logMessage: errorString,
        code: 'AUTH_ERROR',
      };
    }

    if (this.isValidationError(errorString)) {
      return {
        userMessage: this.genericMessages.validation,
        logMessage: errorString,
        code: 'VALIDATION_ERROR',
      };
    }

    if (this.isNetworkError(errorString)) {
      return {
        userMessage: this.genericMessages.network,
        logMessage: errorString,
        code: 'NETWORK_ERROR',
      };
    }

    if (this.isPermissionError(errorString)) {
      return {
        userMessage: this.genericMessages.permission,
        logMessage: errorString,
        code: 'PERMISSION_ERROR',
      };
    }

    if (this.isNotFoundError(errorString)) {
      return {
        userMessage: this.genericMessages.notFound,
        logMessage: errorString,
        code: 'NOT_FOUND_ERROR',
      };
    }

    // Default case - log full error but show generic message
    return {
      userMessage: this.genericMessages.default,
      logMessage: errorString,
      code: 'UNKNOWN_ERROR',
    };
  }

  // Security logging function
  static logSecurityEvent(event: string, details: any, severity: 'low' | 'medium' | 'high' = 'medium') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      severity,
      details: this.sanitizeLogDetails(details),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
    };

    // In production, this would send to a logging service
    console.warn('SECURITY EVENT:', logEntry);
    
    // For high severity events, you might want to send an alert
    if (severity === 'high') {
      // Send to monitoring service
      this.sendSecurityAlert(logEntry);
    }
  }

  // Rate limiting helper
  static checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    if (typeof window === 'undefined') return true;

    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(`rl_${key}`) || '[]');
    
    // Clean old attempts
    const validAttempts = attempts.filter((timestamp: number) => now - timestamp < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      this.logSecurityEvent('RATE_LIMIT_EXCEEDED', { key, attempts: validAttempts.length }, 'high');
      return false;
    }

    // Add current attempt
    validAttempts.push(now);
    localStorage.setItem(`rl_${key}`, JSON.stringify(validAttempts));
    
    return true;
  }

  // Helper methods for error categorization
  private static isAuthError(error: string): boolean {
    const authKeywords = ['auth', 'login', 'credential', 'unauthorized', 'token', 'session'];
    return authKeywords.some(keyword => error.toLowerCase().includes(keyword));
  }

  private static isValidationError(error: string): boolean {
    const validationKeywords = ['validation', 'invalid', 'required', 'format', 'length'];
    return validationKeywords.some(keyword => error.toLowerCase().includes(keyword));
  }

  private static isNetworkError(error: string): boolean {
    const networkKeywords = ['network', 'connection', 'timeout', 'fetch', 'cors'];
    return networkKeywords.some(keyword => error.toLowerCase().includes(keyword));
  }

  private static isPermissionError(error: string): boolean {
    const permissionKeywords = ['permission', 'forbidden', 'access denied', 'unauthorized'];
    return permissionKeywords.some(keyword => error.toLowerCase().includes(keyword));
  }

  private static isNotFoundError(error: string): boolean {
    const notFoundKeywords = ['not found', '404', 'missing', 'does not exist'];
    return notFoundKeywords.some(keyword => error.toLowerCase().includes(keyword));
  }

  // Sanitize sensitive information from logs
  private static sanitizeLogDetails(details: any): any {
    if (typeof details !== 'object' || details === null) {
      return details;
    }

    const sanitized = { ...details };
    const sensitiveFields = ['password', 'token', 'key', 'secret', 'credit_card', 'ssn'];

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  // Mock security alert function
  private static sendSecurityAlert(logEntry: any) {
    // In a real application, this would send to a monitoring service
    console.error('HIGH SEVERITY SECURITY EVENT:', logEntry);
  }
}