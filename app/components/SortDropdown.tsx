"use client";

import { ArrowUpDown, Check } from "lucide-react";
import { useRecoilState } from "recoil";
import { sortByState } from "../store/atoms";
import { useState, useRef, useEffect } from "react";

export function SortDropdownSimple() {
  const [sortBy, setSortBy] = useRecoilState(sortByState);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: "date", label: "Date Created" },
    { value: "title", label: "Title (A-Z)" },
    { value: "status", label: "Status" },
  ];

  return (
    <div className="relative cursor-pointer" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md bg-background hover:bg-accent transition"
      >
        <ArrowUpDown className="h-4 cursor-pointer w-4" />
        <span className="hidden sm:inline">
          Sort:{" "}
          {sortBy === "date" ? "Date" : sortBy === "title" ? "Title" : "Status"}
        </span>
        <span className="sm:hidden cursor-pointer">Sort</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-50">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSortBy(option.value as "date" | "title" | "status");
                setIsOpen(false);
              }}
              className="w-full cursor-pointer flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition text-left"
            >
              <span className="flex-1">{option.label}</span>
              {sortBy === option.value && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
