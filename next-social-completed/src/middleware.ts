import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/settings(.*)",
  "/",
  "/people",
  "/messages(.*)",
  "/notifications",
  "/profile(.*)",
  "/api/notifications(.*)",
  "/api/upload",
  "/api/user(.*)",
  "/api/create-user",
  "/api/check-user",
  "/api/users(.*)"
]);

export default clerkMiddleware((auth, req) => {
  // Protect routes that require authentication
  if (isProtectedRoute(req)) auth().protect();
  
  console.log("Authentication enabled for protected routes:", req.url);
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
