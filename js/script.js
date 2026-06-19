/* ============================================================
   Life Dashboard — script.js
   Implements: Req 1–13 (greeting, timer, tasks, links, dark mode)
   ============================================================ */

/* ------------------------------------------------------------
   HELPER UTILITIES
   ------------------------------------------------------------ */

function pad(n) {
  return String(n).padStart(2, "0");
}

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

function clearError(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = "";
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

function safeGetStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}


/* ------------------------------------------------------------
   REQ 1 & 2 — CLOCK, DATE, GREETING
   ------------------------------------------------------------ */

let lastGreetingPeriod = null;

function getGreetingPrefix(hour) {
  if (hour >= 5 && hour <= 11) return "Good Morning";
  if (hour >= 12 && hour <= 17) return "Good Afternoon";
  if (hour >= 18 && hour <= 20) return "Good Evening";
  return "Good Night"; // 21–23, 00–04
}

function updateClock() {
  const now = new Date();

  // Clock — HH:MM:SS (Req 1.2)
  try {
    const h = pad(now.getHours());
    const m = pad(now.getMinutes());
    const s = pad(now.getSeconds());
    document.getElementById("clock").textContent = `${h}:${m}:${s}`;
  } catch (e) {
    document.getElementById("clock").textContent = "--:--:--"; // Req 1.5
  }

  // Date — "Weekday, DD Month YYYY" (Req 1.3)
  try {
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["January","February","March","April","May","June",
                    "July","August","September","October","November","December"];
    const weekday = days[now.getDay()];
    const dd = pad(now.getDate());
    const month = months[now.getMonth()];
    const yyyy = now.getFullYear();
    document.getElementById("date").textContent = `${weekday}, ${dd} ${month} ${yyyy}`;
  } catch (e) {
    document.getElementById("date").textContent = "Date unavailable"; // Req 1.6
  }

  // Greeting prefix — update if period changed (Req 2.5)
  const hour = now.getHours();
  const prefix = getGreetingPrefix(hour);
  if (prefix !== lastGreetingPeriod) {
    lastGreetingPeriod = prefix;
    updateGreeting();
  }
}

// Req 3.4 — load username on startup
function updateGreeting() {
  const prefix = lastGreetingPeriod || getGreetingPrefix(new Date().getHours());
  const name = safeGetStorage("username") || "";
  const greetingEl = document.getElementById("greeting");
  if (name) {
    greetingEl.textContent = `${prefix}, ${name}!`;
  } else {
    greetingEl.textContent = `${prefix}!`;
  }
}

// Start ticker (Req 1.1)
lastGreetingPeriod = getGreetingPrefix(new Date().getHours());
updateGreeting();
updateClock();
setInterval(updateClock, 1000);


/* ------------------------------------------------------------
   REQ 3 — CUSTOM USERNAME
   ------------------------------------------------------------ */

// Pre-fill input with saved username
(function loadUsernameInput() {
  const saved = safeGetStorage("username") || "";
  const input = document.getElementById("usernameInput");
  if (input) input.value = saved;
})();

// Submit on Enter key (Req 3.2)
document.getElementById("usernameInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") saveUsername();
});

function saveUsername() {
  const input = document.getElementById("usernameInput");
  const raw = input.value;
  const trimmed = raw.trim(); // Req 3.2

  // Req 3.6 — max 50 chars
  if (trimmed.length > 50) {
    showError("usernameError", "Username must be 50 characters or fewer.");
    return;
  }

  clearError("usernameError");

  if (trimmed === "") {
    // Req 3.5 — show greeting without name, do NOT update storage
    updateGreeting();
    return;
  }

  // Req 3.3 — persist and update greeting
  safeSetStorage("username", trimmed);
  updateGreeting();
}


/* ------------------------------------------------------------
   REQ 4 — POMODORO FOCUS TIMER
   ------------------------------------------------------------ */

let timeRemaining = 1500;
let timerInterval = null;
let timerState = "idle"; // idle | running | paused | done

// Audio context for alert (Req 4.8)
function playAlert() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  } catch (e) {
    // Web Audio not available — silent fallback
  }
}

function setTimerDisplay(seconds) {
  const min = pad(Math.floor(seconds / 60));
  const sec = pad(seconds % 60);
  document.getElementById("timerDisplay").textContent = `${min}:${sec}`;
}

function setTimerButtonStates(state) {
  const startBtn = document.getElementById("startBtn");
  const stopBtn  = document.getElementById("stopBtn");
  const resetBtn = document.getElementById("resetBtn");

  if (state === "idle") {
    // Req 4.1: Start enabled, Stop+Reset disabled
    startBtn.disabled = false;
    stopBtn.disabled  = true;
    resetBtn.disabled = true;
  } else if (state === "running") {
    // Req 4.4: Start disabled, Stop+Reset enabled
    startBtn.disabled = true;
    stopBtn.disabled  = false;
    resetBtn.disabled = false;
  } else if (state === "paused") {
    // Req 4.5: Start+Reset enabled, Stop disabled
    startBtn.disabled = false;
    stopBtn.disabled  = true;
    resetBtn.disabled = false;
  } else if (state === "done") {
    // Req 4.9: only Reset enabled
    startBtn.disabled = true;
    stopBtn.disabled  = true;
    resetBtn.disabled = false;
  }
}

function startTimer() {
  // Req 4.2 — ignore if already running
  if (timerState === "running" || timerState === "done") return;

  timerState = "running";
  setTimerButtonStates("running");
  clearError("timerNotification");

  timerInterval = setInterval(() => {
    if (timeRemaining <= 0) {
      // Req 4.8 — session complete
      clearInterval(timerInterval);
      timerState = "done";
      setTimerDisplay(0);
      setTimerButtonStates("done");
      document.getElementById("timerNotification").textContent = "Session complete!";
      playAlert();
      return;
    }
    timeRemaining--;
    setTimerDisplay(timeRemaining);
  }, 1000);
}

function stopTimer() {
  // Req 4.5 — pause
  if (timerState !== "running") return;
  clearInterval(timerInterval);
  timerState = "paused";
  setTimerButtonStates("paused");
}

function resetTimer() {
  // Req 4.7 — stop, reset to 1500, clear notification
  clearInterval(timerInterval);
  timerState = "idle";
  timeRemaining = 1500;
  setTimerDisplay(1500);
  setTimerButtonStates("idle");
  document.getElementById("timerNotification").textContent = "";
}

// Initialize button states on load (Req 4.1)
setTimerButtonStates("idle");


/* ------------------------------------------------------------
   REQ 5, 6, 7, 8, 9 — TO DO LIST
   ------------------------------------------------------------ */

let tasks = [];
let editingIndex = null;

// Req 9.1-9.3 — load from storage
(function loadTasks() {
  try {
    const raw = safeGetStorage("tasks");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      tasks = parsed;
    }
  } catch (e) {
    tasks = [];
  }
})();

function saveTasks() {
  const ok = safeSetStorage("tasks", JSON.stringify(tasks));
  if (!ok) showError("taskError", "Changes could not be saved.");
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    if (editingIndex === index) {
      // Req 6.3 — edit mode: show input pre-filled
      li.innerHTML = `
        <input
          id="editInput_${index}"
          class="edit-input"
          type="text"
          value="${escapeHtml(task.text)}"
          maxlength="200"
          aria-label="Edit task">
        <button onclick="saveEdit(${index})">Save</button>
        <button onclick="cancelEdit()">Cancel</button>
      `;
      // Req 6.3 — auto-focus
      setTimeout(() => {
        const inp = document.getElementById(`editInput_${index}`);
        if (inp) inp.focus();
      }, 0);

      // Enter/Escape keys (Req 6.4, 6.8)
      li.querySelector(`#editInput_${index}`).addEventListener("keydown", function (e) {
        if (e.key === "Enter") saveEdit(index);
        if (e.key === "Escape") cancelEdit();
      });
    } else {
      // Normal display
      const titleSpan = document.createElement("span");
      titleSpan.className = "task-title" + (task.done ? " task-done" : "");
      titleSpan.textContent = task.text;

      li.innerHTML = `
        <input
          type="checkbox"
          aria-label="Mark complete"
          ${task.done ? "checked" : ""}>
        <span class="task-title${task.done ? " task-done" : ""}">${escapeHtml(task.text)}</span>
        <button class="btn-edit" onclick="startEdit(${index})" aria-label="Edit task">Edit</button>
        <button class="btn-delete" onclick="deleteTask(${index})" aria-label="Delete task">Delete</button>
      `;

      li.querySelector("input[type=checkbox]").addEventListener("change", () => doneTask(index));
    }

    list.appendChild(li);
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Req 5.2 — Enter key to add task
document.getElementById("taskInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const input = document.getElementById("taskInput");
  const trimmed = input.value.trim(); // Req 5.2

  // Req 5.4 — empty validation
  if (trimmed === "") {
    showError("taskError", "Task title cannot be empty.");
    return;
  }

  // Req 5.5 — duplicate check (case-insensitive)
  const duplicate = tasks.find(t => t.text.toLowerCase() === trimmed.toLowerCase());
  if (duplicate) {
    showError("taskError", "A task with this title already exists.");
    return;
  }

  clearError("taskError");

  // Req 5.3 — add to bottom with done:false
  tasks.push({ text: trimmed, done: false });
  input.value = "";
  saveTasks();
}

function deleteTask(i) {
  // Req 8.2
  tasks.splice(i, 1);
  if (editingIndex === i) editingIndex = null;
  saveTasks();
}

function doneTask(i) {
  // Req 7.2-7.4
  tasks[i].done = !tasks[i].done;
  saveTasks();
}

// Req 6.1 — edit control
function startEdit(i) {
  // Req 6.2 — only one edit at a time (cancel previous)
  editingIndex = i;
  clearError("taskError");
  renderTasks();
}

function saveEdit(i) {
  const inp = document.getElementById(`editInput_${i}`);
  if (!inp) return;
  const trimmed = inp.value.trim(); // Req 6.4

  // Req 6.6 — empty check
  if (trimmed === "") {
    showError("taskError", "Task title cannot be empty.");
    return;
  }

  // Req 6.7 — duplicate check excluding current task
  const duplicate = tasks.find((t, idx) =>
    idx !== i && t.text.toLowerCase() === trimmed.toLowerCase()
  );
  if (duplicate) {
    showError("taskError", "A task with this title already exists.");
    return;
  }

  // Req 6.5 — update and exit edit mode
  tasks[i].text = trimmed;
  editingIndex = null;
  clearError("taskError");
  saveTasks();
}

function cancelEdit() {
  // Req 6.8
  editingIndex = null;
  clearError("taskError");
  renderTasks();
}

renderTasks();


/* ------------------------------------------------------------
   REQ 10 — QUICK LINKS
   ------------------------------------------------------------ */

let links = [];

// Req 10.8-10.10 — load from storage
(function loadLinks() {
  try {
    const raw = safeGetStorage("links");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      links = parsed;
    }
  } catch (e) {
    links = [];
  }
})();

function saveLinks() {
  const ok = safeSetStorage("links", JSON.stringify(links));
  if (!ok) showError("linkError", "Changes could not be saved.");
  renderLinks();
}

function renderLinks() {
  const container = document.getElementById("linkList");
  container.innerHTML = "";

  links.forEach((link, index) => {
    const pill = document.createElement("span");
    pill.className = "link-pill";
    pill.innerHTML = `
      <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
        ${escapeHtml(link.label)}
      </a>
      <button class="link-pill-delete" onclick="deleteLink(${index})" aria-label="Delete link">×</button>
    `;
    container.appendChild(pill);
  });
}

// Enter key to add link
document.getElementById("linkUrl").addEventListener("keydown", function (e) {
  if (e.key === "Enter") addLink();
});

function addLink() {
  const labelInput = document.getElementById("linkLabel");
  const urlInput   = document.getElementById("linkUrl");
  const label = labelInput.value.trim();
  const url   = urlInput.value.trim();

  // Req 10.3 — empty label
  if (label === "") {
    showError("linkError", "Link label cannot be empty.");
    return;
  }

  // Req 10.4 — empty URL
  if (url === "") {
    showError("linkError", "URL cannot be empty.");
    return;
  }

  // Req 10.5 — URL must start with http:// or https://
  if (!/^https?:\/\/\S+/.test(url)) {
    showError("linkError", "URL must begin with http:// or https://.");
    return;
  }

  clearError("linkError");

  // Req 10.2 — add link
  links.push({ label, url });
  labelInput.value = "";
  urlInput.value   = "";
  saveLinks();
}

function deleteLink(i) {
  // Req 10.7
  links.splice(i, 1);
  saveLinks();
}

renderLinks();


/* ------------------------------------------------------------
   REQ 11 — DARK MODE
   ------------------------------------------------------------ */

// Sync button label on load
(function initDarkModeButton() {
  const isDark = safeGetStorage("darkMode") === "true";
  updateDarkModeButton(isDark);
  // Apply class to body (documentElement already handled by inline script)
  if (isDark) {
    document.body.classList.add("dark");
  }
})();

function updateDarkModeButton(isDark) {
  const btn = document.getElementById("darkModeBtn");
  if (btn) {
    btn.textContent = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
  }
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark");
  // Keep html element in sync
  document.documentElement.classList.toggle("dark", isDark);
  safeSetStorage("darkMode", String(isDark));
  updateDarkModeButton(isDark);
}
