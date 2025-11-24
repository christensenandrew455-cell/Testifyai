// app/profile/page.js
"use client";

import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [profilePic, setProfilePic] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("example@email.com");
  const [accountCreated, setAccountCreated] = useState("Loading...");
  const [uploading, setUploading] = useState(false);

  // TODO: Replace this with Firebase user info
  useEffect(() => {
    // placeholder example data
    setDisplayName("Username");
    setEmail("user@example.com");
    setAccountCreated("January 1, 2025");
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    // TODO: Upload to Firebase Storage
    setTimeout(() => {
      setProfilePic(URL.createObjectURL(file));
      setUploading(false);
    }, 1500);
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        borderRadius: "12px",
        background: "#fafafa",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Your Profile</h1>

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
            border: "3px solid #ddd",
            marginBottom: "10px",
          }}
        />

        <div>
          <label
            style={{
              padding: "8px 14px",
              background: "#1976d2",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer",
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
      </div>

      {/* Name Field */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: "600" }}>Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Email Field (non-editable for now) */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: "600" }}>Email</label>
        <input
          type="text"
          value={email}
          disabled
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: "#eee",
            cursor: "not-allowed",
          }}
        />
      </div>

      {/* Password change */}
      <div style={{ marginBottom: "16px" }}>
        <button
          style={{
            width: "100%",
            padding: "12px",
            background: "#ff9800",
            color: "white",
            fontSize: "1rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Change Password
        </button>
      </div>

      {/* Account Created */}
      <div style={{ textAlign: "center", marginTop: "25px", color: "#666" }}>
        <p>
          <strong>Account Created:</strong> {accountCreated}
        </p>
      </div>

      {/* Save Button */}
      <button
        style={{
          width: "100%",
          padding: "12px",
          background: "#4caf50",
          color: "white",
          fontSize: "1rem",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Save Changes
      </button>
    </div>
  );
}
