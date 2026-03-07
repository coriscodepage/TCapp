"use client";

import { useActionState, useState } from "react";
import { UserSignup } from "@/app/actions/auth";
import { passwordRules } from "@/app/utils/datatypes";

export default function Page() {
  const [state, action, pending] = useActionState(UserSignup, undefined);
  const [password, setPassword] = useState("");

  return (
    <>
      <h2 className="mb-6">Register your account</h2>
      <form action={action} className="space-y-4" onSubmit={() => setPassword("")}>
        <div>
          <label htmlFor="name">Name</label>
          <div className="mt-2">
            <input id="name" name="name" type="text" placeholder="Name" />
          </div>
          <p aria-live="polite" className="err">
            {state?.errors?.name}
          </p>
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <div className="mt-2">
            <input id="email" name="email" type="email" placeholder="Email" />
          </div>
          <p aria-live="polite" className="err">
            {state?.errors?.email}
          </p>
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="min-h-lh mt-1">
            <p className="text-sm">Password must have:</p>
            <ul className="list-disc pl-8">
              {passwordRules.map(({ label, test }) => {
                const passed = password.length > 0 && test(password);
                const failed = (password.length > 0 && !passed) || (state?.errors?.password);
                return (
                  <li
                    key={label}
                    className={`text-sm 
                      ${passed ? "text-green-600" : failed ? "err" : "text-muted"}
                    `}
                  >
                    {label}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <p aria-live="polite" className="err">
          {state?.message}
        </p>

        <button disabled={pending} type="submit">
          Sign Up
        </button>
      </form>

      <p className="mt-10 text-center text-sm/6 text-white">
        Already a member? <a href="/login">Log in!</a>
      </p>
    </>
  );
}
