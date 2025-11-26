"use client";
import { useState } from "react";

export default function DataPage() {
  const [rawData, setRawData] = useState(""); // accumulated data
  const [formattedData, setFormattedData] = useState("");
  const [viewMode, setViewMode] = useState("none"); // none | raw | formatted
  const [importMethod, setImportMethod] = useState("text"); // text | file | drag | clipboard
  const [importBuffer, setImportBuffer] = useState(""); // new data before import
  const [aiAccess, setAiAccess] = useState("both"); // "both" | "data-only" | "chatgpt-only"
  const [loading, setLoading] = useState(false);

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

  const handleClipboardPaste = async (e) => {
    e.preventDefault();
    try {
      const text = await navigator.clipboard.readText();
      setImportBuffer(text);
    } catch {
      alert("Clipboard access denied.");
    }
  };

  const handleImport = () => {
    if (!importBuffer.trim()) return alert("No data to import.");
    setRawData((prev) => (prev ? prev + "\n" + importBuffer : importBuffer));
    setImportBuffer("");
    setViewMode("raw");
  };

  const sendToDataFix = async () => {
    if (!rawData.trim()) return alert("No data to process.");
    if (aiAccess === "chatgpt-only") return alert("No user data selected for AI processing.");

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
      alert("Failed to organize data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", width: "100vw", background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)", display: "flex", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ width: "92%", maxWidth: "900px", backgroundColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(14px)", borderRadius: "36px", border: "3px solid rgba(255,255,255,0.18)", padding: "40px", boxShadow: "0 8px 24px rgba(0,0,0,0.18)", color: "white", fontFamily: "Segoe UI, Roboto, sans-serif" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "800", textAlign: "center", marginBottom: "30px" }}>Data</h1>

        {/* Import Method Selection */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
          {["text", "file", "drag", "clipboard"].map((method) => (
            <button key={method} onClick={() => setImportMethod(method)} style={{ padding: "10px 16px", borderRadius: "12px", border: importMethod === method ? "2px solid #fff" : "2px solid rgba(255,255,255,0.25)", background: "rgba(0,0,0,0.2)", color: "white", cursor: "pointer" }}>
              {method === "text" ? "Copy/Paste" : method === "file" ? "Upload File" : method === "drag" ? "Drag & Drop" : "Clipboard"}
            </button>
          ))}
        </div>

        {/* Import Section */}
        {importMethod === "text" && (
          <textarea placeholder="Paste your data here..." value={importBuffer} onChange={(e) => setImportBuffer(e.target.value)} style={{ width: "100%", minHeight: "120px", padding: "12px", borderRadius: "12px", border: "none", outline: "none", resize: "vertical", background: "white", color: "black", marginBottom: "12px" }} />
        )}

        {importMethod === "file" && <input type="file" accept=".txt,.csv,.json" onChange={handleFileUpload} />}
        {importMethod === "drag" && <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} style={{ border: "2px dashed white", padding: "40px", borderRadius: "12px", textAlign: "center" }}>Drag & drop a file here</div>}
        {importMethod === "clipboard" && <button onClick={handleClipboardPaste} style={{ padding: "12px 20px", borderRadius: "12px", background: "#1976d2", color: "white", fontWeight: 700, cursor: "pointer" }}>Paste from Clipboard</button>}

        <button onClick={handleImport} style={{ marginTop: "12px", padding: "12px 20px", borderRadius: "12px", background: "#4caf50", color: "white", fontWeight: 700, cursor: "pointer" }}>Import</button>

        {/* AI Access Settings */}
        {rawData && (
          <div style={{ marginTop: "30px" }}>
            <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>AI Data Access Settings</h2>
            <label style={{ display: "block", marginBottom: "8px" }}><input type="radio" checked={aiAccess === "data-only"} onChange={() => setAiAccess("data-only")} /> <span style={{ marginLeft: "8px" }}>Use only my imported data</span></label>
            <label style={{ display: "block", marginBottom: "8px" }}><input type="radio" checked={aiAccess === "chatgpt-only"} onChange={() => setAiAccess("chatgpt-only")} /> <span style={{ marginLeft: "8px" }}>Use only ChatGPT knowledge</span></label>
            <label style={{ display: "block" }}><input type="radio" checked={aiAccess === "both"} onChange={() => setAiAccess("both")} /> <span style={{ marginLeft: "8px" }}>Use both my data and ChatGPT (recommended)</span></label>

            {/* Raw / Formatted Data */}
            <h2 style={{ fontWeight: "700", marginBottom: "10px", marginTop: "20px" }}>Your Data</h2>
            <textarea style={{ width: "100%", minHeight: "120px", padding: "12px", borderRadius: "12px", border: "none", outline: "none", resize: "vertical", background: "white", color: "black", marginBottom: "12px" }} value={viewMode === "raw" ? rawData : formattedData} onChange={(e) => viewMode === "raw" ? setRawData(e.target.value) : setFormattedData(e.target.value)} />

            <button onClick={sendToDataFix} disabled={loading || aiAccess === "chatgpt-only"} style={{ padding: "12px 20px", borderRadius: "12px", background: "#4caf50", color: "white", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Organizing..." : "Organize Data"}</button>
            <button onClick={() => setViewMode(viewMode === "raw" ? "formatted" : "raw")} style={{ padding: "12px 20px", borderRadius: "12px", background: "#1976d2", color: "white", fontWeight: 700, marginLeft: "12px", cursor: "pointer" }}>Toggle Raw / Organized</button>
          </div>
        )}
      </div>
    </div>
  );
}
