import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, MicOff } from "lucide-react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import config from "@/lib/config";

interface TranscriptionProps {
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
  onNext: (transcription: string) => void;
  answers: string[];
  currentQ: number;
}

const speechAssessmentKey = config.env.azureSpeechAssessmentKey;
const speechAssessmentRegion = config.env.azureSpeechAssessmentRegion;

const Transcription = ({
  isRecording,
  onNext,
  setIsRecording,
  answers,
  currentQ,
}: TranscriptionProps) => {
  const [partialTranscription, setPartialTranscription] = useState<string>("");
  const [finalTranscription, setFinalTranscription] = useState<string>("");

  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null);

  // 🎯 Load previously stored answer when revisiting the question
  useEffect(() => {
    setFinalTranscription(answers[currentQ] || "");
  }, [answers, currentQ]);

  // 🎤 Start Real-Time Transcription
  const handleStartRecording = async () => {
    try {
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        speechAssessmentKey,
        speechAssessmentRegion
      );
      speechConfig.speechRecognitionLanguage = "en-US";

      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      recognizerRef.current = recognizer;

      // 🎯 Handle partial transcription
      recognizer.recognizing = (_, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizingSpeech) {
          setPartialTranscription(e.result.text);
        }
      };

      // ✅ Handle final transcription
      recognizer.recognized = (_, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          setFinalTranscription((prev) => `${prev} ${e.result.text}`.trim());
          setPartialTranscription("");
        }
      };

      recognizer.canceled = (_, e) => {
        console.error("Recognition canceled:", e);
      };

      recognizer.sessionStopped = () => {
        console.log("Session stopped.");
        recognizer.stopContinuousRecognitionAsync();
      };

      recognizer.startContinuousRecognitionAsync(() => {
        console.log("Recognition started.");
        setIsRecording(true);
        setPartialTranscription("Listening... 🎤");
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsRecording(false);
    }
  };

  // 🛑 Stop Real-Time Transcription
  const handleStopRecording = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(() => {
        console.log("Stopped recognition.");
        setIsRecording(false);
        onNext(finalTranscription);  // Save answer for the current question
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          className="bg-blue-500 hover:bg-blue-400"
          onClick={handleStartRecording}
          disabled={isRecording}
        >
          <Mic />
          {isRecording ? "Recording..." : "Start Recording"}
        </Button>

        <Button
          className="bg-red-500 hover:bg-red-400"
          onClick={handleStopRecording}
          disabled={!isRecording}
        >
          <MicOff />
          Stop Recording
        </Button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        <p className="text-sm text-gray-600">
          {isRecording ? (
            <Loader2 className="inline animate-spin mr-2" />
          ) : (
            "Transcription:"
          )}
        </p>
        <p className="text-gray-800 whitespace-pre-line">
          <strong>Partial:</strong> {partialTranscription}
          <br />
          <strong>Final:</strong> {finalTranscription}
        </p>
      </div>
    </div>
  );
};

export default Transcription;
