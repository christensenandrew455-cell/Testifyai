"use client";

import Link from "next/link";

export default function LearnMorePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fff7ed 0%, #fffdf8 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fffdf9",
          borderRadius: "12px",
          boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
          border: "1px solid #f1e2c6",
          maxWidth: "800px",
          width: "100%",
          padding: "60px 80px",
          textAlign: "left",
          lineHeight: "1.8",
          // ✅ make all text black
          color: "#111",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "2.4rem",
            color: "#c46b1a",
            marginBottom: "5px",
          }}
        >
          TheTestifyAI
        </h1>

        <h2
          style={{
            textAlign: "center",
            color: "#d47b24",
            marginBottom: "30px",
            fontSize: "1.6rem",
          }}
        >
          Learn More
        </h2>

        {/* 🧹 Removed “Dear learner,” paragraph */}
        
        <p style={{ marginBottom: "20px" }}>
          TheTestifyAI is designed for everyone — on phones, tablets, and
          computers. It allows you to take a test on any topic you choose and
          customize both the difficulty and number of questions.
        </p>

        <p style={{ marginBottom: "20px" }}>
          Each question is crafted by an AI that studies your chosen topic,
          creates four answer options, and ensures one is correct. After every
          answer, you’ll see a short explanation to help you learn and
          understand more deeply.
        </p>

        <p style={{ marginBottom: "20px" }}>
          Since these questions are AI-generated, small inaccuracies can occur.
          If you find anything that could be improved, we’d love your feedback
          at:
        </p>

        <p
          style={{
            textAlign: "center",
            color: "#d47b24",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          thetestifyai@gmail.com
        </p>

        <p style={{ fontStyle: "italic", marginBottom: "30px", color: "#444" }}>
          More updates and improvements are on the way. We appreciate your
          support as TheTestifyAI continues to grow and evolve.
        </p>

        {/* 🧹 Removed “Sincerely,” and “TheTestifyAI Team” */}

        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Link
            href="/"
            style={{
              backgroundColor: "#d47b24",
              color: "white",
              padding: "12px 28px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1.05rem",
            }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
