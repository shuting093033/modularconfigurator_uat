import React from 'react';
import { SecurityValidator } from '@/utils/validation';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, className = '' }) => {
  const validation = SecurityValidator.validatePassword(password);
  
  const getStrengthLevel = (password: string): { level: number; text: string; color: string } => {
    if (!password) return { level: 0, text: 'Enter a password', color: 'text-muted-foreground' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    Object.values(checks).forEach(check => check && score++);
    
    if (score <= 2) return { level: 1, text: 'Weak', color: 'text-destructive' };
    if (score === 3) return { level: 2, text: 'Fair', color: 'text-orange-500' };
    if (score === 4) return { level: 3, text: 'Good', color: 'text-yellow-500' };
    return { level: 4, text: 'Strong', color: 'text-green-500' };
  };

  const strength = getStrengthLevel(password);
  const requirements = [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[a-z]/.test(password), text: 'One lowercase letter' },
    { met: /\d/.test(password), text: 'One number' },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Password strength:</span>
        <span className={`text-sm font-medium ${strength.color}`}>
          {strength.text}
        </span>
      </div>
      
      <div className="flex space-x-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded-full transition-colors ${
              level <= strength.level
                ? level === 1
                  ? 'bg-destructive'
                  : level === 2
                  ? 'bg-orange-500'
                  : level === 3
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
                : 'bg-muted'
            }`}
          />
        ))}
      </div>
      
      {password && (
        <div className="space-y-1">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  req.met ? 'bg-green-500' : 'bg-muted'
                }`}
              />
              <span className={req.met ? 'text-green-600' : 'text-muted-foreground'}>
                {req.text}
              </span>
            </div>
          ))}
          
          {!validation.isValid && validation.error && (
            <p className="text-xs text-destructive mt-1">{validation.error}</p>
          )}
        </div>
      )}
    </div>
  );
};