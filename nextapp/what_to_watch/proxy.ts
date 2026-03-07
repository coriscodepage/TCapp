import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";

const protectedRoutes = ["/", "/settings"];
const publicRoutes = ["/login", "/signup", "/unauth"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);


  const cookie = (await cookies()).get("session")?.value;

  try {
    const session = await decrypt(cookie);

    if (isProtectedRoute && !session?.id) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    return NextResponse.next();
  } catch {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
