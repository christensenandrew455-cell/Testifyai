"use client";
import { useState } from "react";

export default function DataPage() {
  const [rawData, setRawData] = useState("");
  const [formattedData, setFormattedData] = useState("");
  const [viewMode, setViewMode] = useState("none"); 
  const [dataAllowedForAI, setDataAllowedForAI] = useState("both");

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

  const title = {
    fontSize: "32px",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: "30px",
  };

  const textarea = {
    width: "100%",
    minHeight: "150px",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    resize: "vertical",
    background: "rgba(255,255,255,0.3)",
    color: "white",
  };

  const button = {
    padding: "12px 18px",
    background: "rgba(0,0,0,0.55)",
    border: "2px solid rgba(255,255,255,0.25)",
    color: "white",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    marginTop: "10px",
    marginRight: "10px",
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
        <h1 style={title}>Data</h1>

        {/* DATA STATUS */}
        <div style={sectionBox}>
          <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>
            Data Status
          </h2>

          {rawData.trim() === "" && formattedData.trim() === "" ? (
            <div style={{ opacity: 0.8 }}>You currently have no data imported.</div>
          ) : (
            <div>Data has been imported.</div>
          )}
        </div>

        {/* IMPORT DATA */}
        <div style={sectionBox}>
          <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>
            Import Your Data
          </h2>

          <p style={{ marginBottom: "10px", opacity: 0.9 }}>
            Paste data below (copy/paste, export, generated text, etc):
          </p>

          <textarea
            style={textarea}
            placeholder="Paste your test data here..."
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
          ></textarea>

          <button
            style={button}
            onClick={() => {
              if (!rawData.trim()) return alert("No data to import.");
              setViewMode("raw");
            }}
          >
            Import
          </button>
        </div>

        {/* VIEW / MODIFY DATA */}
        {viewMode !== "none" && (
          <div style={sectionBox}>
            <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>
              Your Data
            </h2>

            {/* RAW */}
            {viewMode === "raw" && (
              <>
                <p style={{ marginBottom: "6px" }}>Raw Imported Data:</p>
                <textarea
                  style={textarea}
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                ></textarea>

                <button
                  style={button}
                  onClick={() => {
                    const f = "Formatted:\n\n" + rawData.trim();
                    setFormattedData(f);
                    setViewMode("formatted");
                  }}
                >
                  Ask ChatGPT to Improve / Organize
                </button>
              </>
            )}

            {/* FORMATTED */}
            {viewMode === "formatted" && (
              <>
                <p style={{ marginBottom: "6px" }}>
                  ChatGPT-Organized Version:
                </p>

                <textarea
                  style={textarea}
                  value={formattedData}
                  onChange={(e) => setFormattedData(e.target.value)}
                ></textarea>

                <button
                  style={button}
                  onClick={() => setViewMode("raw")}
                >
                  Back to Raw Data
                </button>
              </>
            )}
          </div>
        )}

        {/* AI ACCESS SETTINGS */}
        <div style={sectionBox}>
          <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>
            AI Data Access Settings
          </h2>

          <p style={{ marginBottom: "10px", opacity: 0.9 }}>
            Choose what the AI can use when generating tests:
          </p>

          <label style={{ display: "block", marginBottom: "8px" }}>
            <input
              type="radio"
              checked={dataAllowedForAI === "data-only"}
              onChange={() => setDataAllowedForAI("data-only")}
            />
            <span style={{ marginLeft: "8px" }}>
              Use only my imported data
            </span>
          </label>

          <label style={{ display: "block", marginBottom: "8px" }}>
            <input
              type="radio"
              checked={dataAllowedForAI === "chatgpt-only"}
              onChange={() => setDataAllowedForAI("chatgpt-only")}
            />
            <span style={{ marginLeft: "8px" }}>
              Use only ChatGPT knowledge
            </span>
          </label>

          <label style={{ display: "block" }}>
            <input
              type="radio"
              checked={dataAllowedForAI === "both"}
              onChange={() => setDataAllowedForAI("both")}
            />
            <span style={{ marginLeft: "8px" }}>
              Use both my data and ChatGPT (recommended)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
