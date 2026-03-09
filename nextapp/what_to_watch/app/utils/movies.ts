"use server";

import { User, AppError, Movie, MovieType } from "./datatypes";
import sql from "@/app/utils/db";
import "server-only";

export async function getMovie(id: string): Promise<Movie> {
  let entries = await sql`
    select
      id,
      title,
      director,
      release_date,
      rating,
      poster_url,
      media_type
    from movies
    where id = ${id}
    `;

  let entry = entries.at(0);
  if (!entry) {
    throw new AppError("Movie not found", "MOVIE_NOT_FOUND");
  }
  let movie = new Movie(
    entry.id,
    entry.title,
    entry.director,
    entry.rating,
    undefined,
    entry.release_date,
    undefined,
    undefined,
    entry.poster_url,
    entry.media_type,
  );
  return movie;
}

export async function searchMovies(title: string): Promise<Movie[]> {
  const pattern = `${title}%`;
  let entries = await sql`
    select
      id,
      title,
      director,
      release_date,
      rating,
      poster_url,
      media_type
    from movies
    where lower(title) like lower(${pattern})
    `;

  const movies = entries.map(
    (entry) =>
      new Movie(
        entry.id,
        entry.title,
        entry.director,
        entry.rating,
        undefined,
        entry.release_date,
        undefined,
        undefined,
        entry.poster_url,
        entry.media_type,
      ),
  );
  return movies;
}

export async function setMovie(movie: Movie) {
  if (!movie.id || !movie.title || movie.media_type === undefined) {
    return;
  }
  await sql`
    insert into movies (id, title, director, release_date, rating, poster_url, media_type)
    values (${movie.id}, ${movie.title}, ${movie.director || null}, ${movie.release_date}, ${movie.rating}, ${movie.poster_url || null}, ${movie.media_type == MovieType.MOVIE ? true : false})
    on conflict (id) do nothing
    returning id;
  `;
}
