"use client";
import Link from "next/link";

export default function SignInGateway() {
  const container = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    padding: "40px",
    textAlign: "center",
    fontFamily: "sans-serif",
  };

  const title = {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "16px",
  };

  const subtitle = {
    fontSize: "18px",
    color: "#555",
    maxWidth: "500px",
    marginBottom: "30px",
    lineHeight: "1.6",
  };

  const buttonContainer = {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  };

  const button = {
    padding: "12px 28px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    color: "white",
    backgroundColor: "black",
    transition: "opacity 0.2s",
  };

  return (
    <div style={container}>
      <div style={title}>Account Required</div>

      <div style={subtitle}>
        To access this feature, you’ll need to be signed in.  
        Create an account or log in below to continue.
      </div>

      <div style={buttonContainer}>
        <Link href="/signup" style={button}>
          Sign Up
        </Link>

        <Link href="/login" style={button}>
          Log In
        </Link>
      </div>
    </div>
  );
}
