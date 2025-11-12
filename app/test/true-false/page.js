export default function TrueFalsePage() {
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
        <div style={{ width: "50px" }}></div> {/* spacer for balance */}
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

        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            True or False
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <button
              disabled
              style={{
                width: "100%",
                maxWidth: "400px",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f0f0f0",
                cursor: "not-allowed",
                fontSize: "16px",
              }}
            >
              False
            </button>

            <button
              disabled
              style={{
                width: "100%",
                maxWidth: "400px",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f0f0f0",
                cursor: "not-allowed",
                fontSize: "16px",
              }}
            >
              True
            </button>
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
