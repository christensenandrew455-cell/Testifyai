"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { auth } from "../firebase";
import { db, storage } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ProfilePage() {
  const router = useRouter();

  const [profilePic, setProfilePic] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [accountCreated, setAccountCreated] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Firebase user + Firestore data
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.push("/login");
      return;
    }

    setEmail(user.email);
    setDisplayName(user.displayName || "");
    setProfilePic(user.photoURL || null);
    setAccountCreated(new Date(user.metadata.creationTime).toDateString());

    // Load Firestore profile data (optional)
    async function loadFirestoreProfile() {
      const refDoc = doc(db, "users", user.uid);
      const snap = await getDoc(refDoc);
      if (snap.exists()) {
        const data = snap.data();
        if (data.displayName) setDisplayName(data.displayName);
        if (data.photoURL) setProfilePic(data.photoURL);
      }
      setLoading(false);
    }

    loadFirestoreProfile();
  }, []);

  // Upload profile pic
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const user = auth.currentUser;
      const storageRef = ref(storage, `profilePictures/${user.uid}`);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await updateProfile(user, { photoURL: url });

      await setDoc(
        doc(db, "users", user.uid),
        { photoURL: url },
        { merge: true }
      );

      setProfilePic(url);
    } catch (e) {
      console.error("Upload error: ", e);
      alert("Could not upload picture.");
    }

    setUploading(false);
  };

  // Save changes (name)
  const saveChanges = async () => {
    const user = auth.currentUser;

    try {
      await updateProfile(user, { displayName });

      await setDoc(
        doc(db, "users", user.uid),
        { displayName },
        { merge: true }
      );

      alert("Profile updated!");
    } catch (e) {
      alert("Error saving changes.");
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) return <div style={{ padding: 50, color: "white" }}>Loading...</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "50px 20px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        color: "white",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          borderRadius: "40px",
          border: "3px solid rgba(255,255,255,0.18)",
          padding: "36px 44px",
          width: "92%",
          maxWidth: "520px",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        }}
      >
        <h1
          style={{
            marginBottom: "12px",
            fontWeight: 800,
            fontSize: "1.5rem",
          }}
        >
          Your Profile
        </h1>

        {/* Profile Picture */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={
              profilePic ||
              "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
            }
            alt="Profile"
            style={{
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(255,255,255,0.4)",
              marginBottom: "10px",
            }}
          />

          <label
            style={{
              padding: "10px 16px",
              background: "#1976d2",
              color: "white",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: 700,
              display: "inline-block",
            }}
          >
            {uploading ? "Uploading..." : "Change Picture"}
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {/* Name Input */}
        <div style={{ marginBottom: "18px", textAlign: "left" }}>
          <label style={{ fontWeight: 700 }}>Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "none",
              marginTop: "6px",
              outline: "none",
              fontSize: "1rem",
              background: "white",
              color: "black",
            }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: "18px", textAlign: "left" }}>
          <label style={{ fontWeight: 700 }}>Email</label>
          <input
            type="text"
            value={email}
            disabled
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "none",
              marginTop: "6px",
              outline: "none",
              fontSize: "1rem",
              background: "white",
              color: "gray",
              cursor: "not-allowed",
            }}
          />
        </div>

        {/* Account Created */}
        <div style={{ marginTop: "16px", opacity: 0.85 }}>
          <p>
            <strong>Account Created:</strong> {accountCreated}
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={saveChanges}
          style={{
            width: "100%",
            padding: "12px 0",
            background: "#4caf50",
            borderRadius: "12px",
            color: "white",
            fontWeight: 700,
            fontSize: "1rem",
            marginTop: "22px",
            cursor: "pointer",
            border: "none",
          }}
        >
          Save Changes
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "12px 0",
            background: "#d32f2f",
            borderRadius: "12px",
            color: "white",
            fontWeight: 700,
            fontSize: "1rem",
            marginTop: "14px",
            cursor: "pointer",
            border: "none",
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
