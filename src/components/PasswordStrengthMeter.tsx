import React from 'react';
import { evaluatePasswordStrength } from '../utils/password';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = evaluatePasswordStrength(password);
  
  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="text-on-surface-variant">Força da senha:</span>
        <span className={`${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
      </div>
      <div className="flex gap-1 h-1.5">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`flex-1 rounded-full transition-all duration-300 ${
              password.length >= 8 && strength.score >= level ? strength.color : 'bg-surface-variant'
            }`}
          />
        ))}
      </div>
      <p className="text-[10px] text-on-surface-variant font-medium">
        Use 8+ caracteres misturando letras (A-a), números (0-9) e símbolos (#$@!).
      </p>
    </div>
  );
}
