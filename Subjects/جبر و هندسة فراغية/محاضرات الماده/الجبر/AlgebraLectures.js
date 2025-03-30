// Debounce للـ alerts
let lastAlertTime = 0;
const alertCooldown = 2000;

// دالة لتشغيل/إغلاق الفيديو
let activeVideo = null;
function toggleVideo(videoId) {
    let videoDiv = document.getElementById(videoId);
    if (activeVideo && activeVideo !== videoDiv) activeVideo.style.display = "none";
    videoDiv.style.display = (videoDiv.style.display === "block") ? "none" : "block";
    activeVideo = (videoDiv.style.display === "block") ? videoDiv : null;
}

// دالة زر الرجوع
function goBack() {
    history.back();
}

// ✅ التحقق من توفر الروابط
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".subject a").forEach(link => {
        if (link.href && !link.href.includes('javascript') && !link.href.includes('#')) {
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
});

// 🔒 منع النقر بزر الفأرة الأيمن
document.addEventListener("contextmenu", e => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastAlertTime > alertCooldown) {
        alert("🚫 ممنوع النقر بزر الفأرة الأيمن!");
        lastAlertTime = now;
    }
});

// 🔒 منع تحديد النص
document.addEventListener("selectstart", e => e.preventDefault());

// 🔒 منع النسخ
document.addEventListener("copy", e => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastAlertTime > alertCooldown) {
        alert("🚫 النسخ غير مسموح!");
        lastAlertTime = now;
    }
});

// 🔒 منع فتح أدوات المطور
document.addEventListener("keydown", e => {
    if (
        e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) || 
        (e.ctrlKey && e.key === "U")
    ) {
        e.preventDefault();
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

// 🔥 إخفاء Console كل 1000ms
setInterval(() => console.clear(), 1000);