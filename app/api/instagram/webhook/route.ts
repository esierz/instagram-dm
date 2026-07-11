import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === process.env.INSTAGRAM_VERIFY_TOKEN &&
    challenge
  ) {
    console.log("WEBHOOK_VERIFIED");

    return new NextResponse(challenge, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  return NextResponse.json(
    { error: "Webhook verification failed" },
    { status: 403 },
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Instagram webhook received:");
    console.dir(body, { depth: null });

    // Acknowledge the webhook quickly so Meta does not retry it.
    return new NextResponse("EVENT_RECEIVED", { status: 200 });
  } catch (error) {
    console.error("Unable to process Instagram webhook:", error);

    return NextResponse.json(
      { error: "Invalid webhook payload" },
      { status: 400 },
    );
  }
}