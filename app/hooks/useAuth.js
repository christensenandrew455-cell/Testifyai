"use client";

import { useEffect, useState } from "react";
import { auth } from "../firebase";  // relative path
import { onAuthStateChanged } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return { user };
}
