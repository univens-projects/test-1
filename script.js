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
})();