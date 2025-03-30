// Debounce للـ alerts
let lastAlertTime = 0;
const alertCooldown = 2000; // 2 ثانية

let lastOpenedVideo = null; // لتتبع آخر فيديو تم فتحه

function openVideo(event, linkElement, videoUrl) {
    event.preventDefault(); // منع الرابط من إعادة تحميل الصفحة

    // أولًا، تحقق إذا كان هناك فيديو مفتوح حاليًا وأغلقه
    if (lastOpenedVideo) {
        lastOpenedVideo.innerHTML = ''; // إغلاق الفيديو السابق
    }

    // إذا كان الفيديو موجود في YouTube مباشرة، نفتح الرابط مباشرة
    if (videoUrl.includes('youtube.com/watch')) {
        window.open(videoUrl, '_blank');
        return;
    }

    // إنشاء الفيديو الجديد
    let videoContainer = linkElement.nextElementSibling;
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

    // إضافة الفيديو الجديد
    videoContainer.innerHTML = '';
    videoContainer.appendChild(iframe);

    // تعيين الفيديو الحالي كآخر فيديو تم فتحه
    lastOpenedVideo = videoContainer;
}

// ✅ التحقق من توفر الروابط وتلوين الروابط غير المتاحة بالأحمر
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

// 🔒 منع فتح أدوات المطور (F12 و Ctrl+Shift+I/J/C و Ctrl+U)
document.addEventListener("keydown", function (event) {
    if (
        event.key === "F12" || 
        (event.ctrlKey && event.shiftKey && ["I", "J", "C"].includes(event.key)) || 
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

// 🚫 تعطيل Console بالكامل
(function() {
    const disabledConsole = function() {};
    console.log = disabledConsole;
    console.warn = disabledConsole;
    console.error = disabledConsole;
    console.info = disabledConsole;
    console.debug = disabledConsole;
})();

// 🔥 إخفاء Console كل 1000ms (تقليل التكرار من 100ms)
setInterval(function() {
    console.clear();
}, 1000);