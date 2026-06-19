# Requirements Document

## Introduction

The To-Do List Life Dashboard is a single-page, client-side web application built with HTML, CSS, and Vanilla JavaScript. It provides users with a personal productivity hub that includes a greeting section, a Pomodoro focus timer, a to-do list manager, and a quick links panel. All user data is persisted locally using the browser's Local Storage API. No backend server is required.

---

## Glossary

- **Dashboard**: The single-page web application described in this document.
- **Greeting_Widget**: The UI section that displays the current time, date, and a personalized greeting message.
- **Timer**: The Pomodoro-style countdown timer component initialized to 25 minutes (1500 seconds).
- **Task_Manager**: The UI section that allows users to add, edit, mark, and delete tasks.
- **Task**: A single to-do item containing a title (string, max 200 characters) and a completion status (boolean).
- **Quick_Links**: The UI section that stores and displays user-defined hyperlinks to external websites.
- **Link**: A single saved bookmark containing a label (string, max 50 characters) and a URL (string, max 2048 characters).
- **Local_Storage**: The browser's `localStorage` API used for client-side data persistence.
- **Dark_Mode**: An alternative color theme that uses dark backgrounds and light text, applied by adding the `.dark` CSS class to the `<body>` element.
- **Light_Mode**: The default color theme using light backgrounds and dark text, active when the `.dark` CSS class is absent from the `<body>` element.
- **Username**: A custom name entered by the user (max 50 characters), used in the personalized greeting.
- **Duplicate_Task**: A task whose title, after trimming leading and trailing whitespace and applying case-insensitive comparison, is identical to an existing task's title in the Task_Manager.
- **Ticker**: The recurring 1-second interval used to update the displayed clock time and greeting.
- **Edit_Mode**: The state of a single Task in the Task_Manager where its title is displayed as an editable input field.

---

## Requirements

### Requirement 1: Display Current Time and Date

**User Story:** As a user, I want to see the current time and date when I open the Dashboard, so that I always have a quick time reference.

#### Acceptance Criteria

1. WHEN the Dashboard is loaded, THE Greeting_Widget SHALL start a Ticker that fires once per elapsed wall-clock second and updates the displayed clock time on each tick.
2. WHILE the Ticker is active, THE Greeting_Widget SHALL display the current local time in HH:MM:SS format, where HH is the zero-padded two-digit hour (00–23), MM is the zero-padded two-digit minute (00–59), and SS is the zero-padded two-digit second (00–59), derived from the browser's local timezone.
3. THE Greeting_Widget SHALL display the current local date in the fixed format "Weekday, DD Month YYYY" (e.g., "Monday, 16 June 2025"), where Weekday is the full English day name, DD is the zero-padded two-digit day, Month is the full English month name, and YYYY is the four-digit year.
4. WHEN the Dashboard page becomes visible after being hidden (e.g., switching back to the browser tab), THE Greeting_Widget SHALL immediately synchronize the displayed time to the current second on the next Ticker tick without requiring a page reload.
5. IF the browser cannot resolve the current local time, THEN THE Greeting_Widget SHALL display the static placeholder text "--:--:--" in place of the time value.
6. IF the browser cannot resolve the current local date, THEN THE Greeting_Widget SHALL display the static placeholder text "Date unavailable" in place of the date value.

---

### Requirement 2: Dynamic Greeting Based on Time of Day

**User Story:** As a user, I want to receive a greeting that reflects the time of day, so that the Dashboard feels personal and contextually relevant.

#### Acceptance Criteria

1. WHEN the local hour is between 05 and 11 inclusive (05:00–11:59) according to the user's device clock, THE Greeting_Widget SHALL display the greeting prefix "Good Morning".
2. WHEN the local hour is between 12 and 17 inclusive (12:00–17:59) according to the user's device clock, THE Greeting_Widget SHALL display the greeting prefix "Good Afternoon".
3. WHEN the local hour is between 18 and 20 inclusive (18:00–20:59) according to the user's device clock, THE Greeting_Widget SHALL display the greeting prefix "Good Evening".
4. WHEN the local hour is between 21 and 23 inclusive (21:00–23:59), or between 00 and 04 inclusive (00:00–04:59), according to the user's device clock, THE Greeting_Widget SHALL display the greeting prefix "Good Night".
5. WHEN the Ticker fires and the local hour has transitioned to a new time-of-day period since the last tick, THE Greeting_Widget SHALL update the displayed greeting prefix to match the new period without requiring a page reload.
6. THE Greeting_Widget SHALL cover all 24 hours of the day across exactly the four greeting periods defined in criteria 1–4, with no overlap and no gap.

---

### Requirement 3: Custom Username Greeting

**User Story:** As a user, I want to set a custom username so that the greeting addresses me by name.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL provide a text input field, accepting up to 50 characters, and a submit control for the user to enter and save a Username.
2. WHEN the user submits a Username via the submit control or by pressing the Enter key while the input field is focused, THE Greeting_Widget SHALL trim leading and trailing whitespace from the entered value before processing it.
3. WHEN the user explicitly submits a non-empty trimmed Username via the submit control or the Enter key, THE Greeting_Widget SHALL display the greeting in the format "[Greeting_Prefix], [Username]!" (e.g., "Good Morning, Siddik!") and persist the trimmed Username to Local_Storage, replacing any previously saved value; the greeting SHALL NOT update automatically as the user types into the input field.
4. WHEN the Dashboard is loaded and a non-empty Username string exists in Local_Storage under the key `"username"`, THE Greeting_Widget SHALL retrieve and display the saved Username in the greeting immediately as soon as the stored value is detected, without requiring re-entry.
5. IF the user submits an empty or whitespace-only Username, THEN THE Greeting_Widget SHALL display the greeting in the format "[Greeting_Prefix]!" without a name component, and SHALL NOT update Local_Storage.
6. IF the user attempts to submit a Username whose trimmed length exceeds 50 characters, THEN THE Greeting_Widget SHALL NOT update the greeting or Local_Storage, and SHALL display an inline validation message stating "Username must be 50 characters or fewer."

---

### Requirement 4: Pomodoro Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer so that I can focus on tasks using the Pomodoro technique.

#### Acceptance Criteria

1. THE Timer SHALL initialize on page load with a countdown duration of 1500 seconds, displaying "25:00" in MM:SS format, with the Start button enabled and the Stop and Reset buttons disabled.
2. WHEN the user activates the Start button while the Timer is in an idle or stopped state, THE Timer SHALL begin decrementing the remaining time by one second per elapsed wall-clock second; if the Timer is already counting down, THE Timer SHALL ignore the Start button activation.
3. WHILE the Timer is counting down, THE Timer SHALL update the displayed time on each one-second decrement in MM:SS format, where MM is the zero-padded two-digit minutes remaining and SS is the zero-padded two-digit seconds remaining (e.g., "04:05", not "4:5").
4. WHILE the Timer is counting down, THE Timer SHALL disable the Start button and enable the Stop and Reset buttons to prevent concurrent countdowns.
5. WHEN the user activates the Stop button while the Timer is counting down, THE Timer SHALL pause the countdown, retain the remaining time value, disable the Stop button, and enable the Start and Reset buttons.
6. WHEN the user activates the Start button while the Timer is in a paused state, THE Timer SHALL resume counting down from the retained remaining time.
7. WHEN the user activates the Reset button, THE Timer SHALL stop any active or paused countdown, reset the remaining time to 1500 seconds, display "25:00", and restore the initial button states: Start enabled, Stop disabled, Reset disabled.
8. WHEN the countdown reaches 0 seconds, THE Timer SHALL stop the countdown automatically, display "00:00", play an audible alert using the Web Audio API or an `<audio>` element, and display a visible completion notification (e.g., "Session complete!") that persists until the user activates the Reset button.
9. WHEN the Timer displays the completion notification, THE Timer SHALL disable the Start and Stop buttons and keep only the Reset button enabled.

---

### Requirement 5: Add a Task

**User Story:** As a user, I want to add tasks to my to-do list so that I can track what needs to be done.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide a text input field, accepting up to 200 characters, and a submit control for adding a new Task.
2. WHEN the user submits a new Task title via the submit control or by pressing the Enter key while the task input field is focused, THE Task_Manager SHALL trim leading and trailing whitespace from the title.
3. WHEN the trimmed title is non-empty and not a Duplicate_Task, THE Task_Manager SHALL add the Task to the bottom of the task list with a default completion status of false, clear the input field, and save the updated task list to Local_Storage.
4. IF the user submits an empty or whitespace-only Task title, THEN THE Task_Manager SHALL NOT add a Task and SHALL display the inline validation message "Task title cannot be empty."
5. IF the user submits a Task title that is a Duplicate_Task (case-insensitive comparison after whitespace trimming), THEN THE Task_Manager SHALL NOT add the Task and SHALL display the inline validation message "A task with this title already exists."
6. IF saving the task list to Local_Storage fails after adding a Task, THEN THE Task_Manager SHALL display an error message "Changes could not be saved." and retain the newly added Task in the displayed list for the current session.

---

### Requirement 6: Edit a Task

**User Story:** As a user, I want to edit an existing task title so that I can correct or update what needs to be done.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide an edit control for each Task in the list.
2. THE Task_Manager SHALL allow at most one Task to be in Edit_Mode at any time; activating edit on a second Task SHALL first cancel any currently active Edit_Mode without saving changes.
3. WHEN the user activates the edit control for a Task, THE Task_Manager SHALL replace the task title display with an editable input field pre-filled with the current title and accepting up to 200 characters, and set focus to that input field.
4. WHEN the user confirms the edit by pressing Enter or activating a Save control, THE Task_Manager SHALL trim whitespace from the new title and evaluate the trimmed value.
5. WHEN the trimmed edited title is non-empty and does not create a Duplicate_Task (excluding the task being edited from the duplicate check), THE Task_Manager SHALL update the Task title with the trimmed value, exit Edit_Mode, and save the updated task list to Local_Storage.
6. IF the user confirms an edit with an empty or whitespace-only title, THEN THE Task_Manager SHALL NOT save the change and SHALL display the inline validation message "Task title cannot be empty."
7. IF the user confirms an edit that would create a Duplicate_Task (case-insensitive, whitespace-trimmed, excluding the task being edited), THEN THE Task_Manager SHALL NOT save the change and SHALL display the inline validation message "A task with this title already exists."
8. WHEN the user cancels the edit by pressing Escape or activating a Cancel control, THE Task_Manager SHALL exit Edit_Mode, discard all changes, and restore the original task title display without modifying Local_Storage.

---

### Requirement 7: Mark a Task as Completed

**User Story:** As a user, I want to mark tasks as completed so that I can track my progress.

#### Acceptance Criteria

1. THE Task_Manager SHALL render a checkbox control for each Task, where the checkbox reflects the Task's current completion status (checked for complete, unchecked for incomplete).
2. WHEN the user activates the checkbox of an incomplete Task, THE Task_Manager SHALL immediately set the Task's completion status to true and apply a strikethrough text-decoration style to the task title text, then save the updated task list to Local_Storage.
3. WHEN the user activates the checkbox of a completed Task, THE Task_Manager SHALL immediately set the Task's completion status to false and remove the strikethrough text-decoration style from the task title text, then save the updated task list to Local_Storage.
4. THE Task_Manager SHALL save the updated task list to Local_Storage immediately after each individual completion status change, with no batching of multiple changes into a single write.
5. IF saving the updated task list to Local_Storage fails after a completion status change, THEN THE Task_Manager SHALL display the error message "Changes could not be saved." and retain the updated completion status in the displayed list for the current session.

---

### Requirement 8: Delete a Task

**User Story:** As a user, I want to delete tasks from the list so that I can remove items that are no longer relevant.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide exactly one delete control per Task displayed in the list, visually associated with its corresponding Task.
2. WHEN the user activates the delete control for a Task, THE Task_Manager SHALL immediately remove that Task from the displayed list, then attempt to save the updated task list to Local_Storage.
3. IF saving the updated task list to Local_Storage fails after a Task is deleted, THEN THE Task_Manager SHALL display the error message "Changes could not be saved." and retain the deletion in the displayed list for the current session; THE Task_Manager SHALL NOT warn the user that the deletion may reappear on the next page load.

---

### Requirement 9: Persist Tasks Using Local Storage

**User Story:** As a user, I want my tasks to be saved automatically so that they are available when I revisit the Dashboard.

#### Acceptance Criteria

1. WHEN the Dashboard is loaded, THE Task_Manager SHALL attempt to read the task list from Local_Storage using the key `"tasks"`.
2. IF the `"tasks"` key holds a valid JSON array, THEN THE Task_Manager SHALL render all stored tasks in the task list, preserving each task's title and completion status.
3. IF the `"tasks"` key is absent or holds a value that is not a valid JSON array, THEN THE Task_Manager SHALL render an empty task list without throwing an uncaught error.
4. THE Task_Manager SHALL save the complete task list to Local_Storage under the key `"tasks"` — including each task's title and completion status — after every add, edit, completion-status change, or delete operation.

---

### Requirement 10: Quick Links Management

**User Story:** As a user, I want to save and access my favorite websites from the Dashboard so that I can navigate to them quickly.

#### Acceptance Criteria

1. THE Quick_Links SHALL provide a text input field for a link label (max 50 characters), a text input field for a URL (max 2048 characters), and a submit control for saving a new Link.
2. WHEN the user submits a new Link with a non-empty label and a valid URL, THE Quick_Links SHALL add the Link to the panel as a clickable anchor element that opens the URL in a new browser tab using `target="_blank" rel="noopener noreferrer"`, and SHALL save the updated link list to Local_Storage.
3. IF the user submits a Link with an empty or whitespace-only label, THEN THE Quick_Links SHALL NOT save the Link and SHALL display the inline validation message "Link label cannot be empty."
4. IF the user submits a Link with an empty URL field, THEN THE Quick_Links SHALL NOT save the Link and SHALL display the inline validation message "URL cannot be empty."
5. IF the user submits a URL that does not begin with "http://" or "https://" followed by at least one non-whitespace character, THEN THE Quick_Links SHALL NOT save the Link and SHALL display the inline validation message "URL must begin with http:// or https://."
6. THE Quick_Links SHALL provide exactly one delete control per saved Link, visually associated with its corresponding Link.
7. WHEN the user activates the delete control for a Link, THE Quick_Links SHALL remove that Link from the panel and save the updated link list to Local_Storage.
8. WHEN the Dashboard is loaded, THE Quick_Links SHALL attempt to read the link list from Local_Storage using the key `"links"`.
9. IF the `"links"` key holds a valid JSON array, THEN THE Quick_Links SHALL render all stored links in the panel.
10. IF the `"links"` key is absent or holds a value that is not a valid JSON array, THEN THE Quick_Links SHALL render an empty panel without displaying an error.
11. IF saving the link list to Local_Storage fails after an add or delete operation, THEN THE Quick_Links SHALL display the error message "Changes could not be saved."

---

### Requirement 11: Dark Mode

**User Story:** As a user, I want to toggle between a light and dark color theme so that I can use the Dashboard comfortably in different lighting environments.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a toggle control that reflects the currently active theme at all times: displaying "Switch to Dark Mode" when Light_Mode is active, and "Switch to Light Mode" when Dark_Mode is active.
2. WHEN the user activates the Dark Mode toggle while Light_Mode is active, THE Dashboard SHALL add the `.dark` CSS class to the `<body>` element and save the preference value `true` to Local_Storage under the key `"darkMode"`.
3. WHEN the user activates the Dark Mode toggle while Dark_Mode is active, THE Dashboard SHALL remove the `.dark` CSS class from the `<body>` element and save the preference value `false` to Local_Storage under the key `"darkMode"`.
4. WHEN the Dashboard is loaded and the `"darkMode"` key in Local_Storage holds the value `true`, THE Dashboard SHALL add the `.dark` CSS class to the `<body>` element before any widget content is painted, to prevent a flash of incorrect theme.
5. WHEN the Dashboard is loaded and the `"darkMode"` key in Local_Storage holds the value `false` or is absent or unparseable, THE Dashboard SHALL apply Light_Mode (no `.dark` class on `<body>`).

---

### Requirement 12: Responsive Layout

**User Story:** As a user, I want the Dashboard to be usable on different screen sizes so that I can access it from both desktop and mobile devices.

#### Acceptance Criteria

1. THE Dashboard SHALL render all widgets in a readable, navigable layout on viewport widths from 320px to 2560px inclusive, with no horizontal scroll bar and no clipped content at any size within that range.
2. WHEN the viewport width is below 768px, THE Dashboard SHALL stack all widgets in a single-column layout where each widget spans the full available width.
3. WHEN the viewport width is between 768px and 1279px inclusive, THE Dashboard SHALL arrange widgets in a two-column grid layout.
4. WHEN the viewport width is 1280px or above, THE Dashboard SHALL arrange widgets in a layout with a minimum of three columns.
5. THE Dashboard SHALL use CSS media queries to implement the responsive layout transitions defined in criteria 2–4, with no JavaScript required for layout switching.

---

### Requirement 13: Data Persistence Integrity

**User Story:** As a user, I want my saved data to survive page reloads so that I never lose my tasks, links, or preferences.

#### Acceptance Criteria

1. WHEN the Dashboard is loaded, THE Dashboard SHALL read all persisted data from Local_Storage — specifically the keys `"tasks"`, `"links"`, `"username"`, and `"darkMode"` — before any widget content is painted to the screen; THE Dashboard SHALL wait for all Local_Storage read operations to complete and SHALL NOT time out or fall back to default content if the reads take time.
2. IF the `"tasks"` key in Local_Storage is absent or holds a value that is not a valid JSON array, THEN THE Dashboard SHALL initialize the tasks state with an empty array and SHALL NOT write a default value back to Local_Storage at load time.
3. IF the `"links"` key in Local_Storage is absent or holds a value that is not a valid JSON array, THEN THE Dashboard SHALL initialize the links state with an empty array and SHALL NOT write a default value back to Local_Storage at load time.
4. WHEN the Dashboard is loaded and the `"username"` key in Local_Storage holds a valid non-empty string, THE Dashboard SHALL use that stored value as the Username and display it in the greeting; IF the `"username"` key is absent, empty, or holds a non-string value, THEN THE Dashboard SHALL initialize the username state with an empty string and display the greeting without a name component.
5. IF the `"darkMode"` key in Local_Storage is absent or holds a value other than `true`, THEN THE Dashboard SHALL initialize the dark mode state as `false` and apply Light_Mode.
6. THE Dashboard SHALL use consistent, stable key names across all read and write operations: `"tasks"` for the task list, `"links"` for the link list, `"username"` for the saved Username, and `"darkMode"` for the dark mode preference.
