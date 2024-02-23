const form = document.querySelector("#form");
const tasksList = document.querySelector("#tasks-list");
const template = document.querySelector("#template").content;
const fragment = document.createDocumentFragment();
let input = document.querySelector("input");
let tasks = {};

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("myTasks")) {
    tasks = JSON.parse(localStorage.getItem("myTasks"));
  }
  drawTasks();
});

form.addEventListener("submit", (event) => {
  console.log(event.target.querySelector("input").value);
  let inputValue = event.target.querySelector("input").value;
  event.preventDefault(event);
  setTasks(inputValue);
});

tasksList.addEventListener("click", (event) => {
  btnAction(event);
});

const setTasks = (inputValue) => {
  if (inputValue.trim() === "") {
    console.log("empty");
    return;
  }
  const tarea = {
    id: Date.now(),
    title: inputValue,
    state: false,
  };

  tasks[tarea.id] = tarea;
  form.reset();
  input.focus();

  drawTasks();
};

const drawTasks = () => {
  localStorage.setItem("myTasks", JSON.stringify(tasks));
  if (Object.values(tasks).length === 0) {
    tasksList.innerHTML = `
    <div id="tasks-list" class="mt-2">
        <div class="alert alert-success text-center">No pending tasks</div>
    </div>`;
    return
  }
  tasksList.innerHTML = " ";
  Object.values(tasks).forEach((task) => {
    console.log(task);
    const clone = template.cloneNode(true);
    clone.querySelector("p").textContent = task.title;
    if (task.state) {
      clone
        .querySelector(".alert")
        .classList.replace("alert-warning", "alert-primary");
      clone
        .querySelectorAll(".fas")[0]
        .classList.replace("fa-check-circle", "fa-rotate-left");
      clone.querySelector("p").style.textDecoration = "line-through";
    }
    clone.querySelectorAll(".fas")[0].dataset.id = task.id;
    clone.querySelectorAll(".fas")[1].dataset.id = task.id;
    fragment.appendChild(clone);
  });
  tasksList.appendChild(fragment);
};

const btnAction = (event) => {
  console.log(event.target.classList.contains("fa-check-circle"));
  if (event.target.classList.contains("fa-check-circle")) {
    tasks[event.target.dataset.id].state = true;
    console.log(tasks);
    drawTasks();
  }
  if (event.target.classList.contains("fa-minus-circle")) {
    delete tasks[event.target.dataset.id];
    drawTasks();
  }
  if (event.target.classList.contains("fa-rotate-left")) {
    tasks[event.target.dataset.id].state = false;
    drawTasks();
  }
  event.stopPropagation();
};
