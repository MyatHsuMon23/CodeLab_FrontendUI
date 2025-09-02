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
// AES-256-ECB encryption with PKCS7 padding, matching backend
export const encrypt = (text: string) => {
  // Convert key to 32-byte array (AES-256)
  let keyBytes = CryptoJS.enc.Utf8.parse(Key);
  if (keyBytes.sigBytes < 32) {
    // Pad key with zeros if less than 32 bytes
    const padded = new Uint8Array(32);
    const raw = CryptoJS.enc.Utf8.parse(Key).words;
    for (let i = 0; i < Math.min(raw.length * 4, 32); i++) {
      padded[i] = (raw[Math.floor(i / 4)] >> (24 - 8 * (i % 4))) & 0xff;
    }
    keyBytes = CryptoJS.lib.WordArray.create(padded);
  }
  const encrypted = CryptoJS.AES.encrypt(text, keyBytes, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
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