/* ==========================================================================
   Cool Sir Edulife Academy — 华尔街投资体验 Landing Page
   Interactions: scroll reveal, smooth scroll CTA, form validation,
   Google Apps Script submission, success modal
   ========================================================================== */

(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     CONFIG — replace with your deployed Google Apps Script Web App URL
     ---------------------------------------------------------------------- */
  const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL";

  /* ----------------------------------------------------------------------
     Smooth scroll: CTA buttons -> registration form
     ---------------------------------------------------------------------- */
  function scrollToRegister() {
    const target = document.getElementById("register");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    // Move focus to first field shortly after scroll, for accessibility
    window.setTimeout(function () {
      const firstField = document.getElementById("name");
      if (firstField) firstField.focus({ preventScroll: true });
    }, 600);
  }

  const heroCta = document.getElementById("heroCta");
  const navCta = document.getElementById("navCta");
  if (heroCta) heroCta.addEventListener("click", scrollToRegister);
  if (navCta) navCta.addEventListener("click", scrollToRegister);

  /* ----------------------------------------------------------------------
     Scroll reveal via IntersectionObserver
     ---------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });

    // Simulation panel bar-chart animation trigger
    const simPanel = document.getElementById("simPanel");
    if (simPanel) {
      const simObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      simObserver.observe(simPanel);
    }
  } else {
    // Fallback: show everything immediately if IntersectionObserver unsupported
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    const simPanel = document.getElementById("simPanel");
    if (simPanel) simPanel.classList.add("is-visible");
  }

  /* ----------------------------------------------------------------------
     Toast helper
     ---------------------------------------------------------------------- */
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-shown");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove("is-shown");
    }, 4200);
  }

  /* ----------------------------------------------------------------------
     Form validation
     ---------------------------------------------------------------------- */
  const form = document.getElementById("registrationForm");
  const submitBtn = document.getElementById("submitBtn");
  const submitSpinner = document.getElementById("submitSpinner");
  const submitLabel = document.getElementById("submitLabel");

  const fields = {
    name: document.getElementById("name"),
    whatsapp: document.getElementById("whatsapp"),
    email: document.getElementById("email"),
    experience: document.getElementById("experience"),
    goal: document.getElementById("goal")
  };

  const errors = {
    name: document.getElementById("error-name"),
    whatsapp: document.getElementById("error-whatsapp"),
    email: document.getElementById("error-email"),
    experience: document.getElementById("error-experience"),
    goal: document.getElementById("error-goal")
  };

  // Accepts numbers, spaces, dashes, optional leading +; requires at least 8 digits
  function isValidWhatsapp(value) {
    const digitsOnly = value.replace(/\D/g, "");
    const formatOk = /^[+]?[0-9\s-]{8,16}$/.test(value.trim());
    return formatOk && digitsOnly.length >= 8 && digitsOnly.length <= 15;
  }

  function isValidEmail(value) {
    // Standard, pragmatic email pattern
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function setFieldState(key, valid) {
    const fieldEl = fields[key];
    const errorEl = errors[key];
    if (!fieldEl || !errorEl) return;
    if (valid) {
      fieldEl.classList.remove("is-invalid");
      errorEl.classList.remove("is-shown");
    } else {
      fieldEl.classList.add("is-invalid");
      errorEl.classList.add("is-shown");
    }
  }

  function validateField(key) {
    const value = fields[key] ? fields[key].value : "";
    let valid = true;

    switch (key) {
      case "name":
        valid = value.trim().length >= 2;
        break;
      case "whatsapp":
        valid = isValidWhatsapp(value);
        break;
      case "email":
        valid = isValidEmail(value);
        break;
      case "experience":
        valid = value.trim().length > 0;
        break;
      case "goal":
        valid = value.trim().length >= 3;
        break;
      default:
        valid = true;
    }

    setFieldState(key, valid);
    return valid;
  }

  function validateAll() {
    let allValid = true;
    Object.keys(fields).forEach(function (key) {
      if (!validateField(key)) allValid = false;
    });
    return allValid;
  }

  // Live validation as user interacts
  Object.keys(fields).forEach(function (key) {
    const el = fields[key];
    if (!el) return;
    const evt = el.tagName === "SELECT" ? "change" : "blur";
    el.addEventListener(evt, function () { validateField(key); });
    el.addEventListener("input", function () {
      if (el.classList.contains("is-invalid")) validateField(key);
    });
  });

  /* ----------------------------------------------------------------------
     Submission state helpers
     ---------------------------------------------------------------------- */
  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    if (submitSpinner) submitSpinner.classList.toggle("is-shown", isSubmitting);
    if (submitLabel) submitLabel.textContent = isSubmitting ? "提交中..." : "提交报名";
  }

  /* ----------------------------------------------------------------------
     Success modal
     ---------------------------------------------------------------------- */
  const successModal = document.getElementById("successModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  function openModal() {
    if (!successModal) return;
    successModal.classList.add("is-active");
    document.body.style.overflow = "hidden";
    if (modalCloseBtn) modalCloseBtn.focus();
  }

  function closeModal() {
    if (!successModal) return;
    successModal.classList.remove("is-active");
    document.body.style.overflow = "";
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", function () {
      closeModal();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (successModal) {
    successModal.addEventListener("click", function (e) {
      if (e.target === successModal) closeModal();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && successModal && successModal.classList.contains("is-active")) {
      closeModal();
    }
  });

  /* ----------------------------------------------------------------------
     Form submit handler — POST to Google Apps Script Web App
     ---------------------------------------------------------------------- */
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validateAll()) {
        const firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        showToast("请检查并填写所有必填字段");
        return;
      }

      const payload = {
        name: fields.name.value.trim(),
        whatsapp: fields.whatsapp.value.trim(),
        email: fields.email.value.trim(),
        experience: fields.experience.value,
        goal: fields.goal.value.trim()
      };

      if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_SCRIPT_URL") {
        // Not yet configured — explain clearly instead of failing silently
        showToast("尚未连接后端：请在 script.js 设置 GOOGLE_SCRIPT_URL");
        console.warn(
          "[Cool Sir Edulife Academy] GOOGLE_SCRIPT_URL is not configured. " +
          "Deploy Code.gs as a Web App and paste its URL into script.js. See README.md."
        );
        return;
      }

      setSubmitting(true);

      // Google Apps Script Web Apps work most reliably with a simple POST
      // using text/plain content-type to avoid CORS preflight issues.
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json().catch(function () { return { result: "success" }; });
        })
        .then(function (data) {
          setSubmitting(false);
          if (data && data.result === "error") {
            showToast(data.message || "提交失败，请稍后再试");
            return;
          }
          form.reset();
          Object.keys(fields).forEach(function (key) { setFieldState(key, true); });
          openModal();
        })
        .catch(function (err) {
          console.error("[Cool Sir Edulife Academy] Submission error:", err);
          setSubmitting(false);
          showToast("网络错误，请检查网络连接后重试");
        });
    });
  }

  /* ----------------------------------------------------------------------
     Navbar subtle elevation on scroll (purely cosmetic, cheap to compute)
     ---------------------------------------------------------------------- */
  const navbar = document.querySelector(".navbar");
  let lastScrollY = window.scrollY;
  let navTicking = false;

  function handleNavScroll() {
    if (!navbar) return;
    const currentY = window.scrollY;
    navbar.style.boxShadow = currentY > 8 ? "0 8px 24px rgba(10,22,40,0.25)" : "none";
    lastScrollY = currentY;
    navTicking = false;
  }

  window.addEventListener("scroll", function () {
    if (!navTicking) {
      window.requestAnimationFrame(handleNavScroll);
      navTicking = true;
    }
  });
})();
