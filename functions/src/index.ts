// functions/src/index.ts

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";

import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import OpenAI from "openai";

/* -------------------------------------------------------------------------- */
/*  0) INITIALIZATION + GLOBAL OPTIONS                                        */
/* -------------------------------------------------------------------------- */

if (!admin.apps.length) {
  admin.initializeApp();
}

// Set your default region and declare secrets once
setGlobalOptions({
  region: "us-central1",
  secrets: ["OPENAI_API_KEY", "EMAIL_USER", "EMAIL_PASS"],
});

/* -------------------------------------------------------------------------- */
/*  OpenAI (optional)                                                         */
/* -------------------------------------------------------------------------- */

const openai =
  process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

/* -------------------------------------------------------------------------- */
/*  1) VERIFY DATASET AI (strict checks + optional AI summary)                */
/* -------------------------------------------------------------------------- */

interface VerifyAIRequest {
  userId: string;
  partnerName: string;
  dataTypes?: string[];
}

type Dataset = {
  name: string;
  size?: number; // bytes
  category?: string;
  storagePath?: string;
};

const EXT_WHITELIST: Record<string, string[]> = {
  "Travel Preferences": ["csv", "xlsx", "xls", "pdf", "txt"],
  Location: ["csv", "xlsx", "xls", "json", "txt"],
  "Booking History": ["csv", "xlsx", "xls", "pdf"],
};

const MIN_SIZE_BYTES = 500;
const MAX_SIZE_BYTES = 20 * 1024 * 1024;

function extFromName(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx >= 0 ? filename.slice(idx + 1).toLowerCase() : "";
}

function validateDatasetAgainstCategory(ds: Dataset, category: string) {
  const reasons: string[] = [];
  const ext = extFromName(ds.name || "");

  const allowed = EXT_WHITELIST[category] || [];
  if (!allowed.includes(ext)) {
    reasons.push(
      `File "${ds.name}" has extension ".${ext}". Allowed for ${category}: ${allowed.join(", ")}`
    );
  }

  const sz = typeof ds.size === "number" ? ds.size : undefined;
  if (sz !== undefined) {
    if (sz < MIN_SIZE_BYTES) reasons.push(`"${ds.name}" is too small (${sz} bytes).`);
    if (sz > MAX_SIZE_BYTES)
      reasons.push(`"${ds.name}" is too large (${sz} bytes > ${MAX_SIZE_BYTES}).`);
  }

  if (ds.category && ds.category !== category) {
    reasons.push(`"${ds.name}" labeled "${ds.category}" not "${category}".`);
  }

  return { ok: reasons.length === 0, reasons };
}

export const verifyDatasetAI = onCall<VerifyAIRequest>(async (request) => {
  const { userId, partnerName } = request.data || ({} as VerifyAIRequest);
  const db = admin.firestore();

  if (!userId || !partnerName) {
    throw new HttpsError("invalid-argument", "Missing userId or partnerName.");
  }

  const partnerRef = db
    .collection("users")
    .doc(userId)
    .collection("partners")
    .doc(partnerName);

  const snap = await partnerRef.get();
  if (!snap.exists) {
    throw new HttpsError("not-found", `Partner ${partnerName} not found for user`);
  }

  const partnerData = snap.data() || {};
  const requiredDataTypes: string[] =
    partnerData.requiredDataTypes || request.data?.dataTypes || [];
  const sharedDatasets: Dataset[] = Array.isArray(partnerData.sharedDatasets)
    ? partnerData.sharedDatasets
    : [];

  if (!requiredDataTypes.length) {
    return {
      success: false,
      aiDecision: "Failed",
      code: "MISSING_REQUIREMENTS",
      reasons: ["Partner is missing requiredDataTypes in Firestore."],
    };
  }

  if (!sharedDatasets.length) {
    return {
      success: false,
      aiDecision: "Failed",
      code: "NO_FILES",
      reasons: ["No datasets shared for verification."],
    };
  }

  const perCategoryReasons: Record<string, string[]> = {};
  const perCategoryOK: Record<string, boolean> = {};

  for (const cat of requiredDataTypes) {
    const inCat = sharedDatasets.filter(
      (d) => (d.category || "").toLowerCase() === cat.toLowerCase()
    );

    if (!inCat.length) {
      perCategoryOK[cat] = false;
      perCategoryReasons[cat] = [`No file provided for required category "${cat}".`];
      continue;
    }

    let anyOK = false;
    const reasons: string[] = [];
    for (const ds of inCat) {
      const res = validateDatasetAgainstCategory(ds, cat);
      if (res.ok) anyOK = true;
      else reasons.push(...res.reasons);
    }
    perCategoryOK[cat] = anyOK;
    if (!anyOK && reasons.length) perCategoryReasons[cat] = reasons;
  }

  const allOK = requiredDataTypes.every((c) => perCategoryOK[c]);

  // Optional AI summary (non-blocking)
  let aiSummary = "";
  if (openai) {
    try {
      const summaryPrompt = `
You are an assistant summarizing verification results for data sharing.
Results:
${Object.entries(perCategoryOK)
  .map(([cat, ok]) => `- ${cat}: ${ok ? "OK" : "MISSING/INVALID"}`)
  .join("\n")}
Write 1 short friendly sentence to user about what to fix or confirm.
`;
      const resp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: summaryPrompt }],
        temperature: 0.2,
      });
      aiSummary = resp.choices?.[0]?.message?.content?.trim() ?? "";
    } catch (e) {
      logger.warn("OpenAI summary failed (continuing):", e as any);
      aiSummary = "";
    }
  }

  await partnerRef.update({
    verificationStatus: allOK ? "Verified" : "Failed",
    verificationStrict: {
      requiredDataTypes,
      perCategoryOK,
      perCategoryReasons,
      decidedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    aiSummary,
    verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    aiDecision: allOK ? "Verified" : "Failed",
    reasons: allOK ? [] : requiredDataTypes.flatMap((c) => perCategoryReasons[c] || []),
    perCategoryOK,
    perCategoryReasons,
    aiSummary,
  };
});

/* -------------------------------------------------------------------------- */
/*  4) sendContactMessage (Callable) — for your friend                        */
/* -------------------------------------------------------------------------- */

interface ContactMessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactMessage = onCall<ContactMessageData>(async (req) => {
  const { name, email, subject, message } = req.data || ({} as ContactMessageData);

  if (!name || !email || !subject || !message) {
    throw new HttpsError("invalid-argument", "All fields are required.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: "travelsense.contact@gmail.com",
    subject: `TravelSense Contact Form: ${subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;">
        <h2>📩 New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-line;">${message}</p>
        <hr style="margin:20px 0;border:none;border-top:1px solid #e5e7eb;"/>
        <p style="font-size:12px;color:#6b7280;">This message was sent via the TravelSense contact form.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`📨 Contact message sent from ${email}`);
    return { success: true };
  } catch (error: any) {
    logger.error("❌ Error sending contact email:", error);
    throw new HttpsError("internal", error?.message || "Failed to send contact message");
  }
});
/** ======================================================================
 *  1) sendDeletionRequest (Callable)
 *  ====================================================================== */
interface DeletionRequestData {
  userName: string;
  userEmail: string;
  userId: string;
}

export const sendDeletionRequest = onCall<DeletionRequestData>(async (req) => {
  const { userName, userEmail, userId } = req.data || ({} as DeletionRequestData);
  if (!userName || !userEmail || !userId) {
    throw new HttpsError("invalid-argument", "userName, userEmail, userId are required.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const confirmationLink = `https://us-central1-travelsense-6d151.cloudfunctions.net/confirmAccountDeletion?uid=${encodeURIComponent(
    userId
  )}`;

  try {
    await transporter.sendMail({
      from: `"TravelSense" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Confirm Your TravelSense Account Deletion",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2>Account Deletion Confirmation</h2>
          <p>Hi ${userName},</p>
          <p>We received your request to delete your TravelSense account. Please confirm this action by clicking the button below.</p>
          <a href="${confirmationLink}" 
            style="display:inline-block;padding:10px 20px;margin-top:15px;background-color:#d32f2f;color:white;text-decoration:none;border-radius:6px;">
            Confirm Deletion
          </a>
          <p style="font-size:14px; color:#6b7280;">⚠️ This action is <strong>irreversible</strong>.</p>
          <hr style="margin:32px 0; border:none; border-top:1px solid #e5e7eb;"/>
          <p style="font-size:12px; color:#6b7280;">&copy; ${new Date().getFullYear()} TravelSense • travelsense.contact@gmail.com</p>
        </div>
      `,
    });
    return { success: true };
  } catch (err: any) {
    logger.error("sendDeletionRequest failed", err);
    throw new HttpsError("internal", err?.message || "Email send failed");
  }
});


/** ======================================================================
 *  2) confirmAccountDeletion (HTTP)
 *  ====================================================================== */
import { onRequest } from "firebase-functions/v2/https";

export const confirmAccountDeletion = onRequest(async (req, res) => {
  const userId = (req.query.uid as string) || "";
  if (!userId) {
    res.status(400).send("❌ Missing user ID.");
    return;
  }

  try {
    await admin.auth().deleteUser(userId);
    res.status(200).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align:center; padding:40px;">
          <h2 style="color:#16a34a;">✅ Your account has been permanently deleted</h2>
          <p>We're sorry to see you go. Your TravelSense account and all associated data have been removed.</p>
          <a href="https://travelsenseweb.netlify.app/" 
             style="display:inline-block;margin-top:20px;background:#1976d2;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
             Return to TravelSense
          </a>
        </body>
      </html>
    `);
  } catch (err: any) {
    logger.error("confirmAccountDeletion error", err);
    res.status(500).send(`
      <html><body style="font-family:Arial;text-align:center;padding:40px;">
      <h2 style="color:#d32f2f;">❌ Account Deletion Failed</h2>
      <p>${err?.message || "Unknown error"}</p></body></html>
    `);
  }
});