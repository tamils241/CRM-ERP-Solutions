// Ensure pages hide the loader once resources finish loading (fallback when no explicit loader markup present)
(function(){
  if (document.readyState === 'complete') document.body.classList.add('loaded');
  else window.addEventListener('load', () => document.body.classList.add('loaded'));
})();

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
      const nameField = $('input[pattern]', form);
      if (nameField && !new RegExp(nameField.pattern).test(nameField.value)) {
        nameField.focus();
        showToast("Full name: only letters and spaces, max 16 characters.", "error");
        return;
      }
      const password = $('[name="password"]', form);
      const confirm = $('[name="confirmPassword"]', form);
      if (password && confirm && password.value !== confirm.value) {
        confirm.focus();
        showToast("Passwords do not match.", "error");
        return;
      }
      const role = form.querySelector('select')?.value;
      form.reset();
      showToast(form.dataset.success || "Submitted successfully.");
      if (form.querySelector('.btn[type="submit"]')?.textContent.trim() === 'Create Account') {
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
      }
      if (form.querySelector('.btn[type="submit"]')?.textContent.trim() === 'Login') {
        const target = role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
        setTimeout(() => { window.location.href = target; }, 1500);
      }
    });
  });

  const themeClass = document.body.classList.contains("dashboard-body") ? "dark-dash" : "dark-mode";
  const savedTheme = safeStorage.get("stackly-theme");
  if (savedTheme !== "light") {
    document.body.classList.add(themeClass);
  }

  var rememberCb = document.querySelector('.form-grid input[type="checkbox"]');
  if (rememberCb) {
    setTimeout(function() { rememberCb.checked = false; }, 0);
    var label = rememberCb.parentElement;
    if (label) {
      label.addEventListener('click', function(e) {
        if (e.target !== rememberCb) {
          e.preventDefault();
          rememberCb.checked = !rememberCb.checked;
        }
      });
    }
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

  // 3D tilt for all grid cards
  const tiltCards = $$('.feature-card, .content-card, .testimonial-card, .price-card');
  tiltCards.forEach(card => {
    if (card.closest('.testimonial-track')) return;
    if (card.querySelector('.card-shine')) return;

    card.dataset.tilt = 'active';

    const shine = document.createElement('div');
    shine.className = 'card-shine';
    shine.style.cssText = 'position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:linear-gradient(to right,rgba(255,255,255,0)0%,rgba(255,255,255,0.1)50%,rgba(255,255,255,0)100%);transform:rotate(30deg);opacity:0;pointer-events:none;transition:opacity 0.3s ease;z-index:1;';
    card.appendChild(shine);

    const isPremium = card.classList.contains('premium-card') || card.classList.contains('premium');
    const baseScale = isPremium ? 1.04 : 1;

    card.addEventListener('mouseenter', () => { card.style.transition = 'transform 0.1s ease-out'; });
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      card.style.transition = 'none';
      card.style.transform = `perspective(1200px) rotateX(${(cy - y) / 12}deg) rotateY(${(x - cx) / 12}deg) scale3d(${baseScale + 0.04}, ${baseScale + 0.04}, ${baseScale + 0.04})`;
      shine.style.opacity = '1';
      shine.style.transform = `rotate(30deg) translateX(${x / 8}%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = isPremium ? 'perspective(1200px) scale3d(1.04, 1.04, 1.04)' : 'perspective(1200px) scale3d(1, 1, 1)';
      shine.style.opacity = '0';
    });
    card.addEventListener('click', function() {
      this.classList.add('clicked');
      setTimeout(() => this.classList.remove('clicked'), 500);
    });
  });
});
