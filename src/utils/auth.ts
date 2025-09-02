import { jwtDecode } from "jwt-decode";
import CryptoJS from 'crypto-js';

export interface JwtPayload {
  sub: string; // Subject (e.g., User ID)
  name?: string;
  email?: string;
  [key: string]: any; // Allow other custom claims
}

export const getClaimsFromToken = (token: string): JwtPayload | null => {
  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    return decodedToken;
  } catch (error) {
    console.log("Invalid token", error);
    return null;
  }
}

const Key = import.meta.env.VITE_APP_SECRET_KEY;
const IV = '6543210987654321';
export const encrypt = (text: string) => {
  const ciphertext = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(Key), {
      iv: CryptoJS.enc.Utf8.parse(IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
  }).toString();
  return ciphertext;
};

export const decrypt = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(Key), {
      iv: CryptoJS.enc.Utf8.parse(IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
  });
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};