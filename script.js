// ====== SELECT DOM ELEMENTS ======
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");

// ====== AUDIO: DONE SOUND (Audio API) ======
const dingSound = new Audio("ding.mp3");
dingSound.volume = 0.7; // a little softer


// ====== LOCALSTORAGE HELPERS ======
const STORAGE_KEY = "cuteTodoList";

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}


// ====== CREATE ONE TODO ELEMENT ======
function createTodoElement(task) {
  const li = document.createElement("li");
  li.classList.add("todo-item");
  if (task.done) li.classList.add("done");
  li.dataset.id = String(task.id);

  const span = document.createElement("span");
  span.classList.add("todo-text");
  span.textContent = task.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "✕";

  // --- toggle done when clicking on item (not on delete button) ---
  li.addEventListener("click", (event) => {
    if (event.target === deleteBtn) return; // ignore delete click

    li.classList.toggle("done");

    // update in localStorage
    const tasks = loadTasks();
    const idx = tasks.findIndex((t) => String(t.id) === li.dataset.id);
    if (idx !== -1) {
      tasks[idx].done = li.classList.contains("done");
      saveTasks(tasks);
    }

    // play sound only when marking as done
    if (li.classList.contains("done")) {
      dingSound.currentTime = 0; // rewind to start
      dingSound.play();
    }
  });

  // --- delete button ---
  deleteBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // stop li click

    // remove from DOM
    li.remove();

    // remove from localStorage
    const tasks = loadTasks().filter(
      (t) => String(t.id) !== li.dataset.id
    );
    saveTasks(tasks);
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);
  return li;
}


// ====== ADD A NEW TASK ======
function addTask() {
  const text = input.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(), // simple unique id
    text,
    done: false,
  };

  // add to DOM
  const li = createTodoElement(newTask);
  list.appendChild(li);

  // add to storage
  const tasks = loadTasks();
  tasks.push(newTask);
  saveTasks(tasks);

  input.value = "";
  input.focus();
}


// ====== EVENT LISTENERS ======
addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});


// ====== INITIAL LOAD (ON PAGE OPEN) ======
window.addEventListener("DOMContentLoaded", () => {
  const tasks = loadTasks();
  tasks.forEach((task) => {
    const li = createTodoElement(task);
    list.appendChild(li);
  });
});
