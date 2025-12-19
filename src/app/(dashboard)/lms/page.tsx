"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, FileText, Trophy } from "lucide-react";
import api from "@/lib/api";

const VideoPlayer = ({ title }: { title: string }) => (
  <div className="aspect-video bg-black rounded-xl overflow-hidden relative group cursor-pointer">
    <img
      src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80"
      alt="Lecture Thumbnail"
      className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition"
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <PlayCircle className="h-16 w-16 text-white opacity-80 group-hover:scale-110 transition" />
    </div>
    <div className="absolute bottom-4 left-4">
      <p className="text-white font-bold text-lg">{title}</p>
      <p className="text-gray-300 text-sm">45:00 • Dr. S. Chandra</p>
    </div>
  </div>
);

export default function LMSPage() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleTakeQuiz = async () => {
    try {
      // Mock transcript for now
      const transcript =
        "The Revolt of 1857 was a major uprising in India in 1857–58 against the rule of the British East India Company.";
      const res = await api.post("/lms/quiz/generate", { transcript });
      setQuizData(res.data);
      setShowQuiz(true);
      setCurrentQuestion(0);
      setScore(0);
      setQuizFinished(false);
    } catch (error) {
      console.error("Failed to generate quiz", error);
    }
  };

  const handleAnswer = (selectedOption: string) => {
    if (selectedOption === quizData.questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < quizData.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Modern History</h1>
          <p className="text-gray-400 mt-1">Lecture 14: The Revolt of 1857</p>
        </div>
        <Button
          onClick={handleTakeQuiz}
          className="bg-cyan-600 hover:bg-cyan-500"
        >
          <Trophy className="mr-2 h-4 w-4" />
          Take AI Quiz
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <VideoPlayer title="The Revolt of 1857" />

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5 text-cyan-500" />
              Lecture Summary
            </h2>
            <p className="text-gray-300 leading-relaxed">
              The Revolt of 1857 was a major uprising in India in 1857–58
              against the rule of the British East India Company. Key causes
              included:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1 ml-4">
              <li>Doctrine of Lapse</li>
              <li>Greased Cartridges Issue</li>
              <li>Role of Mangal Pandey</li>
            </ul>
          </div>
        </div>

        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 h-fit">
          <h3 className="font-bold text-white mb-4">Resources</h3>
          <ul className="space-y-3 text-cyan-400 text-sm">
            <li className="cursor-pointer hover:underline flex items-center">
              <span className="mr-2">📄</span> Download PDF Notes
            </li>
            <li className="cursor-pointer hover:underline flex items-center">
              <span className="mr-2">🗺️</span> View Timeline Map
            </li>
          </ul>
        </div>
      </div>

      {/* Quiz Modal Overlay */}
      {showQuiz && quizData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            {!quizFinished ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {quizData.title}
                  </h2>
                  <span className="text-gray-400">
                    Q{currentQuestion + 1}/{quizData.questions.length}
                  </span>
                </div>
                <div className="mb-8">
                  <p className="text-xl text-white mb-6">
                    {quizData.questions[currentQuestion].text}
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {JSON.parse(
                      quizData.questions[currentQuestion].options,
                    ).map((opt: string) => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        className="p-4 bg-gray-800 hover:bg-cyan-900/30 border border-gray-700 hover:border-cyan-500 rounded-xl text-left transition text-gray-300 hover:text-white"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">
                  Quiz Complete!
                </h2>
                <p className="text-xl text-gray-400 mb-8">
                  You scored{" "}
                  <span className="text-cyan-500 font-bold">
                    {score}/{quizData.questions.length}
                  </span>
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => setShowQuiz(false)} variant="outline">
                    Close
                  </Button>
                  <Button
                    onClick={handleTakeQuiz}
                    className="bg-cyan-600 hover:bg-cyan-500"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
