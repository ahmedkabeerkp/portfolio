import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Used in Server Components / Route Handlers (public pages, admin data loaders).
// Reads the user's session from cookies so Supabase RLS knows whether they're
// the authenticated admin or an anonymous visitor.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component — safe to ignore because
            // middleware refreshes the session on every request anyway.
          }
        },
      },
    }
  );
}
