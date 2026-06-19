# 🚀 Life Dashboard

A single-page productivity dashboard built with HTML, CSS, and Vanilla JavaScript.
All data is saved locally in the browser — no backend required.

Built for Coding Camp project assignment.

## 🌐 Live Demo

https://siddik-bot.github.io/CodingCamp-15June26-Muhammad-Siddik

---

## 📌 Features

### 👋 Greeting & Clock

- Live clock updated every second in **HH:MM:SS** format
- Current date displayed as **Weekday, DD Month YYYY** (e.g. Monday, 16 June 2025)
- Dynamic greeting based on time of day:
  - 05:00–11:59 → Good Morning
  - 12:00–17:59 → Good Afternoon
  - 18:00–20:59 → Good Evening
  - 21:00–04:59 → Good Night
- Custom username input (max 50 characters), persisted to Local Storage
- Greeting format: **"Good Morning, Siddik!"**

### ⏱ Focus Timer (Pomodoro)

- 25-minute (1500 seconds) countdown timer
- Start, Stop, and Reset controls with proper button state management
- Timer displays in **MM:SS** format (e.g. "04:05")
- Audible alert and visible "Session complete!" notification when countdown reaches 00:00
- Resume from paused state supported

### 📝 To Do List

- Add tasks (max 200 characters per title)
- Edit existing task titles
- Mark tasks as completed (with strikethrough style)
- Delete tasks
- Duplicate task prevention (case-insensitive)
- Inline validation messages for empty or duplicate inputs
- All tasks persisted via Local Storage (`"tasks"` key)

### 🔗 Quick Links

- Add custom links with a label (max 50 chars) and URL (max 2048 chars)
- URL validation: must begin with `http://` or `https://`
- Links open in a new tab (`target="_blank" rel="noopener noreferrer"`)
- Delete individual links
- Links persisted via Local Storage (`"links"` key)

### 🌙 Dark Mode

- Toggle between Light Mode and Dark Mode
- Button label updates to reflect active theme
- Dark mode preference persisted via Local Storage (`"darkMode"` key)
- Theme applied before page paint to prevent flash of wrong theme

### 📱 Responsive Layout

- Fully usable on viewport widths from **320px to 2560px**
- Single-column layout below 768px
- Two-column grid between 768px–1279px
- Three or more columns at 1280px and above
- Implemented with CSS media queries only (no JavaScript)

---

## 🛠 Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Local Storage API

## 📂 Project Structure

```
CodingCamp-15June26-Muhammad-Siddik/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## 🚀 How to Run

1. Clone or download this repository
2. Open `index.html` in your browser
3. Or visit the live demo link above
