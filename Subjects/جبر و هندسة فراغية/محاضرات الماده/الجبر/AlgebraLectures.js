const videoUrls = {
    video1: "https://www.youtube.com/embed/Lc2MzMw8-Nc",
    video2: "https://www.youtube.com/embed/DOHDC0_oPt4",
    video3: "https://www.youtube.com/embed/L6rq3mIm7no",
    video4: "https://www.youtube.com/embed/IJqgKgcrhos",
    video5: "https://www.youtube.com/embed/LunaIKnInpg",
    video6: "https://www.youtube.com/embed/A4Z9tk5Ud9M",
    video7: "https://www.youtube.com/embed/_0gm9ZgGRg8",
    video8: "https://www.youtube.com/embed/Xw0uftHxQHU",
    video9: "https://www.youtube.com/embed/2osLaRO9mBE",
    video10: "https://www.youtube.com/embed/hZVxl5IchPk",
    video11: "https://www.youtube.com/embed/6AzrLQgdF9o",
    video12: "https://www.youtube.com/embed/0VSIptBLD2Y",
    video13: "https://www.youtube.com/embed/LSi6EzZTpEc",
    video14: "https://www.youtube.com/embed/i-b9VIeuGbk"
};

const isValidUrl = (url) => /^https:\/\/www\.youtube\.com\/embed\//.test(url);

const showVideo = (element, videoId) => {
    const videoContainer = document.getElementById(videoId);
    if (!videoContainer) return;
    const videoUrl = videoUrls[videoId];
    if (!videoUrl || !isValidUrl(videoUrl)) return;

    const allLinks = document.querySelectorAll(".subject li a");
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

document.addEventListener("click", (e) => {
    const videoContainer = e.target.closest(".video-container");
    const link = e.target.closest(".subject li a");
    if (!videoContainer && !link) {
        document.querySelectorAll(".video-container").forEach((container) => {
            container.innerHTML = "";
            container.classList.remove("visible");
        });
        document.querySelectorAll(".subject li a").forEach((link) => link.classList.remove("active"));
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".subject li a");
    links.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const videoId = link.getAttribute("onclick").match(/'([^']+)'/)[1];
            showVideo(link, videoId);
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
            const errorMsg = document.createElement("p");
            errorMsg.style.color = "red";
            errorMsg.style.textAlign = "center";
            errorMsg.textContent = "خطأ في تحميل الفيديو، حاول مرة أخرى لاحقًا.";
            container.innerHTML = "";
            container.appendChild(errorMsg);
        }
    }
}, true);