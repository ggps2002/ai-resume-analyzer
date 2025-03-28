"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { deleteJob, getSavedJobsDetails } from "@/lib/actions/database";
import { Button } from "./ui/button";
import { ExternalLink, Trash2Icon } from "lucide-react";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { Skeleton } from "@mui/material";

interface jobInfo {
  id: string;
  title: string;
  company: string;
  url: string;
  valid: string;
  logo: string;
}

interface SavedJobViewProps {
  id: string;
}

function SavedJobView({ id }: SavedJobViewProps) {
  const [jobs, setJobs] = useState<jobInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
    const handleSavedJobs = async () => {
        if (id) {
            setLoading(true);
            try {
                const savedJobs = await getSavedJobsDetails(id);
                console.log("Fetched jobs:", savedJobs);
                setJobs(savedJobs || []);
            } catch (error) {
                console.error("Error fetching saved jobs:", error);
                toast.error("Failed to fetch saved jobs.");
            } finally {
                setLoading(false);
            }
        } else {
          setLoading(false);
        }
    };

    handleSavedJobs();
}, [id]);

  async function handleDelete(id: string) {
    await deleteJob(id);
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    toast.success("Job deleted successfully!");
    setJobs((prev) => prev.filter((job) => job.id !== id));
  }

  return (
    <div className="h-[60vh]">
      <h2 className="text-center mb-4 text-2xl font-bold">Your Saved Jobs</h2>
      <Separator />

      {loading ? (
        <>
          <Skeleton height={80} />
          <Skeleton height={80} />
          <Skeleton height={80} />
          <Skeleton height={80} />
          <Skeleton height={80} />
        </>
      ) : (
        <div className="h-[85%] overflow-y-auto mt-2 scrollbar-hide">
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <div
                key={index}
                className="flex justify-between border-2 rounded-md p-4 mt-2"
              >
                <div>
                  <div className="flex gap-2">
                    <Image src={job.logo} height={30} width={30} alt="logo" />
                    <h2 className="text-lg font-semibold">
                      {job.title} at {job.company}
                    </h2>
                  </div>
                  <p>
                    <strong>Deadline: </strong>
                    {new Date(job.valid).toDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => job.id && handleDelete(job.id)}
                  >
                    <Trash2Icon />
                  </Button>
                  <a href={job.url} target="_blank">
                    <Button className="bg-blue-500 hover:bg-blue-400 ">
                      <ExternalLink />
                      Apply
                    </Button>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex justify-center items-center">
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
                  No Saved Jobs
                </h2>
                <p className="text-muted-foreground text-md">
                  Save some jobs in the job recommendation tab to view jobs.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SavedJobView;
