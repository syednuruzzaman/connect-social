import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/social',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/comments(.*)',
  '/api/posts(.*)'
]);

export default clerkMiddleware((auth, req) => {
  // Skip protection for public routes
  if (isPublicRoute(req)) {
    return;
  }

  try {
    // Protect private routes
    auth().protect();
  } catch (error) {
    console.error('Middleware authentication error:', error);
    
    // In production, handle gracefully
    if (process.env.NODE_ENV === 'production') {
      // Redirect to sign-in for authentication errors
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return Response.redirect(signInUrl);
    }
    
    // Re-throw in development for debugging
    throw error;
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ],
};
