# 📝 Personal Notes Manager - Fullstack App

A modern, fullstack personal notes management application built with Node.js, Express.js, MongoDB, and Next.js 15.

## 🏗️ Architecture

```
notes-manager/
├── backend/          # Node.js + Express.js API
│   ├── src/
│   │   ├── models/   # Mongoose models
│   │   ├── routes/   # API routes
│   │   ├── middleware/ # Auth middleware
│   │   └── server.ts # Main server file
│   └── package.json
├── frontend/         # Next.js 15 app
│   ├── app/
│   │   ├── components/ # React components
│   │   ├── store/    # Zustand stores
│   │   ├── dashboard/ # Dashboard page
│   │   ├── login/    # Login page
│   │   └── register/ # Register page
│   └── package.json
└── package.json      # Root package.json
```

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) (latest version)
- [MongoDB](https://mongodb.com) (local or cloud instance)
- Node.js 18+ (for compatibility)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notes-manager
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   bun install

   # Install backend dependencies
   cd backend
   bun install

   # Install frontend dependencies
   cd ../frontend
   bun install
   ```

3. **Environment Setup**

   **Backend** - Create `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/notesapp
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend** - Create `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the development servers**

   From the root directory:
   ```bash
   # Start both frontend and backend
   bun dev

   # Or start them separately:
   bun dev:backend   # Backend only
   bun dev:frontend  # Frontend only
   ```

   The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 📋 Features

### ✅ Core Functionality

- **User Authentication**
  - User registration with email and password
  - Secure login with JWT tokens
  - Password hashing with bcrypt

- **Notes Management**
  - Create new notes with title and content
  - View all personal notes in a grid layout
  - Edit existing notes with real-time updates
  - Delete notes with confirmation modal
  - Search notes by title or content

- **User Experience**
  - Responsive design for all devices
  - Spanish language interface
  - Toast notifications for user feedback
  - Loading states and error handling
  - Clean, modern UI with Tailwind CSS

### 🛠️ Technical Features

- **Backend (Node.js + Express.js)**
  - RESTful API design
  - MongoDB with Mongoose ODM
  - JWT authentication middleware
  - Input validation with Zod
  - CORS enabled for frontend communication
  - Error handling and logging

- **Frontend (Next.js 15)**
  - App Router with TypeScript
  - Client and server components
  - Zustand for state management
  - React Hook Form for form handling
  - Axios for API communication
  - Hot toast notifications

## 🔧 Scripts

### Root Project
```bash
bun dev          # Start both frontend and backend
bun dev:frontend # Start frontend only
bun dev:backend  # Start backend only
bun build        # Build frontend for production
```

### Backend
```bash
cd backend
bun dev          # Start development server with file watching
bun start        # Start production server
bun build        # Build TypeScript to JavaScript
```

### Frontend
```bash
cd frontend
bun dev          # Start Next.js development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint
```

## 🗄️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Note Model
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Notes (Protected)
- `GET /api/notes` - Get user's notes
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## 🎨 UI/UX Features

- **Spanish Language Interface**: All user-facing content in Spanish
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Modern UI**: Clean design with Tailwind CSS
- **Interactive Elements**: Hover effects, transitions, animations
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Toast Notifications**: Success and error messages
- **Loading States**: Skeleton loaders and spinners
- **Modal System**: Note viewing, editing, and deletion confirmations

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- User-specific data access
- Input validation and sanitization
- CORS configuration

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🛡️ Error Handling

- Global error handling middleware
- Client-side error boundaries
- Toast notifications for user feedback
- Graceful fallbacks for failed requests
- Form validation with helpful messages

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions, please create an issue in the repository.# notes-app
