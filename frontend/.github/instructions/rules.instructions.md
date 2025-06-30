---
applyTo: "**"
---

# Frontend Development

- Use Kebab Case for all filenames (e.g., `user-profile.tsx`, `interview-session.ts`).
- Use Pascal Case for all component names.
- Cilent-side code should be written in TypeScript.
- Use functional components and hooks instead of class components.
- Use Next.js for server-side rendering and static site generation.
- Use Next.js built-in routing. Do not use React Router unless specified for special cases.
- Use Tailwind CSS for styling.
- Use React Query(TanStack) for data fetching and caching.
- Use Zustand for state management.
- Use React Hook Form for form handling and validation.
- Use zod for schema validation.
- Use React Testing Library for unit and integration testing.
- Use Jest for unit testing.
- Use ESLint and Prettier for code linting and formatting.
- Use GPT-4.1 for code generation.
- Use GitHub Copilot for code suggestions.
- Use GPT API for HR chatbot features only.
- Use GitHub Actions for CI/CD.
- Lib for api calls: `axios`
- Use `@tanstack/react-query` for data fetching and caching.
- src/app/lib for api calls.
- src/app/components for components.
- src/app/hooks for custom hooks.
- src/app/utils for utility functions.
- src/app/styles for global styles.
- src/app/types for TypeScript types.
- src/app/constants for constants.

# Backend Development

- Use Gin for building RESTful APIs.
- Use sqlc for ORM.
- Use sqlc for database migrations.
- Use Go modules for dependency management.
- Use Go's built-in testing package for unit testing.
- Use Go's built-in profiling tools for performance optimization.
- Use postgres for the database.
- Use Redis for caching.
- Use GitHub Actions for CI/CD.

# App Requirements

🔧 Core Features Breakdown

## 1. AI Pre-screening Interview (HR Chatbot-first, Voice/Web-based later)

**Frontend**

- Route: `/interview/[sessionId]`
- Start with an HR Chatbot (custom API) for text-based interview Q&A
- Use GPT API for HR chatbot features
- (Next) Display interview questions one-by-one (next/prev)
- (Next) Record audio using MediaRecorder API (format: mp3)
- (Optional, Next) Support video recording (webcam) [format: mp4]

**Backend**

- GET `/api/interview/questions` → Returns a JSON list of questions (for chatbot or voice)
- POST `/api/interview/upload` → Accepts audio/video files, returns processing results (for future voice/video)
- POST `/api/interview/chat` → Accepts applicant's text response, forwards to GPT API, returns result (for chatbot)

**AI Processing**

- (Chatbot-first) Use GPT API for HR chatbot Q&A
- (Next) Voice emotion analysis
- (Next) NLP keyword extraction
- (Next) Match key keywords (e.g., "customer-focused", "problem-solving", "team player")
- (Next) Analyze pitch, tone, pause duration (using ML service or open-source libs like pyAudioAnalysis)

## 2. Matching Engine

**Backend**

- POST `/api/match`
- Input: Candidate Profile, Job Profile (JSON)
- Output: Ranked Score, Reasoning Summary (JSON)
- รองรับ dynamic weighting (config ผ่าน API หรือ admin panel)

**Frontend**

- แสดงผลคะแนนด้วย radar chart หรือ weighted bar
- แสดงเหตุผล mismatch (เช่น “Low experience match”)

3. Video Interview Platform (Optional Feature)
   Frontend
   Similar to Pre-screening route but add:
   Webcam recording via getUserMedia
   Time limit per question
   Limited number of retries
   Backend
   Accept video upload endpoint
   (Optional) Integrate with 3rd-party face/emotion analysis (like AWS Rekognition, Azure Video Indexer)

4. HR Dashboard
   Frontend
   -Admin route /dashboard
   Components:
   Candidate list view
   Filter/sort by: Score, Interview Time, Language
   Shortlist Button → triggers backend status update
   Modal/Drawer to preview: Transcript, Scores, Video/Audio
