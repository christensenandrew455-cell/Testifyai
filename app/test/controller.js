// app/test/controller.js

/**
 * Controller for managing test state and flow.
 * Handles question ordering, format normalization,
 * and moving through questions.
 */

export default class TestController {
  constructor(rawQuestions = [], testType = "multiple-choice") {
    this.testType = testType;
    this.questions = this.formatQuestions(rawQuestions);
    this.currentIndex = 0;
  }

  // ✅ Normalize all questions into a consistent format
  formatQuestions(questions) {
    return questions.map((q, i) => ({
      testType: this.testType,
      questionNumber: i + 1,
      question: q.question,
      answers: q.answers || [],
      correctAnswer: q.correct || q.correctAnswer,
      explanation: q.explanation || "",
      userAnswer: null,
      isCorrect: null,
    }));
  }

  // ✅ Get the current question
  getCurrentQuestion() {
    return this.questions[this.currentIndex] || null;
  }

  // ✅ Submit an answer
  answerCurrentQuestion(answer) {
    const current = this.getCurrentQuestion();
    if (!current) return null;

    const isCorrect = answer === current.correctAnswer;
    current.userAnswer = answer;
    current.isCorrect = isCorrect;

    return isCorrect;
  }

  // ✅ Go to the next question (returns false if at end)
  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }

  // ✅ Check if test is complete
  isComplete() {
    return this.currentIndex >= this.questions.length - 1;
  }

  // ✅ Get overall progress
  getProgress() {
    return {
      current: this.currentIndex + 1,
      total: this.questions.length,
      percent: Math.round(
        ((this.currentIndex + 1) / this.questions.length) * 100
      ),
    };
  }
}
