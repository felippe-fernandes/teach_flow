import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const existingUser = await prisma.user.findUnique({
        where: { supabase_auth_id: data.user.id },
      });

      if (!existingUser) {
        try {
          // Try to get timezone from cookie (set by client before OAuth redirect)
          const cookies = request.headers.get("cookie") || "";
          const timezoneCookie = cookies
            .split(";")
            .find((c) => c.trim().startsWith("user_timezone="));
          const timezone = timezoneCookie
            ? decodeURIComponent(timezoneCookie.split("=")[1])
            : "America/Sao_Paulo";

          // Determine name from OAuth provider metadata
          const name = data.user.user_metadata?.name ||
                       data.user.user_metadata?.full_name ||
                       data.user.email?.split("@")[0] ||
                       "User";

          await prisma.user.create({
            data: {
              supabase_auth_id: data.user.id,
              email: data.user.email!,
              name: name,
              google_id: data.user.app_metadata?.provider === "google" ? data.user.user_metadata?.sub : undefined,
              timezone: timezone,
              default_currency: "BRL",
            },
          });

          console.log("User created successfully in database:", data.user.email);
        } catch (createError) {
          console.error("Error creating user in database:", createError);
          // Continue anyway - user exists in Supabase auth
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=authentication_failed`);
}
