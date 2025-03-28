# 🚀 **AI-Powered Job Search & Interview Coach**

An all-in-one platform to **simplify and enhance the job-seeking experience** with **AI-powered resume parsing, job recommendations, cover letter generation, and interview coaching**.

---

## 🔥 **Features**

✅ **Resume Parsing with Azure Document Intelligence**  
- Automatically extracts **skills, experience, and education** from PDF and DOCX resumes.  
- Displays the parsed data on a user-friendly dashboard.  

✅ **Job Recommendations**  
- Fetches **relevant job listings** from public APIs based on resume details.  
- Users can **search, filter, and bookmark jobs**.  

✅ **AI-Powered Cover Letter Generator**  
- Generates **personalized cover letters** tailored to the job description.  
- Uses **Llama with Groq** for fast and accurate generation.  

✅ **Interview Coaching with Real-Time Transcription**  
- Users practice answering common interview questions.  
- Speech-to-text transcription captures responses.  
- Displays **session summary with feedback**.  

---

## ⚙️ **Tech Stack**

### **Frontend**
- **Next.js (TypeScript)** → Frontend framework  
- **TailwindCSS** → Styling  
- **Shadcn Components** → UI components  

### **Backend**
- **Drizzle ORM** → Database interactions  
- **Neon PostgreSQL** → Database storage  
- **Next-Auth.js** → Authentication with Google and GitHub OAuth  

### **AI Services**
- **Azure Document Intelligence** → Resume parsing  
- **Azure Speech SDK** → Real-time transcription  
- **Llama (Groq)** → AI-powered cover letter generation  

---

## 🚀 **Installation & Setup**

### **🔹 Clone the Repository**
```bash
git clone https://github.com/ggps2002/ai-resume-analyzer.git
cd ai-resume-analyzer
npm install

```
### **🔹 Setup Environment Variables**
Create a .env.local file inside the ai-resume-analyzer and include this
```env
# Database
DATABASE_URL='YOUR_NEON_DATABASE_URL'

# API Endpoints
NEXT_PUBLIC_API_ENDPOINT='http://localhost:3000'
AUTH_SECRET='YOUR_AUTH_SECRET'

# Azure Document Intelligence (Resume Parsing)
NEXT_PUBLIC_AZURE_DOCUMENT_INTELLIGENCE_API_KEY='YOUR_AZURE_DOCUMENT_INTELLIGENCE_API_KEY'
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT='YOUR_AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT'

# Azure Storage (File Uploads)
NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONNECTION_STRING='YOUR_AZURE_BLOB_STORAGE_ACCOUNT_CONNECTION_STRING'

# Azure Speech-to-Text (Interview Coaching)
NEXT_PUBLIC_AZURE_SPEECH_ASSESMENT_API_KEY='YOUR_AZURE_SPEECH_SERVICE_API_KEY'
NEXT_PUBLIC_AZURE_SPEECH_ASSESMENT_REGION='YOUR_AZURE_SPEECH_SERVICE_REGION'

# Groq API (Cover Letter Generation)
GROQ_API_KEY='YOUR_GROQ_API_KEY'

# OAuth Authentication
AUTH_GOOGLE_ID='YOUR_GOOGLE_CLIENT_ID'
AUTH_GOOGLE_SECRET='YOUR_GOOGLE_CLIENT_SECRET'
AUTH_GITHUB_ID='YOUR_GITHUB_CLIENT_ID'
AUTH_GITHUB_SECRET='YOUR_GITHUB_CLIENT_SECRET'

# Job Search API
RAPID_API_KEY='YOUR_RAPID_API_KEY'
RAPID_API_HOST='YOUR_RAPID_API_HOST'

```