import { randomInt } from 'crypto';

/** Generate a user's random Password */
export function genRandomPassword(): string {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const passwordLength = 12;

  const passwordArray = [];

  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = randomInt(characters.length);
    passwordArray.push(characters[randomIndex]);
  }

  return passwordArray.join('');
}
