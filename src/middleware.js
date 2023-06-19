import { NextResponse } from "next/server";
import cookieKeys from "./constants/cookieKeys";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const userToken = request.cookies.get(cookieKeys.JWT);
  const pathName = request.nextUrl.pathname;

  //  userToken exists
  if (userToken) {
    // on auth router
    if (pathName.includes("/auth")) {
      return NextResponse.redirect(new URL("/home", request.nextUrl));
    }
    // on other router
    else {
      return NextResponse.next();
    }
  }
  // userToken does not exist
  else {
    // on auth router
    if (pathName.includes("/auth")) {
      return NextResponse.next();
    }
    // on other router
    else {
      return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
    }
  }
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/profile/:path*",
    "/connections/:path*",
    "/home/:path*",
    "/messages/:path*",
  ],
};
