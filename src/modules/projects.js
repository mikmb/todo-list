import { highlightSelectedNavTab, renderProjects } from "./domManipulation";
import { getTasks, showTaskCount } from "./displayTasksAndProjects";
import {
  getProjectsFromLocalStorage,
  getTasksFromLocalStorage,
  setProjectsInLocalStorage,
  removeProjectfromLocalStorage,
  removeTaskfromLocalStorage,
  removeAndReplaceProjectfromLocalStorage,
  updateTasksGivenStoredTasksInLocalStorage,
} from "./handleLocalStorage";

export const projects = ["Project 1", "Project 2", "Another Project"];

function checkIfProjectExists(projectTitle) {
  let projectExists = false;
  let projectExistsIndex = null;

  const storedProjects = getProjectsFromLocalStorage();
  storedProjects.forEach((project, index) => {
    if (project.toLowerCase().trim() === projectTitle.toLowerCase().trim()) {
      projectExists = true;
      projectExistsIndex = index;
    }
  });
  return { projectExists, projectExistsIndex };
}

function deleteTasksWithTheSameProjectTitle(projectTitle) {
  const indexesToRemove = [];

  const storedTasks = getTasksFromLocalStorage();
  storedTasks.forEach((task, index) => {
    if (task.taskParentProject.toLowerCase() === projectTitle.toLowerCase()) {
      indexesToRemove.push(index);
    }
  });

  for (let i = indexesToRemove.length - 1; i >= 0; i--) {
    removeTaskfromLocalStorage(indexesToRemove[i]);
  }
}
export function createProject(projectTitle) {
  if (!projectTitle) return;
  const { projectExists, projectExistsIndex } =
    checkIfProjectExists(projectTitle);

  if (projectExists) {
    alert(`Project ${projectTitle} already exists.`);
    return;
  } else {
    setProjectsInLocalStorage(projectTitle);

    renderProjects();
    showTaskCount();
  }
}

export function renameProject(oldProjectTitle, newProjectTitle) {
  let projectIndexToRemove;

  const storedProjects = getProjectsFromLocalStorage();
  storedProjects.forEach((project, index) => {
    if (project.toLowerCase() === newProjectTitle.toLowerCase()) {
      alert(`Project ${newProjectTitle} already exists`);
      return;
    }
    if (project === oldProjectTitle) {
      projectIndexToRemove = index;
    }
  });

  removeAndReplaceProjectfromLocalStorage(
    projectIndexToRemove,
    newProjectTitle
  );

  const storedTasks = getTasksFromLocalStorage();
  storedTasks.forEach((task) => {
    if (task.taskParentProject === oldProjectTitle) {
      task.taskParentProject = newProjectTitle;
    }
  });
  updateTasksGivenStoredTasksInLocalStorage(storedTasks);

  renderProjects();
  showTaskCount();
  getTasks(newProjectTitle);

  const navProjects = document.querySelectorAll(".nav-projects");
  navProjects.forEach((project) => {
    if (project.querySelector(".name").dataset.value === newProjectTitle) {
      highlightSelectedNavTab(project);
    }
  });
}

export function deleteProject(projectTitle) {
  const { projectExists, projectExistsIndex } =
    checkIfProjectExists(projectTitle);

  if (projectExists) {
    removeProjectfromLocalStorage(projectExistsIndex);

    deleteTasksWithTheSameProjectTitle(projectTitle);
  }

  renderProjects();
  showTaskCount();
  getTasks("Today");
}

export function getAllProjects() {
  return storedProjects;
}
