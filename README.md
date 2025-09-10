# barebones2do
A simple to-do list application designed to help users efficiently manage their tasks.
Barebones To Do List is a simple single-page application that leverages AI to transform your task descriptions into strong, past-tense action statements with prioritized labels—keeping you laser-focused on your long-term goals like fitness, wealth, knowledge, and relationships.

## ✨ Features

### Mobile-Friendly & Offline-Ready
- **Progressive Web App (PWA)**: Install on mobile devices for native app experience
- **Offline Support**: Service worker enables task management without internet connection
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing
- **Local Storage**: Tasks persist locally when offline

### Task Management
- **AI-Powered Task Transformation**: Uses AI to rephrase your task descriptions into past-tense statements with assertive language
- **Smart Prioritization**: Automatically assigns "Hot," "Warm," or "Cold" labels based on importance
- **Task Completion**: Mark tasks as complete to move them to archive
- **Archive System**: Review completed tasks with completion dates
- **Offline Fallback**: Local task refinement when AI is unavailable

### Development Environment
- **GitHub Codespaces Ready**: Full development environment with Node.js and Python support
- **Docker Container**: Consistent development setup across different machines
- **Hot Reloading**: Instant feedback during development

## 🚀 Quick Start

### Using GitHub Codespaces (Recommended)
1. Click on "Code" → "Codespaces" → "Create codespace on main"
2. Wait for the container to build and dependencies to install
3. Start the frontend: `cd frontend && npm start`
4. Start the backend: `cd backend && python3 app.py`
5. Open the forwarded port 3000 to view the application

### Local Development
```bash
# Clone the repository
git clone https://github.com/JelanieStarks/barebones2do.git
cd barebones2do

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip3 install -r requirements.txt

# Start development servers
# Terminal 1 - Frontend (runs on port 3000)
cd frontend
npm start

# Terminal 2 - Backend (runs on port 5000)
cd backend
python3 app.py
```

## 🏗️ Project Structure

```
barebones2do/
├── .devcontainer/
│   ├── devcontainer.json    # VS Code devcontainer configuration
│   └── Dockerfile          # Container setup for Node.js + Python
├── frontend/
│   ├── public/
│   │   ├── service-worker.js    # Offline functionality
│   │   ├── manifest.json        # PWA configuration
│   │   └── index.html          # Mobile-optimized HTML
│   ├── src/
│   │   ├── App.js              # Main application with local storage
│   │   ├── TaskList.js         # Task display with archive features
│   │   ├── App.css            # Mobile-first responsive styles
│   │   └── index.js           # Service worker registration
│   └── package.json           # React dependencies
├── backend/
│   ├── app.py                 # Flask API server
│   └── requirements.txt       # Python dependencies
└── README.md
```

## 📱 Mobile & PWA Features

### Installation
- Visit the site on your mobile device
- Look for "Add to Home Screen" prompt (iOS) or "Install" banner (Android)
- Use like a native app with offline capabilities

### Offline Usage
- All tasks are stored locally in browser storage
- Service worker caches app resources for offline access
- AI fallback provides basic task refinement when offline

## 🎯 How It Works

### Task Transformation
The app uses AI to rephrase your task descriptions into past-tense statements with assertive language (e.g., replacing "want" with "desire").

### Priority Assignment
Each task is evaluated and assigned a "hot," "warm," or "cold" label based on its importance, ensuring that critical, long-term goals are given precedence.

### Task Organization
Tasks are automatically organized from hottest to coldest with completion options, and once completed, they're archived for later reflection.

### Goal Management
The app helps you stay focused on long-term ambitions by providing disciplined, faith-driven accountability for what truly matters.

## 🛠️ Development

### Testing
```bash
cd frontend
npm test          # Run React tests
npm run build     # Test production build
```

### Linting
```bash
cd frontend
npm run lint      # Check code style
```

### Docker Development
The project includes a complete Docker development environment:
- Node.js 18 for frontend development
- Python 3 with pip for backend development
- VS Code extensions for React, Python, and linting
- Port forwarding for both frontend (3000) and backend (5000)

## 🎨 Customization

### Styling
- Edit `frontend/src/App.css` for visual customization
- Mobile-first responsive design
- CSS variables for easy theming

### AI Integration
- Configure your OpenAI API key in `frontend/src/App.js`
- Fallback logic ensures functionality without AI

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Purpose: The purpose of Barebones To Do List is to help you harness the power of AI for personal productivity. By transforming your tasks into actionable, motivational statements and prioritizing them based on your long-term ambitions, the app serves as a disciplined, faith-driven tool to keep you accountable and focused on what truly matters.*

**© 2024 STARKSERVICES**