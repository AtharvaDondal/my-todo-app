import { selector } from "recoil";
import { todosState } from "./atoms";

// Get total todos count
export const totalTodosSelector = selector({
  key: "totalTodosSelector",
  get: ({ get }) => {
    const todos = get(todosState);
    return todos.length;
  },
});

// Get completed todos count
export const completedTodosSelector = selector({
  key: "completedTodosSelector",
  get: ({ get }) => {
    const todos = get(todosState);
    return todos.filter((todo) => todo.completed).length;
  },
});

// Get pending todos count
export const pendingTodosSelector = selector({
  key: "pendingTodosSelector",
  get: ({ get }) => {
    const todos = get(todosState);
    return todos.filter((todo) => !todo.completed).length;
  },
});
