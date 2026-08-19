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

  var solutionsPin = document.getElementById("solutionsPin");
  if (solutionsPin) {
    var solButtons = solutionsPin.querySelectorAll(".solution-nav-list button");
    var solPanes = solutionsPin.querySelectorAll(".solution-pane");
    var solBar = document.getElementById("solutionsBar");
    var solCount = solPanes.length;

    function setSolStep(index) {
      solButtons.forEach(function (b, i) {
        var active = i === index;
        b.classList.toggle("active", active);
        b.setAttribute("aria-current", active ? "true" : "false");
        b.setAttribute("tabindex", active ? "0" : "-1");
      });
      solPanes.forEach(function (p, i) {
        var active = i === index;
        p.classList.toggle("active", active);
        p.setAttribute("aria-hidden", active ? "false" : "true");
      });
    }

    function solTick() {
      if (window.innerWidth < 810) return; // Disable scroll tracking on mobile viewports
      var top = solutionsPin.getBoundingClientRect().top + window.pageYOffset;
      var total = solutionsPin.offsetHeight - window.innerHeight;
      var scrolled = Math.min(Math.max(window.pageYOffset - top, 0), total);
      var progress = total > 0 ? scrolled / total : 0;
      var index = Math.min(solCount - 1, Math.floor(progress * solCount));
      setSolStep(index);
      if (solBar) solBar.style.width = progress * 100 + "%";
    }

    solButtons.forEach(function (b, i) {
      b.addEventListener("click", function () {
        if (window.innerWidth < 810) {
          // Card-less tab switching on mobile (no screen jump)
          setSolStep(i);
          if (solBar) solBar.style.width = ((i + 1) / solCount) * 100 + "%";
        } else {
          var top = solutionsPin.getBoundingClientRect().top + window.pageYOffset;
          var total = solutionsPin.offsetHeight - window.innerHeight;
          var target = top + ((total * (i + 0.5)) / solCount);
          window.scrollTo({ top: target, behavior: "smooth" });
        }
      });
    });

    window.addEventListener("scroll", solTick, { passive: true });
    window.addEventListener("resize", solTick);
    solTick();
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

  function updateGearsConnectors() {
    var gears = document.querySelector(".process-gears");
    if (!gears) return;
    var svg = gears.querySelector(".process-connectors");
    if (!svg) return;

    if (window.innerWidth < 810) {
      svg.innerHTML = "";
      return;
    }

    var hub = gears.querySelector(".hub-gear");
    var sats = gears.querySelectorAll(".sat");
    if (!hub || sats.length === 0) return;

    var parentRect = gears.getBoundingClientRect();
    var hubRect = hub.getBoundingClientRect();

    // Start point: right edge of the hub gear circle (approx at 82% of the width)
    var startX = hubRect.left - parentRect.left + hubRect.width * 0.82;
    var startY = hubRect.top - parentRect.top + hubRect.height / 2;

    // Clear previous paths
    svg.innerHTML = "";

    sats.forEach(function (sat, i) {
      var satRect = sat.getBoundingClientRect();
      var endX = satRect.left - parentRect.left + 6;
      var endY = satRect.top - parentRect.top + satRect.height / 2;

      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      
      // Draw a straight line from start to end
      path.setAttribute("d", "M " + startX + " " + startY + " L " + endX + " " + endY);
      
      var colors = ["#5aa2ff", "#2f6fd6", "#1c4f9f", "#0e2e60"];
      path.setAttribute("stroke", colors[i] || "#2f6fd6");
      path.setAttribute("stroke-width", "3.5");
      path.setAttribute("fill", "none");
      path.setAttribute("opacity", "0.7");
      path.setAttribute("stroke-linecap", "round");

      svg.appendChild(path);
    });
  }

  // Run on load, resize, and DOMContentLoaded
  window.addEventListener("resize", updateGearsConnectors);
  window.addEventListener("load", updateGearsConnectors);
  document.addEventListener("DOMContentLoaded", updateGearsConnectors);
  
  // Initial draw and helper triggers
  updateGearsConnectors();
  setTimeout(updateGearsConnectors, 200);
  setTimeout(updateGearsConnectors, 1000);
})();