"use client";

import {
  Button,
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useState, useEffect, useTransition, useRef } from "react";
import MovieSmall from "@/components/ui/MovieInfoSmall";
import { Movie, MovieLists, PlainMovie } from "@/app/utils/datatypes";
import {
  addMovieToList,
  addRandomMovie,
  searchAndAddMovies,
} from "@/app/actions/movies";

export default function SearchBox({
  selectedList,
}: {
  selectedList: MovieLists;
}) {
  const [selectedMovie, setSelectedMovie] = useState<PlainMovie | null>(null);
  const [query, setQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState<PlainMovie[] | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const [isPendingAdd, startTransitionAdd] = useTransition();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (!query) {
      setFilteredMovies(null);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      startTransition(async () => {
        const results = await searchAndAddMovies(query);
        setFilteredMovies(results);
      });
    }, 400);

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  return (
    <div className="searchBox flex flex-col sm:flex-row gap-4 items-center">
      <Combobox
        value={selectedMovie}
        onChange={setSelectedMovie}
        by="id"
        onClose={() => setQuery("")}
      >
        <ComboboxInput
          aria-label="Assignee"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
          displayValue={(movie: Movie | null) => movie?.title ?? ""}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ComboboxOptions
          anchor="bottom"
          className="w-(--input-width) border border-gray-950 rounded shadow-lg empty:invisible z-10"
        >
          {filteredMovies?.map((movie) => (
            <ComboboxOption
              key={movie.id}
              value={movie}
              className="px-4 bg-gray-900 py-2 cursor-pointer data-focus:bg-gray-500"
            >
              <MovieSmall {...movie} />
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
      <div className="flex gap-4">
        <Button
          className="flex flex-0 sm:px-8 sm:py-2 items-center"
          disabled={isPendingAdd || !selectedMovie}
          onClick={() =>
            startTransitionAdd(async () => {
              if (selectedMovie) {
                await addMovieToList(selectedMovie.id, selectedList);
              }
            })
          }
        >
          {isPendingAdd ? "Adding..." : "Add"}
        </Button>
        <Button
          className="flex flex-0 sm:px-8 sm:py-2 text-nowrap items-center"
          disabled={isPendingAdd || !selectedMovie}
          onClick={() =>
            startTransitionAdd(async () => {
              if (selectedMovie) {
                await addRandomMovie();
              }
            })
          }
        >
          {isPendingAdd ? "Adding..." : "Something new"}
        </Button>
      </div>
    </div>
  );
}
