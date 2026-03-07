import { getCurrentUser, getUserMovies } from "@/app/lib/dal";
import MovieList from "@/components/ui/MovieList";

import SearchBox from "@/components/ui/SearchBox";
import EditMovie from "@/components/ui/EditMovieComp";
import SiteNav from "@/components/ui/SiteNav";
import { MovieLists } from "./utils/datatypes";

export default async function Page(props: {
  searchParams: Promise<{ movie?: string; list?: string }>;
}) {
  const searchParams = await props.searchParams;
  const user = await getCurrentUser();
  const currentMovies = (await getUserMovies()).filter(
    (m) => m.list == (searchParams.list ?? MovieLists.TO_WATCH),
  );
  const selectedMovie = searchParams.movie
    ? (currentMovies.find((m) => String(m.id) === searchParams.movie) ?? null)
    : null;

  return (
    <div className="flex flex-col h-screen">
      <SiteNav username={user.username} />
      <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
        <div className="mx-auto px-4 py-2 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold tracking-tight text-white">
            Search and add your movies
          </h1>
          <div className="mt-4">
            <SearchBox selectedList={ Number(searchParams.list) as MovieLists }/>
          </div>
        </div>
      </header>
      <section className="flex min-h-0">
        <main className="flex-1 overflow-y-scroll">
          <div>
            <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto ">
              <MovieList movies={currentMovies}></MovieList>
            </div>
          </div>
        </main>
        {selectedMovie && (
          <aside className="lg:w-1/4 max-w-1/3 p-2">
            <EditMovie {...selectedMovie} />
          </aside>
        )}
      </section>
    </div>
  );
}
