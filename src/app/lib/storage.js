import CryptoJS from "crypto-js";

const KEY = "ai_notes_app_nextjs";

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function loadNotes() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(notes));
}

export function encryptText(plain, password) {
  return CryptoJS.AES.encrypt(plain, password).toString();
}

export function decryptText(cipher, password) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
}
