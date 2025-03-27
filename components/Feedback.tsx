import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLLMScore, getLLMSentiment } from "@/lib/llm";
import { useEffect, useState } from "react";

const questions = [
  "Tell me about yourself.",
  "Why should we hire you?",
  "What is your biggest strength?",
  "Describe a challenge you faced at work.",
];

interface FeedbackProps {
  answers: string[];
}


const Feedback = ({ answers }: FeedbackProps) => {
  const [scores, setScores] = useState<string[]>([]);
  const [sentiments, setSentiments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      const fetchedScores = await Promise.all(
        answers.map((answer, index) => getLLMScore(questions[index], answer))
      );

      const fetchedSentiments = await Promise.all(
        answers.map((answer, index) => getLLMSentiment(questions[index], answer))
      );

      setScores(fetchedScores);
      setSentiments(fetchedSentiments);
      setIsLoading(false)
    };

    fetchFeedback();
  }, [answers]);

  return (
    isLoading ? (
      <div>
        Loading...
      </div>
    ) : (
      <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Feedback & Score</CardTitle>
      </CardHeader>

      <CardContent>
        {answers.map((answer, index) => {
          const sentiment = sentiments[index];
          const score = scores[index];

          return (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-semibold text-lg">
                Q{index + 1}: 
                {sentiment === "positive" ? " ✅ Positive" : sentiment === "negative" ? " ❌ Negative" : " 😐 Neutral"}
              </h3>
              <p className="text-gray-600">
                {answer}
              </p>
              <p className="text-gray-800 font-bold">Score: {score}/10</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
      )
  );
};

export default Feedback;
