// firebaseMfa.ts
import { auth } from "./firebaseConfig";
import { multiFactor, PhoneMultiFactorGenerator, PhoneAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export const enablePhoneMfa = async (phoneNumber: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No logged in user");

  const mfaUser = multiFactor(user);

  const recaptchaVerifier = new RecaptchaVerifier(
    "recaptcha-container",
    { size: "invisible" },
    auth
  );

  // Send code
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);

  const verificationCode = window.prompt("Enter the verification code sent to your phone:");
  if (!verificationCode) throw new Error("Verification code is required");

  const phoneCredential = PhoneAuthProvider.credential(
    confirmationResult.verificationId,
    verificationCode
  );

  const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneCredential);

  await mfaUser.enroll(multiFactorAssertion, "My Phone Number");

  alert("Phone MFA enabled successfully!");
};
