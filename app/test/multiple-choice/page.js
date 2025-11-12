"use client";
export const dynamic = "force-dynamic";
export const dynamicParams = false;
export const revalidate = 0;

export default function MultipleChoice({ question, onAnswer }) {
  // 🛡️ Guard: If question not provided yet (during prerender or load)
  if (!question) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2 style={{ color: "#555" }}>Loading question...</h2>
      </div>
    );
  }

  // 🧭 Destructure safely
  const { question: text, answers = [], correct, index = 1 } = question;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px",
      }}
    >
      {/* Header */}
      <header
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          style={{
            background: "none",
            border: "1px solid #ccc",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={() => window.history.back()}
        >
          ← Back
        </button>
        <h1 style={{ fontSize: "20px", fontWeight: "600" }}>thetestifyai</h1>
        <div style={{ width: "50px" }}></div> {/* spacer */}
      </header>

      {/* Question Box */}
      <main
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          padding: "30px",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        <h2 style={{ fontSize: "28px", margin: "0 0 20px 0" }}>
          {text || "Untitled Question"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {(answers.length ? answers : ["A", "B", "C", "D"]).map((answer, i) => (
            <button
              key={i}
              onClick={() => onAnswer?.({ correct: answer === correct })}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px 12px",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: "bold", marginRight: "8px" }}>
                {String.fromCharCode(65 + i)}.
              </div>
              {answer}
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <p style={{ fontSize: "14px" }}>{index} out of 1</p>
        <button
          style={{
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Check
        </button>
      </footer>
    </div>
  );
}
