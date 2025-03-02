"use client";

import { uploadToBlobStorageAndExtractTextFromResume } from "@/lib/azure";
import { Key, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress"
import { array } from "zod";


export default function ResumeUpload() {
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [parsedDocument, setParsedDocument] = useState<any>(null)
  const inputRef = useRef<any>(null);
  const [file, setFile] = useState<any>(null);

  function handleChange(e: any) {
    e.preventDefault();
    console.log("File has been added");
    if (e.target.files && e.target.files[0]) {
      console.log("File changed to:", e.target.files[0]);
      setFile(e.target.files[0]);
    }
  }


  async function handleSubmitFile(e: any) {
    if (!file) {
      // no file has been submitted
      console.log("No file has been submitted");
    } else {
      // write submit logic here
      setIsUploading(true)
      console.log("File has been submitted", file);
      for (let i = 0; i <= 97; i++) {
        setTimeout(() => setProgress(i), i * 90);
      }
      const response = await uploadToBlobStorageAndExtractTextFromResume(file);
      setProgress(100)
      setFile(null)
      setIsUploading(false)
      let cleanedJson = response.replace(/```json\n?|```/g, '');
      let parsedJson = JSON.parse(cleanedJson);
      console.log(parsedJson)
      setParsedDocument(parsedJson);
    }
  }

  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log("File changed to after drag:", e.dataTransfer.files[0]);
      setFile(e.dataTransfer.files[0]);
    }
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function removeFile() {
    setFile(null);
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }

  return (
    <>
      <div className="flex items-center justify-center h-1/2">
        <form
          className={`${dragActive ? "bg-gray-300" : "bg-gray-200"
            } p-4 w-full rounded-lg min-h-[10rem] text-center flex flex-col items-center justify-center border-2 border-dashed border-gray-400`}
          onDragEnter={handleDragEnter}
          onSubmit={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          {/* this input element allows us to select files for upload. We make it hidden so we can activate it when the user clicks select files */}
          <input
            placeholder="fileInput"
            className="hidden"
            ref={inputRef}
            type="file"
            multiple={false}
            onChange={handleChange}
            accept=".doc, .docx,.txt,.pdf"
            onSubmit={() => handleSubmitFile(file)}
          />

          <p>
            Drag & Drop your Resume or{" "}
            <span
              className="font-bold text-blue-600 cursor-pointer"
              onClick={openFileExplorer}
            >
              <u>Browse Files</u>
            </span>{" "}
            to upload
          </p>

          <div className="flex flex-col items-center p-3">
            {file && (
              <div className="flex flex-row space-x-5">
                <span>{file.name}</span>
                <span
                  className="text-red-500 cursor-pointer"
                  onClick={removeFile}
                >
                  remove
                </span>
                <span
                  className={`text-blue-500 cursor-pointer ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={!isUploading ? handleSubmitFile : undefined}
                >
                  upload
                </span>
              </div>
            )}
          </div>

          {/* <button
          className="bg-black rounded-lg p-2 mt-3 w-auto"
          onClick={handleSubmitFile}
        >
          <span className="p-2 text-white">Submit</span>
        </button> */}
        </form>
      </div>
      <Progress value={progress} className={`mb-1 ${!progress || progress === 100 ? "hidden" : "block"}`} />
      {
        parsedDocument && (
          <div className="overflow-y-scroll h-[44%]">
            <h1 className="text-center text-[2rem] font-bold">{parsedDocument.name}</h1>
            <div>
              <h2 className="font-semibold text-[1.5rem]">CONTACT</h2>
              {Object.entries(parsedDocument.contact).map(([key, value]) => (
                <p key={key} className="text-lg"><span className="font-medium">{key}</span>: {String(value) || "N/A"}</p>
              ))}
            </div>
            <div className="mt-1">
              <h2 className="font-semibold text-[1.5rem]">EDUCATION</h2>
              {
                parsedDocument.education.map((doc: { [s: string]: unknown; } | ArrayLike<unknown>) => (
                  Object.entries(doc).map(([key, value]) => (
                    <p key={key} className="text-lg"><span className="font-medium">{key}</span>: {String(value) || "N/A"}</p>
                  ))
                ))
              }
            </div>
            <div className="mt-1">
              <h2 className="font-semibold text-[1.5rem]">EXPERIENCE</h2>
              {
                parsedDocument.experience.map((doc: { [s: string]: unknown; } | ArrayLike<unknown>, index: number) => (
                  <div key={index} className="flex">
                    <h3 className="font-semibold text-lg mr-2">{index + 1}. </h3>
                    <div>
                      {
                        Object.entries(doc).map(([key, value]) => (
                          <div key={key}>
                            <div key={key} className="text-lg"><span className="font-medium">{key}</span>: {
                              Array.isArray(value) ? (
                                <ul>
                                  {
                                    value.map((str, idx) => (
                                      <li key={idx}>
                                        {idx+1}. {str}
                                      </li>
                                    ))
                                  }
                                </ul>
                              ) : (
                                String(value)
                              )
                            }</div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="mt-1">
              <h2 className="font-semibold text-[1.5rem]">INTERNSHIPS</h2>
              {
                parsedDocument.internships?.map((doc: { [s: string]: unknown; } | ArrayLike<unknown>, index: number) => (
                  <div key={index} className="flex">
                    <h3 className="font-semibold text-lg mr-2">{index + 1}. </h3>
                    <div>
                      {
                        Object.entries(doc).map(([key, value]) => (
                          <div key={key}>
                            <div key={key} className="text-lg"><span className="font-medium">{key}</span>: {
                              Array.isArray(value) ? (
                                <ul>
                                  {
                                    value.map((str, idx) => (
                                      <li key={idx}>
                                        {idx+1}. {str}
                                      </li>
                                    ))
                                  }
                                </ul>
                              ) : (
                                String(value)
                              )
                            }</div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="mt-1">
              <h2 className="font-semibold text-[1.5rem]">PROJECTS</h2>
              {
                parsedDocument.projects?.map((doc: { [s: string]: unknown; } | ArrayLike<unknown>, index: number) => (
                  <div key={index} className="flex">
                    <h3 className="font-semibold text-lg mr-2">{index + 1}. </h3>
                    <div>
                      {
                        Object.entries(doc).map(([key, value]) => (
                          <div key={key}>
                            <div key={key} className="text-lg"><span className="font-medium">{key}</span>: {
                              Array.isArray(value) ? (
                                <ul>
                                  {
                                    value.map((str, idx) => (
                                      <li key={idx}>
                                        {idx+1}. {str}
                                      </li>
                                    ))
                                  }
                                </ul>
                              ) : (
                                String(value)
                              )
                            }</div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="mt-1">
              <h2 className="font-semibold text-[1.5rem]">SKILLS</h2>
              {
                <div className="flex gap-2 text-sm mt-1 flex-wrap">
                  {
                     parsedDocument.skills?.map((skill: string, index: number) => (
                      <div key={index}>
                        <div className="bg-gray-200 rounded-lg flex justify-center items-center text-center p-2">
                          <p>{skill}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              }
            </div>
          </div>
        )
      }
    </>

  );
}