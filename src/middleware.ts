import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/(en|bn|fr|ar|ur|hi|zh)',
  '/(en|bn|fr|ar|ur|hi|zh)/sign-in(.*)',
  '/(en|bn|fr|ar|ur|hi|zh)/sign-up(.*)',
  '/test'
]);

export default clerkMiddleware((auth, req: NextRequest) => {
  // Handle root route redirect first
  if (req.nextUrl.pathname === '/') {
    const locale = 'en'; // Default locale
    const redirectUrl = new URL(`/${locale}`, req.url);
    return NextResponse.redirect(redirectUrl, 307);
  }

  // Apply auth protection for non-public routes
  if (!isPublicRoute(req)) {
    auth().protect();
  }

  // Continue with normal routing
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ],
};
