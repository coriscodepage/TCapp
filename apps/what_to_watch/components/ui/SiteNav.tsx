"use client";
import { MovieLists } from "@/app/utils/datatypes";
import Image from "next/image";
import Link from "next/link";
import { UserLogout } from "@/app/actions/auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const navigation = [
  { name: "To watch", list: MovieLists.TO_WATCH },
  { name: "Already watched", list: MovieLists.WATCHED },
  { name: "Settings", href: "/settings" },
];

export default function SiteNav({ username }: { username: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentList = Number(searchParams.get("list") ?? MovieLists.TO_WATCH);

  return (
    <nav className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Image
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <div className="ml-6 flex space-x-4">
              {navigation.map((item) => {
                const current = item.href
                  ? pathname === item.href
                  : pathname === "/" && item.list === currentList;
                return (
                  <Link
                    key={item.name}
                    href={(() => {
                      if (item.href) return item.href;
                      const params = new URLSearchParams(
                        searchParams.toString(),
                      );
                      params.set("list", String(item.list));
                      return `/?${params.toString()}`;
                    })()}
                    aria-current={current ? "page" : undefined}
                    className={`flex rounded-md px-3 py-2 text-xs sm:text-sm font-medium items-center text-center ${
                      current
                        ? "bg-gray-950/50 text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <form
              action={UserLogout}
              className="text-xs sm:text-sm ml-auto font-medium text-gray-300 flex"
            >
              <div className="text-gray-300 py-2 px-2 text-xs sm:text-sm font-medium ml-auto text-center">
                Welcome {username}!
              </div>
              <button type="submit" className="px-3 py-2 cursor-pointer bg-gray-900/50 rounded-md">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
