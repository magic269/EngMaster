let lastOpenedVideo = null; // لتتبع آخر فيديو تم فتحه

function openVideo(event, linkElement, videoUrl) {
    event.preventDefault(); // منع الرابط من إعادة تحميل الصفحة

    // إغلاق الفيديو السابق إذا كان مفتوحًا
    if (lastOpenedVideo) {
        lastOpenedVideo.innerHTML = ''; // مسح المحتوى السابق
        lastOpenedVideo.style.display = 'none';
    }

    // تحديد أو إنشاء عنصر الفيديو الجديد
    let videoContainer = linkElement.parentElement.querySelector('.video-container');
    if (!videoContainer) {
        videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';
        linkElement.parentElement.appendChild(videoContainer);
    }

    const iframe = document.createElement('iframe');
    iframe.src = videoUrl;
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    // إضافة الفيديو الجديد وعرضه
    videoContainer.innerHTML = '';
    videoContainer.appendChild(iframe);
    videoContainer.style.display = 'block';

    // تعيين الفيديو الحالي كآخر فيديو تم فتحه
    lastOpenedVideo = videoContainer;
}

// التحقق من توفر الروابط وتلوين الروابط غير المتاحة بالأحمر
window.addEventListener("load", function() {
    document.querySelectorAll(".subject a").forEach(link => {
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
});

// Debounce للـ alerts
let lastAlertTime = 0;
const alertCooldown = 2000; // 2 ثانية

// 🔒 منع النقر بزر الفأرة الأيمن
document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    showAlert("🚫 ممنوع النقر بزر الفأرة الأيمن!");
});

// 🔒 منع تحديد النص
document.addEventListener("selectstart", function (event) {
    event.preventDefault();
});

// 🔒 منع النسخ
document.addEventListener("copy", function (event) {
    event.preventDefault();
    showAlert("🚫 النسخ غير مسموح!");
});

// 🔒 منع فتح أدوات المطور
document.addEventListener("keydown", function (event) {
    if (
        event.key === "F12" || 
        (event.ctrlKey && event.shiftKey && ["I", "U", "C"].includes(event.key)) || 
        (event.ctrlKey && event.key === "U")
    ) {
        event.preventDefault();
        showAlert("🚫 ممنوع الوصول إلى أدوات المطور!");
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

// دالة لتنظيم التنبيهات بتوقيت زمني
function showAlert(message) {
    const now = Date.now();
    if (now - lastAlertTime > alertCooldown) {
        alert(message);
        lastAlertTime = now;
    }
}
