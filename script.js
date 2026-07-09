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
    const explicitDecimals = entry.target.dataset.decimals;
    const inferredDecimals = String(entry.target.dataset.count || "").includes(".")
      ? String(entry.target.dataset.count).split(".")[1].length
      : 0;
    const decimals = explicitDecimals ? Number(explicitDecimals) : inferredDecimals;
    const duration = 1300;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = end * eased;
      entry.target.textContent = `${decimals ? current.toFixed(decimals) : Math.round(current)}${suffix}`;
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

qsa("[data-capability-group]").forEach((group) => {
  const cards = qsa("[data-capability-card]", group);
  const lockedCard = () => cards.find((card) => card.dataset.locked === "true");
  const clearCards = ({ clearLocks = false } = {}) => {
    cards.forEach((card) => {
      card.classList.remove("is-active");
      card.setAttribute("aria-expanded", "false");
      if (clearLocks) card.dataset.locked = "false";
    });
    group.classList.remove("has-active");
  };
  const activateCard = (card) => {
    cards.forEach((item) => {
      if (item !== card) {
        item.classList.remove("is-active");
        item.setAttribute("aria-expanded", "false");
      }
    });
    card.classList.add("is-active");
    card.setAttribute("aria-expanded", "true");
    group.classList.add("has-active");
  };

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => activateCard(card));
    card.addEventListener("mouseleave", () => {
      const locked = lockedCard();
      if (locked) activateCard(locked);
      else clearCards();
    });
    card.addEventListener("focus", () => activateCard(card));
    card.addEventListener("blur", () => {
      const locked = lockedCard();
      if (locked) activateCard(locked);
      else clearCards();
    });
    card.addEventListener("click", () => {
      const wasLocked = card.dataset.locked === "true";
      clearCards({ clearLocks: true });
      if (!wasLocked) {
        card.dataset.locked = "true";
        activateCard(card);
      }
    });
  });
});

const consultationSuccess = "Thank you for your inquiry. A member of our team will review your request and contact you shortly.";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const visitorTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const callDateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const callIcsDate = (value) => value.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const callCalendarDescription = (zoomUrl = "") => [
  "Scheduled call with the MSTRY team to discuss objectives, ideas, opportunities, and next steps.",
  zoomUrl ? `Zoom Link: ${zoomUrl}` : "Meeting format: Zoom / Online Call"
].join("\\n");
const callCalendarLinks = (booking) => {
  const title = encodeURIComponent("MSTRY Consultation Call");
  const details = encodeURIComponent(callCalendarDescription(booking.zoom?.joinUrl));
  const location = encodeURIComponent("Zoom / Online Meeting");
  const dates = `${callIcsDate(booking.startUtc)}/${callIcsDate(booking.endUtc)}`;
  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${encodeURIComponent(booking.startUtc)}&enddt=${encodeURIComponent(booking.endUtc)}&body=${details}&location=${location}`
  };
};
const callIcs = (booking) => [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//MSTRY MANAGEMENT//Booking//EN",
  "BEGIN:VEVENT",
  `UID:${booking.id}@themstry.com`,
  `DTSTAMP:${callIcsDate(new Date().toISOString())}`,
  `DTSTART:${callIcsDate(booking.startUtc)}`,
  `DTEND:${callIcsDate(booking.endUtc)}`,
  "SUMMARY:MSTRY Consultation Call",
  `DESCRIPTION:${callCalendarDescription(booking.zoom?.joinUrl)}`,
  "LOCATION:Zoom / Online Meeting",
  "END:VEVENT",
  "END:VCALENDAR"
].join("\r\n");

const demoCallSlots = () => {
  const times = ["09:00", "10:00", "11:30", "13:00", "14:30", "16:00"];
  const slots = [];
  const now = new Date();
  for (let dayOffset = 1; dayOffset <= 60; dayOffset += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + dayOffset);
    const weekday = date.getDay();
    const closed = weekday === 0 || weekday === 6;
    const dateValue = callDateKey(date);
    for (const time of times) {
      const [hour, minute] = time.split(":").map(Number);
      const start = new Date(date);
      start.setHours(hour, minute, 0, 0);
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      const booked = !closed && (date.getDate() + hour) % 5 === 0;
      if (!closed || booked) {
        slots.push({
          date: dateValue,
          time,
          startUtc: start.toISOString(),
          endUtc: end.toISOString(),
          available: !closed && !booked
        });
      }
    }
  }
  return slots;
};

const usePreviewCallSlots = () => {
  const sampleSlots = demoCallSlots();
  return sampleSlots.length ? sampleSlots : [];
};

qsa("[data-call-booking-page]").forEach((page) => {
  const form = qs("[data-call-booking-form]", page);
  const calendarTitle = qs("[data-calendar-title]", page);
  const calendarGrid = qs("[data-calendar-grid]", page);
  const calendarStatus = qs("[data-calendar-status]", page);
  const timeGrid = qs("[data-time-grid]", page);
  const selectedDateInput = qs("[data-selected-date]", page);
  const selectedTimeInput = qs("[data-selected-time]", page);
  const timezoneField = qs("[data-timezone-field]", page);
  const timezoneLabel = qs("[data-timezone-label]", page);
  const bookingSummary = qs("[data-booking-summary]", page);
  const bookingSubmit = qs("[data-booking-submit]", page);
  const confirmationPanel = qs("[data-confirmation-panel]", page);
  const confirmationTime = qs("[data-confirmation-time]", page);
  const googleCalendar = qs("[data-google-calendar]", page);
  const outlookCalendar = qs("[data-outlook-calendar]", page);
  const downloadIcs = qs("[data-download-ics]", page);
  const meetingNote = qs("[data-meeting-note]", page);
  const formStatus = qs("[data-form-status]", page);

  if (!form || !calendarGrid || !timeGrid || !calendarTitle) return;

  let month = new Date();
  let slots = [];
  let selectedDate = "";
  let selectedSlot = null;
  let lastBooking = null;

  if (timezoneField) timezoneField.value = visitorTimezone;
  if (timezoneLabel) timezoneLabel.textContent = `Times shown in your local timezone: ${visitorTimezone}`;

  const slotsByDate = () => slots.reduce((map, slot) => {
    map.set(slot.date, [...(map.get(slot.date) || []), slot]);
    return map;
  }, new Map());

  const formatCallDateTime = (slot) => new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: visitorTimezone
  }).format(new Date(slot.startUtc));

  const formatCallTime = (slot) => new Intl.DateTimeFormat("en-US", {
    timeStyle: "short",
    timeZone: visitorTimezone
  }).format(new Date(slot.startUtc));

  const setFormMessage = (message, type = "") => {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `booking-status ${type}`;
  };

  const updateSummary = () => {
    if (selectedDateInput) selectedDateInput.value = selectedDate;
    if (selectedTimeInput) selectedTimeInput.value = selectedSlot?.time || "";
    if (bookingSummary) {
      bookingSummary.textContent = selectedSlot
        ? `Selected time: ${formatCallDateTime(selectedSlot)}. Meeting format: Zoom / Online Call.`
        : "Choose a date and time to continue.";
    }
    if (bookingSubmit) bookingSubmit.disabled = !selectedSlot;
  };

  const renderTimes = () => {
    const daySlots = (slotsByDate().get(selectedDate) || []);
    const openSlots = daySlots.filter((slot) => slot.available);
    if (!selectedDate) {
      timeGrid.innerHTML = '<button class="time-slot unavailable" type="button" disabled>Select a date first</button>';
      updateSummary();
      return;
    }
    if (!daySlots.length || !openSlots.length) {
      timeGrid.innerHTML = '<button class="time-slot unavailable" type="button" disabled>No open times</button>';
      selectedSlot = null;
      updateSummary();
      return;
    }

    timeGrid.innerHTML = daySlots.map((slot) => {
      const active = selectedSlot?.startUtc === slot.startUtc;
      return `<button class="time-slot ${slot.available ? "available" : "unavailable"} ${active ? "selected" : ""}" type="button" data-time="${slot.time}" ${slot.available ? "" : "disabled"}>${formatCallTime(slot)}</button>`;
    }).join("");

    qsa("[data-time]", timeGrid).forEach((button) => {
      button.addEventListener("click", () => {
        selectedSlot = daySlots.find((slot) => slot.time === button.dataset.time) || null;
        renderTimes();
      });
    });

    updateSummary();
  };

  const renderCalendar = () => {
    const grouped = slotsByDate();
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    calendarTitle.textContent = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(month);

    calendarGrid.innerHTML = Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      const key = callDateKey(day);
      const daySlots = grouped.get(key) || [];
      const hasAvailable = daySlots.some((slot) => slot.available);
      const isBooked = daySlots.length > 0 && !hasAvailable;
      const outside = day.getMonth() !== month.getMonth();
      const selected = selectedDate === key;
      return `<button class="calendar-day ${hasAvailable ? "available" : isBooked ? "booked" : "unavailable"} ${outside ? "outside" : ""} ${selected ? "selected" : ""}" type="button" data-date="${key}" ${hasAvailable ? "" : "disabled"}><span>${day.getDate()}</span><small>${hasAvailable ? "Open" : isBooked ? "Booked" : "Closed"}</small></button>`;
    }).join("");

    qsa("[data-date]", calendarGrid).forEach((button) => {
      button.addEventListener("click", () => {
        selectedDate = button.dataset.date || "";
        selectedSlot = null;
        renderCalendar();
        renderTimes();
      });
    });
  };

  const loadCallAvailability = async () => {
    if (calendarStatus) calendarStatus.textContent = "Loading available call times...";
    if (window.location.protocol === "file:") {
      slots = usePreviewCallSlots();
      if (calendarStatus) calendarStatus.textContent = "Preview mode: showing sample available call times.";
      renderCalendar();
      renderTimes();
      return;
    }
    try {
      const response = await fetch(`/api/availability?timezone=${encodeURIComponent(visitorTimezone)}&days=60`);
      const contentType = response.headers.get("content-type") || "";
      if (!response.ok || !contentType.includes("application/json")) {
        throw new Error("Preview mode: showing sample available call times.");
      }
      const data = await response.json();
      slots = data.slots || [];
      if (calendarStatus) calendarStatus.textContent = "Choose an available day to view call times.";
    } catch (error) {
      slots = usePreviewCallSlots();
      if (calendarStatus) calendarStatus.textContent = "Preview mode: showing sample available call times.";
    }
    renderCalendar();
    renderTimes();
  };

  qs("[data-prev-month]", page)?.addEventListener("click", () => {
    month = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    renderCalendar();
  });
  qs("[data-next-month]", page)?.addEventListener("click", () => {
    month = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    renderCalendar();
  });
  qs("[data-prev-year]", page)?.addEventListener("click", () => {
    month = new Date(month.getFullYear() - 1, month.getMonth(), 1);
    renderCalendar();
  });
  qs("[data-next-year]", page)?.addEventListener("click", () => {
    month = new Date(month.getFullYear() + 1, month.getMonth(), 1);
    renderCalendar();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFormMessage("");

    const button = form.querySelector("button[type='submit']");
    const originalLabel = button?.textContent || "Confirm Call";
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.timezone = visitorTimezone;

    if (!selectedSlot) {
      setFormMessage("Please select an available date and time.", "error");
      return;
    }
    if (!String(payload.fullName || "").trim()) {
      setFormMessage("Please enter your full name.", "error");
      form.querySelector("[name='fullName']")?.focus();
      return;
    }
    if (!emailPattern.test(String(payload.email || "").trim())) {
      setFormMessage("Please enter a valid email address.", "error");
      form.querySelector("[name='email']")?.focus();
      return;
    }

    if (window.location.protocol === "file:") {
      setFormMessage("Live booking confirmation requires the deployed website API.", "error");
      return;
    }

    if (button) {
      button.textContent = "Confirming Call";
      button.disabled = true;
    }

    try {
      const response = await fetch(form.dataset.endpoint || "/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.booking) throw new Error(data.error || "We could not confirm your booking.");

      lastBooking = data.booking;
      slots = slots.map((slot) => slot.startUtc === lastBooking.startUtc ? { ...slot, available: false } : slot);
      const links = callCalendarLinks(lastBooking);
      if (confirmationTime) confirmationTime.textContent = `Your selected time: ${formatCallDateTime(selectedSlot)}`;
      if (googleCalendar) googleCalendar.href = links.google;
      if (outlookCalendar) outlookCalendar.href = links.outlook;
      if (meetingNote) meetingNote.textContent = lastBooking.zoom?.joinUrl ? `Zoom link: ${lastBooking.zoom.joinUrl}` : "Meeting format: Zoom / Online Call. Meeting link will be provided by the MSTRY team.";
      confirmationPanel?.classList.add("visible");
      setFormMessage("");
      renderCalendar();
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : "We could not confirm your booking.", "error");
    } finally {
      if (button) {
        button.textContent = originalLabel;
        button.disabled = !selectedSlot;
      }
    }
  });

  downloadIcs?.addEventListener("click", () => {
    if (!lastBooking) return;
    const blob = new Blob([callIcs(lastBooking)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mstry-consultation-call.ics";
    link.click();
    URL.revokeObjectURL(url);
  });

  loadCallAvailability();
});

const formatSlotDate = (slot) => new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
  timeZone: visitorTimezone
}).format(new Date(slot.startUtc));

const formatSlotTime = (slot) => new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
  timeZone: visitorTimezone
}).format(new Date(slot.startUtc));

const populateTimeSelect = (timeSelect, slots, date) => {
  const times = slots.filter((slot) => slot.date === date && slot.available);
  timeSelect.innerHTML = times.length
    ? times.map((slot) => `<option value="${slot.time}">${formatSlotTime(slot)}</option>`).join("")
    : '<option value="">No available times</option>';
  timeSelect.disabled = !times.length;
};

qsa("[data-booking-scheduler]").forEach((scheduler) => {
  const form = scheduler.closest("form");
  const dateSelect = scheduler.querySelector("[data-date-select]");
  const timeSelect = scheduler.querySelector("[data-time-select]");
  const status = scheduler.querySelector("[data-availability-status]");
  const timezoneLabel = scheduler.querySelector("[data-timezone-label]");
  const timezoneField = form?.querySelector("[data-timezone-field]");
  if (!form || !dateSelect || !timeSelect || !status) return;

  if (timezoneField) timezoneField.value = visitorTimezone;
  if (timezoneLabel) timezoneLabel.textContent = `Times shown in your local timezone: ${visitorTimezone}`;

  const setAvailabilityStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle("error", isError);
  };

  if (window.location.protocol === "file:") {
    dateSelect.innerHTML = '<option value="">Live availability loads on deployed site</option>';
    timeSelect.innerHTML = '<option value="">Deploy to use scheduling</option>';
    setAvailabilityStatus("Live availability and slot reservation run on the deployed Next.js site.");
    return;
  }

  fetch(`/api/availability?timezone=${encodeURIComponent(visitorTimezone)}&days=30`)
    .then((response) => response.json().then((data) => ({ response, data })))
    .then(({ response, data }) => {
      if (!response.ok) throw new Error(data.error || "Availability could not be loaded.");
      const slots = (data.slots || []).filter((slot) => slot.available);
      const dates = [...new Set(slots.map((slot) => slot.date))];
      if (!dates.length) {
        dateSelect.innerHTML = '<option value="">No available dates</option>';
        timeSelect.innerHTML = '<option value="">No available times</option>';
        setAvailabilityStatus("No available consultation times are currently open. Please contact onboarding@themstry.com directly.");
        return;
      }

      dateSelect.innerHTML = dates.map((date) => {
        const slot = slots.find((item) => item.date === date);
        return `<option value="${date}">${slot ? formatSlotDate(slot) : date}</option>`;
      }).join("");
      dateSelect.disabled = false;
      populateTimeSelect(timeSelect, slots, dateSelect.value);
      setAvailabilityStatus("Times shown in your local timezone. Selected slots are reserved only after confirmation.");

      dateSelect.addEventListener("change", () => populateTimeSelect(timeSelect, slots, dateSelect.value));
    })
    .catch((error) => {
      dateSelect.innerHTML = '<option value="">Availability unavailable</option>';
      timeSelect.innerHTML = '<option value="">Availability unavailable</option>';
      setAvailabilityStatus(error instanceof Error ? error.message : "Availability could not be loaded.", true);
    });
});

const setFormStatus = (form, message, type = "neutral") => {
  const status = form.querySelector("[data-form-status]");
  if (!status) return;
  status.textContent = message;
  status.className = `form-status ${type}`;
};

const handleConsultationSubmit = async (form, event) => {
  event.preventDefault();

  const button = form.querySelector("button[type='submit']");
  const originalLabel = button?.dataset.label || button?.textContent || "Request Consultation";
  if (button) button.dataset.label = originalLabel;

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  payload.startedAt = payload.startedAt || String(Date.now());

  const requiredFields = [
    ["fullName", "Please enter your full name."],
    ["email", "Please enter your email address."],
    ["serviceInterest", "Please select a service interest."],
    ["selectedDate", "Please select a consultation date."],
    ["selectedTime", "Please select a consultation time."],
    ["message", "Please describe your objective or project details."]
  ];

  for (const [field, message] of requiredFields) {
    if (!String(payload[field] || "").trim()) {
      setFormStatus(form, message, "error");
      form.querySelector(`[name="${field}"]`)?.focus();
      return;
    }
  }

  if (!emailPattern.test(String(payload.email || "").trim())) {
    setFormStatus(form, "Please enter a valid email address.", "error");
    form.querySelector("[name='email']")?.focus();
    return;
  }

  if (button) {
    button.textContent = "Sending Request";
    button.disabled = true;
  }
  setFormStatus(form, "Submitting your request securely...", "neutral");

  try {
    if (window.location.protocol === "file:") {
      throw new Error("Live submission requires the deployed website API. Please email onboarding@themstry.com directly or test this form on the live site.");
    }

    const response = await fetch(form.dataset.endpoint || "/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "We could not send your request right now. Please email onboarding@themstry.com directly.");
    }

    form.reset();
    const startedAt = form.querySelector("[name='startedAt']");
    const timezoneField = form.querySelector("[data-timezone-field]");
    if (startedAt) startedAt.value = String(Date.now());
    if (timezoneField) timezoneField.value = visitorTimezone;
    const booking = data.booking;
    if (booking?.zoom?.joinUrl) {
      setFormStatus(
        form,
        `Your consultation has been confirmed. Booking ID: ${booking.id}. Time: ${booking.selectedDate} at ${booking.selectedTime} (${booking.timezone}). Zoom link: ${booking.zoom.joinUrl}`,
        "success"
      );
    } else {
      setFormStatus(form, consultationSuccess, "success");
    }
  } catch (error) {
    setFormStatus(form, error instanceof Error ? error.message : "We could not process your request. Please try again.", "error");
  } finally {
    if (button) {
      button.textContent = originalLabel;
      button.disabled = false;
    }
  }
};

qsa("[data-consultation-form]").forEach((form) => {
  const startedAt = form.querySelector("[name='startedAt']");
  if (startedAt && !startedAt.value) startedAt.value = String(Date.now());
});

qsa("form").forEach((form) => {
  if (form.matches("[data-consultation-form]")) {
    form.addEventListener("submit", (event) => handleConsultationSubmit(form, event));
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    if (button) {
      button.textContent = "Request Received";
      button.disabled = true;
    }
  });
});
