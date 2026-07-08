import React from 'react';
import { useTranslation } from 'react-i18next';
import { evaluatePasswordStrength } from '../utils/password';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { t } = useTranslation();

  if (!password) return null;

  const strength = evaluatePasswordStrength(password);

  const strengthLabels: Record<string, string> = {
    'Muito Fraca': t('auth.passwordStrengthWeak'),
    'Fraca': t('auth.passwordStrengthWeak'),
    'Razoável': t('auth.passwordStrengthFair'),
    'Boa': t('auth.passwordStrengthGood'),
    'Forte': t('auth.passwordStrengthStrong'),
  };

  const label = strengthLabels[strength.label] || strength.label;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="text-on-surface-variant">{t('auth.passwordStrength')}</span>
        <span className={`${strength.color.replace('bg-', 'text-')}`}>{label}</span>
      </div>
      <div className="flex gap-1 h-1.5">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`flex-1 rounded-full transition-all duration-300 ${password.length >= 8 && strength.score >= level ? strength.color : 'bg-surface-variant'
              }`}
          />
        ))}
      </div>
      <p className="text-[10px] text-on-surface-variant font-medium">
        {t('auth.passwordHint')}
      </p>
    </div>
  );
}