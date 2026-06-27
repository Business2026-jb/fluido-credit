import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "fluido_session";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({
      where: { id: session.id },
    });

    return null;
  }

  if (!session.user.isActive || !session.user.emailVerified) {
    return null;
  }

  return session.user;
}

export async function getRequestInfo() {
  const headersList = await headers();

  const forwardedFor = headersList.get("x-forwarded-for");
  const ipAddress = forwardedFor?.split(",")[0]?.trim() || "unknown";

  const userAgent = headersList.get("user-agent") || "unknown";

  return {
    ipAddress,
    userAgent,
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return user;
}