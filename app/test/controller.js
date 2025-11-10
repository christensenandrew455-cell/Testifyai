// app/test/controller.js

/**
 * TestController
 * ----------------------------
 * Core logic for test execution and tracking.
 * - Normalizes raw questions into consistent structure.
 * - Tracks current question, answers, correctness, progress.
 * - Can later sync results to server (via /api/progress).
 */

export default class TestController {
  constructor(rawQuestions = [], testType = "multiple-choice") {
    this.testType = testType;
    this.questions = this.formatQuestions(rawQuestions);
    this.currentIndex = 0;
  }

  /**
   * Normalize questions into consistent internal format
   */
  formatQuestions(questions) {
    return questions.map((q, i) => ({
      id: crypto.randomUUID?.() || `q_${i}`,
      testType: this.testType,
      questionNumber: i + 1,
      question: q.question,
      answers: q.answers || [],
      correctAnswer: q.correct || q.correctAnswer,
      explanation: q.explanation || "",
      userAnswer: null,
      isCorrect: null,
      timestamp: null,
    }));
  }

  /**
   * Return current question object
   */
  getCurrentQuestion() {
    return this.questions[this.currentIndex] || null;
  }

  /**
   * Submit an answer for current question
   */
  answerCurrentQuestion(answer) {
    const current = this.getCurrentQuestion();
    if (!current) return null;

    const isCorrect = answer === current.correctAnswer;

    current.userAnswer = answer;
    current.isCorrect = isCorrect;
    current.timestamp = new Date().toISOString();

    return isCorrect;
  }

  /**
   * Advance to the next question (returns false if at end)
   */
  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }

  /**
   * Check if the test is complete
   */
  isComplete() {
    return this.currentIndex >= this.questions.length - 1;
  }

  /**
   * Return overall test progress
   */
  getProgress() {
    return {
      current: this.currentIndex + 1,
      total: this.questions.length,
      percent: Math.round(
        ((this.currentIndex + 1) / this.questions.length) * 100
      ),
    };
  }

  /**
   * Save progress locally (client-side)
   */
  saveProgress() {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("testProgress", JSON.stringify(this.questions));
  }

  /**
   * Load progress from storage (client-side)
   */
  loadProgress() {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem("testProgress");
    if (stored) {
      const parsed = JSON.parse(stored);
      this.questions = parsed;
      this.currentIndex =
        parsed.findIndex((q) => q.userAnswer === null) || 0;
    }
  }

  /**
   * 🔜 (Future-ready) Sync progress with server
   */
  async syncProgressToServer(userId) {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          testType: this.testType,
          questions: this.questions,
        }),
      });
    } catch (err) {
      console.error("❌ Failed to sync progress:", err);
    }
  }
}
