/**
 * Next.js API proxy for Better Auth
 * All /api/auth/* requests are proxied to the backend server-to-server
 * This eliminates CORS issues since requests go server-to-server
 */
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

async function handler(req: NextRequest) {
  const path = req.nextUrl.pathname; // e.g. /api/auth/sign-up/email
  const url = `${BACKEND_URL}${path}${req.nextUrl.search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    // Skip hop-by-hop headers
    if (!['host', 'connection', 'transfer-encoding'].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  // Set host and origin to backend so better-auth trusts the request
  headers.set('host', new URL(BACKEND_URL).host);
  headers.set('origin', BACKEND_URL);

  const body = req.method !== 'GET' && req.method !== 'HEAD'
    ? await req.arrayBuffer()
    : undefined;

  const response = await fetch(url, {
    method: req.method,
    headers,
    body: body ? Buffer.from(body) : undefined,
  });

  const responseHeaders = new Headers();
  response.headers.forEach((value, key) => {
    // Forward all headers including Set-Cookie for session
    responseHeaders.set(key, value);
  });

  // Explicitly copy all Set-Cookie headers (fetch merges them)
  const setCookieValues = response.headers.getSetCookie?.() ?? [];
  if (setCookieValues.length > 0) {
    responseHeaders.delete('set-cookie');
    const res = new NextResponse(await response.arrayBuffer(), {
      status: response.status,
      headers: responseHeaders,
    });
    setCookieValues.forEach(cookie => res.headers.append('set-cookie', cookie));
    return res;
  }

  const responseBody = await response.arrayBuffer();
  return new NextResponse(responseBody, {
    status: response.status,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;

