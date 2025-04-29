(() => {
    "use strict";

    if (typeof window !== "object" || typeof document !== "object" || window.self !== window.top) {
        document.documentElement.innerHTML = "";
        return;
    }

    document.addEventListener("DOMContentLoaded", () => {
        const $body = document.body;
        const $year = document.getElementById("current-year");

        const sanitizeHTML = str => {
            const div = document.createElement("div");
            div.textContent = str;
            return div.innerHTML;
        };

        const applyTheme = t => {
            if (!$body) return;
            $body.classList.toggle("dark-mode", t === "enabled");
        };

        const saveTheme = t => {
            try {
                localStorage.setItem("darkMode", t);
            } catch (_) {}
        };

        const loadTheme = () => {
            try {
                return localStorage.getItem("darkMode");
            } catch (_) {
                return null;
            }
        };

        const setTheme = () => {
            if (!$body) return;
            let t = loadTheme();
            if (!t) {
                t = "disabled";
                saveTheme(t);
            }
            applyTheme(t);
        };

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
            const t = e.matches ? "enabled" : "disabled";
            saveTheme(t);
            applyTheme(t);
        });

        window.addEventListener("storage", () => {
            setTheme();
        });

        setTheme();

        if ($year) {
            $year.textContent = sanitizeHTML(new Date().getFullYear().toString());
        }

        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === "SCRIPT" || node.nodeName === "IFRAME") {
                        node.remove();
                    }
                });
            });
        }).observe(document.body, { childList: true, subtree: true });
    });
})();