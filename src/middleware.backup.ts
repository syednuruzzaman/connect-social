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
  // Simplified middleware for production debugging
  if (process.env.NODE_ENV === 'production') {
    // In production, make most routes public temporarily for debugging
    console.log('Production mode: allowing request to', req.url);
    return;
  }
  
  // Development mode - normal protection
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ],
};
