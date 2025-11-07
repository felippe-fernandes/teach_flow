"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        name: formData.get("name") as string,
      },
    },
  };

  const { data: authData, error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  // Check if email confirmation is required
  const emailConfirmationRequired = authData.user && !authData.user.email_confirmed_at;

  if (authData.user && !emailConfirmationRequired) {
    // User is auto-confirmed (e.g., via OAuth or email confirmation disabled)
    try {
      const phoneNumber = formData.get("phone_number") as string | null;
      const timezone = formData.get("timezone") as string;

      console.log("Creating user in database...", {
        supabase_auth_id: authData.user.id,
        email: authData.user.email,
        name: formData.get("name"),
      });

      await prisma.user.create({
        data: {
          supabase_auth_id: authData.user.id,
          email: authData.user.email!,
          name: formData.get("name") as string,
          phone_number: phoneNumber && phoneNumber.trim() !== "" ? phoneNumber : null,
          timezone: timezone || "America/Sao_Paulo", // Fallback to Brazil timezone
          default_currency: "BRL", // Default to Brazilian Real
        },
      });

      console.log("User created successfully in database");
    } catch (error) {
      console.error("Error creating user in database:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      // Delete the auth user if database insert fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return { error: `Failed to create user profile: ${error instanceof Error ? error.message : "Unknown error"}` };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  // If email confirmation is required, return success without redirecting
  if (emailConfirmationRequired) {
    return { success: true };
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function loginWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function linkGoogleProvider() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.linkIdentity({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/dashboard/profile`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { success: true };
}

export async function unlinkProvider(provider: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get all identities to ensure user has at least 2 before unlinking
  const identities = user.identities || [];

  if (identities.length <= 1) {
    return { error: "Você deve manter pelo menos um método de login ativo" };
  }

  const identity = identities.find(id => id.provider === provider);

  if (!identity) {
    return { error: "Provedor não encontrado" };
  }

  const { error } = await supabase.auth.unlinkIdentity(identity);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function getLinkedProviders() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  return user.identities || [];
}


export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  let dbUser = await prisma.user.findUnique({
    where: { supabase_auth_id: user.id },
  });

  // If user exists in Supabase Auth but not in Prisma, create them
  if (!dbUser && user.email) {
    try {
      const name = user.user_metadata?.name ||
                   user.user_metadata?.full_name ||
                   user.email.split("@")[0] ||
                   "User";

      dbUser = await prisma.user.create({
        data: {
          supabase_auth_id: user.id,
          email: user.email,
          name: name,
          google_id: user.app_metadata?.provider === "google" ? user.user_metadata?.sub : undefined,
          timezone: "America/Sao_Paulo",
          default_currency: "BRL",
        },
      });

      console.log("User synced from Supabase Auth to database:", user.email);
    } catch (error) {
      console.error("Error syncing user to database:", error);
      return null;
    }
  }

  return dbUser;
}
