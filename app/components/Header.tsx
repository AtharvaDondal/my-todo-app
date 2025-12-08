"use client";

import { User as UserIcon, LogOut, Menu, X } from "lucide-react";
import { User } from "../types";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function Header({
  user,
  onLogout,
  onToggleSidebar,
  sidebarOpen,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <h1 className="text-2xl font-bold text-indigo-600">TodoApp</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">
              {user?.fullname || user?.email}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
