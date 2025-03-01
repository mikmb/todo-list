import { projects } from "./projects";
import { tasks } from "./tasks";

let storedProjects;
let storedTasks;

// Projects
export function updateProjectsInLocalStorage() {
  localStorage.setItem("storedProjects", JSON.stringify(storedProjects));
}
export function getProjectsFromLocalStorage() {
  storedProjects =
    JSON.parse(localStorage.getItem("storedProjects")) || projects;
  return storedProjects;
}

export function setProjectsInLocalStorage(project) {
  if (project) {
    storedProjects.push(project);
    updateProjectsInLocalStorage();
  }
}

export function removeProjectfromLocalStorage(index) {
  storedProjects.splice(index, 1);
  updateProjectsInLocalStorage();
}

export function removeAndReplaceProjectfromLocalStorage(index, projectTitle) {
  storedProjects.splice(index, 1, projectTitle);
  updateProjectsInLocalStorage();
}
// Tasks
export function updateTasksInLocalStorage() {
  localStorage.setItem("storedTasks", JSON.stringify(storedTasks));
}

export function updateTasksGivenStoredTasksInLocalStorage(storedTasks) {
  localStorage.setItem("storedTasks", JSON.stringify(storedTasks));
}
export function getTasksFromLocalStorage() {
  storedTasks = JSON.parse(localStorage.getItem("storedTasks")) || tasks;

  return storedTasks;
}

export function setTasksInLocalStorage(task) {
  if (task) {
    storedTasks.push(task);
    updateTasksInLocalStorage();
  }
}

export function removeTaskfromLocalStorage(index) {
  storedTasks.splice(index, 1);
  updateTasksInLocalStorage();
}

export function removeAndReplaceTaskfromLocalStorage(index, task) {
  storedTasks.splice(index, 1, task);
  updateTasksInLocalStorage();

  console.log("task: " + JSON.stringify(task));
}
