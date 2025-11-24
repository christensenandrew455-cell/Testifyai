"use client";
import { useState } from "react";

export default function DataPage() {
  const [rawData, setRawData] = useState("");
  const [formattedData, setFormattedData] = useState("");
  const [viewMode, setViewMode] = useState("none"); 
  // none | raw | formatted

  const [dataAllowedForAI, setDataAllowedForAI] = useState("both");
  // "data-only" | "chatgpt-only" | "both"

  const container = {
    padding: "40px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "sans-serif",
  };

  const title = {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const sectionBox = {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "25px",
  };

  const boxTitle = {
    fontWeight: "bold",
    fontSize: "20px",
    marginBottom: "10px",
  };

  const textarea = {
    width: "100%",
    minHeight: "150px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #bbb",
    fontSize: "14px",
    resize: "vertical",
  };

  const button = {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "black",
    color: "white",
    marginRight: "10px",
    marginTop: "10px",
  };

  const grayText = { color: "#888" };

  return (
    <div style={container}>
      <div style={title}>Data</div>

      {/* ■■■ NO DATA MESSAGE OR CURRENT STATUS ■■■ */}
      <div style={sectionBox}>
        <div style={boxTitle}>Data Status</div>

        {rawData.trim() === "" && formattedData.trim() === "" ? (
          <div style={grayText}>You currently have no data imported.</div>
        ) : (
          <div>Data has been imported.</div>
        )}
      </div>

      {/* ■■■ IMPORT DATA SECTION ■■■ */}
      <div style={sectionBox}>
        <div style={boxTitle}>Import Your Data</div>
        <div style={{ marginBottom: "10px" }}>
          Paste data below (copy/paste, export, generated text, etc):
        </div>

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

      {/* ■■■ VIEW & MODIFY DATA SECTION ■■■ */}
      {viewMode !== "none" && (
        <div style={sectionBox}>
          <div style={boxTitle}>Your Data</div>

          {/* RAW VIEW */}
          {viewMode === "raw" && (
            <>
              <div style={{ marginBottom: "5px" }}>Raw Imported Data:</div>
              <textarea
                style={textarea}
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
              ></textarea>

              <button
                style={button}
                onClick={() => {
                  const f = "Formatted:\n\n" + rawData.trim(); // placeholder
                  setFormattedData(f);
                  setViewMode("formatted");
                }}
              >
                Ask ChatGPT to Improve / Organize
              </button>
            </>
          )}

          {/* FORMATTED VIEW */}
          {viewMode === "formatted" && (
            <>
              <div style={{ marginBottom: "5px" }}>
                ChatGPT-Organized Version:
              </div>

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

      {/* ■■■ AI DATA ACCESS CONTROL ■■■ */}
      <div style={sectionBox}>
        <div style={boxTitle}>AI Data Access Settings</div>

        <div style={{ marginBottom: "10px" }}>
          Choose what the AI can use when generating tests:
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px" }}>
            <input
              type="radio"
              name="ai-data"
              checked={dataAllowedForAI === "data-only"}
              onChange={() => setDataAllowedForAI("data-only")}
            />
            <span style={{ marginLeft: "8px" }}>
              Use only my imported data
            </span>
          </label>

          <label style={{ display: "block", marginBottom: "6px" }}>
            <input
              type="radio"
              name="ai-data"
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
              name="ai-data"
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
