import "server-only";
import { Movie, MovieType } from "@/app/utils/datatypes";

export async function getMovieById(id: number) {}

export async function searchApi(query: string, pageNumber?: number): Promise<Movie[]> {
  const url = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=${pageNumber || 1}`;
  console.log(url);
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
  };

  const response = await fetch(url, options);
  const result = await response.json();
  const moviesDirty = result["results"]
    .filter((entry: { media_type: string }) => entry.media_type !== "person")
    .map(
      (entry: {
        original_title: string;
        name: string;
        id: number;
        title: string;
        vote_average: number;
        release_date: any;
        first_air_date: any;
        poster_path: string | undefined;
        media_type: string;
      }) =>
        new Movie(
          entry.id,
          entry.title || entry.name || entry.original_title,
          "",
          entry.vote_average,
          undefined,
          entry?.release_date || entry?.first_air_date,
          undefined,
          undefined,
          entry.poster_path,
          entry.media_type == "tv" ? MovieType.TV : MovieType.MOVIE,
        ),
    );
  const movies = await Promise.all(
    moviesDirty.map((m: Movie) => fillInInfo(m)),
  );
  return movies;
}

async function fillInInfo(movie: Movie): Promise<Movie> {
  if ((movie.media_type == MovieType.MOVIE)) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?append_to_response=credits`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      },
    );
    const data = await response.json();
    const director = data.credits?.crew.find(
      (person: { job: string }) => person.job === "Director",
    );
    return movie.withDirector(director?.name);
  } else {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${movie.id}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      },
    );
    const data = await response.json();
    const creators = data.created_by
      .map((c: { name: string }) => c.name)
      .join(", ");
    return movie.withDirector(creators);
  }
}
