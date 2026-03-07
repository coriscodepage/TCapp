"use client";

import Image from "next/image";
import Rating from "@/components/ui/RatingTicker";
import { PlainMovie } from "@/app/utils/datatypes";
import { useRouter, useSearchParams } from "next/navigation";

export default function Movie(movie: PlainMovie) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div
      className="flex flex-col items-center"
      onClick={() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("movie", String(movie.id));
        router.push(`?${params.toString()}`);
      }}
    >
      <div>
        <Image
          src={`https://media.themoviedb.org/t/p/w440_and_h660_face${movie?.poster_url}`}
          width={200}
          height={200}
          alt={"Movie poster"}
        />
        <div className="relative bottom-4 left-1 sm:bottom-6 sm:left-4 size-5 sm:size-8 md:size-10">
          <Rating percentage={Math.round(movie.rating * 10)} />
        </div>
      </div>
      <div className="sm:text-xl text-xs sm:ml-4 -mt-4 w-full max-w-50">
        <p>{movie.title}</p>
        <p className="sm:ml-2 sm:text-lg text-[10px] text-gray-400">
          {movie.director}
        </p>
      </div>
    </div>
  );
}
