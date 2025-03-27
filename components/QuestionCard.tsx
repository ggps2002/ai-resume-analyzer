import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionCardProps {
  question: string;
}

const QuestionCard = ({ question }: QuestionCardProps) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Question:</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-md">{question}</p>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
