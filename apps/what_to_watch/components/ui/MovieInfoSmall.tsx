import Image from "next/image";
import Rating from "@/components/ui/RatingTicker";
import { Movie, PlainMovie } from "@/app/utils/datatypes";

export default function MovieSmall(movie: PlainMovie) {
  const posterUrl = movie?.poster_url ? `https://media.themoviedb.org/t/p/w130_and_h195_face${movie?.poster_url}` : '/not_found.jpg';
  return (
    <div className="flex flex-row items-center">
      <div>
        <Image priority
          src={posterUrl}
          width={50}
          height={50}
          alt={"Movie poster"}
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
        />
        <div className="relative bottom-3 left-1 size-5 sm:size-6">
          <Rating percentage={Math.round(movie.rating * 10)} />
        </div>
      </div>
      <div className="mr-20 text-2xs sm:text-xl -mt-4 ml-2">
        <p>{movie.title}</p>
        <p className="ml-2 text-xs sm:text-lg text-gray-400">{movie.director}</p>
      </div>
    </div>
  );
}