# barebones2do
A simple to-do list application designed to help users efficiently manage their tasks.
Barebones To Do List is a simple single-page application that leverages AI to transform your task descriptions into strong, past-tense action statements with prioritized labels—keeping you laser-focused on your long-term goals like fitness, wealth, knowledge, and relationships.

What the App Does
Task Transformation:
The app uses AI to rephrase your task descriptions into past-tense statements with assertive language (e.g., replacing "want" with "desire").

Priority Assignment:
It evaluates each task and assigns a "hot," "warm," or "cold" label based on its importance, ensuring that critical, long-term goals are given precedence.

Task Organization:
Tasks are automatically organized from hottest to coldest with check marks, and once completed, they’re archived for later reflection.

Goal Reminders:
The app reminds you to record your daily goals by prompting you to either take a picture or type them in, keeping your ambitions in sight.

Scalability and Feedback:
There’s a dedicated section for testing new features and gathering user feedback to help the app grow and evolve.

User Stories and Use Cases
You will be able to add a task:
Input any task into the app, and it will convert your description into a strong, past-tense statement that motivates action.

You will be able to see task priorities:
Each task is automatically tagged as hot, warm, or cold, so you can immediately know which tasks require urgent attention.

You will be able to complete and archive tasks:
Mark tasks as completed, and they will be moved to an archive for end-of-day review and reflection.

You will be able to review your daily progress:
At the end of the day, the app presents a summary of your completed tasks, letting you assess your productivity.

You will be able to record your goals:
Receive a nightly prompt to write down your goals—initially by typing (with plans for handwriting recognition in future updates).

You will be able to test and suggest new features:
Access a special section where you can experiment with upcoming features and provide feedback to help shape the app’s evolution.

Purpose
The purpose of Barebones To Do List is to help you harness the power of AI for personal productivity. By transforming your tasks into actionable, motivational statements and prioritizing them based on your long-term ambitions, the app serves as a disciplined, faith-driven tool to keep you accountable and focused on what truly matters.

Offline & Mobile
- Offline-first: The app works without internet using a service worker and local storage.
- Mobile-friendly: Responsive layout, large touch targets, and installable as a PWA.
- Android: You can wrap the build with Capacitor and ship to Play Store.

Build & Run (web)
1) Install Node.js LTS.
2) From `frontend/` run:
	- `npm install`
	- `npm run build` (outputs to `build/`)
	- `npm start` for dev server

Capacitor (Android)
1) In `frontend/`:
	- `npm install @capacitor/core @capacitor/cli`
	- `npx cap init barebones2do com.example.barebones2do`
	- `npm run build`
	- `npx cap add android`
	- `npx cap copy`
	- `npx cap open android`
2) Build and publish from Android Studio.

