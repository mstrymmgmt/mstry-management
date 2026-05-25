const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

qs(".menu-toggle")?.addEventListener("click", () => qs(".nav-links")?.classList.toggle("open"));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: .14 });
qsa("[data-animate]").forEach((el) => observer.observe(el));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || entry.target.dataset.done) return;
    entry.target.dataset.done = "true";
    const end = Number(entry.target.dataset.count);
    const suffix = entry.target.dataset.suffix || "";
    const duration = 1300;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      entry.target.textContent = `${Math.round(end * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: .55 });
qsa("[data-count]").forEach((el) => countObserver.observe(el));

qsa(".faq-question").forEach((button) => {
  button.addEventListener("click", () => button.closest(".faq-item")?.classList.toggle("open"));
});

const chatPanel = qs(".chat-panel");
const chatBody = qs(".chat-body");
const chatInput = qs("#chatMessage");
const addBubble = (text, isUser = false) => {
  const bubble = document.createElement("div");
  bubble.className = `bubble${isUser ? " user" : ""}`;
  bubble.textContent = text;
  chatBody?.appendChild(bubble);
  chatBody?.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
};

qs(".chat-fab")?.addEventListener("click", () => chatPanel?.classList.toggle("open"));
qs(".chat-close")?.addEventListener("click", () => chatPanel?.classList.remove("open"));
qs(".chat-send")?.addEventListener("click", () => {
  const value = chatInput?.value.trim();
  if (!value) return;
  addBubble(value, true);
  chatInput.value = "";
  setTimeout(() => {
    const lower = value.toLowerCase();
    if (lower.includes("free zone") || lower.includes("mainland")) {
      addBubble("Free Zone structures are often suited to international trade, services, e-commerce, and founder-owned operations. Mainland structures are stronger when you need wider UAE market access, local contracts, broader hiring, or physical operations. MSTRY can map the best route against visas, banking, tax, and licensing. Escalate privately at team@themstry.com.");
      return;
    }
    if (lower.includes("visa") || lower.includes("relocation")) {
      addBubble("MSTRY can coordinate business relocation planning, company setup, visa eligibility review, licensing, banking preparation, and the operational support needed once the owner or team arrives. For direct escalation: team@themstry.com.");
      return;
    }
    if (lower.includes("operation") || lower.includes("outsource") || lower.includes("management")) {
      addBubble("Clients can outsource back-office management, renewals, PRO coordination, payroll liaison, HR support, accounting coordination, workflows, and multi-country administration while keeping full ownership and control. MSTRY can handle the operating layer behind the scenes.");
      return;
    }
    addBubble("I can help outline UAE formation, European setup, corporate structuring, banking support, compliance handling, relocation, and outsourced operational management. For tailored guidance, speak with MSTRY at team@themstry.com or request a private consultation.");
  }, 420);
});
chatInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") qs(".chat-send")?.click();
});

qsa("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    if (button) {
      button.textContent = "Request Received";
      button.disabled = true;
    }
  });
});
