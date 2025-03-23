import { NextResponse } from "next/server";
import https from "https";
import config from "@/lib/config";

const rapidApiKey = config.env.rapidApiKey;
const rapidApiHost = config.env.rapidApiHost;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Extract query parameters
  const location = searchParams.get("location_filter");
  const jobType = searchParams.get("type_filter");
  const experience = searchParams.get("seniority_filter");
  const remote = searchParams.get("remote");
  const title = searchParams.get("title_filter");


  // Build query string
  const filters: string[] = [];
  if (location) filters.push(`location_filter=${encodeURIComponent(location)}`);
  if (jobType) filters.push(`type_filter=${encodeURIComponent(jobType)}`);
  if (experience) filters.push(`seniority_filter=${encodeURIComponent(experience)}`);
  if (remote) filters.push(`remote=${remote}`);

  const queryString = filters.length > 0 ? `&${filters.join("&")}` : "";
  const titleQuery = title ? `title_filter=${encodeURIComponent(title)}` : "";

  const path = `/active-jb-7d?${titleQuery}${queryString}`;

  const options = {
    method: "GET",
    hostname: rapidApiHost,   // Remove extra quotes
    port: null,
    path,
    headers: {
      "x-rapidapi-key": rapidApiKey,
      "x-rapidapi-host": rapidApiHost, // Remove extra quotes
    },
  };

  try {
    const response = await new Promise((resolve, reject) => {
      const request = https.request(options, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
          data += chunk;
        });

        apiRes.on("end", () => {
          console.log("API Response Status Code:", apiRes.statusCode);
          console.log("API Response Body:", data);

          if (apiRes.statusCode !== 200) {
            reject(new Error(`API request failed with status code ${apiRes.statusCode}`));
          } else {
            resolve(JSON.parse(data));
          }
        });
      });

      request.on("error", (error) => {
        console.error("Request error:", error);
        reject(error);
      });

      request.end();
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}