"use client";
import { useState, useRef } from "react";

export default function DataPage() {
  const [rawData, setRawData] = useState("");
  const [formattedData, setFormattedData] = useState("");
  const [viewMode, setViewMode] = useState("none");
  const [dataAllowedForAI, setDataAllowedForAI] = useState("both");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const frostedContainer = {
    width: "92%",
    maxWidth: "900px",
    backgroundColor: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
    borderRadius: "36px",
    border: "3px solid rgba(255,255,255,0.18)",
    padding: "40px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
    color: "white",
    fontFamily: "Segoe UI, Roboto, sans-serif",
  };

  const textarea = {
    width: "100%",
    minHeight: "150px",
    padding: "12px",
    borderRadius: "12px",
    border: "2px solid rgba(255,255,255,0.5)",
    outline: "none",
    resize: "vertical",
    background: "white",
    color: "black",
  };

  const button = {
    padding: "12px 18px",
    background: "#1976d2",
    border: "none",
    color: "white",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    marginTop: "10px",
    marginRight: "10px",
  };

  // Handle file upload
  const handleFile = async (file) => {
    if (!file) return;
    const text = await file.text();
    setRawData(text);
    sendToAPI(text);
  };

  // Send data to API for organization
  const sendToAPI = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("/api/datafix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawData: data }),
      });
      const json = await res.json();
      setFormattedData(json.organizedData);
      setViewMode("formatted");
      setRawData(""); // Clear the input box
    } catch (err) {
      console.error(err);
      alert("Failed to process data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle paste from clipboard
  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    if (!text) return alert("Clipboard is empty");
    setRawData(text);
    sendToAPI(text);
  };

  // Handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={frostedContainer}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <h1 style={{ fontSize: "32px", fontWeight: "800", textAlign: "center", marginBottom: "30px" }}>
          Import Your Data
        </h1>

        {/* Paste / Textarea */}
        <div style={{ marginBottom: "20px" }}>
          <p>Paste your data here:</p>
          <textarea
            style={textarea}
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
            placeholder="Paste text or import via file / clipboard..."
          />
          <button style={button} onClick={() => sendToAPI(rawData)} disabled={loading}>
            {loading ? "Processing..." : "Import Data"}
          </button>
        </div>

        {/* File Upload */}
        <div style={{ marginBottom: "20px" }}>
          <p>Or upload a file (.txt, .csv, .json):</p>
          <input
            type="file"
            accept=".txt,.csv,.json"
            ref={fileInputRef}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {/* Clipboard */}
        <div style={{ marginBottom: "20px" }}>
          <p>Or import from clipboard:</p>
          <button style={button} onClick={handlePaste}>Paste from Clipboard</button>
        </div>

        {/* View Organized Data */}
        {viewMode !== "none" && (
          <div style={{ marginTop: "30px" }}>
            <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>Organized Data:</h2>
            <textarea style={textarea} value={formattedData} readOnly />
          </div>
        )}
      </div>
    </div>
  );
}
