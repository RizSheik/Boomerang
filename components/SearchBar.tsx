"use client";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!term) {
      setResults([]);
      return;
    }
    timerRef.current = setTimeout(async () => {
      const res = await fetch(`/api/search/products?q=${encodeURIComponent(term)}`);
      const json = await res.json();
      setResults(json?.results || []);
    }, 250);
  }, [term]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md border hover:border-shop_light_green cursor-text" onClick={() => setOpen(true)}>
          <Search className="w-4 h-4" />
          <span className="text-sm text-muted-foreground hidden md:inline">Search products</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-72 md:w-96">
        <div className="flex flex-col gap-2">
          <Input
            autoFocus
            placeholder="Search all products..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <div className="max-h-64 overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-sm text-muted-foreground px-1 py-2">No results</div>
            ) : (
              <ul className="space-y-1">
                {results.map((p) => (
                  <li key={p._id}>
                    <Link href={`/product/${p.slug?.current}`} className="block px-2 py-1.5 rounded hover:bg-muted" onClick={() => setOpen(false)}>
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBar;
