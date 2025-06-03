const body = document.body;
const toggleBtn = document.querySelector('.dark-mode-toggle-button'); 

const iconDark = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M12 2a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zm5.66 3.34a1 1 0 010 1.41l-.7.7a1 1 0 11-1.41-1.41l.7-.7a1 1 0 011.41 0zM21 11a1 1 0 100 2h-1a1 1 0 100-2h1zm-2.34 7.66a1 1 0 01-1.41 0l-.7-.7a1 1 0 111.41-1.41l.7.7a1 1 0 010 1.41zM13 20a1 1 0 10-2 0v1a1 1 0 102 0v-1zm-7.66-2.34a1 1 0 010-1.41l.7-.7a1 1 0 011.41 1.41l-.7.7a1 1 0 01-1.41 0zM4 13a1 1 0 100-2H3a1 1 0 100 2h1zm2.34-7.66a1 1 0 011.41 0l.7.7a1 1 0 11-1.41 1.41l-.7-.7a1 1 0 010-1.41zM12 6a6 6 0 100 12A6 6 0 0012 6z"/></svg>`;
const iconLight = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24"><path d="M21.75 15.5a9.73 9.73 0 01-4.16 4.16 10 10 0 01-13.58-13.58A9.73 9.73 0 0112 2a1 1 0 01.92 1.39A8 8 0 1019.61 13.1a1 1 0 011.39.92 9.73 9.73 0 01-.25 1.48z"/></svg>`;

const storeTheme = (theme) => {
  localStorage.setItem("theme", theme);
};

const retrieveTheme = () => {
  return localStorage.getItem("theme");
};

const applyTheme = (theme) => {
  if (!body || !toggleBtn) return;
  body.classList.toggle("dark-mode", theme === "dark");
  if (toggleBtn) {
    toggleBtn.innerHTML = theme === "dark" ? iconLight : iconDark; 
  }
};

const setInitialTheme = () => {
  if (!body) return;
  let theme = retrieveTheme();
  if (!theme) {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    storeTheme(theme);
  }
  applyTheme(theme);
};

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const newTheme = body.classList.contains("dark-mode") ? "light" : "dark";
    storeTheme(newTheme);
    applyTheme(newTheme);
  });
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  const newTheme = e.matches ? "dark" : "light";
  storeTheme(newTheme);
  applyTheme(newTheme);
});

window.addEventListener("storage", (e) => {
  if (e.key === "theme") {
    setInitialTheme();
  }
});

document.addEventListener("DOMContentLoaded", setInitialTheme);