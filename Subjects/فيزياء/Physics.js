// ✅ التحقق من توفر الروابط
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

// 🔒 إعدادات الحماية
document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    alert("🚫 ممنوع النقر بزر الفأرة الأيمن!");
});

document.addEventListener("selectstart", function (event) {
    event.preventDefault();
});

document.addEventListener("copy", function (event) {
    event.preventDefault();
    alert("🚫 النسخ غير مسموح!");
});

document.addEventListener("keydown", function (event) {
    if (event.key === "F12" || 
        (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "U" || event.key === "C"))) {
        event.preventDefault();
        alert("🚫 ممنوع الوصول إلى أدوات المطور!");
    }
});

// 🚫 تعطيل الكونسول
console.log = function() {};
console.warn = function() {};
console.error = function() {};
console.info = function() {};
console.debug = function() {};

setInterval(function() {
    console.clear();
}, 100);