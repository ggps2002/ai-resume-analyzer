"use client";

import { uploadToBlobStorageAndExtractTextFromResume } from "@/lib/azure";
import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { getProfileInfo, storeProfileToDatabase } from "@/lib/actions/database";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import NavigateBetweenResumes from "./NavigateBetweenResumes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@mui/material";
import SavedJobView from "./SavedJobView";
import Image from "next/image";

export default function ResumeUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [parsedDocument, setParsedDocument] = useState<Profile | null>(null);
  const inputRef = useRef<any>(null);
  const [profileName, setProfileName] = useState<string>("");
  const [file, setFile] = useState<any>(null);
  const [uploadToDatabaseState, setUploadToDatabaseState] =
    useState<boolean>(false);
  const [uploadingToDatabase, setUploadingToDatabase] =
    useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(true);
  const [profileId, setProfileId] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(false);

  useEffect(() => {
    const handleProfile = async () => {
      if (profileId) {
        setIsloading(true);
        const profileDets = await getProfileInfo(profileId);

        // Ensure loading stops even if no profile is found
        setParsedDocument(profileDets ?? null);
        setIsloading(false);
      } else {
        setIsloading(false); // Stop loading if no profileId is present
      }
    };

    handleProfile();
  }, [profileId]);

  function handleQueryString(queryString: string, id: string) {
    setProfileId(id);
  }

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
      setIsUploading(true);
      setUploadToDatabaseState(false);
      setIsUploaded(false);
      setShowProfile(false);
      console.log("File has been submitted", file);
      for (let i = 0; i <= 97; i++) {
        setTimeout(() => setProgress(i), i * 90);
      }
      const arrayBuffer = await file.arrayBuffer();
      const response = await uploadToBlobStorageAndExtractTextFromResume(
        arrayBuffer
      );
      setProgress(100);
      setFile(null);
      setIsUploading(false);
      const cleanedJson = response.replace(/```json\n?|```/g, "");
      const parsedJson = JSON.parse(cleanedJson);
      console.log(parsedJson);
      // await storeProfileToDatabase(parsedJson)
      setParsedDocument(parsedJson);
      setShowProfile(true);
      setUploadToDatabaseState(true);
    }
  }

  async function handleDatabaseUpload(profileName: string) {
    if (parsedDocument) {
      setUploadingToDatabase(true);
      await storeProfileToDatabase(parsedDocument, profileName);
      setUploadingToDatabase(false);
      setIsUploaded(true);
    }
  }

  function handleCancelUpload() {
    setParsedDocument(null);
    setUploadToDatabaseState(false);
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
    <div className="grid grid-cols-1 lg:grid-cols-2 w-full p-4 gap-6">
      <div className="lg:min-h-full border border-gray-300 shadow-lg rounded-lg p-4">
        <div className="h-[60vh] ">
          <div className="flex items-center justify-center">
            <form
              className={`${
                dragActive ? "bg-gray-300" : "bg-gray-200"
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
                onSubmit={() => file && handleSubmitFile(file)}
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
                      className={`text-blue-500 cursor-pointer ${
                        isUploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={
                        !isUploading
                          ? () => file && handleSubmitFile(file)
                          : undefined
                      }
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
          <div className="flex justify-between mt-2 mb-4 items-start">
            <div className={`flex gap-2 ${!uploadToDatabaseState && "hidden"}`}>
              {isUploaded ? (
                <div>✅Uploaded Successfully</div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    disabled={uploadingToDatabase}
                    onClick={handleCancelUpload}
                  >
                    Cancel
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-500 hover:bg-blue-400">
                        Save Profile
                      </Button>
                    </DialogTrigger>
                    <DialogOverlay className="dialog-overlay" />
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Give a profile name</DialogTitle>
                        <DialogDescription>
                          Give a name to the profile to uniquely identify the
                          resume.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            placeholder="Eg. Profile#{number}"
                            className="col-span-3"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        {uploadingToDatabase ? (
                          <Button
                            disabled={true}
                            className="bg-blue-500 hover:bg-blue-400"
                          >
                            <Loader2 className="animate-spin" />
                            Please wait
                          </Button>
                        ) : (
                          <Button
                            className="bg-blue-500 hover:bg-blue-400"
                            onClick={() => handleDatabaseUpload(profileName)}
                          >
                            Upload Details
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
            <div className={`ml-auto ${!showProfile && "hidden"}`}>
              <NavigateBetweenResumes handleQueryString={handleQueryString} />
            </div>
          </div>
          <Progress
            value={progress}
            className={`${!progress || progress === 100 ? "hidden" : "block"}`}
          />
          {parsedDocument ? (
            !isLoading ? (
              <div className="overflow-y-scroll h-[50%]">
                <h1 className="text-center text-[2rem] font-bold">
                  {parsedDocument.name}
                </h1>
                <div>
                  <h2 className="font-semibold text-[1.5rem]">CONTACT</h2>
                  {Object.entries(parsedDocument.contact).map(
                    ([key, value]) =>
                      String(value).length > 0 && (
                        <p key={key} className="text-lg">
                          <span className="font-medium">{key}</span>:{" "}
                          {String(value) || "N/A"}
                        </p>
                      )
                  )}
                </div>
                <div className="mt-1">
                  <h2 className="font-semibold text-[1.5rem]">EDUCATION</h2>
                  {parsedDocument.education.map(
                    (doc: Education, index: number) => (
                      <div key={index} className="flex">
                        <h3 className="font-semibold text-lg mr-2">
                          {index + 1}.{" "}
                        </h3>
                        <div>
                          {Object.entries(doc).map(
                            ([key, value]) =>
                              String(value).length > 0 && (
                                <p key={key} className="text-lg">
                                  <span className="font-medium">{key}</span>:{" "}
                                  {String(value)}
                                </p>
                              )
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-1">
                  <h2 className="font-semibold text-[1.5rem]">EXPERIENCE</h2>
                  {parsedDocument.experience.map(
                    (doc: Experience, index: number) => (
                      <div key={index} className="flex">
                        <h3 className="font-semibold text-lg mr-2">
                          {index + 1}.{" "}
                        </h3>
                        <div>
                          {Object.entries(doc).map(([key, value]) => (
                            <div key={key}>
                              <div key={key} className="text-lg">
                                <span className="font-medium">{key}</span>:{" "}
                                {Array.isArray(value) ? (
                                  <ul>
                                    {value.map((str, idx) => (
                                      <li key={idx}>
                                        {idx + 1}. {str}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  String(value)
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-1">
                  <h2 className="font-semibold text-[1.5rem]">INTERNSHIPS</h2>
                  {(Array.isArray(parsedDocument.internships)
                    ? parsedDocument.internships
                    : []
                  ).map((doc: Experience, index: number) => (
                    <div key={index} className="flex">
                      <h3 className="font-semibold text-lg mr-2">
                        {index + 1}.{" "}
                      </h3>
                      <div>
                        {Object.entries(doc).map(([key, value]) => (
                          <div key={key}>
                            <div key={key} className="text-lg">
                              <span className="font-medium">{key}</span>:{" "}
                              {Array.isArray(value) ? (
                                <ul>
                                  {value.map((str, idx) => (
                                    <li key={idx}>
                                      {idx + 1}. {str}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                String(value)
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-1">
                  <h2 className="font-semibold text-[1.5rem]">PROJECTS</h2>
                  {parsedDocument.projects?.map(
                    (doc: Project, index: number) => (
                      <div key={index} className="flex">
                        <h3 className="font-semibold text-lg mr-2">
                          {index + 1}.{" "}
                        </h3>
                        <div>
                          {Object.entries(doc).map(([key, value]) => (
                            <div key={key}>
                              <div key={key} className="text-lg">
                                <span className="font-medium">{key}</span>:{" "}
                                {Array.isArray(value) ? (
                                  <ul>
                                    {value.map((str, idx) => (
                                      <li key={idx}>
                                        {idx + 1}. {str}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  String(value)
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-1">
                  <h2 className="font-semibold text-[1.5rem]">SKILLS</h2>
                  {
                    <div className="flex gap-2 text-sm mt-1 flex-wrap">
                      {parsedDocument.skills?.map(
                        (skill: string, index: number) => (
                          <div key={index}>
                            <div className="bg-gray-200 rounded-lg flex justify-center items-center text-center p-2">
                              <p>{skill}</p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  }
                </div>
                {/* <div className="mt-1">
              <h2 className="font-semibold text-[1.5rem]">Query string: {parsedDocument.queryString}</h2>
            </div> */}
              </div>
            ) : (
              <>
                <div className="flex justify-center w-full">
                  <Skeleton width={170} height={60} />
                </div>
                <Skeleton width={120} height={40} />
                <Skeleton width={250} />
                <Skeleton width={250} />
                <Skeleton width={250} />
                <Skeleton width={250} />
                <Skeleton width={250} />
                <Skeleton width={250} />
              </>
            )
          ) : (
            <>
              <div className="flex justify-center items-center">
                <div className="text-center">
                  <div className="flex w-full justify-center items-center">
                    <Image
                      src="/images/planet.png"
                      alt="planet"
                      width={100}
                      height={100}
                    />
                  </div>
                  <h2 className="text-lg font-semibold text-muted-foreground">
                    No Saved Resumes
                  </h2>
                  <p className="text-muted-foreground text-md">
                    Drag and drop or upload a resume to view.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="lg:min-h-full border border-gray-300 shadow-lg rounded-lg p-4">
        <SavedJobView id={profileId} />
      </div>
    </div>
  );
}
