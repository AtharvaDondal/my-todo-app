'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Check, Edit2, Trash2, Loader2 } from 'lucide-react';
import { authLoadingState, editingTodoState, showTodoModalState, todosState, userState } from '../store/atoms';
import { Todo } from '../types';
import TodoModal from '../components/TaskModal';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

export default function TodosPage() {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const [todos, setTodos] = useRecoilState(todosState);
  const isLoading = useRecoilValue(authLoadingState);
  const setAuthLoading = useSetRecoilState(authLoadingState);
  const showModal = useRecoilValue(showTodoModalState);
  const setShowModal = useSetRecoilState(showTodoModalState);
  const setEditingTodo = useSetRecoilState(editingTodoState);

  

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    setAuthLoading(true);
    try {
      // Check authentication
      const authRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-auth`, {
        credentials: 'include',
      });
      const authData = await authRes.json();

      if (!authRes.ok || !authData.success) {
        router.push('/login');
        return;
      }

      setUser(authData.user);

      // Fetch todos
      const todosRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/todo`, {
        credentials: 'include',
      });
      const todosData = await todosRes.json();

      if (todosRes.ok) {
        setTodos(todosData.todos || []);
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/login');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDelete = async (todoId: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/todo/${todoId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setTodos(todos.filter((t) => t._id !== todoId));
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/todo/${todo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });

      if (res.ok) {
        setTodos(todos.map((t) => (t._id === todo._id ? { ...t, completed: !t.completed } : t)));
      }
    } catch (error) {
      console.error('Toggle error:', error);
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

  

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar onAddTodo={handleAddTodo} />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800">My Todos</h2>
              <button
                onClick={handleAddTodo}

                className="lg:hidden cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Add Todo
              </button>
            </div>

            {todos.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <p className="text-gray-500 text-lg">No todos yet. Create your first one!</p>
                <button
                  onClick={handleAddTodo}
                  className="mt-4 cursor-pointer px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Add Your First Todo
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {todos.map((todo) => (
                  <div
                    key={todo._id}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3
                        className={`font-semibold text-lg ${
                          todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                        }`}
                      >
                        {todo.title}
                      </h3>
                      <button
                        onClick={() => handleToggleComplete(todo)}
                        className={`p-1 cursor-pointer rounded ${
                          todo.completed
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                    <p
                      className={`text-sm mb-4 ${
                        todo.completed ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {todo.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTodo(todo)}
                        className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm"
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
