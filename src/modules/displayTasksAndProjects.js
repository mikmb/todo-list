import { getToday, getTomorrow, isInCurrentWeek } from "./dateHandler";
import { addTasksEventListeners } from "./eventListeners";
import { setIcons, iconImageObjects } from "./iconImageHandler";
import {
  getTasksFromLocalStorage,
  removeAndReplaceTaskfromLocalStorage,
} from "./handleLocalStorage";

class TaskDueDateIsToday {
  constructor(dueDate) {
    this.dueDate = dueDate;
  }

  getTasks() {
    const storedTasks = getTasksFromLocalStorage();
    const tasksDueToday = [];
    storedTasks.forEach((task) => {
      if (task.taskDueDate === getToday()) {
        tasksDueToday.push(task);
      }
    });

    return tasksDueToday;
  }
}

class TaskDueDateIsTomorrow {
  constructor(dueDate) {
    this.dueDate = dueDate;
  }

  getTasks() {
    const storedTasks = getTasksFromLocalStorage();
    const tasksDueTomorrow = [];
    storedTasks.forEach((task) => {
      if (task.taskDueDate === getTomorrow()) {
        tasksDueTomorrow.push(task);
      }
    });

    return tasksDueTomorrow;
  }
}

class TaskDueDateIsThisWeek {
  constructor(dueDate) {
    this.dueDate = dueDate;
  }

  getTasks() {
    const storedTasks = getTasksFromLocalStorage();
    const tasksDueThisWeek = [];
    storedTasks.forEach((task) => {
      if (isInCurrentWeek(task.taskDueDate)) {
        tasksDueThisWeek.push(task);
      }
    });

    return tasksDueThisWeek;
  }
}

class AllTasks {
  constructor(criteria) {
    this.criteria = criteria;
  }

  getTasks() {
    const storedTasks = getTasksFromLocalStorage();

    return storedTasks;
  }
}

class CompletedTasks {
  constructor(completed) {
    this.completed = completed;
  }

  getTasks() {
    const storedTasks = getTasksFromLocalStorage();
    const completedTasks = [];
    storedTasks.forEach((task) => {
      if (task.taskCompleted) {
        completedTasks.push(task);
      }
    });

    return completedTasks;
  }
}

class TasksInProject {
  constructor(projectName) {
    this.projectName = projectName;
  }

  getTasks() {
    const storedTasks = getTasksFromLocalStorage();
    const tasksInSelectedProject = [];
    storedTasks.forEach((task) => {
      if (task.taskParentProject === this.projectName) {
        tasksInSelectedProject.push(task);
      }
    });

    console.log("tasksInSelectedProject: " + tasksInSelectedProject);
    return tasksInSelectedProject;
  }
}
const tasksCriteria = {
  DueDateIsToday: new TaskDueDateIsToday("Today"),
  DueDateIsTomorrow: new TaskDueDateIsTomorrow("Tomorrow"),
  DueDateIsThisWeek: new TaskDueDateIsThisWeek("This Week"),
  AllTasksThere: new AllTasks("All Tasks"),
  CompletedTasksThere: new CompletedTasks("Completed"),
};

export function getTasks(criteria) {
  console.log("getTasks, criteria: " + criteria);
  let tasksFound = [];
  let tasksCompletedCount = 0;
  let tasksPendingCount = 0;
  let completedTasksView = false;

  if (criteria === "Today") {
    tasksFound = tasksCriteria["DueDateIsToday"].getTasks();
  } else if (criteria === "Tomorrow") {
    tasksFound = tasksCriteria["DueDateIsTomorrow"].getTasks();
  } else if (criteria === "This Week") {
    tasksFound = tasksCriteria["DueDateIsThisWeek"].getTasks();
  } else if (criteria === "All Tasks") {
    tasksFound = tasksCriteria["AllTasksThere"].getTasks();
  } else if (criteria === "Completed") {
    completedTasksView = true;
    tasksFound = tasksCriteria["CompletedTasksThere"].getTasks();
  } else {
    const TasksInSelectedProject = new TasksInProject(criteria);
    tasksFound = TasksInSelectedProject.getTasks();
  }

  if (criteria !== "Completed") {
    tasksCompletedCount = tasksFound.filter(
      (task) => task.taskCompleted === true
    ).length;
    tasksPendingCount = tasksFound.filter(
      (task) => task.taskCompleted === false
    ).length;
  } else {
    tasksCompletedCount = tasksFound.length;
  }

  console.log("tasksFound in getTasks: " + JSON.stringify(tasksFound));
  displayTasksDetails(
    criteria,
    tasksFound,
    tasksPendingCount,
    tasksCompletedCount,
    completedTasksView
  );
  showTaskCount();
}
function displayTasksDetails(
  criteria,
  tasksFound,
  tasksPendingCount,
  tasksCompletedCount,
  completedTasksView
) {
  const completedPendingCountDiv = document.createElement("div");
  completedPendingCountDiv.classList.add("completed-pending-count-div");
  const taskDetailDisplay = document.querySelector(".tasks-display");
  taskDetailDisplay.innerHTML = "";
  const taskDetailFor = document.createElement("div");
  taskDetailFor.classList.add("task-detail-for");
  taskDetailFor.dataset.value = criteria;
  taskDetailFor.textContent = criteria;
  const pendingCountDiv = document.createElement("div");
  pendingCountDiv.classList.add("pending-count-div");
  const pendingTaskCountDisplay = document.createElement("div");
  pendingTaskCountDisplay.classList.add("pending-task-count-display");
  pendingTaskCountDisplay.textContent = tasksPendingCount;
  const pendingTaskText = document.createElement("div");
  pendingTaskText.classList.add("pending-task-text");
  pendingTaskText.textContent = "Pending";

  const completedCountDiv = document.createElement("div");
  completedCountDiv.classList.add("completed-count-div");
  const completedTaskCountDisplay = document.createElement("div");
  completedTaskCountDisplay.classList.add("completed-task-count-display");
  completedTaskCountDisplay.textContent = tasksCompletedCount;
  const completedTaskText = document.createElement("div");
  completedTaskText.classList.add("completed-task-text");
  completedTaskText.textContent = "Completed";

  const addTaskDiv = document.createElement("div");
  addTaskDiv.classList.add("add-task-div");
  addTaskDiv.textContent = "+ Add Task";

  pendingCountDiv.appendChild(pendingTaskCountDisplay);
  pendingCountDiv.appendChild(pendingTaskText);

  completedCountDiv.appendChild(completedTaskCountDisplay);
  completedCountDiv.appendChild(completedTaskText);

  if (completedTasksView) {
    completedPendingCountDiv.appendChild(completedCountDiv);
  } else {
    completedPendingCountDiv.appendChild(pendingCountDiv);
    completedPendingCountDiv.appendChild(completedCountDiv);
  }

  const tasksInfoDiv = document.createElement("div");
  tasksInfoDiv.classList.add("tasks-info-div");

  tasksFound.forEach((task, index) => {
    const taskInfo = document.createElement("div");
    taskInfo.classList.add("task-info");
    taskInfo.dataset.value = task.taskTitle;

    const checkboxId = `checkbox-${index}`;

    const taskCheckboxLabel = document.createElement("label");
    taskCheckboxLabel.textContent = task.taskTitle;
    taskCheckboxLabel.setAttribute("for", checkboxId);

    const taskDueDate = document.createElement("div");
    taskDueDate.classList.add("task-due-date");
    taskDueDate.textContent = task.taskDueDate;

    const taskEditIcon = document.createElement("img");
    taskEditIcon.classList.add("editIcon");
    taskEditIcon.src = "";
    taskEditIcon.alt = "Edit";

    const taskCheckboxInput = document.createElement("input");
    taskCheckboxInput.type = "checkbox";
    taskCheckboxInput.id = checkboxId;
    taskCheckboxInput.name = `task-checkbox-${index}`; // Allow multiple checkboxes
    taskCheckboxInput.value = task.taskTitle;

    if (task.taskCompleted) {
      taskCheckboxInput.checked = true;
      taskCheckboxLabel.classList.add("line-through");
      taskDueDate.classList.add("line-through");
    } else {
      taskCheckboxInput.checked = false;
      taskCheckboxLabel.classList.remove("line-through");
      taskDueDate.classList.remove("line-through");
    }

    taskCheckboxInput.addEventListener("click", function () {
      const storedTasks = getTasksFromLocalStorage();
      if (taskCheckboxInput.checked) {
        taskCheckboxLabel.classList.add("line-through");
        taskDueDate.classList.add("line-through");
        task.taskCompleted = true;
        const index = storedTasks.findIndex(
          (obj) => obj.taskTitle === task.taskTitle
        );
        removeAndReplaceTaskfromLocalStorage(index, task);
        let completed = 0;
        let pending = 0;
        tasksFound.forEach((taskFound) => {
          if (taskFound.taskCompleted) {
            completed++;
          } else if (!taskFound.taskCompleted) {
            pending++;
          }
        });
        pendingTaskCountDisplay.textContent = pending;
        completedTaskCountDisplay.textContent = completed;
        showTaskCount();
      } else {
        taskCheckboxLabel.classList.remove("line-through");
        taskDueDate.classList.remove("line-through");
        task.taskCompleted = false;
        const index = storedTasks.findIndex(
          (obj) => obj.taskTitle === task.taskTitle
        );
        removeAndReplaceTaskfromLocalStorage(index, task);

        let completed = 0;
        let pending = 0;
        tasksFound.forEach((taskFound) => {
          if (taskFound.taskCompleted) {
            completed++;
          } else if (!taskFound.taskCompleted) {
            pending++;
          }
        });
        pendingTaskCountDisplay.textContent = pending;
        completedTaskCountDisplay.textContent = completed;
        showTaskCount();
      }
    });

    taskCheckboxInput.classList.add("task-checkbox");

    taskInfo.appendChild(taskCheckboxInput);
    taskInfo.appendChild(taskCheckboxLabel);
    taskInfo.appendChild(taskEditIcon);
    taskInfo.appendChild(taskDueDate);
    tasksInfoDiv.appendChild(taskInfo);
  });
  taskDetailDisplay.appendChild(taskDetailFor);
  taskDetailDisplay.appendChild(completedPendingCountDiv);
  taskDetailDisplay.appendChild(tasksInfoDiv);
  taskDetailDisplay.appendChild(addTaskDiv);

  addTasksEventListeners();
  setIcons(iconImageObjects);
}

export function showTaskCount() {
  const navTasks = document.querySelectorAll(".nav-tasks");
  const navProjects = document.querySelectorAll(".nav-projects");

  let taskCount = 0;
  let tasksFound = [];
  let notCompletedTasks = [];

  navTasks.forEach((navTask) => {
    const name = navTask.querySelector(".name").dataset.value;
    const count = navTask.querySelector(".count");

    if (name === "Today") {
      tasksFound = tasksCriteria["DueDateIsToday"].getTasks();
    } else if (name === "Tomorrow") {
      tasksFound = tasksCriteria["DueDateIsTomorrow"].getTasks();
    } else if (name === "This Week") {
      tasksFound = tasksCriteria["DueDateIsThisWeek"].getTasks();
    } else if (name === "All Tasks") {
      tasksFound = tasksCriteria["AllTasksThere"].getTasks();
    } else if (name === "Completed") {
      tasksFound = tasksCriteria["CompletedTasksThere"].getTasks();
    }
    if (name !== "Completed") {
      notCompletedTasks = tasksFound.filter(
        (task) => task.taskCompleted === false
      );
      taskCount = notCompletedTasks.length;
    } else {
      taskCount = tasksFound.length;
    }

    count.dataset.value = taskCount;
    count.textContent = taskCount;
  });

  navProjects.forEach((navProject) => {
    const name = navProject.querySelector(".name").dataset.value;
    const count = navProject.querySelector(".count");
    const TasksInSelectedProject = new TasksInProject(name);
    tasksFound = TasksInSelectedProject.getTasks();
    notCompletedTasks = tasksFound.filter(
      (task) => task.taskCompleted === false
    );
    taskCount = notCompletedTasks.length;
    count.dataset.value = taskCount;
    count.textContent = taskCount;
  });
}
