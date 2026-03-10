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
import FailureModal from "@/components/ui/FailureModal";

export default function SearchBox({
  selectedList,
}: {
  selectedList: MovieLists;
}) {
  const [selectedMovie, setSelectedMovie] = useState<
    PlainMovie | null | undefined
  >(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [filteredMovies, setFilteredMovies] = useState<PlainMovie[] | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const [isPendingAdd, startTransitionAdd] = useTransition();
  const [page, setPage] = useState(1);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const PAGE_LIMIT = 6;

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (!query) {
      setFilteredMovies(null);
      if(page != 1) {
        setPage(1);
      }
      return;
    }

    timeoutRef.current = setTimeout(() => {
      startTransition(async () => {
        const results = await searchAndAddMovies(query, page);
        setFilteredMovies(results);
      });
    }, 600);

    return () => clearTimeout(timeoutRef.current);
  }, [query, page]);

  useEffect(() => {
    if (selectedMovie === undefined) {
      if (page < PAGE_LIMIT){
        setPage(page + 1);
      }
      setSelectedMovie(null);
    }
  }, [selectedMovie]);

  return (
    <div className="searchBox flex flex-col sm:flex-row gap-4 items-center ">
      <Combobox
        value={selectedMovie}
        onChange={setSelectedMovie}
        by="id"
        onClose={() => setQuery("")}
      >
        <ComboboxInput
          aria-label="Assignee"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 "
          displayValue={(movie: Movie | null) => movie?.title ?? ""}
          onChange={(e) => setQuery(e.target.value.trim())}
        />
        <ComboboxOptions
          anchor="bottom"
          className="w-(--input-width) border border-gray-950 rounded shadow-lg empty:invisible z-10 bg-white/5 p-6 backdrop-blur-2xl"
        >
          {filteredMovies?.map((movie) => (
            <ComboboxOption
              key={movie.id}
              value={movie}
              className="px-4 py-2 cursor-pointer data-focus:bg-gray-500 rounded-md"
            >
              <MovieSmall {...movie} />
            </ComboboxOption>
          ))}
          {filteredMovies && !isPending && filteredMovies?.length < 5 && (
            <Button
              className="px-4 py-2 w-full text-left cursor-pointer hover:bg-gray-500 rounded-md"
              disabled={page >= PAGE_LIMIT}
              onMouseDown={(e) => {
                setPage((prev) => prev + 1);
              }}
            >
              {page >= PAGE_LIMIT ? "Can't load more" : "Load more..."}
            </Button>
          )}
          {isPending && <span>Loading...</span>}
        </ComboboxOptions>
      </Combobox>
      {error && (
        <FailureModal message={error} onClose={() => setError(undefined)} />
      )}
      <div className="flex gap-4">
        <Button
          className="flex flex-0 sm:px-8 sm:py-2 items-center"
          disabled={isPendingAdd || !selectedMovie}
          onClick={() =>
            startTransitionAdd(async () => {
              if (selectedMovie) {
                const res = await addMovieToList(
                  selectedMovie.id,
                  selectedList,
                );
                setError(res?.message);
                res?.message || setSelectedMovie(null);
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
                const res = await addRandomMovie();
                setError(res?.message);
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
