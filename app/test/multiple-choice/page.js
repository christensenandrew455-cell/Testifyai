"use client";
export const dynamic = "force-dynamic";

export default function MultipleChoice({ question, onAnswer }) {
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
        >
          ← Back
        </button>
        <h1 style={{ fontSize: "20px", fontWeight: "600" }}>thetestifyai</h1>
        <div style={{ width: "50px" }}></div>
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
          {question.question}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {question.answers.map((answer, i) => (
            <button
              key={i}
              onClick={() => onAnswer({ correct: answer === question.correct })}
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
        <p style={{ fontSize: "14px" }}>
          {question.index || 1} out of 1
        </p>
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
