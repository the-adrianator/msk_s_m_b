# MSK Suggestion Management Board

A modern web application for health and safety administrators to manage musculoskeletal (MSK) risk reduction suggestions. Built with Next.js 14+, TypeScript, TailwindCSS, and Firebase Firestore.

## 🚀 Features

### Core Functionality

- **Suggestion Management**: Create, view, update, and track MSK risk reduction suggestions
- **Employee Management**: View employee details and their associated suggestions
- **Role-Based Access**: Different permission levels for administrators
- **Real-time Updates**: Optimistic UI updates with Firebase Firestore
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### User Experience

- **Dark/Light Mode**: System preference detection with manual toggle
- **Advanced Filtering**: Filter by employee, status, priority, category, and search
- **Smart Sorting**: Sort by date, priority, and status
- **Empty States**: Helpful guidance when no data is available
- **Loading States**: Skeleton loaders and smooth transitions
- **Error Handling**: Graceful error recovery with retry mechanisms

### Data Management

- **Sample Data**: One-click seeding with realistic test data
- **Form Validation**: Client-side validation with user feedback
- **Toast Notifications**: Success and error feedback
- **Optimistic Updates**: Immediate UI feedback for better UX

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom design system
- **Database**: Firebase Firestore
- **Authentication**: Mock authentication system
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Firestore enabled

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd msk_s_m_b
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Copy your Firebase config to `.env.local`:

```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Seed Sample Data

1. Navigate to the application
2. Click "Seed Sample Data" button
3. Wait for the success message
4. Refresh to see the populated data

## 🔐 Demo Credentials

The application includes mock authentication with these demo accounts:

| Email                   | Password   | Role                    | Permissions             |
| ----------------------- | ---------- | ----------------------- | ----------------------- |
| `hsmanager@company.com` | `admin123` | Health & Safety Manager | Full access             |
| `editor@company.com`    | `admin123` | Editor                  | Update status, view all |
| `viewer@company.com`    | `admin123` | Viewer                  | View only               |

## 📱 Usage Guide

### For Administrators

1. **Login** with demo credentials
2. **View Dashboard** with suggestion overview
3. **Create Suggestions** using the "Create Suggestion" button
4. **Filter & Search** to find specific suggestions
5. **Update Status** by clicking on suggestion rows
6. **View Employee Details** by clicking employee names

### Key Features

- **Create Suggestion**: Add new MSK risk reduction suggestions
- **Status Updates**: Track progress (Pending → In Progress → Completed)
- **Employee Management**: View employee profiles and their suggestions
- **Advanced Filtering**: Find suggestions by multiple criteria
- **Responsive Design**: Works on all device sizes

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── App.tsx            # Main application component
│   ├── SuggestionTable.tsx # Core suggestion management
│   ├── CreateSuggestionModal.tsx # Suggestion creation
│   ├── EmployeeDrawer.tsx  # Employee details
│   └── ...
├── services/              # Business logic
│   ├── authService.ts     # Authentication
│   ├── suggestionService.ts # Suggestion CRUD
│   └── employeeService.ts # Employee management
├── utils/                 # Utility functions
│   ├── filters.ts         # Filtering & sorting
│   ├── dates.ts          # Date formatting
│   ├── currency.ts       # Currency formatting
│   └── theme.ts          # Theme management
├── types/                 # TypeScript definitions
└── scripts/              # Data seeding scripts
```

## 🎨 Design System

### Colors

- **Primary**: Blue (#3B82F6)
- **Status Colors**:
  - Pending: Yellow (#F59E0B)
  - In Progress: Blue (#3B82F6)
  - Completed: Green (#10B981)
  - Dismissed: Red (#EF4444)

### Typography

- **Font**: Inter (system fallback)
- **Sizes**: Responsive scale from 12px to 24px

### Components

- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Consistent hover states and focus rings
- **Forms**: Clear validation states
- **Tables**: Responsive with mobile card fallback

## 🔧 Configuration

### Environment Variables

```env
# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### TailwindCSS Configuration

The project uses a custom TailwindCSS configuration with:

- Dark mode support
- Custom color palette
- Responsive breakpoints
- Animation utilities

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- Render

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:

1. Check the documentation above
2. Review the test files for usage examples
3. Open an issue in the repository

## 🎯 Roadmap

Future enhancements could include:

- Real authentication integration
- Advanced reporting and analytics
- Bulk operations
- Email notifications
- Mobile app version
- Advanced permissions system

---

**Built with ❤️ for health and safety professionals**
