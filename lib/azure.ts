"use server";

import config from "./config";
import { BlobServiceClient } from "@azure/storage-blob";
import { getLLMFormatResumeText } from "./llm";
// import * as sdk from "microsoft-cognitiveservices-speech-sdk";
// import { Readable } from "stream";

// Azure Config Variables
const storageConnectionString =
  config.env.azureStorageAccountNameConnectionString;
// const speechAssessmentKey = config.env.azureSpeechAssessmentKey;
// const speechAssessmentRegion = config.env.azureSpeechAssessmentRegion;
const apiEndPoint = config.env.apiEndpoint;

const containerName = "resumes";
// const audioContainerName = "audio";

// Create Blob Service Client
const blobServiceClient = new BlobServiceClient(storageConnectionString);

// ✅ Upload Resume to Azure Blob Storage using Storage Key
export async function uploadToBlobStorageAndExtractTextFromResume(file: File): Promise<string> {
  if (!file) throw new Error("No file provided");

  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Ensure container exists
  const exists = await containerClient.exists();
  if (!exists) {
      console.log(`Creating container: ${containerName}`);
      await containerClient.create();
  }

  // Generate unique file name
  const blobName = `${Date.now()}-${file.name}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Upload the file
  await blockBlobClient.uploadData(file);
  console.log("File uploaded successfully:", blockBlobClient.url);

  const sendData = {
      fileUrl : blockBlobClient.url
  }
  try {
      const response = await fetch(`${apiEndPoint}/api/document-to-text`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(sendData),
      });
      if(!response) throw new Error("Cant resolve response from api");
      const data = await response.json();
      const llmResponse = await getLLMFormatResumeText(data.text);
      return llmResponse;
  } catch (error) {
      console.error("Error analyzing document:", error);
  }
  return "";
}

// // ✅ Upload audio file to Blob Storage
// export async function uploadToBlobStorage(
//   audioBuffer: Buffer
// ): Promise<string> {
//   const containerClient =
//     blobServiceClient.getContainerClient(audioContainerName);

//   // Ensure the container exists
//   await containerClient.createIfNotExists();

//   const blobName = `audio-${Date.now()}.wav`;
//   const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//   await blockBlobClient.uploadData(audioBuffer, {
//     blobHTTPHeaders: { blobContentType: "audio/wav" },
//   });

//   console.log(`Uploaded audio to Blob Storage: ${blobName}`);
//   return blockBlobClient.url;
// }

// // ✅ Helper function to download blob as a buffer
// async function downloadBlobAsBuffer(blobUrl: string): Promise<Buffer> {
//   const blobName = new URL(blobUrl).pathname.split("/").pop();
//   if (!blobName) {
//     throw new Error("Invalid blob URL");
//   }

//   const containerClient =
//     blobServiceClient.getContainerClient(audioContainerName);
//   const blobClient = containerClient.getBlobClient(blobName);

//   const downloadResponse = await blobClient.download();
//   const chunks: Buffer[] = [];

//   return new Promise((resolve, reject) => {
//     downloadResponse.readableStreamBody?.on("data", (chunk) => {
//       chunks.push(chunk);
//     });

//     downloadResponse.readableStreamBody?.on("end", () => {
//       resolve(Buffer.concat(chunks));
//     });

//     downloadResponse.readableStreamBody?.on("error", (err) => {
//       reject(err);
//     });
//   });
// }

// // ✅ Convert Buffer to Readable Stream for Azure SDK
// function bufferToStream(buffer: Buffer): Readable {
//   const readable = new Readable();
//   readable.push(buffer);
//   readable.push(null);
//   return readable;
// }

// // ✅ Perform Pronunciation Assessment
// export async function assessPronunciationFromBlob(blobUrl: string): Promise<{
//   accuracyScore: number;
//   fluencyScore: number;
//   completenessScore: number;
//   prosodyScore: number;
// }> {
//   try {
//     console.log(`Starting assessment for blob: ${blobUrl}`);

//     // 1️⃣ Download blob as buffer
//     const buffer = await downloadBlobAsBuffer(blobUrl);

//     const speechConfig = sdk.SpeechConfig.fromSubscription(
//       speechAssessmentKey,
//       speechAssessmentRegion
//     );

//     const audioStream = sdk.AudioInputStream.createPushStream();
//     const stream = bufferToStream(buffer);

//     // ✅ Ensure the entire stream is written before closing
//     await new Promise<void>((resolve, reject) => {
//       stream.on("data", (chunk) => {
//         audioStream.write(chunk);
//       });

//       stream.on("end", () => {
//         audioStream.close();
//         resolve();
//       });

//       stream.on("error", (error) => {
//         console.error("Stream error:", error);
//         reject(error);
//       });
//     });

//     const audioConfig = sdk.AudioConfig.fromStreamInput(audioStream);

//     // ✅ Pronunciation assessment config
//     const referenceText = "How are you?";
//     const pronunciationAssessmentConfig = new sdk.PronunciationAssessmentConfig(
//       referenceText,
//       sdk.PronunciationAssessmentGradingSystem.HundredMark,
//       sdk.PronunciationAssessmentGranularity.Phoneme,
//       true
//     );

//     pronunciationAssessmentConfig.enableProsodyAssessment = true;

//     const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
//     pronunciationAssessmentConfig.applyTo(recognizer);

//     return new Promise((resolve, reject) => {
//       let scores = {
//         accuracyScore: 0,
//         fluencyScore: 0,
//         completenessScore: 0,
//         prosodyScore: 0
//       };

//       // ✅ Capture recognized speech in real-time
//       recognizer.recognizing = (s, e) => {
//         console.log("Recognizing:", e.result.text);
//       };

//       recognizer.recognized = (s, e) => {
//         if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
//           console.log("Pronunciation assessment for:", e.result.text);

//           const result = sdk.PronunciationAssessmentResult.fromResult(e.result);

//           scores = {
//             accuracyScore: result.accuracyScore || 0,
//             fluencyScore: result.fluencyScore || 0,
//             completenessScore: result.completenessScore || 0,
//             prosodyScore: result.prosodyScore || 0
//           };
//         } else {
//           console.warn("No speech recognized.");
//         }
//       };

//       recognizer.canceled = (s, e) => {
//         console.error(`Recognition canceled: ${e.reason}`);
//         recognizer.close();
//         reject(`Recognition canceled: ${e.reason}`);
//       };

//       recognizer.sessionStopped = () => {
//         console.log("Session stopped.");
//         recognizer.close();
//         resolve(scores);
//       };

//       // ✅ Use single recognition instead of continuous
//       const keywordModel = sdk.KeywordRecognitionModel.fromFile("path/to/your/keyword/file");
//       recognizer.startKeywordRecognitionAsync(
//         keywordModel,
//         () => {
//           console.log("Keyword recognition started successfully.");
//         },
//         (error: string) => {
//           console.error("Error starting recognition:", error);
//           recognizer.close();
//           reject(new Error(error));
//         }
//       );
//     });
//   } catch (error) {
//     console.error("Error in pronunciation assessment:", error);
//     throw error;
//   }
// }

// export async function transcribeAudioFromBlob(blobUrl: string): Promise<string> {
//   try {
//     console.log(`Starting transcription for blob: ${blobUrl}`);

//     // 1️⃣ Download blob as buffer
//     const buffer = await downloadBlobAsBuffer(blobUrl);

//     const speechConfig = sdk.SpeechConfig.fromSubscription(
//       process.env.AZURE_SUBSCRIPTION_KEY || "",
//       process.env.AZURE_REGION || ""
//     );

//     const audioStream = sdk.AudioInputStream.createPushStream();
//     const stream = bufferToStream(buffer);

//     // ✅ Write stream to audio input
//     await new Promise<void>((resolve, reject) => {
//       stream.on("data", (chunk) => {
//         audioStream.write(chunk);
//       });

//       stream.on("end", () => {
//         audioStream.close();
//         resolve();
//       });

//       stream.on("error", (error) => {
//         console.error("Stream error:", error);
//         reject(error);
//       });
//     });

//     const audioConfig = sdk.AudioConfig.fromStreamInput(audioStream);
//     const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

//     return new Promise((resolve, reject) => {
//       let transcript = "";

//       // 🎯 Handle Recognized Speech
//       recognizer.recognized = (s, e) => {
//         if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
//           console.log(`Recognized: ${e.result.text}`);
//           transcript += e.result.text + " ";
//         } else {
//           console.warn("No speech recognized.");
//         }
//       };

//       // 🎯 Handle Continuous Recognition
//       recognizer.canceled = (s, e) => {
//         if (e.reason === sdk.CancellationReason.EndOfStream) {
//           console.log("End of stream reached.");
//           recognizer.stopContinuousRecognitionAsync();
//           resolve(transcript.trim());
//         } else if (e.reason === sdk.CancellationReason.Error) {
//           console.error("Recognition error:", e.errorDetails);
//           reject(new Error(`Recognition canceled: ${e.errorDetails}`));
//         }
//       };

//       // 🎯 Handle Session Stopped
//       recognizer.sessionStopped = () => {
//         console.log("Session stopped.");
//         recognizer.stopContinuousRecognitionAsync();
//         resolve(transcript.trim());
//       };

//       // ✅ Start Continuous Recognition
//       recognizer.startContinuousRecognitionAsync();
//     });

//   } catch (error) {
//     console.error("Error in transcription:", error);
//     throw error;
//   }
// }

// // ✅ Delete the blob from Azure Storage after processing
// export async function deleteBlob(blobUrl: string): Promise<void> {
//   const containerClient =
//     blobServiceClient.getContainerClient(audioContainerName);

//   const blobName = blobUrl.split("/").pop() || "";
//   const blobClient = containerClient.getBlobClient(blobName);

//   await blobClient.deleteIfExists();
//   console.log(`Deleted blob: ${blobName}`);
// }

// export async function audioAssessment(audioBlob: Blob) {
//   try {
//     // 1️⃣ Convert Blob to Buffer
//     const audioBuffer = Buffer.from(await audioBlob.arrayBuffer());

//     // 2️⃣ Upload to Blob Storage (audio container)
//     const blobUrl = await uploadToBlobStorage(audioBuffer);
//     console.log("Blob uploaded:", blobUrl);

//     // 3️⃣ Perform Pronunciation Assessment
//     // const result = await assessPronunciationFromBlob(blobUrl);
//     // console.log("Assessment result:", result);

//     const result = transcribeAudioFromBlob(blobUrl);
//     console.log("Transcribed Text:", result)

//     // 4️⃣ Delete blob after processing
//     // await deleteBlob(blobUrl);

//     return {
//       success: true,
//       result,
//     };
//   } catch (error) {
//     console.error("Error in audio assessment:", error);
//     return {
//       success: false,
//       error: "Failed to process audio",
//     };
//   }
// }
