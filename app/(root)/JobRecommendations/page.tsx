'use client'

import JobFilterSidebar from "@/components/JobFilterSidebar"
import JobRecommendations from "@/components/JobRecommendations"
import { useState } from "react"

export default function Page() {
  const [toggleShow, setToggleShow] = useState<boolean>(false);
  const [jobSearchParams, setJobSearchParams] = useState<Filters>({
    location: '',
    jobType: '',
    experienceLevel: '',
    isRemote: undefined,
})
  function handleToggle() {
    setToggleShow(!toggleShow);
  }
  return (
    <div className="flex justify-center items-center border-2 m-2 border-gray-200 bg-[#FAFAFA] h-[89.5vh] overflow-hidden">
      <JobFilterSidebar onFilterChange={(filters) => { setJobSearchParams(filters) }} show={toggleShow} handleToggle={handleToggle} />
      <JobRecommendations jobSearchParams={jobSearchParams} handleToggle={handleToggle} />
    </div>
  )
}
