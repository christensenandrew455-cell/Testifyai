import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
  increment
} from "firebase/firestore";

/* -------------------------------------------------------
   SAVE A TEST (Called ONLY when clicking "Save")
-------------------------------------------------------- */
export async function saveTest(uid, testId, testData) {
  try {
    // Prevent saving empty or broken test files
    if (
      !testData ||
      !testData.questions ||
      !Array.isArray(testData.questions) ||
      testData.questions.length === 0
    ) {
      console.warn("❌ saveTest aborted — test has no question data");
      return { success: false, error: "EMPTY_TEST" };
    }

    if (!testData.topic || !testData.total) {
      console.warn("❌ saveTest aborted — test missing essential fields");
      return { success: false, error: "INCOMPLETE_TEST" };
    }

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

/* -------------------------------------------------------
   GET ALL SAVED TESTS
-------------------------------------------------------- */
export async function getAllTests(uid) {
  try {
    const collectionRef = collection(db, "users", uid, "data");
    const snap = await getDocs(collectionRef);

    const tests = [];
    snap.forEach((docItem) => {
      tests.push({ id: docItem.id, ...docItem.data() });
    });

    return tests;
  } catch (err) {
    console.error("getAllTests error:", err);
    return [];
  }
}

/* -------------------------------------------------------
   GET A SINGLE TEST
-------------------------------------------------------- */
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

/* -------------------------------------------------------
   UPDATE A TEST
-------------------------------------------------------- */
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

/* -------------------------------------------------------
   DELETE A TEST
-------------------------------------------------------- */
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

/* -------------------------------------------------------
   ⭐ INCREMENT TESTS TAKEN — DOES NOT SAVE TEST DATA ⭐
-------------------------------------------------------- */
export async function incrementTestCount(uid) {
  try {
    // This creates:
    //
    // users/{uid}/stats/progress
    //     → testsTaken: N
    //
    const ref = doc(db, "users", uid, "stats", "progress");

    await setDoc(
      ref,
      { testsTaken: increment(1) },
      { merge: true }
    );

    return { success: true };
  } catch (err) {
    console.error("incrementTestCount error:", err);
    return { success: false, error: err };
  }
}
