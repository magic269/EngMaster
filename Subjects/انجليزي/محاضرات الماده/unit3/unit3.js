function showVideo(element, videoUrl) {
    // إغلاق جميع الفيديوهات المفتوحة
    const allVideoContainers = document.querySelectorAll('.video-container');
    allVideoContainers.forEach(container => {
        container.innerHTML = ''; // إزالة أي فيديو مفتوح سابقاً
    });

    // إنشاء iframe للفيديو الجديد
    const videoContainer = element.nextElementSibling; // تحديد الحاوية المناسبة
    if (!videoContainer) return; // فحص وجود الحاوية

    const iframe = document.createElement('iframe');
    iframe.src = videoUrl;
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    // إضافة الفيديو إلى الحاوية
    videoContainer.innerHTML = ''; // تأكد من أن الحاوية فارغة أولاً
    videoContainer.appendChild(iframe);
}

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

// 🔒 منع فتح أدوات المطور (F12 و Ctrl+Shift+I و Ctrl+U و Ctrl+Shift+C)
document.addEventListener("keydown", function (event) {
    if (event.key === "F12" || 
        (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "U" || event.key === "C"))) {
        event.preventDefault();
        const now = Date.now();
        if (now - lastAlertTime > alertCooldown) {
            alert("🚫 ممنوع الوصول إلى أدوات المطور!");
            lastAlertTime = now;
        }
    }
});

// 🚫 تعطيل Console بالكامل
console.log = function() {};
console.warn = function() {};
console.error = function() {};
console.info = function() {};
console.debug = function() {};

// 🔥 إخفاء Console كل 500ms بدل 100ms لتحسين الأداء
setInterval(function() {
    console.clear();
}, 500);