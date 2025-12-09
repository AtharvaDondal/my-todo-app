"use client";

import { useRecoilState, useRecoilValue } from "recoil";

import { Plus, CheckCircle2, Clock, ListTodo } from "lucide-react";
import { sidebarOpenState } from "../store/atoms";
import {
  completedTodosSelector,
  pendingTodosSelector,
  totalTodosSelector,
} from "../store/selectors";

interface SidebarProps {
  onAddTodo: () => void;
}

export default function Sidebar({ onAddTodo }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useRecoilState(sidebarOpenState);
  const totalTodos = useRecoilValue(totalTodosSelector);
  const completedTodos = useRecoilValue(completedTodosSelector);
  const pendingTodos = useRecoilValue(pendingTodosSelector);

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <nav className="p-4 space-y-4 mt-16 lg:mt-4">
          <button
            onClick={() => {
              onAddTodo();
              setSidebarOpen(false);
            }}
            className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add New Todo
          </button>

          <div className="pt-4 border-t">
            <p className="text-sm font-semibold text-gray-500 px-4 mb-3">
              Statistics
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                <ListTodo className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Total: {totalTodos}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm">Completed: {completedTodos}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-sm">Pending: {pendingTodos}</span>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
