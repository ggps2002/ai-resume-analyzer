interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
}

interface Contact {
  email: string;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  location: string | null;
  X: string | null;
}

interface Education {
  institution?: string;
  university?: string;
  degree: string;
  field?: string;
  cgpa?: string;
  percentage?: string;
  duration: string;
}

interface Experience {
  role: string;
  company: string;
  duration: string;
  location: string;
  responsibilities: string[];
}

interface Project {
  name: string;
  duration: string;
  description: string[];
  techStack: string[];
}

interface Profile {
  name: string;
  contact: Contact;
  education: Education[];
  experience: Experience[];
  internships: any[];
  projects: Project[];
  skills: string[];
  queryString: string;
}

interface Filters {
  location: string;
  jobType: string;
  experienceLevel: string;
  isRemote: boolean | undefined;
}

interface ProfileDetails {
  id: string;
  name: string;
  userSetName: string;
  queryString: string;
}

interface LocationRaw {
  "@type": string;
  address: Address;
  latitude: number;
  longitude: number;
}

interface Address {
  "@type": string;
  addressCountry: string;
  addressLocality: string;
  addressRegion: string | null;
  streetAddress: string | null;
}

interface Job {
  logo: string;
  posted: string;
  valid: string;
  title: string;
  company: string;
  url: string;
}