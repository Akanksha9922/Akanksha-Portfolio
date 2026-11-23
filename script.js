"use strict";

const EMAIL = "singhakanksha9922@gmail.com";
const CV_FILE = "Akanksha Singh Resume.pdf";
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Sticky nav + back-to-top ---------- */
const nav = $("#nav");
const toTop = $("#toTop");

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("is-stuck", y > 20);
  toTop.classList.toggle("is-visible", y > 400);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
const menu = $("#menu");
const menuBtn = $("#menuBtn");

function setMenu(open) {
  menu.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menuBtn.firstElementChild.className = open ? "fas fa-times" : "fas fa-bars";
  document.body.style.overflow = open ? "hidden" : "";
}

menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
$$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
window.addEventListener("resize", () => window.innerWidth > 760 && setMenu(false));

/* ---------- Highlight current section in the menu ---------- */
const links = $$("a", menu);
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) =>
          l.classList.toggle("is-active", l.getAttribute("href") === `#${entry.target.id}`)
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
$$("main section[id]").forEach((s) => sectionObserver.observe(s));

/* ---------- Typing effect ---------- */
const typed = $("#typed");
const fullText = typed.dataset.text;
const cursor = '<span class="cursor">&nbsp;</span>';

if (reduceMotion) {
  typed.textContent = fullText;
} else {
  let i = 0;
  let deleting = false;

  (function tick() {
    typed.innerHTML = fullText.slice(0, i) + cursor;
    let delay = deleting ? 50 : 110;

    if (!deleting && i === fullText.length) {
      deleting = true;
      delay = 2000; // pause on the finished text
    } else if (deleting && i === 0) {
      deleting = false;
      delay = 500;
    }
    i += deleting ? -1 : 1;
    setTimeout(tick, delay);
  })();
}

/* ---------- Skill bars fill when visible ---------- */
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = `${entry.target.dataset.level}%`;
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);
$$(".bars__track i").forEach((bar) => barObserver.observe(bar));

/* ---------- Email + CV download ---------- */
function openGmail() {
  const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;
  window.open(url, "_blank", "noopener");
}
$$("[data-mail]").forEach((btn) => btn.addEventListener("click", openGmail));

function downloadCV() {
  const link = document.createElement("a");
  link.href = encodeURI(CV_FILE);
  link.download = "Akanksha Singh Resume.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
$("#cvBtn").addEventListener("click", downloadCV);

/* ---------- Footer year ---------- */
$("#year").textContent = new Date().getFullYear();
