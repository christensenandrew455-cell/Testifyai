import { db } from "@/app/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export async function saveUserData(uid, data) {
  try {
    const ref = doc(db, "userData", uid);
    await setDoc(ref, { raw: data, createdAt: Date.now() }, { merge: true });
    return { success: true };
  } catch (err) {
    console.error("saveUserData error:", err);
    return { success: false, error: err };
  }
}

export async function updateUserData(uid, updates) {
  try {
    const ref = doc(db, "userData", uid);
    await updateDoc(ref, updates);
    return { success: true };
  } catch (err) {
    console.error("updateUserData error:", err);
    return { success: false, error: err };
  }
}

export async function getUserData(uid) {
  try {
    const ref = doc(db, "userData", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;
    return snap.data();
  } catch (err) {
    console.error("getUserData error:", err);
    return null;
  }
}
