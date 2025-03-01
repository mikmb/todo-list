import { getToday, getTomorrow } from "./dateHandler";

export const tasks = [
  {
    taskTitle: "Task 1 title",
    taskDescription: "Task 1 description.",
    taskPriority: "High",
    taskDueDate: getToday(),
    taskParentProject: "Project 1",
    taskCompleted: false,
  },
  {
    taskTitle: "Task 2 title",
    taskDescription: "Task 2 description.",
    taskPriority: "Medium",
    taskDueDate: getToday(),
    taskParentProject: "Project 1",
    taskCompleted: false,
  },
  {
    taskTitle: "Task 3 title",
    taskDescription: "Task 3 description.",
    taskPriority: "High",
    taskDueDate: getTomorrow(),
    taskParentProject: "Project 2",
    taskCompleted: false,
  },
  {
    taskTitle: "Task 4 title",
    taskDescription: "Task 4 description.",
    taskPriority: "Low",
    taskDueDate: getTomorrow(),
    taskParentProject: "Project 2",
    taskCompleted: true,
  },
  {
    taskTitle: "Task 5 title",
    taskDescription: "Task 5 description.",
    taskPriority: "Medium",
    taskDueDate: getTomorrow(),
    taskParentProject: "Another Project",
    taskCompleted: false,
  },
  {
    taskTitle: "Task 6 title",
    taskDescription: "Task 6 description.",
    taskPriority: "High",
    taskDueDate: getTomorrow(),
    taskParentProject: "Another Project",
    taskCompleted: false,
  },
];

export function createTask(
  taskTitle,
  taskDescription,
  taskPriority,
  taskDueDate,
  taskParentProject,
  taskCompleted
) {
  return {
    taskTitle,
    taskDescription,
    taskPriority,
    taskDueDate,
    taskParentProject,
    taskCompleted,
  };
}
