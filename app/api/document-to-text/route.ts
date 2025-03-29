import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";

import config from "@/lib/config";
import { NextResponse } from "next/server";
// import { PrebuiltLayoutModel } from "@/prebuilt-layout";

export async function POST(req: Request) {
    try {
        const { fileUrl } = await req.json();
        const key = config.env.azureDocumentIntelligenceKey;
        const endpoint = config.env.azureDocumentIntelligenceEndpoint;

        if (!endpoint || !key) {
            return NextResponse.json({ error: "Missing Azure credentials" }, { status: 500 });
        }

        if (!fileUrl) {
            return NextResponse.json({ error: "Missing file URL" }, { status: 400 });
        }

        const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
        const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-layout", fileUrl);
        const analyzeResult = await poller.pollUntilDone();

        const { pages, tables } = analyzeResult;

        // Ensure analyzeResult?.documents is not undefined
        if (!analyzeResult) {
            throw new Error("No documents found in the analysis result");
        }

        // Extract text content from all pages
        const extractedText = pages?.map(page =>
            page.lines?.map(line => line.content).join("\n")
        ).join("\n") || "";

        // Log the extracted text for debugging
        console.log("Extracted Text:", extractedText);

        return NextResponse.json({ text: extractedText, tables }, { status: 200 });
    } catch (error) {
        console.error("Error processing document:", error);
        return NextResponse.json({ error: "Failed to analyze document" }, { status: 500 });
    }
}

