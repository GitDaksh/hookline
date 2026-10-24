import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseConfig } from "@/lib/auth/config";
import { signInPath } from "@/lib/auth/redirects";

/**
 * Runs before every signed-in page (see src/proxy.ts). It refreshes the session when it has
 * expired, saves the new cookies, and sends anyone who isn't signed in to the sign-in page.
 *
 * It's a quick first check only. Pages still check the session themselves before showing anything.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const config = getSupabaseConfig();
  if (!config) return redirectToSignIn(request, response);

  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        // Hand the fresh cookies to the page that's about to render…
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        // …and send them back to the browser, with headers that stop anything caching them.
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
      },
    },
  });

  // Keep this right after creating the client: it's the call that refreshes an expired session.
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) return response;

  return redirectToSignIn(request, response);
}

function redirectToSignIn(request: NextRequest, response: NextResponse) {
  // Form posts check the session themselves, and can't follow a redirect anyway.
  if (request.method !== "GET" && request.method !== "HEAD") return response;

  const { pathname, searchParams } = request.nextUrl;
  const params = new URLSearchParams(searchParams);
  params.delete("_rsc"); // Next.js adds this to in-app navigations
  const query = params.size > 0 ? `?${params}` : "";
  const redirect = NextResponse.redirect(new URL(signInPath(`${pathname}${query}`), request.url));

  // Keep any cookie changes (like clearing a session that no longer works) and the no-cache headers.
  for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = response.headers.get(header);
    if (value) redirect.headers.set(header, value);
  }
  return redirect;
}
