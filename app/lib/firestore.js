import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

// ✅ Save a new test as /users/{uid}/data/{testId}
export async function saveTest(uid, testId, testData) {
  try {
    const ref = doc(db, "users", uid, "data", testId);
    await setDoc(ref, {
      ...testData,
      createdAt: Date.now(),
    });

    return { success: true };
  } catch (err) {
    console.error("saveTest error:", err);
    return { success: false, error: err };
  }
}

// ✅ Get ALL tests for a user
export async function getAllTests(uid) {
  try {
    const collectionRef = collection(db, "users", uid, "data");
    const snap = await getDocs(collectionRef);

    const tests = [];
    snap.forEach((doc) => {
      tests.push({ id: doc.id, ...doc.data() });
    });

    return tests;
  } catch (err) {
    console.error("getAllTests error:", err);
    return [];
  }
}

// ✅ Get ONE test by ID
export async function getTest(uid, testId) {
  try {
    const ref = doc(db, "users", uid, "data", testId);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error("getTest error:", err);
    return null;
  }
}

// ✅ Update existing test
export async function updateTest(uid, testId, updates) {
  try {
    const ref = doc(db, "users", uid, "data", testId);
    await updateDoc(ref, updates);

    return { success: true };
  } catch (err) {
    console.error("updateTest error:", err);
    return { success: false, error: err };
  }
}

// ❌ Delete test (if needed)
export async function deleteTest(uid, testId) {
  try {
    const ref = doc(db, "users", uid, "data", testId);
    await deleteDoc(ref);
    return { success: true };
  } catch (err) {
    console.error("deleteTest error:", err);
    return { success: false, error: err };
  }
}
