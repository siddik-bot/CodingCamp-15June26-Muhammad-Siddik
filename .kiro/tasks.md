# Development Tasks

## ✅ Completed

### Core Structure
- [x] Create HTML structure
- [x] Create CSS design
- [x] Create JavaScript logic

### Req 1–2: Greeting & Clock
- [x] Live clock in HH:MM:SS format with zero-padding
- [x] Date in "Weekday, DD Month YYYY" format
- [x] Fallback "--:--:--" if time unavailable
- [x] Fallback "Date unavailable" if date unavailable
- [x] All 4 greeting periods (Morning, Afternoon, Evening, Night)
- [x] Greeting prefix updates automatically when time period changes

### Req 3: Custom Username
- [x] Username input field (max 50 chars) with Save button
- [x] Save on Enter key or button click
- [x] Load saved username from Local Storage on page load
- [x] Show greeting without name if input is empty
- [x] Validation message if username exceeds 50 characters

### Req 4: Pomodoro Timer
- [x] 25-minute countdown with MM:SS zero-padded display
- [x] Start, Stop, Reset with correct button state management
- [x] Resume from paused state
- [x] Audible alert (Web Audio API) on countdown end
- [x] "Session complete!" notification until Reset is pressed
- [x] Only Reset enabled when session is done

### Req 5: Add Task
- [x] Task input (max 200 chars) with Add button
- [x] Enter key support for submitting
- [x] Inline validation: "Task title cannot be empty."
- [x] Inline validation: "A task with this title already exists."
- [x] Local Storage save failure handling

### Req 6: Edit Task
- [x] Edit button per task
- [x] Only one task in edit mode at a time
- [x] Pre-filled editable input with focus
- [x] Save on Enter key or Save button
- [x] Cancel on Escape key or Cancel button
- [x] Validation: empty or duplicate title blocked with inline message

### Req 7: Mark Task Complete
- [x] Checkbox per task reflects completion status
- [x] Strikethrough style applied on completion
- [x] Strikethrough removed on uncheck

### Req 8: Delete Task
- [x] Delete button per task
- [x] Task removed immediately from list and Local Storage

### Req 9: Persist Tasks
- [x] Load tasks from Local Storage on page load
- [x] Save after every add, edit, complete, or delete
- [x] Graceful handling if storage key absent or invalid

### Req 10: Quick Links
- [x] Label input (max 50 chars) and URL input (max 2048 chars)
- [x] URL validation: must start with http:// or https://
- [x] Inline validation for empty label, empty URL, invalid URL
- [x] Delete button per link
- [x] Links open in new tab with rel="noopener noreferrer"
- [x] Load and save links via Local Storage key "links"

### Req 11: Dark Mode
- [x] Toggle button with dynamic label (Switch to Dark / Light Mode)
- [x] Dark mode preference saved to Local Storage
- [x] Dark mode applied before paint to prevent flash

### Req 12: Responsive Layout
- [x] Single-column layout below 768px
- [x] Two-column grid at 768px–1279px
- [x] Three-column layout at 1280px and above
- [x] Implemented with CSS media queries only

### Req 13: Data Persistence Integrity
- [x] All Local Storage keys loaded before content painted
- [x] Consistent key names: "tasks", "links", "username", "darkMode"
- [x] Graceful fallback for absent or invalid stored values

## 🧪 Testing

- [x] Browser test
- [x] Responsive test

## 🚀 Deployment

- [x] GitHub Pages deployment
