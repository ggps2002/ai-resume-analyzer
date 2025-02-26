import config from "./config";
import { BlobServiceClient } from "@azure/storage-blob";

// Azure Config Variables
const storageConnectionString = config.env.azureStorageAccountNameConnectionString;
const containerName = "resumes";

// Create Blob Service Client
const blobServiceClient = new BlobServiceClient(
    storageConnectionString
);


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
        const response = await fetch("/api/document-to-text", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sendData),
        });
        if(!response) throw new Error("Cant resolve response from api");
        const data = await response.json();
        console.log("Analysis Result:", data);
        return data;
    } catch (error) {
        console.error("Error analyzing document:", error);
    }
    return "";
}
