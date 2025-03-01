import { createTask } from "./tasks";
import { getTasks } from "./displayTasksAndProjects";
import {
  setDueDateValue,
  displayTaskInfoModal,
  cloneAddModal,
} from "./domManipulation";
import { dateFormatter } from "./dateHandler";
import {
  highlightSelectedNavTab,
  createRenameProjectModal,
  createDeleteProjectModal,
  resetAddModal,
} from "./domManipulation";
import { createProject, renameProject, deleteProject } from "./projects";

import {
  setTasksInLocalStorage,
  removeTaskfromLocalStorage,
  getTasksFromLocalStorage,
  getProjectsFromLocalStorage,
  removeAndReplaceTaskfromLocalStorage,
} from "./handleLocalStorage";

export const tasksNav = [
  "Today",
  "Tomorrow",
  "This Week",
  "All Tasks",
  "Completed",
];

export function sidebarEventListeners() {
  const sidebarIconButton = document.querySelector(".sidebar-icon");
  const sidebar = document.querySelector(".sidebar");
  const sidebarContainer = document.querySelector(".sidebar-container");
  const content = document.querySelector(".content");
  const secondSidebarIcon = document.querySelector(".second-sidebar-icon-div");
  const navTasks = document.querySelectorAll(".nav-tasks");
  const navProjects = document.querySelectorAll(".nav-projects");
  const options = document.querySelectorAll(".options");
  const addProject = document.querySelector(".add-project");

  sidebarIconButton.addEventListener("click", () => {
    sidebar.classList.add("hidden");
    content.style.marginLeft = "auto";
    secondSidebarIcon.classList.remove("hidden");
  });

  secondSidebarIcon.addEventListener("click", () => {
    sidebar.classList.remove("hidden");
    secondSidebarIcon.classList.add("hidden");
    content.style.marginLeft = "270px";
  });

  navTasks.forEach((navTask) => {
    navTask.addEventListener("click", (e) => {
      highlightSelectedNavTab(e.currentTarget);
      const taskIndex = Array.from(navTasks).indexOf(e.currentTarget);
      getTasks(tasksNav[taskIndex]);
    });
  });

  navProjects.forEach((project) => {
    project.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("options") ||
        e.target.classList.contains("option-group") ||
        e.target.classList.contains("rename-project") ||
        e.target.classList.contains("delete-project")
      )
        return;

      highlightSelectedNavTab(e.currentTarget);
      if (e.target.classList.contains("options")) return;
      const projectIndex = Array.from(navProjects).indexOf(e.currentTarget);

      const storedProjects = getProjectsFromLocalStorage();
      getTasks(storedProjects[projectIndex]);
    });
    project.addEventListener("mouseenter", (e) => {
      if (e.target.classList.contains("selected")) return;
      const options = e.target.querySelector(".options");
      const count = e.target.querySelector(".count");

      options.classList.remove("hidden");
      count.classList.add("hidden");
    });
    project.addEventListener("mouseleave", (e) => {
      if (e.target.classList.contains("selected")) return;
      const options = e.target.querySelector(".options");
      const count = e.target.querySelector(".count");

      if (!e.target.querySelector(".option-group").classList.contains("hidden"))
        return;

      options.classList.add("hidden");
      count.classList.remove("hidden");
    });
  });

  options.forEach((option) => {
    let renameAndDeleteClickEventAdded = false;
    option.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("rename-project") ||
        e.target.classList.contains("delete-project") ||
        e.target.classList.contains("option-group")
      )
        return;

      const currentOptionIndex = Array.from(options).indexOf(e.target);
      Array.from(options).forEach((option, index) => {
        if (currentOptionIndex === index) return;

        if (option.closest(".nav-projects").classList.contains("selected")) {
          option.querySelector(".option-group").classList.add("hidden");
          return;
        }

        if (!option.classList.contains("hidden")) {
          //closes all the opened .option-group of other projects
          option.classList.add("hidden");
          option.querySelector(".option-group").classList.add("hidden");
          option.parentElement
            .querySelector(".count")
            .classList.remove("hidden");
        }
      });
      const optionGroup = e.target.children[0];
      if (option.querySelector(".option-group").classList.contains("hidden")) {
        option.querySelector(".option-group").classList.remove("hidden");
        updateOptionGroupPosition();
      } else {
        option.querySelector(".option-group").classList.add("hidden");
      }

      const renameProjectButton = e.target.querySelector(".rename-project");
      const deleteProjectButton = e.target.querySelector(".delete-project");

      function updateOptionGroupPosition() {
        const optionRect = e.target.getBoundingClientRect();
        optionGroup.style.top = `${optionRect.bottom + window.scrollY}px`;
        optionGroup.style.left = `${optionRect.left + window.scrollX}px`;
      }

      function reset() {
        navProjects.forEach((project) => {
          if (project.classList.contains("selected")) {
            return;
          }
          project.querySelector(".options").classList.add("hidden");
          project.querySelector(".count").classList.remove("hidden");
        });

        optionGroup.classList.add("hidden");
      }
      // preventing the duplication of click even on rename and delete buttons
      if (renameAndDeleteClickEventAdded) return;
      renameAndDeleteClickEventAdded = true;

      sidebarContainer.addEventListener("scroll", updateOptionGroupPosition);

      renameProjectButton.addEventListener("click", (e) => {
        const parentElement = e.target.closest(".options").parentElement;
        const oldProjectTitle =
          parentElement.querySelector(".name").dataset.value;

        reset();
        createRenameProjectModal(oldProjectTitle);

        const confirm = document.querySelector(".rename-project-confirm");
        const cancel = document.querySelector(".rename-project-cancel");
        const renameModal = document.querySelector(".rename-modal");

        confirm.addEventListener("click", () => {
          const newProjectTitle =
            document.querySelector(".new-project-title").value;

          if (newProjectTitle === "") return;
          renameProject(oldProjectTitle, newProjectTitle);

          renameModal.remove();
        });
        cancel.addEventListener("click", () => {
          renameModal.remove();
        });
      });

      deleteProjectButton.addEventListener("click", (e) => {
        const parentElement = e.target.closest(".options").parentElement;
        const projectTitle = parentElement.querySelector(".name").dataset.value;

        reset();
        createDeleteProjectModal(projectTitle);

        const confirm = document.querySelector(".delete-project-confirm");
        const cancel = document.querySelector(".delete-project-cancel");
        const deleteModal = document.querySelector(".delete-modal");

        confirm.addEventListener("click", () => {
          deleteProject(projectTitle);
          deleteModal.remove();
        });
        cancel.addEventListener("click", () => {
          deleteModal.remove();
        });
      });
    });
  });
  addProject.addEventListener("click", () => {
    const addProjectPopupDiv = document.querySelector(".add-project-popup-div");
    const addProjectContainer = document.querySelector(
      ".add-project-container"
    );
    const addProjectCancelButton = document.querySelector(
      ".add-project-cancel-button"
    );
    const addProjectAddButton = document.querySelector(
      ".add-project-add-button"
    );
    const addProjectInput = document.querySelector(".project-title");
    addProjectPopupDiv.classList.remove("hidden");
    addProjectContainer.classList.add("hidden");

    addProjectCancelButton.addEventListener("click", () => {
      addProjectPopupDiv.classList.add("hidden");
      addProjectContainer.classList.remove("hidden");
      addProjectInput.value = "";
    });

    addProjectAddButton.addEventListener("click", () => {
      createProject(addProjectInput.value);
      addProjectPopupDiv.classList.add("hidden");
      addProjectContainer.classList.remove("hidden");
      addProjectInput.value = "";
    });
  });
}

export function addTasksEventListeners() {
  const addTaskButton = document.querySelector(".add-task-div");
  const modalBackdrop = document.querySelector(".modal-backdrop");
  const addModalContainer = document.querySelector(".add-modal-container");
  const form = document.querySelector(".form");
  const modalCloseButton = document.querySelector(".add-modal-close-button");
  const dueDate = document.querySelector(".due-date");
  const tasksInfos = document.querySelectorAll(".task-info");

  addTaskButton.addEventListener("click", () => {
    modalBackdrop.classList.remove("hidden");
    addModalContainer.classList.remove("hidden");

    modalBackdrop.addEventListener("click", () => {
      modalBackdrop.classList.add("hidden");
      addModalContainer.classList.add("hidden");
    });
  });

  modalCloseButton.addEventListener("click", () => {
    modalBackdrop.classList.add("hidden");
    addModalContainer.classList.add("hidden");
  });

  form.addEventListener("submit", (e) => {
    if (!form.checkValidity()) {
      e.preventDefault();
      return;
    }

    const taskTitle = document.querySelector(".task-title").value;
    const taskDescription = document.querySelector(".task-description").value;
    const taskPriority = document.querySelector(".task-priority").value;
    const taskDueDate = document.querySelector(
      ".due-date-default-value"
    ).textContent;
    const taskProject = document.querySelector(".task-project").value;

    let taskTitleExists = false;
    const storedTasks = getTasksFromLocalStorage();
    storedTasks.forEach((task) => {
      if (task.taskTitle.toLowerCase() === taskTitle.toLowerCase()) {
        alert(`Task "${taskTitle}" already exist`);
        taskTitleExists = true;
      }
    });

    if (taskTitleExists) {
      form.reset();
      modalBackdrop.classList.add("hidden");
      addModalContainer.classList.add("hidden");
      return;
    }

    const task = createTask(
      taskTitle,
      taskDescription,
      taskPriority,
      taskDueDate,
      taskProject,
      false
    );

    setTasksInLocalStorage(task);

    form.reset();
    getTasks(document.querySelector(".task-detail-for").dataset.value);
    modalBackdrop.classList.add("hidden");
    addModalContainer.classList.add("hidden");
  });

  dueDate.addEventListener("click", () => {
    const datePicker = document.querySelector(".date-picker");
    try {
      datePicker.showPicker();
    } catch (error) {
      console.log("error: " + error);
    }
    datePicker.addEventListener("change", () => {
      setDueDateValue(dateFormatter(datePicker.value));
    });
  });

  const clonedAddModal = cloneAddModal();
  tasksInfos.forEach((taskInfo) => {
    const editIcon = taskInfo.querySelector(".editIcon");
    if (editIcon) {
      editIcon.addEventListener("click", (e) => {
        const selectedTaskTitle = e.target.parentElement.dataset.value;

        const storedTasks = getTasksFromLocalStorage();
        storedTasks.forEach((task, index) => {
          if (
            task.taskTitle.toLowerCase() === selectedTaskTitle.toLowerCase()
          ) {
            displayTaskInfoModal(task);
            modalBackdrop.classList.remove("hidden");
            addModalContainer.classList.remove("hidden");

            modalBackdrop.addEventListener("click", () => {
              modalBackdrop.classList.add("hidden");
              addModalContainer.classList.add("hidden");
              resetAddModal(clonedAddModal);
              getTasks(
                document.querySelector(".task-detail-for").dataset.value
              );
            });

            modalCloseButton.addEventListener("click", () => {
              modalBackdrop.classList.add("hidden");
              addModalContainer.classList.add("hidden");
              resetAddModal(clonedAddModal);
              getTasks(
                document.querySelector(".task-detail-for").dataset.value
              );
            });

            const editModalDeleteTaskButton = document.querySelector(
              ".delete-task-button"
            );
            const editModalSaveChangesButton =
              document.querySelector(".edit-task-button");

            editModalDeleteTaskButton.addEventListener("click", () => {
              removeTaskfromLocalStorage(index);

              resetAddModal(clonedAddModal);
              modalBackdrop.classList.add("hidden");
              addModalContainer.classList.add("hidden");
              getTasks(
                document.querySelector(".task-detail-for").dataset.value
              );
            });

            editModalSaveChangesButton.addEventListener("click", () => {
              if (!form.checkValidity()) {
                e.preventDefault();
                return;
              }

              const taskTitle = document.querySelector(".task-title").value;
              const taskDescription =
                document.querySelector(".task-description").value;
              const taskPriority =
                document.querySelector(".task-priority").value;
              const taskDueDate = document.querySelector(
                ".due-date-default-value"
              ).textContent;
              const taskProject = document.querySelector(".task-project").value;

              task.taskTitle = taskTitle;
              task.taskDescription = taskDescription;
              task.taskPriority = taskPriority;
              task.taskDueDate = taskDueDate;
              task.taskParentProject = taskProject;
              removeAndReplaceTaskfromLocalStorage(index, task);
              resetAddModal(clonedAddModal);
              modalBackdrop.classList.add("hidden");
              addModalContainer.classList.add("hidden");

              getTasks(
                document.querySelector(".task-detail-for").dataset.value
              );
            });
          }
        });
      });
    }
  });
}
