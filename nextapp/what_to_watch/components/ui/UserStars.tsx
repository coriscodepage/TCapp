"use client";
import { setUserRating } from "@/app/actions/movies";
import { PlainMovie } from "@/app/utils/datatypes";
import { useState, useTransition } from "react";
import FailureModal from "@/components/ui/FailureModal";

const STAR_PATH =
  "M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z";
const FILLED = "oklch(98.8% 0.003 106.5)";
const EMPTY = "oklch(28.6% 0.016 107.4)";

export default function UserStars(movie: PlainMovie) {
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [, startTransition] = useTransition();
  const currentStars = movie?.user_rating;
  const [optimisticStars, setOptimisticStars] = useState(currentStars);

  const displayStars = hoveredStars ?? (optimisticStars || 0);

  return (
    <div className="flex items-center ml-4 flex-col md:flex-row">
      {error && (
        <FailureModal message={error} onClose={() => setError(undefined)} />
      )}
      <div
        className="flex items-center md:space-x-1"
        onMouseLeave={() => setHoveredStars(null)}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            className="w-5 h-5 cursor-pointer transition-transform hover:scale-110"
            xmlns="http://www.w3.org/2000/svg"
            fill={displayStars >= i ? FILLED : EMPTY}
            viewBox="0 0 24 24"
            onMouseEnter={() => setHoveredStars(i)}
            onClick={() => {
              let n = i;
              i === optimisticStars ? (n = 0) : (n = i);
              setOptimisticStars(n);
              startTransition(async () => {
                const res = await setUserRating(movie, n);
                setError(res?.message);
              });
            }}
          >
            <path d={STAR_PATH} />
          </svg>
        ))}
      </div>
      <p className="ms-2 text-2xs md:text-sm font-medium">
        {optimisticStars === 0 ? "Not rated" : `${optimisticStars} out of 5`}
      </p>
    </div>
  );
}
