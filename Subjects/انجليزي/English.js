// script.js
// ✅ التحقق من توفر الروابط وتلوين الروابط غير المتاحة بالأحمر
document.querySelectorAll(".content ul li a").forEach(link => {
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
});

// 🔒 منع النقر بزر الفأرة الأيمن
document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    alert("🚫 ممنوع النقر بزر الفأرة الأيمن!");
});

// 🔒 منع تحديد النص
document.addEventListener("selectstart", function (event) {
    event.preventDefault();
});

// 🔒 منع النسخ
document.addEventListener("copy", function (event) {
    event.preventDefault();
    alert("🚫 النسخ غير مسموح!");
});

// 🔒 منع فتح أدوات المطور (F12 و Ctrl+Shift+I و Ctrl+U و Ctrl+Shift+C)
document.addEventListener("keydown", function (event) {
    if (event.key === "F12" || 
        (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "U" || event.key === "C"))) {
        event.preventDefault();
        alert("🚫 ممنوع الوصول إلى أدوات المطور!");
    }
});

// 🚫 تعطيل Console بالكامل
console.log = function() {};
console.warn = function() {};
console.error = function() {};
console.info = function() {};
console.debug = function() {};

// 🔥 إخفاء Console كل 100ms لمنع التلاعب
setInterval(function() {
    console.clear();
}, 100);