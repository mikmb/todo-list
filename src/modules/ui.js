import { renderProjects } from "./domManipulation";
import { showTaskCount, getTasks } from "./displayTasksAndProjects";
import { createAddTaskModal } from "./domManipulation";
export function renderUI() {
  createAddTaskModal();
  renderProjects();
  showTaskCount();
  getTasks("Today");
}
