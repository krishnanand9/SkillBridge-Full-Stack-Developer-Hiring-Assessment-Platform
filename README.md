# SkillBridge — Full-Stack Developer Hiring & Assessment Platform

SkillBridge is a full-stack hiring and developer assessment platform designed to connect **developers, recruiters, and companies** through a structured technical hiring workflow.

The platform enables candidates to create professional profiles, discover job opportunities, take skill-based assessments, complete coding challenges, and receive AI-powered feedback. Recruiters can create job openings, define required skills, assess candidates, review performance, shortlist applicants, and manage the hiring pipeline from a centralized dashboard.

SkillBridge combines **MERN stack development, real-time communication, authentication, coding assessments, analytics, and AI-powered candidate evaluation** into a single production-oriented platform.

---

## 🚀 Key Features

### 👨‍💻 Candidate Platform

* Secure candidate registration and login
* Professional developer profile
* Resume upload and management
* Skills and technology management
* Experience and education details
* Job discovery and search
* Job filtering by:

  * Technology
  * Experience
  * Location
  * Job type
  * Salary
* One-click job application
* Application tracking
* Saved jobs
* Personalized skill recommendations
* Technical assessments
* Coding challenges
* MCQ-based assessments
* Assessment history
* Performance analytics
* AI-generated feedback
* Candidate dashboard

---

### 🏢 Recruiter Platform

Recruiters can manage the complete hiring workflow from a dedicated dashboard.

#### Job Management

* Create job openings
* Edit and delete jobs
* Define required skills
* Set experience requirements
* Configure salary range
* Specify employment type
* Add job descriptions
* Manage job status

#### Candidate Management

* View applicants
* Search and filter candidates
* Review candidate profiles
* View resumes
* Analyze assessment results
* Compare candidates
* Shortlist candidates
* Reject candidates
* Move candidates through hiring stages

#### Hiring Pipeline

```text
Applied
   ↓
Screening
   ↓
Assessment
   ↓
Interview
   ↓
Shortlisted
   ↓
Selected / Rejected
```

---

## 🤖 AI-Powered Features

SkillBridge integrates AI into the hiring and assessment workflow.

### AI Resume Analysis

Candidates can upload their resumes and receive automated analysis including:

* Skill extraction
* Experience analysis
* Missing skills
* Resume improvement suggestions
* Role suitability
* Job-specific skill matching

### AI Job Matching

The platform analyzes candidate skills against job requirements and generates a compatibility score.

Example:

```text
Candidate Skills
        ↓
Required Job Skills
        ↓
Skill Comparison
        ↓
AI Matching Engine
        ↓
Compatibility Score
```

### AI Assessment Generation

Recruiters can generate technical assessments based on:

* Job role
* Required technologies
* Difficulty level
* Experience level
* Number of questions

Example:

```text
Role: Full Stack Developer

Technologies:
React
Node.js
Express
MongoDB

Difficulty:
Intermediate

        ↓

AI Assessment Generator

        ↓

Technical Questions
MCQs
Coding Challenges
```

### AI Candidate Evaluation

AI can analyze assessment performance and provide:

* Strengths
* Weaknesses
* Skill gaps
* Technical performance
* Recommended learning areas
* Overall assessment summary

---

## 💻 Technical Assessment System

SkillBridge provides a structured assessment environment for evaluating developers.

### Assessment Types

* Multiple Choice Questions
* Technical Questions
* Coding Challenges
* Programming Problems
* Skill-Based Assessments

### Assessment Features

* Timed assessments
* Question navigation
* Automatic scoring
* Code submission
* Test-case evaluation
* Performance tracking
* Result generation
* Skill-wise scoring

Example:

```text
Assessment
├── JavaScript
│   ├── MCQs
│   └── Coding
│
├── React
│   ├── MCQs
│   └── Practical
│
├── Node.js
│   ├── MCQs
│   └── Coding
│
└── MongoDB
    └── Technical Questions
```

---

# 📊 Skill & Performance Analytics

Candidates receive detailed performance insights.

### Candidate Analytics

* Overall score
* Skill-wise score
* Assessment completion rate
* Strong skills
* Weak skills
* Skill gaps
* Assessment history
* Hiring readiness

Example:

```text
JavaScript     █████████░ 90%
React          ████████░░ 80%
Node.js        ███████░░░ 70%
MongoDB        ████████░░ 82%
DSA            ██████░░░░ 60%
```

Recruiters can use these analytics to make more informed hiring decisions.

---

# 🔐 Authentication & Authorization

SkillBridge implements secure authentication and role-based authorization.

### Supported Roles

```text
Candidate
   │
   ├── Profile
   ├── Jobs
   ├── Applications
   └── Assessments

Recruiter
   │
   ├── Jobs
   ├── Candidates
   ├── Assessments
   └── Hiring Pipeline

Admin
   │
   ├── Users
   ├── Jobs
   ├── Reports
   └── Platform Management
```

### Security Features

* JWT authentication
* Password hashing with bcrypt
* Protected routes
* Role-based access control
* Input validation
* API authorization
* Secure environment variables
* Rate limiting
* CORS protection
* HTTP security headers

---

# 💬 Real-Time Communication

SkillBridge uses **Socket.IO** for real-time functionality.

Real-time capabilities can include:

* Recruiter-candidate communication
* Notifications
* Application status updates
* Assessment events
* Hiring pipeline updates
* Interview notifications

Example:

```text
Recruiter
    │
    │ Candidate shortlisted
    ↓
Backend
    │
    │ Socket.IO Event
    ↓
Candidate
    │
    ↓
Real-Time Notification
```

---

# 📄 Resume Management

Candidates can upload resumes and maintain their professional information.

Supported workflow:

```text
Upload Resume
      ↓
Resume Parser
      ↓
Extract Information
      ↓
Skills + Experience
      ↓
Candidate Profile
      ↓
AI Analysis
```

The extracted information can be used for job matching and skill-gap analysis.

---

# 🔎 Job Search & Matching

Candidates can search for relevant opportunities using multiple filters.

### Filters

* Job title
* Skills
* Experience
* Location
* Employment type
* Salary
* Remote/On-site
* Technology

The AI matching system can rank jobs based on the candidate's profile.

Example:

```text
Candidate Profile
       ↓
Skills
Experience
Projects
Resume
       ↓
Matching Engine
       ↓
Job Ranking
       ↓
Best Opportunities
```

---

# 📋 Application Tracking

Candidates can monitor their complete application lifecycle.

```text
Applied
   ↓
Under Review
   ↓
Shortlisted
   ↓
Assessment
   ↓
Interview
   ↓
Selected
```

Candidates can view:

* Applied jobs
* Current status
* Assessment status
* Interview status
* Recruiter updates
* Application history

---

# 🧑‍💼 Recruiter Dashboard

The recruiter dashboard provides centralized hiring analytics.

### Dashboard Metrics

* Total jobs
* Active jobs
* Total applicants
* Shortlisted candidates
* Assessments completed
* Interviews
* Selected candidates

Example:

```text
┌───────────────────────────────────────┐
│ Recruiter Dashboard                   │
├───────────────────────────────────────┤
│ Active Jobs          12               │
│ Applicants           248              │
│ Shortlisted          42               │
│ Assessments          96               │
│ Interviews           31               │
│ Selected             8                │
└───────────────────────────────────────┘
```

---

# 🧠 Skill Gap Analysis

SkillBridge identifies the difference between a candidate's current capabilities and the skills required for a target role.

Example:

```text
Target Role:
Full Stack Developer

Required Skills
├── React       ✓
├── Node.js     ✓
├── Express     ✓
├── MongoDB     ✓
├── TypeScript  ⚠
├── Docker      ✗
└── AWS         ✗

Skill Gap:
TypeScript
Docker
AWS
```

The system can recommend learning resources and assessment areas based on these gaps.

---

# 🏗️ System Architecture

SkillBridge follows a modular full-stack architecture.

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │ React + TypeScript  │
                    │ Tailwind CSS        │
                    └──────────┬──────────┘
                               │
                         REST / Socket.IO
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │ Node.js + Express   │
                    │ TypeScript          │
                    └───────┬─────┬───────┘
                            │     │
                            │     └──────────────┐
                            ▼                    ▼
                   ┌────────────────┐   ┌─────────────────┐
                   │    MongoDB     │   │   AI Engine     │
                   │   Mongoose     │   │ Python/FastAPI  │
                   └────────────────┘   │ OpenAI API      │
                                        └─────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios
* React Query
* Socket.IO Client
* Lucide React

## Backend

* Node.js
* Express.js
* TypeScript
* REST APIs
* JWT
* bcrypt
* Socket.IO
* Multer
* Zod / validation

## Database

* MongoDB
* Mongoose
* MongoDB Atlas

## AI Engine

* Python
* FastAPI
* OpenAI API
* AI-powered resume analysis
* AI assessment generation
* AI job matching
* AI candidate evaluation

## Development Tools

* Git
* GitHub
* VS Code
* Postman
* npm
* ESLint
* Prettier

---

# 📁 Project Structure

```text
SkillBridge/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── types/
│   │   └── App.tsx
│   │
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── server.ts
│   │
│   └── package.json
│
├── ai-engine/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── prompts/
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── uploads/
│
├── .env.example
├── README.md
└── package.json
```

---

# 🔄 Application Workflow

## Candidate Workflow

```text
Register
   ↓
Create Profile
   ↓
Upload Resume
   ↓
AI Resume Analysis
   ↓
Explore Jobs
   ↓
AI Job Matching
   ↓
Apply
   ↓
Take Assessment
   ↓
Receive Results
   ↓
Interview
   ↓
Hiring Decision
```

## Recruiter Workflow

```text
Register
   ↓
Create Company Profile
   ↓
Create Job
   ↓
Define Skills
   ↓
Receive Applications
   ↓
Review Candidates
   ↓
Assign Assessment
   ↓
Analyze Performance
   ↓
Shortlist Candidates
   ↓
Interview
   ↓
Hire
```

---

# 🔌 API Architecture

The backend follows a RESTful API architecture.

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Users

```text
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/resume
GET    /api/users/skills
```

### Jobs

```text
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
```

### Applications

```text
POST   /api/applications
GET    /api/applications
GET    /api/applications/:id
PUT    /api/applications/:id/status
```

### Assessments

```text
POST   /api/assessments
GET    /api/assessments
GET    /api/assessments/:id
POST   /api/assessments/:id/submit
GET    /api/assessments/:id/result
```

### AI

```text
POST   /api/ai/resume-analysis
POST   /api/ai/job-match
POST   /api/ai/generate-assessment
POST   /api/ai/evaluate-candidate
POST   /api/ai/skill-gap
```

---

# 🤖 AI Request Flow

AI functionality is separated into a dedicated service.

```text
React Frontend
      ↓
Node.js API
      ↓
AI Service
      ↓
FastAPI
      ↓
OpenAI API
      ↓
AI Processing
      ↓
Structured Response
      ↓
Node.js Backend
      ↓
React Frontend
```

This architecture keeps AI functionality modular and allows the AI engine to evolve independently from the main application.

---

# ⚡ Real-Time Events

Socket.IO can handle events such as:

```text
application:updated
assessment:started
assessment:submitted
candidate:shortlisted
interview:scheduled
notification:new
message:new
```

This allows the platform to provide real-time updates without requiring constant page refreshes.

---

# 🔐 Environment Variables

Create `.env` files for the required services.

### Backend

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

AI_ENGINE_URL=http://localhost:8000
```

### AI Engine

```env
OPENAI_API_KEY=your_openai_api_key
PORT=8000
```

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Never commit real API keys or secrets to GitHub.

---

# ▶️ Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/your-username/skillbridge.git

cd skillbridge
```

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

## 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

## 4. Setup AI Engine

```bash
cd ../ai-engine

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## 5. Configure Environment Variables

Create the required `.env` files and add:

* MongoDB URI
* JWT secret
* OpenAI API key
* API URLs

## 6. Start Backend

```bash
cd server
npm run dev
```

## 7. Start Frontend

```bash
cd client
npm run dev
```

## 8. Start AI Engine

```bash
cd ai-engine
uvicorn app.main:app --reload --port 8000
```

The application can then be accessed through the Vite development server.

---

# 🧪 Testing

SkillBridge can be tested using:

* Postman
* Browser testing
* API integration testing
* Authentication testing
* Role-based authorization testing
* Assessment submission testing
* AI endpoint testing
* Socket.IO event testing

Important test cases include:

```text
✓ Candidate registration
✓ Candidate login
✓ Recruiter registration
✓ Protected routes
✓ Job creation
✓ Job application
✓ Assessment creation
✓ Assessment submission
✓ Result calculation
✓ AI resume analysis
✓ AI job matching
✓ Candidate shortlisting
✓ Real-time notifications
```

---

# 📈 Future Enhancements

Planned improvements include:

* Video interview system
* AI-powered mock interviews
* Advanced coding sandbox
* Automated code evaluation
* GitHub profile analysis
* GitHub repository skill analysis
* AI interview scoring
* Resume ATS scoring
* Email notifications
* Calendar integration
* Advanced recruiter analytics
* Candidate recommendation engine
* Learning-path recommendations
* Company verification
* Multi-language coding support
* Docker deployment
* CI/CD pipeline
* Cloud deployment
* Microservices architecture

---

# 🎯 What This Project Demonstrates

SkillBridge demonstrates practical experience with:

* Full-stack application development
* MERN stack architecture
* TypeScript
* REST API development
* MongoDB database design
* Authentication and authorization
* Role-based access control
* File uploads
* Resume processing
* AI integration
* Python/FastAPI microservices
* Real-time communication
* Socket.IO
* Job recommendation systems
* Technical assessment systems
* Analytics dashboards
* API integration
* Secure backend development
* Modular application architecture
* Frontend-backend integration

---

# 💼 Resume Description

> Built a full-stack developer hiring and assessment platform using React.js, TypeScript, Node.js, Express.js, MongoDB, Socket.IO, Python, FastAPI, and OpenAI API. Implemented role-based authentication, job management, candidate applications, technical assessments, coding challenges, AI-powered resume analysis, job matching, skill-gap detection, candidate evaluation, real-time notifications, and recruiter analytics.

---

# 🧑‍💻 Interview Explanation

**SkillBridge is a full-stack hiring and developer assessment platform that connects candidates and recruiters through an end-to-end technical hiring workflow. Candidates can create profiles, upload resumes, discover jobs, apply, and take technical assessments, while recruiters can create jobs, evaluate candidates, manage hiring pipelines, and analyze assessment results. I integrated AI using a Python FastAPI service for resume analysis, job matching, assessment generation, and skill-gap analysis. The application uses React and TypeScript on the frontend, Node.js and Express on the backend, MongoDB for persistence, and Socket.IO for real-time updates.**

---

# 📸 Screenshots

Add project screenshots here:

```text
screenshots/
├── landing-page.png
├── candidate-dashboard.png
├── recruiter-dashboard.png
├── job-search.png
├── job-details.png
├── assessment.png
├── assessment-result.png
├── ai-resume-analysis.png
└── hiring-pipeline.png
```

Example:

```markdown
![Candidate Dashboard](screenshots/candidate-dashboard.png)
```

---

# 🤝 Contributing

Contributions are welcome.

```bash
git checkout -b feature/new-feature

git add .

git commit -m "Add new feature"

git push origin feature/new-feature
```

Then create a Pull Request.

---

# 📜 License

This project is developed for educational, portfolio, and demonstration purposes.

---

## 👨‍💻 Author

**Krishna Nand**

Full Stack Developer | MERN Stack | AI/ML Enthusiast

Interested in building scalable web applications, AI-powered products, and intelligent developer tools.

---

⭐ If you find this project useful, consider giving the repository a star.
#   S k i l l B r i d g e - F u l l - S t a c k - D e v e l o p e r - H i r i n g - A s s e s s m e n t - P l a t f o r m  
 #   S k i l l B r i d g e - F u l l - S t a c k - D e v e l o p e r - H i r i n g - A s s e s s m e n t - P l a t f o r m  
 