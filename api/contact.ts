import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const TURNSTILE_SECRET =
  process.env.NODE_ENV !== "production"
    ? "1x0000000000000000000000000000000AA"
    : (process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
      "1x0000000000000000000000000000000AA");

const RESEND_API_KEY = process.env.RESEND_API_KEY;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  try {
    const body = new URLSearchParams({
      secret: TURNSTILE_SECRET,
      response: token,
      ...(ip ? { remoteip: ip } : {}),
    });

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body,
      },
    );

    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const { name, email, phone, services, description, turnstileToken } =
    (req.body ?? {}) as {
      name?: string;
      email?: string;
      phone?: string;
      services?: string[];
      description?: string;
      turnstileToken?: string;
    };

  if (
    !name ||
    !email ||
    !phone ||
    !services?.length ||
    !description ||
    !turnstileToken
  ) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ||
    (req.headers["x-real-ip"] as string | undefined) ||
    undefined;

  const valid = await verifyTurnstile(turnstileToken, ip);
  if (!valid) {
    res.status(400).json({ error: "Security check failed. Please try again." });
    return;
  }

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    res.status(500).json({ error: "Email service is not configured." });
    return;
  }

  const resend = new Resend(RESEND_API_KEY);
  const servicesList = Array.isArray(services)
    ? services.join(", ")
    : String(services);

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeServicesList = escapeHtml(servicesList);
  const safeDescription = escapeHtml(description);

  const htmlBody = `
    <h2>New Studios inquiry from ${safeName}</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr><td style="padding:6px 12px;color:#666;font-weight:600;">Name</td><td style="padding:6px 12px;">${safeName}</td></tr>
      <tr><td style="padding:6px 12px;color:#666;font-weight:600;">Email</td><td style="padding:6px 12px;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
      <tr><td style="padding:6px 12px;color:#666;font-weight:600;">Phone</td><td style="padding:6px 12px;">${safePhone}</td></tr>
      <tr><td style="padding:6px 12px;color:#666;font-weight:600;">Services</td><td style="padding:6px 12px;">${safeServicesList}</td></tr>
      <tr><td style="padding:6px 12px;color:#666;font-weight:600;vertical-align:top;">Description</td><td style="padding:6px 12px;white-space:pre-wrap;">${safeDescription}</td></tr>
    </table>
  `;

  const textBody = [
    `New Studios inquiry from ${name}`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Services: ${servicesList}`,
    ``,
    `Description:`,
    description,
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from: "TRL Studios <onboarding@resend.dev>",
      to: "victor@theremotelifestyle.com",
      subject: `New Studios inquiry from ${name}`,
      html: htmlBody,
      text: textBody,
    });

    if (error) {
      console.error("Failed to send email via Resend", error);
      res.status(500).json({ error: "Failed to send email. Please try again." });
      return;
    }
  } catch (err) {
    console.error("Exception sending email via Resend", err);
    res.status(500).json({ error: "Failed to send email. Please try again." });
    return;
  }

  res.status(200).json({ ok: true });
}
