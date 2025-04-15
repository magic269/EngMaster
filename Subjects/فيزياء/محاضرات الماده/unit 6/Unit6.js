const videoUrls = {
    video1: "https://www.youtube.com/embed/FIk_YQjsW-Y",
    video2: "https://www.youtube.com/embed/zUWfgygS_RI",
    video3: null // للإشارة إلى أن المحاضرة الثالثة غير متوفرة
};

const isValidUrl = (url) => url && /^https:\/\/www\.youtube\.com\/embed\//.test(url);

const showVideo = (element, videoId) => {
    const videoContainer = document.getElementById(videoId);
    if (!videoContainer) return;
    const videoUrl = videoUrls[videoId];
    if (!videoUrl) {
        displayError(videoContainer, "الفيديو غير متوفر حاليًا.");
        return;
    }
    if (!isValidUrl(videoUrl)) {
        displayError(videoContainer, "رابط الفيديو غير صالح.");
        return;
    }

    const allLinks = document.querySelectorAll(".subject li a:not(.coming-soon)");
    const allContainers = document.querySelectorAll(".video-container");
    allLinks.forEach((link) => link.classList.remove("active"));
    allContainers.forEach((container) => {
        container.innerHTML = "";
        container.classList.remove("visible");
    });

    element.classList.add("active");
    if (videoContainer.querySelector("iframe")?.src === videoUrl) return;

    const iframe = document.createElement("iframe");
    iframe.src = videoUrl;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups");
    videoContainer.innerHTML = "";
    videoContainer.appendChild(iframe);
    videoContainer.classList.add("visible");
    videoContainer.scrollIntoView({ behavior: "smooth", block: "center" });
};

const displayError = (container, message) => {
    container.innerHTML = "";
    const errorMsg = document.createElement("p");
    errorMsg.style.color = "red";
    errorMsg.style.textAlign = "center";
    errorMsg.textContent = message;
    container.appendChild(errorMsg);
    container.classList.add("visible");
};

document.addEventListener("click", (e) => {
    const videoContainer = e.target.closest(".video-container");
    const link = e.target.closest(".subject li a:not(.coming-soon)");
    if (!videoContainer && !link) {
        document.querySelectorAll(".video-container").forEach((container) => {
            container.innerHTML = "";
            container.classList.remove("visible");
        });
        document.querySelectorAll(".subject li a").forEach((link) => link.classList.remove("active"));
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".subject li a:not(.coming-soon)");
    links.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const videoId = link.getAttribute("data-video-id");
            showVideo(link, videoId);
        });
    });

    const comingSoonLinks = document.querySelectorAll(".coming-soon");
    comingSoonLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const videoId = link.getAttribute("data-video-id");
            const videoContainer = document.getElementById(videoId);
            if (videoContainer) {
                displayError(videoContainer, "المحاضرة الثالثة ستكون متاحة قريبًا!");
            }
        });
    });

    if ("IntersectionObserver" in window) {
        const containers = document.querySelectorAll(".video-container");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        entry.target.innerHTML = "";
                        entry.target.classList.remove("visible");
                    }
                });
            },
            { threshold: 0 }
        );
        containers.forEach((container) => observer.observe(container));
    }
});

window.addEventListener("error", (e) => {
    if (e.target.tagName === "IFRAME") {
        const container = e.target.closest(".video-container");
        if (container) {
            displayError(container, "خطأ في تحميل الفيديو، حاول مرة أخرى لاحقًا.");
        }
    }
}, true);