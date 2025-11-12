"use client";
export const dynamic = "force-dynamic";

export default function MultiSelectPage() {
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
        <div style={{ width: "50px" }}></div> {/* spacer for symmetry */}
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
        <h2 style={{ fontSize: "28px", margin: "0 0 20px 0" }}>Question</h2>

        <div style={{ textAlign: "left" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Multi-Select
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {["A", "B", "C", "D", "E"].map((letter) => (
              <div
                key={letter}
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  backgroundColor: "#fff",
                }}
              >
                <input
                  type="checkbox"
                  style={{
                    marginRight: "10px",
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                  }}
                  disabled
                />
                <div
                  style={{
                    width: "25px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {letter}.
                </div>
                <div style={{ flexGrow: 1, height: "16px", background: "#f0f0f0" }}></div>
              </div>
            ))}
          </div>
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
        <p style={{ fontSize: "14px" }}>1 out of 1</p>
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
