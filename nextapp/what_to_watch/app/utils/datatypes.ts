import * as z from "zod";
import type { JWTPayload } from "jose";

export class User {
  uuid: string;
  username: string;
  email: string;

  constructor(uuid: string, username: string, email: string) {
    this.uuid = uuid;
    this.username = username;
    this.email = email;
  }

  public isValid(): boolean {
    if (!this.uuid || !this.email) {
      return false;
    }
    return true;
  }
}

export class FullUser extends User {
  password_hash: string;

  constructor(
    uuid: string,
    username: string,
    email: string,
    password_hash: string,
  ) {
    super(uuid, username, email);
    this.password_hash = password_hash;
  }

  public override isValid(): boolean {
    return super.isValid() && !!this.password_hash;
  }
}

export enum MovieLists {
  TO_WATCH = 0,
  WATCHED = 1,
}

export enum MovieType {
  TV = 0,
  MOVIE = 1,
}

export class Movie {
  id: number;
  title: string;
  director: string;
  rating: number;
  user_rating: number | undefined;
  release_date: string;
  added_date: string | undefined;
  list: MovieLists | undefined;
  poster_url: string | undefined;
  media_type: MovieType;

  constructor(
    id: number,
    title: string,
    director: string,
    rating: number,
    user_rating: number | undefined,
    release_date: string,
    added_date: string | undefined,
    list: MovieLists | undefined,
    poster_url: string | undefined,
    media_type: MovieType,
  ) {
    this.id = id;
    this.title = title;
    this.director = director;
    this.rating = rating;
    this.user_rating = user_rating;
    this.release_date = release_date;
    this.added_date = added_date;
    this.list = list;
    this.poster_url = poster_url;
    this.media_type = media_type;
  }

  withDirector(director: string): Movie {
    return new Movie(this.id, this.title, director, this.rating, this.user_rating, this.release_date, this.added_date, this.list, this.poster_url, this.media_type);
  }
}

export type PlainMovie = Omit<Movie, 'withDirector'>


export const passwordRules = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "At least one letter", test: (v: string) => /[a-zA-Z]/.test(v) },
  {
    label: "At least one uppercase letter",
    test: (v: string) => /[A-Z]/.test(v),
  },
  { label: "At least one number", test: (v: string) => /[0-9]/.test(v) },
  {
    label: "At least one special character",
    test: (v: string) => /[^a-zA-Z0-9]/.test(v),
  },
] as const;

export const passwordSchema = passwordRules.reduce(
  (schema, rule) => schema.refine(rule.test, { message: rule.label }),
  z.string().trim() as z.ZodType<string>,
);

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters long." })
    .trim(),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: passwordSchema,
});

export type SignupFormData = z.infer<typeof SignupFormSchema>;

export const LoginFormSchema = z.object({
  email: z
    .email({
      error: "Please enter a valid email.",
    })
    .trim(),
  password: z
    .string({
      error: "Invalid password.",
    })
    .trim(),
});

export interface SessionPayload extends JWTPayload {
  id: string;
  email: string;
}

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
