import { Movie as MovieTypeLoc } from "@/app/utils/datatypes";
import Movie from "@/components/ui/MovieInfoBig";

export default async function MovieList({
  movies,
}: {
  movies: MovieTypeLoc[];
}) {
  return (
    <ul className="grid xl:grid-cols-5 grid-cols-3 2xl:grid-cols-6 gap-4 ">
      {movies
        .sort(
          (a, b) =>
            Date.parse(b.added_date as string) -
            Date.parse(a.added_date as string),
        )
        .map((movie) => (
          <li className="w-fit" key={movie.id}>
            <Movie {...movie}></Movie>
          </li>
        ))}
    </ul>
  );
}
