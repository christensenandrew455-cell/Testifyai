"use client";

import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

export default function DataPage() {
  const { user } = useAuth();

  const [rawData, setRawData] = useState("");
  const [formattedData, setFormattedData] = useState("");
  const [viewMode, setViewMode] = useState("none");
  const [importMethod, setImportMethod] = useState("text");
  const [importBuffer, setImportBuffer] = useState("");
  const [aiAccess, setAiAccess] = useState("both");
  const [loading, setLoading] = useState(false);

  // 🔥 SAVE TO FIRESTORE (now saves aiAccess properly)
  const saveUserData = async (newRaw, newFormatted, newAiAccess = aiAccess) => {
    if (!user) return;

    try {
      const ref = doc(db, "users", user.uid, "data", "main");

      await setDoc(ref, {
        raw: newRaw,
        formatted: newFormatted,
        aiAccess: newAiAccess,
        updatedAt: Date.now(),
      });

      console.log("🔥 Data + AI Access saved");
    } catch (err) {
      console.error("Firestore save error:", err);
    }
  };

  // 🔥 LOAD USER DATA INCLUDING AI ACCESS
  useEffect(() => {
    if (!user?.uid) return;

    const loadData = async () => {
      try {
        const ref = doc(db, "users", user.uid, "data", "main");
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setRawData(data.raw || "");
          setFormattedData(data.formatted || "");
          setAiAccess(data.aiAccess || "both");
          setViewMode(data.raw ? "raw" : "none");
        }
      } catch (err) {
        console.error("Failed to load user data:", err);
      }
    };

    loadData();
  }, [user?.uid]);

  // -----------------------------
  // IMPORT FEATURES
  // -----------------------------
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => setImportBuffer(event.target.result);
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => setImportBuffer(event.target.result);
    reader.readAsText(file);
  };

  const handleClipboardPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setImportBuffer(text);
    } catch {
      alert("Clipboard access denied.");
    }
  };

  const handleImport = async () => {
    if (!importBuffer.trim()) return alert("No data to import.");

    const newRaw = rawData ? rawData + "\n" + importBuffer : importBuffer;

    setRawData(newRaw);
    setImportBuffer("");
    setViewMode("raw");

    await saveUserData(newRaw, formattedData, aiAccess);
  };

  // -----------------------------
  // AI ORGANIZER
  // -----------------------------
  const sendToDataFix = async () => {
    if (!rawData.trim()) return alert("No data to process.");

    if (aiAccess === "chatgpt-only")
      return alert("AI cannot read your imported data in this mode.");

    setLoading(true);

    try {
      const res = await fetch("/api/datafix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawData }),
      });

      const data = await res.json();

      if (data.organizedData) {
        setFormattedData(data.organizedData);
        setViewMode("formatted");

        await saveUserData(rawData, data.organizedData, aiAccess);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to organize data.");
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
      <div
        style={{
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
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "800",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Data
        </h1>

        {/* IMPORT TYPE BUTTONS */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
          {["text", "file", "drag", "clipboard"].map((method) => (
            <button
              key={method}
              onClick={() => setImportMethod(method)}
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border:
                  importMethod === method
                    ? "2px solid #fff"
                    : "2px solid rgba(255,255,255,0.25)",
                background: "rgba(0,0,0,0.2)",
                color: "white",
                cursor: "pointer",
              }}
            >
              {method === "text"
                ? "Copy/Paste"
                : method === "file"
                ? "Upload File"
                : method === "drag"
                ? "Drag & Drop"
                : "Clipboard"}
            </button>
          ))}
        </div>

        {/* IMPORT INPUTS */}
        {importMethod === "text" && (
          <textarea
            placeholder="Paste your data here..."
            value={importBuffer}
            onChange={(e) => setImportBuffer(e.target.value)}
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "12px",
              borderRadius: "12px",
              background: "white",
              color: "black",
              marginBottom: "12px",
            }}
          />
        )}

        {importMethod === "file" && (
          <input
            type="file"
            accept=".txt,.csv,.json"
            onChange={handleFileUpload}
            style={{ marginBottom: "12px" }}
          />
        )}

        {importMethod === "drag" && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{
              border: "2px dashed white",
              padding: "40px",
              borderRadius: "12px",
              textAlign: "center",
              marginBottom: "12px",
            }}
          >
            Drag & drop a file here
          </div>
        )}

        {importMethod === "clipboard" && (
          <button
            onClick={handleClipboardPaste}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              background: "#1976d2",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: "12px",
            }}
          >
            Paste from Clipboard
          </button>
        )}

        {/* PREVIEW */}
        {importBuffer.trim() !== "" && (
          <textarea
            readOnly={importMethod !== "text"}
            value={importBuffer}
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "12px",
              borderRadius: "12px",
              background: "white",
              color: "black",
              marginBottom: "12px",
            }}
          />
        )}

        <button
          onClick={handleImport}
          style={{
            marginTop: "12px",
            padding: "12px 20px",
            borderRadius: "12px",
            background: "#4caf50",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Import
        </button>

        {/* DATA DISPLAY */}
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>Your Data</h2>

          {!rawData.trim() && (
            <p style={{ opacity: 0.8, fontStyle: "italic" }}>
              You have no data.
            </p>
          )}

          {rawData.trim() && (
            <p style={{ marginBottom: "8px", fontStyle: "italic" }}>
              {viewMode === "raw" ? "Viewing Raw Data" : "Viewing Organized Data"}
            </p>
          )}

          {rawData.trim() && (
            <textarea
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                background: "white",
                color: "black",
                marginBottom: "12px",
                overflow: "hidden",
                resize: "none",
              }}
              value={viewMode === "raw" ? rawData : formattedData}
              ref={(el) => {
                if (el) {
                  el.style.height = "auto";
                  el.style.height = el.scrollHeight + "px";
                }
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onChange={(e) => {
                if (viewMode === "raw") {
                  setRawData(e.target.value);
                  saveUserData(e.target.value, formattedData, aiAccess);
                } else {
                  setFormattedData(e.target.value);
                  saveUserData(rawData, e.target.value, aiAccess);
                }
              }}
            />
          )}

          {rawData.trim() && (
            <>
              <button
                onClick={sendToDataFix}
                disabled={loading || aiAccess === "chatgpt-only"}
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background: "#4caf50",
                  color: "white",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Organizing..." : "Organize Data"}
              </button>

              <button
                onClick={() =>
                  setViewMode(viewMode === "raw" ? "formatted" : "raw")
                }
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background: "#1976d2",
                  color: "white",
                  marginLeft: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Toggle Raw / Organized
              </button>
            </>
          )}
        </div>

        {/* AI ACCESS SETTINGS */}
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>
            AI Data Access Settings
          </h2>

          <label style={{ display: "block", marginBottom: "8px" }}>
            <input
              type="radio"
              checked={aiAccess === "data-only"}
              onChange={() => {
                setAiAccess("data-only");
                saveUserData(rawData, formattedData, "data-only");
              }}
            />
            <span style={{ marginLeft: "8px" }}>Use only my imported data</span>
          </label>

          <label style={{ display: "block", marginBottom: "8px" }}>
            <input
              type="radio"
              checked={aiAccess === "chatgpt-only"}
              onChange={() => {
                setAiAccess("chatgpt-only");
                saveUserData(rawData, formattedData, "chatgpt-only");
              }}
            />
            <span style={{ marginLeft: "8px" }}>Use only ChatGPT knowledge</span>
          </label>

          <label style={{ display: "block" }}>
            <input
              type="radio"
              checked={aiAccess === "both"}
              onChange={() => {
                setAiAccess("both");
                saveUserData(rawData, formattedData, "both");
              }}
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
