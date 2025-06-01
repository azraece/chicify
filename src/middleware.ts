import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export function middleware(request: NextRequest) {
  const start = Date.now();
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  
  // Log incoming request
  logger.info('Incoming request', {
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    requestId,
    timestamp: new Date().toISOString()
  });

  // Clone the request to add request ID header
  const response = NextResponse.next();
  
  // Add request ID to response headers for debugging
  response.headers.set('x-request-id', requestId);
  
  // Log response (this runs after the route handler)
  const duration = Date.now() - start;
  logger.info('Request completed', {
    method: request.method,
    url: request.url,
    status: response.status,
    duration: `${duration}ms`,
    requestId
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 