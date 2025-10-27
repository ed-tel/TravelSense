import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

interface DeletionRequestData {
  userName: string;
  userEmail: string;
  userId: string;
}

interface VerifyAIRequest {
  userId: string;
  partnerName: string;
  dataTypes?: string[];
}

// 🔹 1. Send the confirmation email
export const sendDeletionRequest = functions.https.onCall(
  async (request: functions.https.CallableRequest<DeletionRequestData>) => {
    const { userName, userEmail, userId } = request.data;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // confirmation link points to confirmAccountDeletion endpoint
    const confirmationLink = `https://us-central1-travelsense-6d151.cloudfunctions.net/confirmAccountDeletion?uid=${userId}`;

    const mailOptions = {
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
          <p style="font-size:14px; color:#6b7280; line-height:1.6;">
              ⚠️ This action is <strong>irreversible</strong>. Once confirmed, your account and data will be permanently removed from our systems.
            </p>

            <hr style="margin:32px 0; border:none; border-top:1px solid #e5e7eb;"/>

            <p style="font-size:13px; color:#6b7280;">
              If you didn’t make this request, you can safely ignore this email. Your account will remain active.
            </p>
          </td>
        </tr>

        <tr>
          <td style="background-color:#f3f4f6; padding:20px; text-align:center; font-size:12px; color:#6b7280;">
            <p style="margin:0;">&copy; ${new Date().getFullYear()} TravelSense. All rights reserved.</p>
            <p style="margin:4px 0 0;">travelsense.contact@gmail.com</p>
          </td>
        </tr>
      </table>
    </div>
  `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error: any) {
      console.error("Error sending email:", error);
      throw new functions.https.HttpsError("internal", error.message);
    }
  }
);

// 🔹 2. Handle confirmation and actually delete user
export const confirmAccountDeletion = functions.https.onRequest(async (req, res) => {
  const userId = req.query.uid as string;

  if (!userId) {
    res.status(400).send("❌ Missing user ID.");
    return;
  }

  try {
    await admin.auth().deleteUser(userId);
    res.status(200).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align:center; padding:40px;">
          <h2 style="color:#d32f2f;">✅ Your account has been permanently deleted</h2>
          <p>We're sorry to see you go. Your TravelSense account and all associated data have been removed.</p>
          <a href="https://travelsenseweb.netlify.app/" style="display:inline-block;margin-top:20px;background:#1976d2;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">Return to TravelSense</a>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).send(`
      <html><body style="font-family:Arial;text-align:center;padding:40px;">
      <h2 style="color:#d32f2f;">❌ Account Deletion Failed</h2>
      <p>${error.message}</p></body></html>
    `);
  }
});

export const verifyDatasetAI = functions.https.onCall(
  async (request: functions.https.CallableRequest<VerifyAIRequest>) => {
    const data = request.data;

    try {
      const { userId, partnerName } = data;
      const db = admin.firestore();

      console.log(`🤖 Starting AI verification for ${partnerName} (user: ${userId})`);

      // 🔹 Fetch Firestore partner document
      const partnerDoc = await db
        .collection("users")
        .doc(userId)
        .collection("partners")
        .doc(partnerName)
        .get();

      const sharedDatasets = partnerDoc.data()?.sharedDatasets || [];
      if (!sharedDatasets.length) {
        console.warn(`⚠️ No shared datasets found for ${partnerName}`);
        throw new Error("No shared datasets found in Firestore.");
      }

      let verificationPassed = false;
      const results: any[] = [];

      // 🔍 Loop through datasets in Firestore instead of Storage
      for (const dataset of sharedDatasets) {
        const category = dataset.category || "Unknown";
        const name = dataset.name || "Unnamed file";
        const size = dataset.size || "Unknown size";
        const uploadDate = dataset.uploadDate || "N/A";

        console.log(`📄 Checking dataset: ${name} (${category}, ${size})`);

        // Simple example validation rule
        const validCategories = ["Booking History", "Travel Preferences"];
        const valid = validCategories.includes(category);

        results.push({
          name,
          category,
          size,
          uploadDate,
          valid,
        });

        verificationPassed ||= valid;
      }

      // 🔹 Save results back to Firestore
      await db
        .collection("users")
        .doc(userId)
        .collection("partners")
        .doc(partnerName)
        .update({
          verificationStatus: verificationPassed ? "Verified" : "Failed",
          verificationDetails: results,
          verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      console.log(`✅ Verification ${verificationPassed ? "passed" : "failed"} for ${partnerName}`);

      return { success: true, verificationPassed, results };

    } catch (error: any) {
      console.error("❌ Verification error:", error);
      throw new functions.https.HttpsError("internal", error.message);
    }
  }
);
