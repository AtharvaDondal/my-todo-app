"use client";

import { Search } from "lucide-react";
import { useRecoilState } from "recoil";
import { Input } from "@/components/ui/input";
import { searchQueryState } from "../store/atoms";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search todos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
