/*
  app.js
  ไฟล์นี้เพิ่มลูกเล่นให้เว็บไซต์ (เว็บยังใช้งานได้แม้ไม่มี JS)
  ทำ 3 อย่าง:
  1) ใส่ปีปัจจุบันใน footer
  2) เปิด/ปิดเมนูมือถือ (toggle)
  3) ทำ Scroll Reveal ด้วย Intersection Observer
*/

/* =========================
   1) ใส่ปีอัตโนมัติใน footer
   ========================= */
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* =========================
   2) เมนูมือถือ (toggle)
   ========================= */
const toggleBtn = document.querySelector(".nav-toggle");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const opened = document.body.classList.toggle("nav-open");
    toggleBtn.setAttribute("aria-expanded", String(opened));
  });
}

/* =========================
   3) Scroll Reveal (Intersection Observer)
   ========================= */
const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target); // เล่นครั้งเดียวแล้วพอ
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealEls.forEach((el) => io.observe(el));
} else {
  // browser เก่า: แสดงเลย ไม่ต้อง animate
  revealEls.forEach((el) => el.classList.add("is-visible"));
}
// ===== Page entrance animation (safe & smooth) =====
window.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  hero.classList.add("enter");
});
