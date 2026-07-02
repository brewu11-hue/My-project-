import React, { useState } from "react";
import { BookOpen, GraduationCap, CheckCircle, ChevronDown, ChevronUp, AlertTriangle, Lightbulb } from "lucide-react";
import { EDUCATIONAL_SECTIONS } from "../data";
import { EducationalSection } from "../types";

export default function EducationalHub() {
  const [selectedSection, setSelectedSection] = useState<string | null>("credit-scores-sa");
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizFeedback, setQuizFeedback] = useState<{ [key: string]: { correct: boolean; msg: string } }>({});

  const toggleSection = (id: string) => {
    setSelectedSection(selectedSection === id ? null : id);
  };

  // Fun SA Micro-quizzes to lock in financial literacy
  const quizzes: { [key: string]: { question: string; options: string[]; answer: string; feedback: string } } = {
    "credit-scores-sa": {
      question: "Which of these is the most effective way to improve your credit score in South Africa?",
      options: [
        "Paying a credit repair company R1,000 to delete your record.",
        "Paying off store account balances in full and on time every month.",
        "Closing all your bank accounts and only using cash."
      ],
      answer: "Paying off store account balances in full and on time every month.",
      feedback: "Correct! Consistent payment history makes up 35% of your score. There is no legal shortcut to erasing accurate defaults—avoid credit repair scams!"
    },
    "debt-management-sa": {
      question: "If a clothing account interest rate is 24% per year, what happens if you buy clothes on a 12-month interest account?",
      options: [
        "You pay the exact original price listed on the tag.",
        "You pay substantially more than the original price due to compound interest.",
        "The clothing store pays you interest."
      ],
      answer: "You pay substantially more than the original price due to compound interest.",
      feedback: "Correct! Buying consumer goods like clothes on credit can end up costing you 40% to 50% more once interest and monthly admin fees are added."
    },
    "budgeting-sa": {
      question: "What is the best way to budget for 'Black Tax' or family support obligations in South Africa?",
      options: [
        "Avoid supporting your family entirely to build your own savings.",
        "Send money whenever asked, even if it forces you into store card debt.",
        "Set a fixed, honest family support amount in your monthly budget and stick to it."
      ],
      answer: "Set a fixed, honest family support amount in your monthly budget and stick to it.",
      feedback: "Correct! Setting healthy boundaries and a dedicated, predictable budget line for family support protects your own financial safety while supporting loved ones."
    },
    "savings-stokvels": {
      question: "How do Tax-Free Savings Accounts (TFSAs) help South Africans grow their money?",
      options: [
        "They give you free government grants of R36,000 every year.",
        "All interest, dividends, and growth inside the account are 100% tax-free.",
        "They guarantee you get approved for standard clothing store cards."
      ],
      answer: "All interest, dividends, and growth inside the account are 100% tax-free.",
      feedback: "Correct! TFSAs let your investments compound without SARS taking a single cent. It's one of SA's best structures for building long-term generational wealth."
    }
  };

  const handleAnswerSubmit = (sectionId: string, choice: string) => {
    const quiz = quizzes[sectionId];
    const isCorrect = choice === quiz.answer;
    setQuizAnswers((prev) => ({ ...prev, [sectionId]: choice }));
    setQuizFeedback((prev) => ({
      ...prev,
      [sectionId]: {
        correct: isCorrect,
        msg: isCorrect ? `🎉 Correct! ${quiz.feedback}` : `❌ Try again! ${quiz.feedback}`
      }
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm" id="educational-academy-card">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">South African Financial Academy</h3>
          <p className="text-xs text-gray-500">Master credit scores, debt management, and the power of savings structures</p>
        </div>
      </div>

      <div className="space-y-4">
        {EDUCATIONAL_SECTIONS.map((section) => {
          const isOpen = selectedSection === section.id;
          const quiz = quizzes[section.id];
          const hasAnswered = quizAnswers[section.id];
          const feedback = quizFeedback[section.id];

          return (
            <div
              key={section.id}
              className={`border rounded-xl transition-all overflow-hidden ${
                isOpen ? "border-indigo-600 bg-indigo-50/10" : "border-gray-100 bg-white hover:bg-gray-50/50"
              }`}
            >
              {/* Header trigger */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm bg-indigo-100 text-indigo-800 tracking-wider">
                      {section.category}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{section.title}</h4>
                  </div>
                  <p className="text-xs text-gray-500">{section.subtitle}</p>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                )}
              </button>

              {/* Collapsed content */}
              {isOpen && (
                <div className="border-t border-gray-100 p-4 space-y-4 text-xs text-gray-600">
                  <p className="leading-relaxed text-gray-700 font-medium">{section.summary}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Key takeaways */}
                    <div className="space-y-2.5">
                      <h5 className="font-bold text-gray-900 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        Key Takeaways
                      </h5>
                      <ul className="space-y-2">
                        {section.keyPoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[11px] leading-relaxed">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* SA Reality focus */}
                    <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/40 space-y-2">
                      <h5 className="font-bold text-amber-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        South African Context
                      </h5>
                      <p className="leading-relaxed text-[11px] text-amber-900">
                        {section.saReality}
                      </p>
                    </div>
                  </div>

                  {/* Micro Quiz */}
                  {quiz && (
                    <div className="border-t border-gray-200/60 pt-4 mt-2 space-y-3">
                      <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                        <Lightbulb className="w-4 h-4 text-indigo-600" />
                        <span>Practice Literacy Check</span>
                      </div>
                      
                      <p className="font-semibold text-gray-800 leading-snug">{quiz.question}</p>

                      <div className="space-y-2">
                        {quiz.options.map((opt, idx) => {
                          const isSelected = hasAnswered === opt;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleAnswerSubmit(section.id, opt)}
                              className={`w-full p-2.5 rounded-lg border text-left text-[11px] transition-all leading-normal flex items-start gap-2.5 ${
                                isSelected
                                  ? "border-indigo-600 bg-indigo-50 text-indigo-950 font-medium"
                                  : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] shrink-0 font-semibold bg-gray-50 text-gray-500">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {feedback && (
                        <div
                          className={`p-3 rounded-lg border text-[11px] leading-relaxed transition-all ${
                            feedback.correct
                              ? "bg-emerald-50 border-emerald-100 text-emerald-900"
                              : "bg-rose-50 border-rose-100 text-rose-900"
                          }`}
                        >
                          {feedback.msg}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
