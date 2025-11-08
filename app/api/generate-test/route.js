import OpenAI from "openai";

export async function POST(req) {
  try {
    const { topic, difficulty, numQuestions, selectedTypes } = await req.json();

    if (!selectedTypes || selectedTypes.length === 0) {
      return new Response(
        JSON.stringify({ error: "No test types selected." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Helper: call your existing subroutes
    async function fetchQuestions(type) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/generate-test/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numQuestions }),
      });
      const data = await res.json();
      if (data.questions) {
        return data.questions.map((q) => ({ ...q, type }));
      } else if (data.question) {
        // For single-question routes like open/short
        return [{ ...data, type }];
      } else {
        return [];
      }
    }

    // Collect all types
    const results = await Promise.all(selectedTypes.map((t) => fetchQuestions(t)));

    // Flatten
    const allQuestions = results.flat();

    // Group + order
    const objective = allQuestions.filter((q) =>
      ["multiple-choice", "multi-select", "true-false"].includes(q.type)
    );
    const openResponse = allQuestions.filter((q) => q.type === "open-response");
    const shortAnswer = allQuestions.filter((q) => q.type === "short-answer");

    // Shuffle objective section
    for (let i = objective.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [objective[i], objective[j]] = [objective[j], objective[i]];
    }

    const finalQuestions = [...objective, ...openResponse, ...shortAnswer];

    return new Response(JSON.stringify({ questions: finalQuestions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error generating unified test:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
