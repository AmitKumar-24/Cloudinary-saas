// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';

// const isPublicRoute = createRouteMatcher([
//     "/sign-in",
//     "/sign-up",
//     "/",
//     "/home",
//     "/social-share",  // Adding social share page
//     "/video-upload"   // Adding video upload page
// ])
// const isPublicApiRoute = createRouteMatcher([
//     "/api/videos",
//     "/api/image-upload"  // Adding image upload route
// ])


// export default clerkMiddleware(async (auth, req) => {
//     const { userId } = await auth();
//     // const { userId } = auth() ?? {};
//     // const { userId } = auth() as { userId?: string | undefined };
//     console.log("Authenticated user ID:", userId); // Debugging
//     const currentUrl = new URL(req.url)
//     const isAccessingDashboard = currentUrl.pathname === "/home"
//     const isApiRequest = currentUrl.pathname.startsWith("/api")

//     // If user is logged in and accessing a public route but not the dashboard
//     if (userId && isPublicRoute(req) && !isAccessingDashboard) {
//         return NextResponse.redirect(new URL("/home", req.url))
//     }
//     //not logged in
//     if (!userId) {
//         // If user is not logged in and trying to access a protected route
//         if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
//             return NextResponse.redirect(new URL("/sign-in", req.url))
//         }

//         // If the request is for a protected API and the user is not logged in
//         if (isApiRequest && !isPublicApiRoute(req)) {
//             return NextResponse.redirect(new URL("/sign-in", req.url))
//         }
//     }
//     return NextResponse.next()

// })

// export const config = {
//     matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };


import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes
const isPublicRoute = createRouteMatcher([
    "/sign-in", "/sign-up", "/"
    // , "/home", "/social-share", "/video-upload"
]);

// Define public API routes
const isPublicApiRoute = createRouteMatcher([
    "/api/videos", "/api/image-upload"
]);

export default clerkMiddleware(async (auth, req) => {
    const authData = await auth(); // Call the auth function to get the authentication data
    const userId = authData?.userId || null;

    console.log("Authenticated user ID:", userId); // Log to see if it’s working

    const currentUrl = new URL(req.url);
    // const isAccessingDashboard = currentUrl.pathname === "/home";
    const isAccessingDashboard = ["/home", "/social-share", "/video-upload"].includes(currentUrl.pathname);
    const isApiRequest = currentUrl.pathname.startsWith("/api");

    if (userId && isPublicRoute(req) && !isAccessingDashboard) {
        return NextResponse.redirect(new URL("/home", req.url));
    }

    if (!userId) {
        if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }

        if (isApiRequest && !isPublicApiRoute(req)) {
            return NextResponse.redirect(new URL("/sign-in", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
