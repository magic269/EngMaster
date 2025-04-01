function showVideo(link, videoUrl) {
    const allVideos = document.querySelectorAll('.video-container');
    allVideos.forEach((video) => {
        video.innerHTML = ''; // إغلاق الفيديوهات القديمة
        video.style.display = 'none'; // إخفاء كل الحاويات
    });

    const videoContainer = link.nextElementSibling; // الحاوية الخاصة بالرابط
    if (!videoContainer) return; // فحص وجود الحاوية

    // إذا كان الفيديو مفتوح بالفعل، أغلقه
    if (videoContainer.style.display === 'block') {
        videoContainer.innerHTML = '';
        videoContainer.style.display = 'none';
    } else {
        // افتح الفيديو
        const iframe = document.createElement('iframe');
        iframe.src = videoUrl;
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;

        videoContainer.innerHTML = ''; // تأكد من أن الحاوية فارغة
        videoContainer.appendChild(iframe);
        videoContainer.style.display = 'block'; // إظهار الحاوية
        videoContainer.scrollIntoView({ behavior: "smooth" }); // التمرير للفيديو
    }
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