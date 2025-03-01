import addIcon from "../assets/add.svg";
import completedIcon from "../assets/completed.svg";
import deleteIcon from "../assets/delete.svg";
import dueDateIcon from "../assets/due-date.svg";
import editIcon from "../assets/edit.svg";
import pendingIcon from "../assets/pending.svg";
import priorityIcon from "../assets/priority.svg";
import projectsIcon from "../assets/projects.svg";
import sidebarIcon from "../assets/sidebar.svg";
import taskIcon from "../assets/task.svg";
import thisWeekIcon from "../assets/this-week.svg";
import todayIcon from "../assets/today.svg";
import tomorrowIcon from "../assets/tomorrow.svg";
import allProjectsIcon from "../assets/all-projects.svg";
// key: class name, value: icon image link
export const iconImageObjects = {
  addIcon,
  completedIcon,
  deleteIcon,
  dueDateIcon,
  editIcon,
  pendingIcon,
  priorityIcon,
  projectsIcon,
  sidebarIcon,
  taskIcon,
  thisWeekIcon,
  todayIcon,
  tomorrowIcon,
  allProjectsIcon,
};

export function setIcons(iconImageObjects) {
  const iconImages = Object.entries(iconImageObjects);
  iconImages.forEach((iconImage) => {
    const imgElements = document.querySelectorAll(`.${iconImage[0]}`);
    if (imgElements) {
      imgElements.forEach((imageElement) => {
        imageElement.src = iconImage[1];
      });
    }
  });
}
