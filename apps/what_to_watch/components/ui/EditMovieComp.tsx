"use client";
import { MovieLists, MovieType, PlainMovie } from "@/app/utils/datatypes";
import Image from "next/image";
import Rating from "@/components/ui/RatingTicker";
import UserStars from "@/components/ui/UserStars";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@headlessui/react";
import { removeMovieFromList, setUserList } from "@/app/actions/movies";
import FailureModal from "@/components/ui/FailureModal";
import { useState } from "react";

export default function EditMovie(movie: PlainMovie) {
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <div className="editMovie relative flex 2xl:flex-row flex-col">
      <div className="relative w-full xl:w-40 2xl:w-54 h-fit aspect-2/3 shrink-0">
        <Image
          src={`https://media.themoviedb.org/t/p/w440_and_h660_face${movie?.poster_url}`}
          fill
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={"Movie poster"}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="size-8 sm:size-12 xl:size-18 mt-4 xl:ml-4">
            <Rating percentage={Math.round(movie.rating * 10)} />
          </div>
          <p className="text-xs md:text-base ml-2 font-semibold mt-4">
            User
            <br />
            Score
          </p>
        </div>
        <div className="md:text-xl text-xs mt-4 xl:ml-4">
          <p className="font-bold">Title</p>
          <p className="text-2xs md:text-lg ml-4">
            {movie.title}
            <span className="text-gray-400">
              {" (" + new Date(movie.release_date).getFullYear() + ")"}
            </span>
          </p>
          <p className="font-bold">Director</p>
          <p className="text-2xs md:text-lg ml-4">{movie.director}</p>
          <p className="font-bold">Type</p>
          <p className="text-2xs md:text-lg ml-4">
            {movie.media_type == MovieType.TV ? "TV" : "Movie"}
          </p>

          <p className="font-bold">Your rating</p>
          <UserStars key={movie.id} {...movie} />

          <div className="flex gap-2 mt-4 w-full ">
            <Button
              onClick={async () => {
                const list =
                  movie.list == MovieLists.TO_WATCH
                    ? MovieLists.WATCHED
                    : MovieLists.TO_WATCH;
                const res = await setUserList(movie.id, list);
                if (res?.message) {
                  setError(res.message);
                } else {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("list", String(list));
                  router.push(`?${params.toString()}`);
                }
              }}
            >
              Change lists
            </Button>
            {error && (
              <FailureModal
                message={error}
                onClose={() => setError(undefined)}
              />
            )}
            <Button
              onClick={async () => {
                const res = await removeMovieFromList(movie.id);
                if (res?.message) {
                  setError(res?.message);
                } else {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("movie");
                  router.push(`?${params.toString()}`);
                }
              }}
            >
              Remove movie
            </Button>
          </div>
        </div>
      </div>
      <X
        className="absolute top-0 right-0 w-5 h-5 cursor-pointer"
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("movie");
          router.push(`?${params.toString()}`);
        }}
      />
    </div>
  );
}
