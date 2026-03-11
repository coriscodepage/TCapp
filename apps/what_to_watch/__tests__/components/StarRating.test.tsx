import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserStars from "@/components/ui/UserStars";
import { Movie, MovieType } from "@/app/utils/datatypes";
import { setUserRating } from "@/app/actions/movies";

jest.mock("@/app/actions/movies", () => ({
  setUserRating: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

(describe("UserStars", () => {
  it("shows Not rated when stars is 0", () => {
    const testMovie = new Movie(
      550,
      "",
      "",
      0,
      0,
      "",
      "",
      undefined,
      undefined,
      MovieType.MOVIE,
    );
    render(<UserStars {...testMovie} />);
    expect(screen.getByText("Not rated")).toBeInTheDocument();
  });

  it("shows rating when stars is set", () => {
    const testMovie = new Movie(
      550,
      "",
      "",
      0,
      3,
      "",
      "",
      undefined,
      undefined,
      MovieType.MOVIE,
    );
    render(<UserStars {...testMovie} />);
    expect(screen.getByText("3 out of 5")).toBeInTheDocument();
  });

  it("updates display on click", async () => {
    const testMovie = new Movie(
      550,
      "",
      "",
      0,
      0,
      "",
      "",
      undefined,
      undefined,
      MovieType.MOVIE,
    );
    render(<UserStars {...testMovie} />);
    fireEvent.click(screen.getByTestId("star-3"));
    expect(await screen.findByText("3 out of 5")).toBeInTheDocument();
  });

  it("updates value on click", async () => {
    const testMovie = new Movie(
      550,
      "",
      "",
      0,
      0,
      "",
      "",
      undefined,
      undefined,
      MovieType.MOVIE,
    );
    render(<UserStars {...testMovie} />);
    fireEvent.click(screen.getByTestId("star-4"));
    await waitFor(() =>
      expect(setUserRating).toHaveBeenCalledWith(testMovie, 4),
    );
  });
}));