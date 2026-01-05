import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define paths
    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");
    const isApiRoute = pathname.startsWith("/api");
    const isPublicAsset = pathname.includes(".") || pathname.startsWith("/_next");

    // Get session token from cookies
    // Note: We configured cookiePrefix: "whatnow" in auth.ts
    const sessionToken = request.cookies.get("whatnow.session_token") || request.cookies.get("__Secure-whatnow.session_token");

    // 1. Protect core application routes (Home, etc.)
    // If trying to access protected route without token -> Redirect to Login
    if (!sessionToken && !isAuthRoute && !isApiRoute && !isPublicAsset) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Redirect authenticated users away from Auth pages
    // If has token and trying to access Login/Signup -> Redirect to Home
    if (sessionToken && isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (static files)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
