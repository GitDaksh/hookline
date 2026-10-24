import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only the signed-in pages. Public pages skip this, so they stay fast and can be cached.
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};
