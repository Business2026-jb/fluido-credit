import { NextResponse } from "next/server";
import webpush from "web-push";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT =
  process.env.VAPID_SUBJECT || "mailto:support@fluidocredit.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return NextResponse.json(
        { message: "Missing VAPID configuration." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const userId = String(body.userId || "").trim();
    const title = String(body.title || "Fluido Credit").trim();
    const message = String(body.message || "You have a new notification.").trim();
    const url = String(body.url || "/notifications").trim();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }

    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json({
        message: "No push subscription found for this user.",
        sent: 0,
      });
    }

    let sent = 0;
    let failed = 0;

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            JSON.stringify({
              title,
              body: message,
              url,
            })
          );

          sent++;
        } catch (error: any) {
          failed++;

          if (error?.statusCode === 404 || error?.statusCode === 410) {
            await prisma.pushSubscription.deleteMany({
              where: { endpoint: sub.endpoint },
            });
          }

          console.error("PUSH_SEND_ERROR:", error);
        }
      })
    );

    return NextResponse.json({
      message: "Push notification processed.",
      sent,
      failed,
    });
  } catch (error) {
    console.error("PUSH_SEND_ROUTE_ERROR:", error);

    return NextResponse.json(
      { message: "Unable to send push notification." },
      { status: 500 }
    );
  }
}