export type PasswordStrength = {
  score: number; // 0 to 4
  label: string;
  color: string;
};

export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password || password.length < 8) {
    return { score: 0, label: 'Muito Curta', color: 'bg-error' };
  }

  let score = 0;
  
  // Rule 1: Lowercase letters
  if (/[a-z]/.test(password)) score++;
  
  // Rule 2: Uppercase letters
  if (/[A-Z]/.test(password)) score++;
  
  // Rule 3: Numbers
  if (/[0-9]/.test(password)) score++;
  
  // Rule 4: Special characters
  if (/[^A-Za-z0-9]/.test(password)) score++;

  switch (score) {
    case 1:
      return { score: 1, label: 'Fraca', color: 'bg-red-500' };
    case 2:
      return { score: 2, label: 'Razoável', color: 'bg-yellow-500' };
    case 3:
      return { score: 3, label: 'Forte', color: 'bg-green-500' };
    case 4:
      return { score: 4, label: 'Muito Forte', color: 'bg-green-600' };
    default:
      return { score: 0, label: 'Fraca', color: 'bg-red-500' };
  }
}
