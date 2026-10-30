$(function () {
  "use strict";

  // Current year in every footer.
  $(".year").text(new Date().getFullYear());

  // Navbar appearance after scrolling.
  const updateNav = () => {
    $(".site-nav").toggleClass("scrolled", window.scrollY > 30);
    $("#backToTop").toggleClass("show", window.scrollY > 450);
  };
  updateNav();
  $(window).on("scroll", updateNav);

  // Close the mobile menu after selecting a page.
  $(".site-nav .nav-link, .site-nav .nav-cta").on("click", function () {
    const nav = document.querySelector("#mainNav");
    if (nav && nav.classList.contains("show") && window.bootstrap) {
      bootstrap.Collapse.getOrCreateInstance(nav).hide();
    }
  });

  // Reveal content when it enters the viewport.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el, index) => {
      el.style.setProperty("--delay", `${(index % 3) * 0.08}s`);
      observer.observe(el);
    });
  } else {
    $(".reveal").addClass("visible");
  }

  // Animated statistics.
  const counterObserver = "IntersectionObserver" in window ? new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const start = performance.now();
      const duration = 1400;
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 }) : null;
  document.querySelectorAll("[data-count]").forEach(el => {
    if (counterObserver) counterObserver.observe(el);
    else el.textContent = Number(el.dataset.count || 0).toLocaleString();
  });

  // Property category buttons.
  $("#propertyFilters .filter-btn").on("click", function () {
    const filter = $(this).data("filter");
    $("#propertyFilters .filter-btn").removeClass("active");
    $(this).addClass("active");
    $(".property-item").each(function () {
      const matches = filter === "all" || $(this).data("type") === filter;
      $(this).toggleClass("is-hidden", !matches);
    });
    updateResultsCount();
  });

  // Property search works on both Home and Properties pages.
  $("#searchForm").on("submit", function (event) {
    event.preventDefault();
    const location = $("#location").val() || "all";
    const type = $("#type").val() || "all";
    const budget = Number($("#budget").val() || 999999999);
    let visibleCount = 0;

    $(".property-item").each(function () {
      const card = $(this);
      const matchesLocation = location === "all" || card.data("location") === location;
      const matchesType = type === "all" || card.data("type") === type;
      const matchesBudget = Number(card.data("price")) <= budget;
      const matches = matchesLocation && matchesType && matchesBudget;
      card.toggleClass("is-hidden", !matches);
      if (matches) visibleCount++;
    });

    // Sync category tabs to the selected type.
    if (type !== "all") {
      $("#propertyFilters .filter-btn").removeClass("active");
      $(`#propertyFilters .filter-btn[data-filter="${type}"]`).addClass("active");
    } else {
      $("#propertyFilters .filter-btn").removeClass("active");
      $('#propertyFilters .filter-btn[data-filter="all"]').addClass("active");
    }
    $("#noResults").toggleClass("d-none", visibleCount > 0);
    updateResultsCount();
    const section = document.querySelector("#properties");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  function updateResultsCount() {
    const visible = $(".property-item").not(".is-hidden").length;
    $("#resultCount").text(visible);
    $("#noResults").toggleClass("d-none", visible > 0);
  }

  // Save / unsave a property (visual-only demo).
  $(".favorite-btn").on("click", function () {
    $(this).toggleClass("saved");
    const icon = $(this).find("i");
    icon.toggleClass("fa-regular", !$(this).hasClass("saved"));
    icon.toggleClass("fa-solid", $(this).hasClass("saved"));
    $(this).attr("aria-pressed", $(this).hasClass("saved") ? "true" : "false");
  });

  // Back to top.
  $("#backToTop").on("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Contact form demo: validate and show a friendly message, without sending data.
  $("#contactForm").on("submit", function (event) {
    event.preventDefault();
    $("#formFeedback").text("Thanks! This demo form is working on the page, but it is not connected to an email service yet.");
    this.reset();
  });
});
