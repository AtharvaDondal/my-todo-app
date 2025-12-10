"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Check, Edit2, Trash2, Loader2 } from "lucide-react";
import {
  authLoadingState,
  editingTodoState,
  showTodoModalState,
  todosState,
  userState,
  searchQueryState,
  sortByState,
  otpVerifiedState,
} from "../store/atoms";
import { Todo } from "../types";
import TodoModal from "../components/TaskModal";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ThemeToggle } from "../components/ThemeToggle";
import { toast } from "sonner";
import { SearchBar } from "../components/Searchbar";
import { SortDropdownSimple } from "../components/SortDropdown";

export default function TodosPage() {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const [todos, setTodos] = useRecoilState(todosState);
  const isLoading = useRecoilValue(authLoadingState);
  const setAuthLoading = useSetRecoilState(authLoadingState);
  const showModal = useRecoilValue(showTodoModalState);
  const setShowModal = useSetRecoilState(showTodoModalState);
  const setEditingTodo = useSetRecoilState(editingTodoState);
  const searchQuery = useRecoilValue(searchQueryState);
  const sortBy = useRecoilValue(sortByState);
  const verified = useRecoilValue(otpVerifiedState);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

 

  const checkAuthAndFetchData = async () => {
    setAuthLoading(true);
    try {
      const authRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-auth`,
        {
          credentials: "include",
        }
      );
      const authData = await authRes.json();

      if (!authRes.ok || !authData.success) {
        router.push("/login");
        return;
      }

      setUser(authData.user);

      const todosRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/todo`,
        {
          credentials: "include",
        }
      );
      const todosData = await todosRes.json();

      if (todosRes.ok) {
        setTodos(todosData.todos || []);
      }
    } catch (error) {
      console.error("Error:", error);
      router.push("/login");
    } finally {
      setAuthLoading(false);
    }
  };

   useEffect(() => {
    if (!verified) router.replace("/login");
  }, [verified, router]);

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  const handleDelete = async (todoId: string) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/todo/${todoId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        setTodos(todos.filter((t) => t._id !== todoId));
        toast.success("Todo deleted successfully");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete todo");
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/todo/${todo._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ ...todo, completed: !todo.completed }),
        }
      );

      if (res.ok) {
        setTodos(
          todos.map((t) =>
            t._id === todo._id ? { ...t, completed: !t.completed } : t
          )
        );
        toast.success("Todo updated successfully");
      }
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Failed to update todo");
    }
  };

  const handleAddTodo = () => {
    setEditingTodo(null);
    setShowModal(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowModal(true);
  };

  // FILTERED AND SORTED TODOS
  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          todo.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "status") {
        return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
      } else if (sortBy === "date") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Newest first
      }
      return 0;
    });

    return sorted;
  }, [todos, searchQuery, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <div className="flex flex-1">
        <Sidebar onAddTodo={handleAddTodo} />

        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header with Search, Sort, Theme Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                My Todos
              </h2>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <SearchBar />
                <SortDropdownSimple />

                <button
                  onClick={handleAddTodo}
                  className="lg:hidden cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Results count */}
            {searchQuery && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Found {filteredAndSortedTodos.length} todo(s)
              </p>
            )}

            {filteredAndSortedTodos.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {searchQuery
                    ? "No todos found matching your search."
                    : "No todos yet. Create your first one!"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleAddTodo}
                    className="mt-4 cursor-pointer px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Add Your First Todo
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedTodos.map((todo) => (
                  <div
                    key={todo._id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3
                        className={`font-semibold text-lg ${
                          todo.completed
                            ? "line-through text-gray-400 dark:text-gray-500"
                            : "text-gray-800 dark:text-gray-100"
                        }`}
                      >
                        {todo.title}
                      </h3>
                      <button
                        onClick={() => handleToggleComplete(todo)}
                        className={`p-1 cursor-pointer rounded ${
                          todo.completed
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                        }`}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                    <p
                      className={`text-sm mb-4 ${
                        todo.completed
                          ? "text-gray-400 dark:text-gray-500"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {todo.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTodo(todo)}
                        className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />

      {showModal && <TodoModal />}
    </div>
  );
}
