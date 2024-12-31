import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  console.log("Middleware - User Token:", token); // Log para inspección

  if (!token) {
    console.log("Middleware - No Token Found");
    return NextResponse.redirect(new URL("/", req.url));
  }

  console.log("Middleware - User Role:", token.role);

  if (req.nextUrl.pathname === "/" && token.role !== "user") {
    // Redirige a dashboard si no es usuario regular
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/dashboard") && token.role === "user") {
    console.log("Middleware - Redirecting to /home");
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/home") && token.role !== "user") {
    console.log("Middleware - Redirecting to /dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  console.log("Middleware - No Redirect Needed");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/home/:path*"],
};
