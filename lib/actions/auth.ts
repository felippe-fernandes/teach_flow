"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth, signIn, signOut } from "@/lib/auth";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

    return result;
  } catch (error: any) {
    if (error.type === "CredentialsSignin") {
      return { error: "Email ou senha inválidos" };
    }
    throw error;
  }
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const phoneNumber = formData.get("phone_number") as string | null;
  const timezone = formData.get("timezone") as string;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Usuário já existe com este email" };
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone_number: phoneNumber && phoneNumber.trim() !== "" ? phoneNumber : null,
        timezone: timezone || "America/Sao_Paulo",
        default_currency: "BRL",
      },
    });

    // Auto sign in after signup
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return { error: error.message || "Falha ao criar conta" };
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function getUser() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      timezone: user.timezone,
      default_currency: user.default_currency,
      two_factor_enabled: user.two_factor_enabled,
      google_calendar_sync: user.google_calendar_sync,
      google_access_token: user.google_access_token,
      google_refresh_token: user.google_refresh_token,
      google_token_expiry: user.google_token_expiry,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export async function updateUserProfile(formData: FormData) {
  try {
    const user = await getUser();
    if (!user) {
      return { error: "Usuário não autenticado" };
    }

    const timezone = formData.get("timezone") as string;
    const defaultCurrency = formData.get("default_currency") as string;
    const name = formData.get("name") as string;
    const phoneNumber = formData.get("phone_number") as string;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phoneNumber !== undefined) updateData.phone_number = phoneNumber || null;
    if (timezone) updateData.timezone = timezone;
    if (defaultCurrency) updateData.default_currency = defaultCurrency;

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return { error: error.message || "Erro ao atualizar perfil" };
  }
}

export async function getLinkedProviders() {
  try {
    const user = await getUser();
    if (!user) {
      return [];
    }

    const accounts = await prisma.account.findMany({
      where: { userId: user.id },
      select: { provider: true },
    });

    return accounts.map((account) => ({
      provider: account.provider,
    }));
  } catch (error) {
    console.error("Error getting linked providers:", error);
    return [];
  }
}

export async function linkGoogleProvider() {
  try {
    await signIn("google", {
      redirectTo: "/dashboard/profile",
    });
  } catch (error: any) {
    console.error("Error linking Google provider:", error);
    return { error: error.message || "Erro ao vincular conta Google" };
  }
}

export async function unlinkProvider(provider: string) {
  try {
    const user = await getUser();
    if (!user) {
      return { error: "Usuário não autenticado" };
    }

    // Delete the account link
    await prisma.account.deleteMany({
      where: {
        userId: user.id,
        provider: provider,
      },
    });

    // If unlinking Google, clear Google Calendar tokens
    if (provider === "google") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          google_access_token: null,
          google_refresh_token: null,
          google_token_expiry: null,
          google_calendar_sync: false,
        },
      });
    }

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Error unlinking provider:", error);
    return { error: error.message || "Erro ao desvincular conta" };
  }
}
