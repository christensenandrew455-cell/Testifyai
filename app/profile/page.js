"use client";

import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [profilePic, setProfilePic] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("example@email.com");
  const [accountCreated, setAccountCreated] = useState("Loading...");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setDisplayName("Username");
    setEmail("user@example.com");
    setAccountCreated("January 1, 2025");
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    setTimeout(() => {
      setProfilePic(URL.createObjectURL(file));
      setUploading(false);
    }, 1500);
  };

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
              background: "rgba(255,255,255,0.3)",
              color: "#eee",
              cursor: "not-allowed",
            }}
          />
        </div>

        {/* Change Password */}
        <button
          style={{
            width: "100%",
            padding: "12px 0",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "12px",
            color: "white",
            fontWeight: 700,
            fontSize: "1rem",
            border: "2px solid rgba(255,255,255,0.3)",
            cursor: "pointer",
            marginBottom: "14px",
          }}
        >
          Change Password
        </button>

        <div style={{ marginTop: "16px", opacity: 0.85 }}>
          <p>
            <strong>Account Created:</strong> {accountCreated}
          </p>
        </div>

        {/* Save Button */}
        <button
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
      </div>
    </div>
  );
}
