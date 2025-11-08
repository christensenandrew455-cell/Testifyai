import fetch from "node-fetch"; // Only needed for server environments, Next 14+ supports fetch natively

export async function POST(req) {
  try {
    const {
      topic,
      difficulty,
      numQuestions,
      selectedTypes,
      typeDistribution,
      answerCounts,
    } = await req.json();

    if (!selectedTypes || selectedTypes.length === 0) {
      return new Response(JSON.stringify({ error: "No test types selected." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Helper: call subroutes relative
    async function fetchQuestions(type) {
      const count = typeDistribution?.[type] || numQuestions || 1;
      const numAnswers = answerCounts?.[type] || 4;

      const res = await fetch(`/api/generate-test/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numQuestions: count, numAnswers }),
      });

      const data = await res.json();
      if (data.questions) return data.questions.map((q) => ({ ...q, type }));
      return [];
    }

    // Generate all types
    const results = await Promise.all(selectedTypes.map((t) => fetchQuestions(t)));
    const allQuestions = results.flat();

    // Optional: shuffle objective questions
    const objective = allQuestions.filter((q) =>
      ["multiple-choice", "multi-select", "true-false"].includes(q.type)
    );

    for (let i = objective.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [objective[i], objective[j]] = [objective[j], objective[i]];
    }

    const other = allQuestions.filter((q) =>
      !["multiple-choice", "multi-select", "true-false"].includes(q.type)
    );

    const finalQuestions = [...objective, ...other];

    return new Response(JSON.stringify({ questions: finalQuestions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Unified test generation error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
