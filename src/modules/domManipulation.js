import { setIcons, iconImageObjects } from "./iconImageHandler";
import { sidebarEventListeners } from "./eventListeners";
import { getToday } from "./dateHandler";
import { getProjectsFromLocalStorage } from "./handleLocalStorage";

export function highlightSelectedNavTab(value) {
  const navTasks = document.querySelectorAll(".nav-tasks");
  const navProjects = document.querySelectorAll(".nav-projects");

  navTasks.forEach((navTask) => {
    if (navTask.classList.contains("selected")) {
      navTask.classList.remove("selected");
    }
  });

  navProjects.forEach((navProject) => {
    if (navProject.classList.contains("selected")) {
      navProject.classList.remove("selected");
    }
  });

  value.classList.add("selected");

  navProjects.forEach((navProject) => {
    if (navProject.classList.contains("selected")) {
      navProject.querySelector(".options").classList.remove("hidden");
      navProject.querySelector(".count").classList.add("hidden");
      return;
    }
    navProject.querySelector(".options").classList.add("hidden");
    navProject.querySelector(".option-group").classList.add("hidden");
    navProject.querySelector(".count").classList.remove("hidden");
  });
}

export function setDueDateValue(selectedDate) {
  const dueDateDefaultValue = document.querySelector(".due-date-default-value");
  dueDateDefaultValue.textContent = selectedDate;
}
function cloneNavTasks() {
  const tasksGroup = document.querySelector(".tasks-group");
  return tasksGroup.cloneNode(true); // Deep clone, including children
}

function clearNavTasks() {
  const tasksGroup = document.querySelector(".tasks-group");
  tasksGroup.innerHTML = "";
  tasksGroup.remove();
}

function insertNavTasks(clone) {
  const sidebarContainer = document.querySelector(".sidebar-container");
  const projectsGroup = document.querySelector(".projects-group");
  sidebarContainer.insertBefore(clone, projectsGroup);
}

function updateProjectOptionsInAddModal() {
  const taskProjectOption = document.querySelector(".task-project");
  taskProjectOption.innerHTML = "";

  const storedProjects = getProjectsFromLocalStorage();
  console.log("storedProject: " + storedProjects);
  storedProjects.forEach((project) => {
    const projectOption = document.createElement("option");
    projectOption.classList.add("project-option");
    projectOption.textContent = project;
    projectOption.dataset.value = project;

    taskProjectOption.appendChild(projectOption);
  });
}
export function renderProjects() {
  const projectGroup = document.querySelector(".projects-group");
  const addProjectPopup = document.querySelector(".add-project-popup-div");
  const navProjects = document.querySelectorAll(".nav-projects");

  navProjects.forEach((project) => project.remove());

  const storedProjects = getProjectsFromLocalStorage();
  storedProjects.forEach((project) => {
    const navProjects = document.createElement("div");
    navProjects.classList.add("nav-projects");

    const projectsIcon = document.createElement("img");
    projectsIcon.classList.add("projectsIcon");
    projectsIcon.src = "";
    projectsIcon.alt = "Project";

    const projectName = document.createElement("div");
    projectName.classList.add("name");
    projectName.textContent = project;
    projectName.dataset.value = project;

    const taskCount = document.createElement("div");
    taskCount.classList.add("count");
    taskCount.textContent = 0;

    const options = document.createElement("div");
    options.classList.add("options");
    options.classList.add("hidden");
    options.textContent = "...";

    const optionGroup = document.createElement("div");
    optionGroup.classList.add("option-group");
    optionGroup.classList.add("hidden");

    const rename = document.createElement("div");
    rename.classList.add("rename-project");
    rename.textContent = "Rename";
    const deleteProject = document.createElement("div");
    deleteProject.classList.add("delete-project");
    deleteProject.textContent = "Delete";

    optionGroup.appendChild(rename);
    optionGroup.appendChild(deleteProject);

    options.appendChild(optionGroup);

    navProjects.appendChild(projectsIcon);
    navProjects.appendChild(projectName);
    navProjects.appendChild(taskCount);
    navProjects.appendChild(options);

    projectGroup.insertBefore(navProjects, addProjectPopup);
  });

  updateProjectOptionsInAddModal();

  const navTasksClone = cloneNavTasks();
  clearNavTasks();
  insertNavTasks(navTasksClone);
  sidebarEventListeners();
  setIcons(iconImageObjects);
}

export function createRenameProjectModal(projectTitle) {
  const renameModal = document.createElement("div");
  renameModal.classList.add("rename-modal");

  const h2 = document.createElement("h2");
  h2.classList.add("h2");
  h2.textContent = "Rename Project";

  const input = document.createElement("input");
  input.classList.add("new-project-title");
  input.type = "text";
  input.value = projectTitle;

  const buttonGroup = document.createElement("div");
  buttonGroup.classList.add("rename-buttons");

  const cancel = document.createElement("div");
  cancel.classList.add("rename-project-cancel");
  cancel.textContent = "Cancel";

  const confirm = document.createElement("div");
  confirm.classList.add("rename-project-confirm");
  confirm.textContent = "Confirm";

  buttonGroup.appendChild(cancel);
  buttonGroup.appendChild(confirm);

  renameModal.appendChild(h2);
  renameModal.appendChild(input);
  renameModal.appendChild(buttonGroup);

  document.body.appendChild(renameModal);
}

export function createDeleteProjectModal(projectTitle) {
  const deleteModal = document.createElement("div");
  deleteModal.classList.add("delete-modal");

  const h2 = document.createElement("div");
  h2.classList.add("h2");
  h2.textContent = "Are you sure you want to delete the project?";

  const subtext = document.createElement("div");
  subtext.classList.add("delete-project-subtext");
  subtext.textContent = `All the tasks under ${projectTitle} will be deleted also`;
  const projectTitleStyled = subtext.textContent.replace(
    projectTitle,
    `<span class="delete-project-project-name">${projectTitle}</span>`
  );
  subtext.innerHTML = projectTitleStyled;

  const buttonGroup = document.createElement("div");
  buttonGroup.classList.add("delete-buttons");

  const cancel = document.createElement("div");
  cancel.classList.add("delete-project-cancel");
  cancel.textContent = "Cancel";

  const confirm = document.createElement("div");
  confirm.classList.add("delete-project-confirm");
  confirm.textContent = "Confirm";

  buttonGroup.appendChild(cancel);
  buttonGroup.appendChild(confirm);
  deleteModal.appendChild(h2);
  deleteModal.appendChild(subtext);
  deleteModal.appendChild(buttonGroup);
  document.body.appendChild(deleteModal);
}

export function createAddTaskModal() {
  const modalBackdrop = document.createElement("div");
  modalBackdrop.classList.add("modal-backdrop");
  modalBackdrop.classList.add("hidden");

  const addModalContainer = document.createElement("div");
  addModalContainer.classList.add("add-modal-container");
  addModalContainer.classList.add("hidden");

  const addModal = document.createElement("div");
  addModal.classList.add("add-modal");
  addModal.classList.add("hidden");

  const modalCloseButton = document.createElement("span");
  modalCloseButton.classList.add("add-modal-close-button");
  modalCloseButton.textContent = "X";

  const modalTitle = document.createElement("h2");
  modalTitle.classList.add("h2");
  modalTitle.textContent = "Add Task";

  const form = document.createElement("form");
  form.classList.add("form");
  form.setAttribute("action", "#");

  const group = document.createElement("div");
  group.classList.add("group");

  const taskTitle = document.createElement("textarea");
  taskTitle.classList.add("task-title");
  taskTitle.setAttribute("placeholder", "Title");
  taskTitle.required = true;

  const taskDescription = document.createElement("textarea");
  taskDescription.classList.add("task-description");
  taskDescription.setAttribute("placeholder", "Description");
  taskDescription.required = true;

  const taskConfigGroup = document.createElement("div");
  taskConfigGroup.classList.add("task-config-group");

  const taskPriorityGroup = document.createElement("div");
  taskPriorityGroup.classList.add("modal-group");

  const priorityIcon = document.createElement("img");
  priorityIcon.classList.add("priorityIcon");

  const priorityText = document.createElement("div");
  priorityText.classList.add("config-group-item");
  priorityText.textContent = "Priority";

  const taskPriority = document.createElement("select");
  taskPriority.classList.add("task-priority");
  taskPriority.required = true;

  const priorityOption1 = document.createElement("option");
  priorityOption1.classList.add("priority-option");
  priorityOption1.textContent = "Low";
  priorityOption1.value = "Low";
  priorityOption1.selected = true;

  const priorityOption2 = document.createElement("option");
  priorityOption2.classList.add("priority-option");
  priorityOption2.textContent = "Medium";
  priorityOption2.value = "Medium";
  priorityOption2.selected = false;

  const priorityOption3 = document.createElement("option");
  priorityOption3.classList.add("priority-option");
  priorityOption3.textContent = "High";
  priorityOption3.value = "High";
  priorityOption3.selected = false;

  const dueDateGroup = document.createElement("div");
  dueDateGroup.classList.add("modal-group");

  const dueDateIcon = document.createElement("img");
  dueDateIcon.classList.add("dueDateIcon");

  const dueDateText = document.createElement("div");
  dueDateText.classList.add("config-group-item");
  dueDateText.textContent = "Due Date";

  const dueDateDefault = document.createElement("div");
  dueDateDefault.classList.add("due-date");
  const dueDateDefaultValue = document.createElement("div");
  dueDateDefaultValue.classList.add("due-date-default-value");
  dueDateDefaultValue.textContent = `${getToday()}`;

  const datePicker = document.createElement("input");
  datePicker.classList.add("date-picker");
  datePicker.type = "date";
  datePicker.min = `${getToday()}`;
  datePicker.dataset.value = `${getToday()}`;

  const projectGroup = document.createElement("div");
  projectGroup.classList.add("modal-group");

  const taskProjectGroup = document.createElement("div");
  taskProjectGroup.classList.add("modal-group");

  const allProjectsIcon = document.createElement("img");
  allProjectsIcon.classList.add("allProjectsIcon");

  const projectsText = document.createElement("div");
  projectsText.classList.add("config-group-item");
  projectsText.textContent = "Projects";

  const projectsOptions = document.createElement("select");
  projectsOptions.classList.add("task-project");
  projectsOptions.required = true;

  const storedProjects = getProjectsFromLocalStorage();
  storedProjects.forEach((project) => {
    const projectOption = document.createElement("option");
    projectOption.classList.add("project-option");
    projectOption.textContent = project;
    projectOption.value = project;

    projectsOptions.appendChild(projectOption);
  });

  const modalAddButton = document.createElement("button");
  modalAddButton.classList.add("modal-add-button");
  modalAddButton.type = "submit";
  modalAddButton.textContent = "Add Task";
  group.appendChild(taskTitle);
  group.appendChild(taskDescription);

  taskPriority.appendChild(priorityOption1);
  taskPriority.appendChild(priorityOption2);
  taskPriority.appendChild(priorityOption3);

  taskPriorityGroup.appendChild(priorityIcon);
  taskPriorityGroup.appendChild(priorityText);
  taskPriorityGroup.appendChild(taskPriority);

  dueDateDefault.appendChild(dueDateDefaultValue);
  dueDateDefault.appendChild(datePicker);

  dueDateGroup.appendChild(dueDateIcon);
  dueDateGroup.appendChild(dueDateText);
  dueDateGroup.appendChild(dueDateDefault);

  projectGroup.appendChild(allProjectsIcon);
  projectGroup.appendChild(projectsText);
  projectGroup.appendChild(projectsOptions);

  taskConfigGroup.appendChild(taskPriorityGroup);
  taskConfigGroup.appendChild(dueDateGroup);
  taskConfigGroup.appendChild(projectGroup);

  form.appendChild(group);
  form.appendChild(taskConfigGroup);
  form.appendChild(modalAddButton);

  addModal.appendChild(modalCloseButton);
  addModal.appendChild(modalTitle);
  addModal.appendChild(form);

  addModalContainer.appendChild(addModal);
  document.body.appendChild(modalBackdrop);
  document.body.appendChild(addModalContainer);
}

export function displayTaskInfoModal(task) {
  const form = document.querySelector(".form");
  const modalAddButton = document.querySelector(".modal-add-button");
  modalAddButton.remove();

  const taskInfoButtonGroup = document.createElement("div");
  taskInfoButtonGroup.classList.add("task-info-button-group");

  const deleteTaskButton = document.createElement("div");
  deleteTaskButton.classList.add("delete-task-button");
  deleteTaskButton.textContent = "Delete Task";

  const editTaskButton = document.createElement("div");
  editTaskButton.classList.add("edit-task-button");
  editTaskButton.textContent = "Save Changes";

  taskInfoButtonGroup.appendChild(deleteTaskButton);
  taskInfoButtonGroup.appendChild(editTaskButton);
  form.appendChild(taskInfoButtonGroup);

  const taskInfoModalTitle = document.querySelector(".h2");
  const taskTitle = document.querySelector(".task-title");
  const taskDescription = document.querySelector(".task-description");
  const taskPriority = document.querySelector(".task-priority");
  const taskDueDate = document.querySelector(".due-date");
  const taskProject = document.querySelector(".task-project");

  taskInfoModalTitle.textContent = "Edit Task";

  taskTitle.value = task.taskTitle;
  taskTitle.textContent = task.taskTitle;

  taskDescription.value = task.taskDescription;
  taskDescription.textContent = task.taskDescription;

  taskPriority.value = task.taskPriority;

  taskDueDate.value = task.taskDueDate;
  setDueDateValue(task.taskDueDate);
  taskProject.value = task.taskParentProject;
}

export function cloneAddModal() {
  const addModalCloseButton = document.querySelector(".add-modal-close-button");
  const taskInfoModalTitle = document.querySelector(".h2");
  const form = document.querySelector(".form");

  const clonedAddModalCloseButton = addModalCloseButton.cloneNode(true);
  const clonedTaskInfoModalTitle = taskInfoModalTitle.cloneNode(true);
  const clonedForm = form.cloneNode(true);

  return { clonedAddModalCloseButton, clonedTaskInfoModalTitle, clonedForm };
}

export function resetAddModal(clone) {
  const addModal = document.querySelector(".add-modal");
  addModal.innerHTML = "";

  addModal.appendChild(clone.clonedAddModalCloseButton);
  addModal.appendChild(clone.clonedTaskInfoModalTitle);
  addModal.appendChild(clone.clonedForm);
  updateProjectOptionsInAddModal();
}
