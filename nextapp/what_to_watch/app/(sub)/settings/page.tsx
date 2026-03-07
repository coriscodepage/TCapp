"use client";

import SiteNav from "@/components/ui/SiteNav";
import { useActionState, useEffect, useState } from "react";
import { EditUser, fetchCurrentUser } from "@/app/actions/auth";
import { Button } from "@headlessui/react";
import DeleteModal from "@/components/ui/DeleteModal";
import { deleteUser } from "@/app/utils/users";
import { User } from "@/app/utils/datatypes";

export default function Page() {
  const [state, action, pending] = useActionState(EditUser, undefined);
  const [user, setUser] = useState<{ username: string; uuid: string } | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchCurrentUser()
      .then((user) => setUser({ username: user.username, uuid: user.uuid }))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading)
    return <div className="flex flex-col h-screen">Loading...</div>;

  return (
    <div className="flex flex-col h-screen items-center">
      <section className="w-full">
        <SiteNav username={user?.username ?? ""} />
        <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
          <div className="mx-auto px-4 py-2 sm:px-6 lg:px-8">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Edit account settings
            </h1>
          </div>
        </header>
      </section>
      <main className="auth-layout sm:w-full sm:max-w-sm ">
        <h2 className="mb-6">Edit your account</h2>
        <form action={action} className="space-y-4">
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
              />
            </div>
            <div className="min-h-lh mt-1">
              {state?.errors?.password && (
                <p className="text-sm err">Password must have:</p>
              )}
              <ul className="list-disc pl-8">
                {(state?.errors?.password ?? []).map((label) => {
                  return (
                    <li key={label} className={`text-sm err`}>
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
          <Button onClick={() => setOpen(true)}>Delete account</Button>
        </p>
      </main>
      <div className="flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full justify-center">
        {open && (
          <DeleteModal
            message="Are you sure you want to delete your account?"
            onConfirm={() => {
              // user?.uuid && deleteUser(user?.uuid);
              setOpen(false);
            }}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
