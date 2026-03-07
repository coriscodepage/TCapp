import sql from "@/app/utils/db";
import { AppError, Movie, MovieLists, MovieType } from "@/app/utils/datatypes";

export async function getUsersMovies(id: string): Promise<Movie[]> {
  const entries = await sql`
    select
      movie.id,
      movie.title,
      movie.director,
      movie.rating,
      movie.release_date,
      movie.poster_url,
      movie.media_type,
      uasoc.user_rating,
      uasoc.added_at,
      uasoc.in_list_number
    from user_movies_asoc uasoc
    join movies movie ON movie.id = uasoc.movie_id
    where uasoc.user_id = ${id}
  `;

  return entries.map(
    (e) =>
      new Movie(
        e.id,
        e.title,
        e.director,
        e.rating,
        e.user_rating,
        e.release_date,
        e.added_at,
        e.in_list_number as MovieLists,
        e.poster_url,
        e.media_type as MovieType,
      ),
  );
}

export async function addUserMovie(
  userId: string,
  movieId: number,
  list: MovieLists = MovieLists.TO_WATCH,
) {
  const entries = await sql`
    insert into user_movies_asoc (user_id, movie_id, in_list_number)
    values (${userId}, ${movieId}, ${list})
    on conflict do nothing
    returning user_id
  `;

  if (!entries.at(0)) {
    throw new AppError("Could not add movie to list", "MOVIE_ASSOC_ADD_ERR");
  }
}

export async function deleteUserMovie(userId: string, movieId: number) {
  const entries = await sql`
    delete from user_movies_asoc
    where user_id = ${userId} and movie_id = ${movieId}
    returning user_id
  `;

  if (!entries.at(0)) {
    throw new AppError("Could not delete movie", "MOVIE_ASSOC_DEL_ERR");
  }
}

export async function updateUserMovieRating(
  userId: string,
  movieId: number,
  newRating: number,
) {
  let entries = await sql`
      update user_movies_asoc
      set user_rating = ${newRating}
      where user_id = ${userId} and movie_id = ${movieId}
      returning id
    `;

  if (!entries.at(0)) {
    throw new AppError(
      "Could not update movie user rating",
      "MOVIE_ASSOC_UPDATE_ERR",
    );
  }
}

export async function updateUserMovieList(
  userId: string,
  movieId: number,
  newList: MovieLists,
) {
  const entries = await sql`
    update user_movies_asoc
    set in_list_number = ${newList === MovieLists.TO_WATCH ? 0 : 1}
    where user_id = ${userId}
    and movie_id = ${movieId}
    returning user_id
  `;

  if (!entries.at(0)) {
    throw new AppError("Could not update movie list", "MOVIE_ASSOC_UPDATE_ERR");
  }
}
