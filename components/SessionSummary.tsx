import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionSummaryProps {
  questions: string[];
  answers: string[];
}

const SessionSummary = ({ questions, answers }: SessionSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Session Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {questions.map((question, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold">{question}</h3>
            <p className="text-gray-600">
              {answers[index] || "No answer provided."}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SessionSummary;
