"use client";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      {/* SEO HEAD TAGS */}
      <Head>
        <title>TheTestifyAI — AI Test Generator & Study Tool</title>

        <meta
          name="description"
          content="Instant AI-generated tests for any topic. Create quizzes, study smarter, and improve fast using TheTestifyAI — your personal learning assistant."
        />

        <meta
          name="keywords"
          content="AI test generator, study tool, quiz maker, practice tests, student study help, exam prep, custom quizzes, learning app"
        />

        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "TheTestifyAI",
              url: "https://thetestifyai.com",
              description:
                "AI test generator that creates custom quizzes and practice tests for any topic. Study smarter and learn faster.",
              applicationCategory: "EducationalApplication",
              operatingSystem: "All",
              creator: {
                "@type": "Organization",
                name: "TheTestifyAI",
              },
            }),
          }}
        />
      </Head>

      <div
        style={{
          width: "100vw",
          background: "linear-gradient(90deg, #1976d2 0%, #ff9800 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          fontFamily: "Segoe UI, Roboto, sans-serif",
          color: "white",
          padding: "20px",
          position: "relative",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "30px",
            fontWeight: 700,
            fontSize: "1.2rem",
          }}
        >
          TheTestifyAI
        </div>

        {/* HERO SECTION */}
        <div
          style={{
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
            Instant quizzes, smart questions, and direct feedback. Learn anything, anywhere!
                                       Test it out for free
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
        </div>

        {/* EXTRA SPACE */}
        <div style={{ height: "25vh" }}></div>

        {/* FEATURES SECTION */}
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            padding: "0 20px",
            marginBottom: "80px",
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "26px",
              width: "100%",
              justifyItems: "center",
            }}
          >
            {[
              {
                title: "AI-Generated Tests Instantly",
                text: "Create tests on any topic in seconds. Boost your studying with fully personalized practice questions.",
              },
              {
                title: "Multiple Test Types",
                text: "Choose from multiple-choice, true/false, open-response, short-answer, and more.",
              },
              {
                title: "Choose the difficulty",
                text: "Go from beginner to advanced at your own pace on any subject you want.",
              },
              {
                title: "Track Your Progress",
                text: "View strengths, weaknesses, and improvements with detailed results & explanations.",
              },
              {
                title: "Perfect for Any Subject",
                text: "Math, science, history, nursing, trades, exams, certifications — everything covered.",
              },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  padding: "22px",
                  borderRadius: "18px",
                  border: "2px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(10px)",
                  width: "100%",
                  maxWidth: "320px",
                }}
              >
                <h3 style={{ fontWeight: 700, marginBottom: "10px" }}>
                  {f.title}
                </h3>
                <p style={{ opacity: 0.9, lineHeight: 1.5 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
