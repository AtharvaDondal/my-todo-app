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

// NEW ATOMS FOR SEARCH AND SORT
export const searchQueryState = atom<string>({
  key: "searchQueryState",
  default: "",
});

export const sortByState = atom<"date" | "title" | "status">({
  key: "sortByState",
  default: "date",
});

export const otpSessionIdState = atom<string | null>({
  key: "otpSessionId",
  default: null,
});
export const showOtpInputState = atom<boolean>({
  key: "showOtpInput",
  default: false,
});

export const correctOtpState = atom<string>({
  key: "correctOtp",
  default: "",
});

export const otpSentState = atom<boolean>({
  key: "otpSent",
  default: false,
});

export const otpValueState = atom<string>({
  key: "otpValue",
  default: "",
});

export const otpVerifiedState = atom<boolean>({
  key: "otpVerified",
  default: false,
});
