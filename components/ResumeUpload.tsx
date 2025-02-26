"use client";

import { uploadToBlobStorageAndExtractTextFromResume } from "@/lib/azure";
import { useRef, useState } from "react";
import { Progress } from "@/components/ui/progress"


export default function ResumeUpload() {
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState<boolean>(false);
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
      console.log("File has been submitted", file);
      setProgress(33)
      const response = await uploadToBlobStorageAndExtractTextFromResume(file);
      setProgress(100)
      setFile(null)
      console.log(response);
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
      <div className="flex items-center justify-center">
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
                  className="text-blue-500 cursor-pointer"
                  onClick={handleSubmitFile}
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
      <Progress value={progress} className={`mt-2 ${!progress || progress===100? "hidden" : "block"}`}/>
    </>

  );
}