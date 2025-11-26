"use client";
import { useState } from "react";

export default function DataPage() {
  const [rawData, setRawData] = useState("");
  const [formattedData, setFormattedData] = useState("");
  const [viewMode, setViewMode] = useState("none"); // none | raw | formatted
  const [importMethod, setImportMethod] = useState("text"); // text | file | drag | clipboard
  const [loading, setLoading] = useState(false);

  const appendData = (newData) => {
    setRawData((prev) => (prev ? prev + "\n" + newData : newData));
    setViewMode("raw");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => appendData(event.target.result);
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => appendData(event.target.result);
    reader.readAsText(file);
  };

  const handleClipboardPaste = async (e) => {
    e.preventDefault();
    try {
      const text = await navigator.clipboard.readText();
      appendData(text);
    } catch {
      alert("Clipboard access denied.");
    }
  };

  const sendToDataFix = async () => {
    if (!rawData.trim()) return alert("No data to process.");
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
        <h1 style={{ fontSize: "32px", fontWeight: "800", textAlign: "center", marginBottom: "30px" }}>Data</h1>

        {/* Import Method Selection */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
          {["text", "file", "drag", "clipboard"].map((method) => (
            <button
              key={method}
              onClick={() => setImportMethod(method)}
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border: importMethod === method ? "2px solid #fff" : "2px solid rgba(255,255,255,0.25)",
                background: "rgba(0,0,0,0.2)",
                color: "white",
                cursor: "pointer",
              }}
            >
              {method === "text" ? "Copy/Paste" : method === "file" ? "Upload File" : method === "drag" ? "Drag & Drop" : "Clipboard"}
            </button>
          ))}
        </div>

        {/* Import Section */}
        {importMethod === "text" && (
          <textarea
            placeholder="Paste your data here..."
            value={""}
            onChange={(e) => appendData(e.target.value)}
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              outline: "none",
              resize: "vertical",
              background: "white",
              color: "black",
              marginBottom: "12px",
            }}
          ></textarea>
        )}

        {importMethod === "file" && (
          <input type="file" accept=".txt,.csv,.json" onChange={handleFileUpload} />
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
            }}
          >
            Paste from Clipboard
          </button>
        )}

        {/* Raw / Formatted Data */}
        {rawData && (
          <div style={{ marginTop: "30px" }}>
            <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>Your Data</h2>

            {viewMode === "raw" && (
              <>
                <p style={{ marginBottom: "6px" }}>Raw Data:</p>
                <textarea
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "none",
                    outline: "none",
                    resize: "vertical",
                    background: "white",
                    color: "black",
                    marginBottom: "12px",
                  }}
                  value={rawData}
                  onChange={(e) => setRawData(e.target.value)}
                ></textarea>
              </>
            )}

            {viewMode === "formatted" && (
              <>
                <p style={{ marginBottom: "6px" }}>Organized Data:</p>
                <textarea
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "none",
                    outline: "none",
                    resize: "vertical",
                    background: "white",
                    color: "black",
                    marginBottom: "12px",
                  }}
                  value={formattedData}
                  onChange={(e) => setFormattedData(e.target.value)}
                ></textarea>
              </>
            )}

            <button
              onClick={sendToDataFix}
              disabled={loading}
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
              onClick={() => setViewMode(viewMode === "raw" ? "formatted" : "raw")}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                background: "#1976d2",
                color: "white",
                fontWeight: 700,
                marginLeft: "12px",
                cursor: "pointer",
              }}
            >
              Toggle Raw / Organized
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
