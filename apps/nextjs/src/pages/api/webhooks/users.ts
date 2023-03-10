import { IncomingHttpHeaders } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { buffer } from "micro";
import { env } from "src/env/server.mjs";
import { upsert } from "src/server/userRepo";

// Disable the bodyParser so we can access the raw
// request body for verification.
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret: string = env.WEBHOOK_SECRET;

export default async function handler(
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse,
) {
  // Verify the webhook signature
  // See https://docs.svix.com/receiving/verifying-payloads/how
  const payload = (await buffer(req)).toString();
  const headers = req.headers;
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payload, headers) as Event;
  } catch (_) {
    return res.status(400).json({});
  }

  // Handle the webhook
  const eventType: EventType = evt.type;
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, ...attributes } = evt.data;
    if (id) {
      const response = await upsert(`${id}`, attributes);
      switch (response) {
        case "created":
          res.json({ message: "User created" });
          break;
        case "updated":
          res.json({ message: "User updated" });
          break;
        case "skipped":
          res.json({ message: "User skipped" });
          break;
      }
    } else {
      res.json({ message: "User ID missing" });
    }
  } else {
    res.json({ message: "Unhandled event" });
  }
}

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};

// Generic (and naive) way for the Clerk event
// payload type.
type Event = {
  data: Record<string, string | number>;
  object: "event";
  type: EventType;
};

type EventType = "user.created" | "user.updated" | "*";
