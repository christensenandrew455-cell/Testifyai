"use client";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      {/* ⭐ SEO Structured Data */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "TheTestifyAI",
              "url": "https://thetestifyai.com",
              "description":
                "AI test generator that creates custom quizzes and practice tests for any topic. Study smarter, learn faster, and improve exam prep instantly.",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "All",
              "creator": {
                "@type": "Organization",
                "name": "TheTestifyAI",
              },
            }),
          }}
        />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontFamily: "Segoe UI, Roboto, sans-serif",
          color: "white",
          padding: "20px",
          position: "relative",
        }}
      >
        {/* Logo / Title */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "30px",
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "white",
          }}
        >
          TheTestifyAI
        </div>

        {/* Main Title */}
        <h1
          style={{
            fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
            fontWeight: 800,
            marginBottom: "16px",
            textShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
        >
          Welcome to TheTestifyAI
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            maxWidth: "700px",
            opacity: 0.95,
            lineHeight: 1.5,
            marginBottom: "40px",
          }}
        >
          The best AI test generator — study smarter, learn faster, and improve.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Learn More Button */}
          <button
            onClick={() => router.push("/learn")}
            style={{
              padding: "16px 30px",
              fontSize: "1.1rem",
              fontWeight: 700,
              borderRadius: "16px",
              border: "3px solid rgba(255,255,255,0.45)",
              backgroundColor: "rgba(255,255,255,0.18)",
              color: "white",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "0.25s",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.28)")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.18)")
            }
          >
            Learn More
          </button>

          {/* Test Me Button */}
          <button
            onClick={() => router.push("/testsetup")}
            style={{
              padding: "16px 30px",
              fontSize: "1.1rem",
              fontWeight: 700,
              borderRadius: "16px",
              border: "3px solid rgba(255,255,255,0.7)",
              backgroundColor: "white",
              color: "#1976d2",
              cursor: "pointer",
              transition: "0.25s",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#f2f2f2";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "white";
            }}
          >
            Test Me
          </button>
        </div>

        {/* FEATURES SECTION */}
        <div
          style={{
            marginTop: "80px",
            width: "100%",
            maxWidth: "1100px",
            padding: "0 20px",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: "30px",
              textShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            Why Students Love TheTestifyAI
          </h2>

          {/* Feature Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "26px",
              width: "100%",
            }}
          >
            {/* Feature 1 */}
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: "22px",
                borderRadius: "18px",
                border: "2px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3 style={{ fontWeight: 700, marginBottom: "10px" }}>
                AI-Generated Tests Instantly
              </h3>
              <p style={{ opacity: 0.9, lineHeight: 1.5 }}>
                Create tests on any topic in seconds. Boost your studying with
                fully personalized practice questions.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: "22px",
                borderRadius: "18px",
                border: "2px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3 style={{ fontWeight: 700, marginBottom: "10px" }}>
                Multiple Test Types
              </h3>
              <p style={{ opacity: 0.9, lineHeight: 1.5 }}>
                Choose from multiple-choice, true/false, open-response,
                short-answer, and more to match your learning style.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: "22px",
                borderRadius: "18px",
                border: "2px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3 style={{ fontWeight: 700, marginBottom: "10px" }}>
                Difficulty That Adapts to You
              </h3>
              <p style={{ opacity: 0.9, lineHeight: 1.5 }}>
                Start easy or go advanced — adjust difficulty anytime and learn
                at your pace.
              </p>
            </div>

            {/* Feature 4 */}
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: "22px",
                borderRadius: "18px",
                border: "2px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3 style={{ fontWeight: 700, marginBottom: "10px" }}>
                Track Your Progress
              </h3>
              <p style={{ opacity: 0.9, lineHeight: 1.5 }}>
                Study smarter with detailed results and instant explanations for
                every question.
              </p>
            </div>

            {/* Feature 5 */}
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: "22px",
                borderRadius: "18px",
                border: "2px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3 style={{ fontWeight: 700, marginBottom: "10px" }}>
                Perfect for Any Subject
              </h3>
              <p style={{ opacity: 0.9, lineHeight: 1.5 }}>
                Math, science, history, nursing, trades, exams, certifications —
                you name it, TheTestifyAI can generate it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
