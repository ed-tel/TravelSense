// src/hooks/useCurrentUser.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebaseConfig";

export function useCurrentUser() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        setUserName(user.displayName || user.email?.split("@")[0] || "User");
        setUserEmail(user.email || "");
        setUserProfileImage(
          user.photoURL ||
            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png?w=400&h=400&fit=crop&crop=face"
        );
      } else {
        setUserName(null);
        setUserEmail(null);
        setUserProfileImage(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return { userName, userEmail, userProfileImage };
}
