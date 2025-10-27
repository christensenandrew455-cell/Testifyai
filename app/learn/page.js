"use client";

import Link from "next/link";

export default function LearnPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fffaf3 0%, #fff6e8 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fffefb",
          color: "#333",
          maxWidth: "700px",
          width: "100%",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "1px solid #f1e0c5",
          lineHeight: "1.8",
          fontFamily: "Georgia, serif",
        }}
      >
        <h1
          style={{
            color: "#d47a00",
            textAlign: "center",
            fontSize: "2.2rem",
            marginBottom: "20px",
          }}
        >
          Learn More
        </h1>

        <p style={{ marginBottom: "16px" }}>
          TheTestifyAI is designed to make learning engaging and adaptive.
          You can take tests on nearly any topic — whether it’s history,
          science, entertainment, or random facts. You choose the difficulty
          and the number of questions, and the AI does the rest.
        </p>

        <p style={{ marginBottom: "16px" }}>
          Our AI gathers accurate, topic-based information, then builds
          multiple-choice questions with detailed reasoning for each correct
          answer. After each question, you’ll see an explanation to help you
          learn as you go.
        </p>

        <p style={{ marginBottom: "16px" }}>
          Because each question set is freshly generated, some variations may
          occur. We’re always improving accuracy and depth, so if you notice
          any issues, feel free to contact us at:
        </p>

        <p
          style={{
            color: "#d47a00",
            fontWeight: "bold",
            textAlign: "center",
            margin: "12px 0 28px 0",
          }}
        >
          thetestifyai@gmail.com
        </p>

        <p
          style={{
            textAlign: "center",
            fontStyle: "italic",
            color: "#555",
            marginBottom: "30px",
          }}
        >
          More updates and improvements are coming soon — stay tuned!
        </p>

        <div style={{ textAlign: "center" }}>
          <Link
            href="/"
            style={{
              backgroundColor: "#d47a00",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#b86500")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#d47a00")}
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
