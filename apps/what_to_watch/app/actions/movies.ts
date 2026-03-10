"use server";

import { searchMovies, setMovie } from "@/app/utils/movies";
import { searchApi } from "@/app/utils/useApi";
import { Movie, MovieLists, PlainMovie } from "@/app/utils/datatypes";
import { revalidatePath } from "next/cache";
import {
  addUserMovie,
  deleteUserMovie,
  updateUserMovieList,
  updateUserMovieRating,
} from "@/app/utils/listDb";
import { verifySession } from "@/app/lib/dal";

export async function searchAndAddMovies(query: string, pageNumber?: number): Promise<PlainMovie[]> {
  const localMovies = await searchMovies(query);
  let apiMovies: Movie[] = [];
  if (localMovies.length < 5 && query.length > 1) {
    const apiMoviesNoDedup = await searchApi(query, pageNumber);
    try {
      await Promise.all(apiMoviesNoDedup.map((movie) => setMovie(movie)));
      apiMovies = apiMoviesNoDedup.filter(m => !localMovies.some(l => l.id === m.id))
    } catch {}
  }
  const a = localMovies.map((m) => ({ ...m })).slice(0, 20);
  const b = apiMovies.map((m) => ({ ...m })).slice(0, 20);
  return [...a, ...b];
}

export async function addMovieToList(
  movieId: number,
  list?: MovieLists,
): Promise<{ message: string } | undefined> {
  const user = await verifySession();
  try {
    await addUserMovie(user.userId, movieId, list);
    revalidatePath("/");
  } catch {
    return { message: "Could not add movie. It might be already added!" };
  }
}

export async function addRandomMovie(): Promise<
  { message: string } | undefined
> {
  const user = await verifySession();
  try {
    // addUserMovie(user.userId, movieId, list);
    revalidatePath("/");
  } catch {
    return { message: "Could not add movie" };
  }
}

export async function removeMovieFromList(movieId: number) {
  const user = await verifySession();
  try {
    await deleteUserMovie(user.userId, movieId);
    revalidatePath("/");
  } catch {
    return { message: "Could not delete movie" };
  }
}

export async function setUserRating(movie: PlainMovie, newRating: number) {
  const user = await verifySession();
  try {
    await updateUserMovieRating(user.userId, movie.id, newRating);
  } catch {
    return { message: "Could not update movie" };
  }
}

export async function setUserList(movieId: number, newList: MovieLists) {
  const user = await verifySession();
  try {
    await updateUserMovieList(user.userId, movieId, newList);
    revalidatePath("/");
  } catch {
    return { message: "Could not update movie" };
  }
}
