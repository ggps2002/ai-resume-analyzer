"use server"

import { eq, and } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users, contact, experience, education, projects, profile, jobs } from "@/database/schema";
import { auth } from "@/auth";

export async function storeProfileToDatabase(details: Profile, userSetProfileName: string) {
  const { contact: contactDetails, education: educationDetails, experience: experienceDetails, projects: projectsDetails, name: profileName, skills, queryString } = details;
  const session = await auth();
  const name = session?.user?.name ?? "";
  try {
    const loggedInUser = await db
      .select()
      .from(users)
      .where(eq(users.fullName, name))
      .limit(1);
    if (loggedInUser.length === 0) throw new Error("Failed to find logged in user in the database");
    const newProfile = await db.insert(profile).values({
      userId: loggedInUser[0].id,
      userSetName: userSetProfileName,
      name: profileName,
      skills,
      queryString
    });
    if (!newProfile) throw new Error("Failed to insert profile details in the database");
    const insertedProfile = await db
      .select()
      .from(profile)
      .where(eq(profile.name, profileName))
      .limit(1);
    if (insertedProfile.length === 0) throw new Error("Failed to retrieve inserted profile details from the database");
    await db.insert(contact).values({
      profileId: insertedProfile[0].id,
      email: contactDetails.email,
      phone: contactDetails.phone,
      linkedin: contactDetails.linkedin,
      github: contactDetails.github,
      location: contactDetails.location,
      X: contactDetails.X
    })
    educationDetails.forEach(async (institute) => {
      return await db.insert(education).values({
        profileId: insertedProfile[0].id,
        institution: institute.institution,
        degree: institute.degree,
        university: institute.university,
        field: institute.field,
        cgpa: institute.cgpa,
        duration: institute.duration,
        percentage: institute.percentage
      });
    })
    experienceDetails.forEach(async (timeline) => {
      return await db.insert(experience).values({
        profileId: insertedProfile[0].id,
        role: timeline.role,
        company: timeline.company,
        duration: timeline.duration,
        location: timeline.location,
        responsibilities: timeline.responsibilities
      })
    })
    projectsDetails.forEach(async (projectWork) => {
      return await db.insert(projects).values({
        profileId: insertedProfile[0].id,
        name: projectWork.name,
        duration: projectWork.duration,
        description: projectWork.description,
        techStack: projectWork.techStack,
      })
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getCurrentUserProfiles() {
  const session = await auth();
  const name = session?.user?.name ?? "";
  try {
    const loggedInUser = await db
      .select()
      .from(users)
      .where(eq(users.fullName, name))
      .limit(1);
    if (loggedInUser.length === 0) throw new Error("Failed to find logged in user in the database");
    const currentUserProfiles = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, loggedInUser[0].id));
    if (currentUserProfiles.length === 0) return [];  
    const profiles: Array<ProfileDetails> = [];
    currentUserProfiles.forEach((profile) => {
      profiles.push({
        id: profile.id,
        userSetName: profile.userSetName ||  "",
        name: profile.name || "",
        queryString: profile.queryString || "",
      })
    })
    return profiles;
  } catch (error) {
    console.log(error)
  }
}

export async function saveJobs(profileId: string, job: Job) {
  try {
    const exixtingJob = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.title, job.title), eq(jobs.company, job.company), eq(jobs.profileId, profileId), eq(jobs.url, job.url), eq(jobs.valid, job.valid), (eq(jobs.logo, job.logo))))
      .limit(1);
    if (exixtingJob.length > 0) return
    await db.insert(jobs).values({
      profileId,
      logo: job.logo,
      title: job.title,
      company: job.company,
      posted: job.posted,
      valid: job.valid,
      url: job.url
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getSavedJobs(profileId: string) {
  try {
    const savedJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.profileId, profileId));
    if (savedJobs.length === 0) return []; 
    return savedJobs.map(job => ({
      title: job.title,
      company: job.company,
      logo: job.logo,
    }));
  } catch (error) {
    console.error(error)
  }
}

export async function getProfileContactDetails(profileId: string) {
  try {
    const contactDetails = await db
      .select()
      .from(contact)
      .where(eq(contact.profileId, profileId))
      .limit(1);
    if (contactDetails.length === 0) return;
    const data  = {
      email: contactDetails[0].email,
      phone: contactDetails[0].phone,
      linkedin: contactDetails[0].linkedin,
      github: contactDetails[0].github,
      location: contactDetails[0].location,
      X: contactDetails[0].X
    }
    return data;
  } catch (error) {
    console.error(error)
  }
}

export async function getProfileInfo(profileId : string) {
  try {
  const profileDetails = await db
    .select()
    .from(profile)
    .where(eq(profile.id, profileId))
    .limit(1);
  if(profileDetails.length === 0) return; 
  const contactDetails = await db
    .select()
    .from(contact)
    .where(eq(contact.profileId, profileId))
    .limit(1);

  const educationDetails = await db
    .select()
    .from(education)
    .where(eq(education.profileId, profileId))

  const experienceDetails = await db
    .select()
    .from(experience)
    .where(eq(experience.profileId, profileId));

  const projectDetails = await db
    .select()
    .from(projects)
    .where(eq(projects.profileId, profileId));
 
  const profileData: Profile = {
    name: profileDetails[0].name ?? "",
    contact: {
      email: contactDetails[0].email,
      phone: contactDetails[0].phone,
      linkedin: contactDetails[0].linkedin,
      github: contactDetails[0].github,
      location: contactDetails[0].location,
      X: contactDetails[0].X
    },
    education: educationDetails.map(edu => ({
      institution: edu.institution ?? undefined,
      university: edu.university ?? undefined,
      field: edu.field ?? undefined,
      degree: edu.degree,
      cgpa: edu.cgpa ?? undefined,
      percentage: edu.percentage ?? undefined,
      duration: edu.duration
    })),
    experience: experienceDetails.map(exp => ({
      role: exp.role,
      company: exp.company,
      duration: exp.duration,
      location: exp.location,
      responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : [],
    })),
    projects: projectDetails.map(project => ({
      name: project.name,
      duration: project.duration,
      description: Array.isArray(project.description) ? project.description : [],
      techStack: Array.isArray(project.techStack) ? project.techStack : [],
    })),
    skills: profileDetails[0].skills as string[],
    queryString: profileDetails[0].queryString ?? "",
    internships: undefined
  }
  return profileData
  } catch (error) {
    console.error(error);
  }
}

export async function getSavedJobsDetails(profileId: string) {
  try {
    const savedJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.profileId, profileId));
    if (savedJobs.length === 0) return;
    return savedJobs
  } catch (error) {
    console.error(error);
    return [];
  }
}


export async function deleteJob(id : string) {
  try {
    await db
    .delete(jobs)
    .where(eq(jobs.id, id));
  } catch (error) {
    console.error(error);
  }
}
