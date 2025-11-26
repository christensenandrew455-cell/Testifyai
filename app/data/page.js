"use client";
import { useState } from "react";

export default function DataPage() {
  const [rawData, setRawData] = useState("");
  const [formattedData, setFormattedData] = useState("");
  const [viewMode, setViewMode] = useState("none"); 
  const [dataAllowedForAI, setDataAllowedForAI] = useState("both");
  const [loading, setLoading] = useState(false);

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

  const sectionBox = {
    background: "rgba(255,255,255,0.12)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "25px",
    border: "2px solid rgba(255,255,255,0.25)",
  };

  const textarea = {
    width: "100%",
    minHeight: "150px",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
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

  // Function to send raw data to /api/datafix
  const organizeData = async () => {
    if (!rawData.trim()) return alert("No data to organize.");
    setLoading(true);
    try {
      const res = await fetch("/api/datafix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: rawData }),
      });
      const result = await res.json();
      if (result.processedData) {
        setFormattedData(result.processedData);
        setViewMode("formatted");
      } else if (result.error) {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to process data.");
    } finally {
      setLoading(false);
    }
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
      <div style={frostedContainer}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, textAlign: "center", marginBottom: "30px" }}>Data</h1>

        <div style={sectionBox}>
          <h2 style={{ fontWeight: 700, marginBottom: "10px" }}>Import Your Data</h2>
          <textarea
            style={textarea}
            placeholder="Paste your test data here..."
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
          />
          <button style={button} onClick={() => setViewMode("raw")}>Import</button>
        </div>

        {viewMode !== "none" && (
          <div style={sectionBox}>
            <h2 style={{ fontWeight: 700, marginBottom: "10px" }}>Your Data</h2>

            {viewMode === "raw" && (
              <>
                <p style={{ marginBottom: "6px" }}>Raw Imported Data:</p>
                <textarea style={textarea} value={rawData} onChange={(e) => setRawData(e.target.value)} />
                <button style={button} onClick={organizeData}>
                  {loading ? "Organizing..." : "Ask ChatGPT to Improve / Organize"}
                </button>
              </>
            )}

            {viewMode === "formatted" && (
              <>
                <p style={{ marginBottom: "6px" }}>ChatGPT-Organized Version:</p>
                <textarea style={textarea} value={formattedData} onChange={(e) => setFormattedData(e.target.value)} />
                <button style={button} onClick={() => setViewMode("raw")}>Back to Raw Data</button>
              </>
            )}
          </div>
        )}

        <div style={sectionBox}>
          <h2 style={{ fontWeight: 700, marginBottom: "10px" }}>AI Data Access Settings</h2>
          <label>
            <input type="radio" checked={dataAllowedForAI === "data-only"} onChange={() => setDataAllowedForAI("data-only")} />
            <span style={{ marginLeft: "8px" }}>Use only my imported data</span>
          </label>
          <label>
            <input type="radio" checked={dataAllowedForAI === "chatgpt-only"} onChange={() => setDataAllowedForAI("chatgpt-only")} />
            <span style={{ marginLeft: "8px" }}>Use only ChatGPT knowledge</span>
          </label>
          <label>
            <input type="radio" checked={dataAllowedForAI === "both"} onChange={() => setDataAllowedForAI("both")} />
            <span style={{ marginLeft: "8px" }}>Use both my data and ChatGPT (recommended)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
