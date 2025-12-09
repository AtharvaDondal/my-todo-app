import { atom } from "recoil";
import { Todo, User } from "../types";

// User atom
export const userState = atom<User | null>({
  key: "userState",
  default: null,
});

// Todos atom
export const todosState = atom<Todo[]>({
  key: "todosState",
  default: [],
});

// Loading states
export const authLoadingState = atom<boolean>({
  key: "authLoadingState",
  default: true,
});

export const todosLoadingState = atom<boolean>({
  key: "todosLoadingState",
  default: false,
});

// Sidebar state
export const sidebarOpenState = atom<boolean>({
  key: "sidebarOpenState",
  default: false,
});

// Modal states
export const showTodoModalState = atom<boolean>({
  key: "showTodoModalState",
  default: false,
});

export const editingTodoState = atom<Todo | null>({
  key: "editingTodoState",
  default: null,
});

// Message states (for login/register feedback)
export const authMessageState = atom<string>({
  key: "authMessageState",
  default: "",
});
