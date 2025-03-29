import config from "../config";

const apiEndPoint = config.env.apiEndpoint;

export async function searchJobs(filters: Filters, queryString: string) {
    const params = new URLSearchParams();
  
    if (filters.location) params.append("location_filter", filters.location);
    if (filters.jobType) params.append("type_filter", filters.jobType);
    if (filters.experienceLevel) params.append("seniority_filter", filters.experienceLevel);
    if (filters.isRemote !== undefined) {
      params.append("remote", filters.isRemote ? "true" : "false");
    }
  
    // Append title filter without encoding
    params.append("title_filter", queryString);
  
    const url = `${apiEndPoint}/api/job-search?${params.toString()}`;
    console.log("API Request:", url);  // Verify the correct query string
  
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
  
    return await response.json();
  }

  