"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import QuestionCard from "@/components/QuestionCard";
import Transcription from "@/components/Transcription";
import SessionSummary from "@/components/SessionSummary";
import Feedback from "@/components/Feedback";
import { useRouter } from "next/navigation";

function InterviewCoach() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(4).fill("")); // Initialize empty answers array
  const [isRecording, setIsRecording] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const router = useRouter();

  const questions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What is your biggest strength?",
    "Describe a challenge you faced at work.",
  ];

  // ✅ Save answer for the current question
  const handleAnswers = (transcribedText: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = transcribedText;  // Store the answer at the specific index
    setAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  const handleFinish = () => {
    router.refresh();
    window.location.reload();
  };

  return (
    <div className="flex justify-center items-center border-2 m-2 border-gray-200 bg-[#FAFAFA] h-[89.5vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
      <div className="w-[90%] h-full p-6 flex flex-col justify-between">
        {sessionCompleted ? (
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
            <SessionSummary questions={questions} answers={answers} />
            <Feedback answers={answers} />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-center">👨🏻‍💼 Interview Prep</h1>
            <div className="flex flex-col gap-2 mt-6">
              <QuestionCard question={questions[currentQuestion]} />
              <Transcription
                isRecording={isRecording}
                onNext={handleAnswers}
                setIsRecording={setIsRecording}
                answers={answers}
                currentQ={currentQuestion}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4">
          {!sessionCompleted && currentQuestion !== 0 ? (
            <Button
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              className="bg-blue-500 hover:bg-blue-400"
            >
              Previous
            </Button>
          ) : (
            <div className="w-2 h-2" />
          )}

          <Button
            className="bg-blue-500 hover:bg-blue-400"
            onClick={() => {
              if (sessionCompleted) {
                handleFinish();
              } else {
                handleNextQuestion();
              }
            }}
          >
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InterviewCoach;
