const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const safeStorage = {
  get(key) {
    try {
      return window.localStorage?.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage?.setItem(key, value);
    } catch {
      return false;
    }
    return true;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const header = $(".site-header");
  const nav = $(".nav-links");
  const mobileToggle = $(".mobile-toggle");
  const backToTop = $(".back-to-top");
  const toast = $(".toast");

  if (nav && !$(".mobile-nav-close", nav)) {
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "mobile-nav-close";
    closeButton.setAttribute("aria-label", "Close menu");
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    nav.prepend(closeButton);
    closeButton.addEventListener("click", () => nav.classList.remove("open"));
  }

  if (nav && !$(".mobile-nav-actions", nav)) {
    const mobileActions = document.createElement("div");
    mobileActions.className = "mobile-nav-actions";
    mobileActions.innerHTML = `
      <a class="btn btn-ghost" href="login.html"><i class="fa-solid fa-right-to-bracket"></i>Login</a>
      <a class="btn btn-light" href="register.html"><i class="fa-solid fa-user-plus"></i>Register</a>
      <a class="btn btn-primary" href="contact.html"><i class="fa-solid fa-calendar-check"></i>Book Demo</a>
    `;
    nav.appendChild(mobileActions);
  }

  const onScroll = () => {
    const scrolled = window.scrollY > 30;
    header?.classList.toggle("scrolled", scrolled);
    backToTop?.classList.toggle("visible", window.scrollY > 450);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  mobileToggle?.addEventListener("click", () => nav?.classList.toggle("open"));
  $$(".nav-links a").forEach((link) => link.addEventListener("click", () => nav?.classList.remove("open")));
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  $$(".btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  $$(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");
      item?.classList.toggle("open");
    });
  });

  const monthly = $(".price-monthly");
  const yearly = $(".price-yearly");
  const prices = $$(".price[data-monthly]");
  const setBilling = (mode) => {
    monthly?.classList.toggle("active", mode === "monthly");
    yearly?.classList.toggle("active", mode === "yearly");
    prices.forEach((price) => {
      price.textContent = mode === "monthly" ? price.dataset.monthly : price.dataset.yearly;
    });
  };
  monthly?.addEventListener("click", () => setBilling("monthly"));
  yearly?.addEventListener("click", () => setBilling("yearly"));

  const track = $(".testimonial-track");
  if (track) {
    let index = 0;
    const slides = $$(".testimonial-card", track);
    setInterval(() => {
      index = (index + 1) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
    }, 4200);
  }

  $$(".validate-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const invalid = $$("[required]", form).find((field) => {
        const checkboxInvalid = field.type === "checkbox" && !field.checked;
        return checkboxInvalid || !String(field.value || "").trim();
      });
      if (invalid) {
        invalid.focus();
        showToast("Please complete the required fields.", "error");
        return;
      }
      const password = $('[name="password"]', form);
      const confirm = $('[name="confirmPassword"]', form);
      if (password && confirm && password.value !== confirm.value) {
        confirm.focus();
        showToast("Passwords do not match.", "error");
        return;
      }
      form.reset();
      showToast(form.dataset.success || "Submitted successfully.");
    });
  });

  const themeClass = document.body.classList.contains("dashboard-body") ? "dark-dash" : "dark-mode";
  const savedTheme = safeStorage.get("stackly-theme");
  if (savedTheme !== "light") {
    document.body.classList.add(themeClass);
  }

  $$(".theme-toggle").forEach((toggle) => {
    syncThemeToggle(toggle);
    toggle.addEventListener("click", () => {
      document.body.classList.toggle(themeClass);
      safeStorage.set("stackly-theme", document.body.classList.contains(themeClass) ? "dark" : "light");
      syncThemeToggle(toggle);
    });
  });

  function syncThemeToggle(toggle) {
    const isDark = document.body.classList.contains("dashboard-body")
      ? document.body.classList.contains("dark-dash")
      : document.body.classList.contains("dark-mode");
    const icon = $("i", toggle);
    if (icon) {
      icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
    toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    toggle.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2800);
  }
  window.StacklyToast = showToast;
});
