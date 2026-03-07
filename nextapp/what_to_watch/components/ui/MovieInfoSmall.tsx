import Image from "next/image";
import Rating from "@/components/ui/RatingTicker";
import { Movie, PlainMovie } from "@/app/utils/datatypes";

export default function MovieSmall(movie: PlainMovie) {
  const posterUrl = movie?.poster_url ? `https://media.themoviedb.org/t/p/w440_and_h660_face${movie?.poster_url}` : '/not_found.jpg';
  return (
    <div className="flex flex-row items-center">
      <div>
        <Image
          src={posterUrl}
          width={50}
          height={50}
          alt={"Movie poster"}
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