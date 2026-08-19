(function () {
  document.documentElement.classList.add("js");

  var clockEl = document.getElementById("clock");
  var clockFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", hour12: true });

  function tick() {
    clockEl.textContent = clockFmt.format(new Date());
    clockEl.style.visibility = "visible";
  }

  tick();
  setInterval(tick, 1000);

  var dateEl = document.getElementById("liveDate");
  var dateFmt = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "numeric", day: "numeric", year: "numeric" });
  dateEl.textContent = dateFmt.format(new Date());
  dateEl.style.visibility = "visible";

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var nav = document.getElementById("nav");
  var menuBtn = document.getElementById("menuBtn");
  var mobileMenu = document.getElementById("mobileMenu");

  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  menuBtn.addEventListener("click", function () {
    setMenu(!nav.classList.contains("open"));
  });

  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  var revealEls = document.querySelectorAll("[data-reveal]");

  var aboutVideo = document.querySelector(".about-video");
  var videoToggle = document.querySelector(".video-toggle");

  function updateVideoToggle() {
    if (!videoToggle) return;
    var paused = aboutVideo.paused;
    videoToggle.classList.toggle("is-paused", paused);
    videoToggle.setAttribute("aria-label", paused ? "Play video" : "Pause video");
  }

  if (aboutVideo) {
    aboutVideo.playbackRate = 0.75;
    aboutVideo.addEventListener("loadedmetadata", updateVideoToggle);
    aboutVideo.addEventListener("play", updateVideoToggle);
    aboutVideo.addEventListener("pause", updateVideoToggle);
  }

  if (aboutVideo && videoToggle) {
    videoToggle.addEventListener("click", function () {
      if (aboutVideo.paused) {
        aboutVideo.play();
      } else {
        aboutVideo.pause();
      }
    });
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  var accordionGroups = [
    document.querySelectorAll(".case-study"),
    document.querySelectorAll(".faq-item")
  ];

  accordionGroups.forEach(function (items) {
    items.forEach(function (item) {
      var btn = item.querySelector(".case-study-toggle, .faq-toggle");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("open");
        items.forEach(function (other) {
          if (other !== item) {
            other.classList.remove("open");
            var otherBtn = other.querySelector(".case-study-toggle, .faq-toggle");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          }
        });
        if (isOpen) {
          item.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
        } else {
          item.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  });
})();