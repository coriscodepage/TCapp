"use client";

import { useActionState } from "react";
import { LoginUser } from "@/app/actions/auth";

export default function Page() {
  const [state, formAction, pending] = useActionState(LoginUser, null);
  return (
    <>
      <h2 className="mb-6">Sign in to your account</h2>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email">Email</label>
          <div className="mt-2">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
            />
          </div>
          <p aria-live="polite" className="err">
            {state?.errors?.email}
          </p>
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <div className="mt-2">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>
          <p aria-live="polite" className="err min-h-lh">
            {state?.message || state?.errors?.password}
          </p>
        </div>

        <button disabled={pending}>Sign in</button>
      </form>

      <p className="mt-10 text-center text-sm/6 text-white">
        Not a member? <a href="/signup">Join now!</a>
      </p>
    </>
  );
}
