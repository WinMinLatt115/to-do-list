const taskInput = document.getElementById("task-input");
const taskDateInput = document.getElementById("task-date");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

function addTaskToDOM(taskText, dueDate, completed) {
  const li = document.createElement("li");

  const heart = document.createElement("span");
  heart.textContent = "💖";
  heart.style.marginRight = "10px";
  li.appendChild(heart);

  const taskSpan = document.createElement("span");
  taskSpan.textContent = taskText;
  li.appendChild(taskSpan);

  if (completed) li.classList.add("completed");

  // Add due date
  if (dueDate) {
    const dueSpan = document.createElement("span");
    dueSpan.textContent = dueDate;
    dueSpan.classList.add("due-date");

    const today = new Date().toISOString().split("T")[0];
    if (dueDate === today) {
      li.classList.add("today");
      popupTask(taskText);
    } else if (dueDate < today) {
      li.classList.add("overdue");
    }

    li.appendChild(dueSpan);
  }

  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    animateHeart(li);
    updateLocalStorage();
  });

  const delBtn = document.createElement("button");
  delBtn.textContent = "×";
  delBtn.classList.add("delete-btn");
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    updateLocalStorage();
  });

  li.appendChild(delBtn);
  taskList.appendChild(li);
}

function animateHeart(li) {
  // Heart animation
  const heart = document.createElement('span');
  heart.textContent = '💖';
  heart.style.position = 'absolute';
  heart.style.left = '50%';
  heart.style.top = '0';
  heart.style.transform = 'translateX(-50%)';
  heart.style.fontSize = '1.5em';
  heart.style.opacity = '1';
  li.appendChild(heart);

  let top = 0;
  const interval = setInterval(() => {
    top -= 2;
    heart.style.top = top + 'px';
    heart.style.opacity -= 0.05;
    if (top < -20) {
      clearInterval(interval);
      heart.remove();
    }
  }, 20);

  // Add sparkles
  for (let i = 0; i < 5; i++) {
    const sparkle = document.createElement('span');
    sparkle.textContent = '✨';
    sparkle.classList.add('sparkle');
    sparkle.style.left = `${Math.random() * 80 + 10}%`;
    sparkle.style.top = `${Math.random() * 20}px`;
    li.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
  }

  // Play sound
  playSound();
}

function popupTask(taskText) {
  const popup = document.createElement("div");
  popup.textContent = `💖 "${taskText}" is due today! 💖`;
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.backgroundColor = "#ffe6f0";
  popup.style.padding = "10px 20px";
  popup.style.borderRadius = "20px";
  popup.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
  popup.style.zIndex = "9999";
  popup.style.animation = "fadeUp 3s forwards";
  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 3000);
}

function updateLocalStorage() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach((li) => {
    const taskText = li.querySelector("span:nth-child(2)").textContent;
    const dueSpan = li.querySelector(".due-date");
    const dueDate = dueSpan ? dueSpan.textContent : "";
    tasks.push({
      text: taskText,
      completed: li.classList.contains("completed"),
      dueDate,
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.innerHTML = "";
  tasks.forEach((task) =>
    addTaskToDOM(task.text, task.dueDate, task.completed)
  );
}

addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const dueDate = taskDateInput.value;
  if (!taskText) return;
  addTaskToDOM(taskText, dueDate, false);
  updateLocalStorage();
  taskInput.value = "";
  taskDateInput.value = "";
});

loadTasks();

function playSound() {
  const sound = document.getElementById('complete-sound');
  sound.currentTime = 0; // restart
  sound.play();
}
