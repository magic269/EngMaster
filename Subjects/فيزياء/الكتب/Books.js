// التحقق من توفر الروابط وتلوين الروابط غير المتاحة بالأحمر
document.querySelectorAll(".subject a").forEach(link => {
    if (!link.classList.contains("coming-soon")) { // تجاهل الروابط "قريباً"
        fetch(link.href, { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    link.style.color = "red";
                    link.textContent += " (غير متاح)";
                }
            })
            .catch(() => {
                link.style.color = "red";
                link.textContent += " (غير متاح)";
            });
    }
});

// Debounce للـ alerts
let lastAlertTime = 0;
const alertCooldown = 2000; // 2 ثانية

// 🔒 منع النقر بزر الفأرة الأيمن
document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    const now = Date.now();
    if (now - lastAlertTime > alertCooldown) {
        alert("🚫 ممنوع النقر بزر الفأرة الأيمن!");
        lastAlertTime = now;
    }
});

// 🔒 منع تحديد النص
document.addEventListener("selectstart", function (event) {
    event.preventDefault();
});

// 🔒 منع النسخ
document.addEventListener("copy", function (event) {
    event.preventDefault();
    const now = Date.now();
    if (now - lastAlertTime > alertCooldown) {
        alert("🚫 النسخ غير مسموح!");
        lastAlertTime = now;
    }
});

// 🔒 منع فتح أدوات المطور
document.addEventListener("keydown", function (event) {
    if (
        event.key === "F12" || 
        (event.ctrlKey && event.shiftKey && ["I", "U", "C"].includes(event.key)) || 
        (event.ctrlKey && event.key === "U")
    ) {
        event.preventDefault();
        const now = Date.now();
        if (now - lastAlertTime > alertCooldown) {
            alert("🚫 ممنوع الوصول إلى أدوات المطور!");
            lastAlertTime = now;
        }
    }
});

// 🚫 تعطيل Console
(function() {
    const disabledConsole = function() {};
    console.log = disabledConsole;
    console.warn = disabledConsole;
    console.error = disabledConsole;
    console.info = disabledConsole;
    console.debug = disabledConsole;
})();

// 🔥 إخفاء Console كل 500ms
setInterval(function() {
    console.clear();
}, 500);