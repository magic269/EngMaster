document.addEventListener("DOMContentLoaded", setInitialTheme);

const generateRandomKey = () => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return array;
};

const arrayBufferToBase64 = (buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer)));

const base64ToArrayBuffer = (base64) => Uint8Array.from(atob(base64), c => c.charCodeAt(0));

const keyStore = (() => {
  let key = null;
  return {
    generate: () => {
      if (!key) key = generateRandomKey();
      return key;
    },
    get: () => key,
  };
})();

const encryptData = async (theme, key) => {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const data = enc.encode(theme);
  const algorithm = { name: 'AES-GCM', iv: iv };
  const keyObj = await window.crypto.subtle.importKey('raw', key, algorithm, false, ['encrypt']);
  const encryptedData = await window.crypto.subtle.encrypt(algorithm, keyObj, data);
  return { encryptedData, iv };
};

const decryptData = async (encryptedData, key, iv) => {
  const algorithm = { name: 'AES-GCM', iv: iv };
  const keyObj = await window.crypto.subtle.importKey('raw', key, algorithm, false, ['decrypt']);
  const decryptedData = await window.crypto.subtle.decrypt(algorithm, keyObj, encryptedData);
  const dec = new TextDecoder();
  return dec.decode(decryptedData);
};

const storeTheme = async (theme) => {
  const key = keyStore.get() || keyStore.generate();
  const { encryptedData, iv } = await encryptData(theme, key);
  localStorage.setItem("theme", JSON.stringify({
    encryptedData: arrayBufferToBase64(encryptedData),
    iv: arrayBufferToBase64(iv),
  }));
};

const retrieveTheme = async () => {
  const themeData = localStorage.getItem("theme");
  if (!themeData) return null;
  try {
    const parsed = JSON.parse(themeData);
    if (parsed.theme) return parsed.theme;
    const { encryptedData, iv } = parsed;
    const key = keyStore.get();
    if (!key) return null;
    return await decryptData(
      base64ToArrayBuffer(encryptedData),
      key,
      base64ToArrayBuffer(iv)
    );
  } catch (e) {
    console.warn("Failed to decrypt theme:", e);
    return null;
  }
};

const applyTheme = (theme) => {
  const body = document.body;
  const toggleBtn = document.getElementById("theme-toggle");
  if (!body || !toggleBtn) return;
  body.classList.toggle("dark-mode", theme === "dark");
  toggleBtn.innerHTML = theme === "dark" ? iconDark : iconLight;
};

const setInitialTheme = async () => {
  const body = document.body;
  const toggleBtn = document.getElementById("theme-toggle");
  if (!body || !toggleBtn) {
    console.warn("Missing body or toggleBtn");
    return;
  }
  let theme = await retrieveTheme();
  if (!theme) {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    await storeTheme(theme);
  }
  applyTheme(theme);
};

const toggleBtn = document.getElementById("theme-toggle");
if (toggleBtn) {
  toggleBtn.addEventListener("click", async () => {
    const body = document.body;
    const newTheme = body.classList.contains("dark-mode") ? "light" : "dark";
    await storeTheme(newTheme);
    applyTheme(newTheme);
  });
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", async (e) => {
  const newTheme = e.matches ? "dark" : "light";
  await storeTheme(newTheme);
  applyTheme(newTheme);
});

window.addEventListener("storage", async (e) => {
  if (e.key === "theme") {
    await setInitialTheme();
  }
});

const iconDark = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M12 2a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zm5.66 3.34a1 1 0 010 1.41l-.7.7a1 1 0 11-1.41-1.41l.7-.7a1 1 0 011.41 0zM21 11a1 1 0 100 2h-1a1 1 0 100-2h1zm-2.34 7.66a1 1 0 01-1.41 0l-.7-.7a1 1 0 111.41-1.41l.7.7a1 1 0 010 1.41zM13 20a1 1 0 10-2 0v1a1 1 0 102 0v-1zm-7.66-2.34a1 1 0 010-1.41l.7-.7a1 1 0 011.41 1.41l-.7.7a1 1 0 01-1.41 0zM4 13a1 1 0 100-2H3a1 1 0 100 2h1zm2.34-7.66a1 1 0 011.41 0l.7.7a1 1 0 11-1.41 1.41l-.7-.7a1 1 0 010-1.41zM12 6a6 6 0 100 12A6 6 0 0012 6z"/></svg>`;

const iconLight = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24"><path d="M21.75 15.5a9.73 9.73 0 01-4.16 4.16 10 10 0 01-13.58-13.58A9.73 9.73 0 0112 2a1 1 0 01.92 1.39A8 8 0 1019.61 13.1a1 1 0 011.39.92 9.73 9.73 0 01-.25 1.48z"/></svg>`;

if (!window.crypto || !window.crypto.subtle) {
  console.warn("Web Crypto API not supported, falling back to plain theme storage");
  localStorage.setItem("theme", JSON.stringify({ theme: "light" }));
}