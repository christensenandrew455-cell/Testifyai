"use client";
import React, { Suspense } from "react";

export default function Incorrect2Page() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Segoe UI, Roboto, sans-serif",
            fontSize: "1.4rem",
            color: "#1976d2",
          }}
        >
          Loading result…
        </div>
      }
    >
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffebee",
          fontFamily: "Segoe UI, Roboto, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "2rem", color: "#c62828" }}>❌ Incorrect</h1>
        <p style={{ fontSize: "1.1rem", marginTop: "10px" }}>
          Don’t worry — you’ll get the next one!
        </p>
      </div>
    </Suspense>
  );
}
