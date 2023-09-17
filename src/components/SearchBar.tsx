"use client";

import { useQuery } from "@tanstack/react-query";
import { Command, CommandEmpty, CommandInput, CommandItem } from "./ui/Command";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Prisma, Subreddit } from "@prisma/client";
import { CommandGroup, CommandList } from "cmdk";
import { usePathname, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

const SearchBar = () => {
  const [input, setInput] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();
  const {
    data,
    refetch: searchFunction,
    isFetched,
  } = useQuery({
    queryKey: ["search-query"],
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
    enabled: false,
  });

  const request = debounce(() => {
    searchFunction();
  }, 500);
  const debounceRequest = useCallback(() => {
    request();
  }, []);

  const commandRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(commandRef, () => {
    setInput("");
  });

  useEffect(() => setInput(""), [pathname]);
  return (
    <Command
      ref={commandRef}
      className="relative rounded-lg border max-w-lg z-50 overflow-visible"
    >
      <CommandInput
        value={input}
        onValueChange={(value) => setInput(value)}
        onInput={debounceRequest}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communities..."
      />
      {input.length > 0 && (
        <CommandList className="absolute top-full inset-x-0 bg-white rounded-b-md shadow">
          {isFetched && <CommandEmpty>No results found</CommandEmpty>}
          {(data?.length ?? 0) > 0 && (
            <CommandGroup title="Communities">
              {data?.map((subreddit) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/r/${e}`);
                    router.refresh();
                  }}
                  key={subreddit.id}
                  value={subreddit.name}
                >
                  <Users className="mr-2 w-4 h-4" />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  );
};

export default SearchBar;
