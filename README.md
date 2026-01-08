# Talent Flow — Light-Touch Recruitment Platform

A human-centric Applicant Tracking System (ATS) built with accessibility at its core. Inspired by the principles of simplicity, clarity, and human-centric design.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)
![WCAG 2.1 AA](https://img.shields.io/badge/WCAG_2.1-AA_Compliant-green)

## ✨ Features

### For Candidates
- **Accessible Application Form** — Clean, simple forms with proper labels, error handling, and keyboard navigation
- **Browse Open Positions** — View all available roles with detailed descriptions
- **Clear Feedback** — Success/error states and confirmation messages

### For Hiring Teams
- **Kanban Pipeline View** — Visual board with drag-and-drop (keyboard accessible)
- **Candidate Profiles** — Detailed view with contact info, cover letters, and timeline
- **Notes & Scoring** — Structured evaluation rubrics and collaborative note-taking
- **Email Templates** — Pre-built templates for interview invites, offers, and rejections
- **AI Assistant (Simulated)** — Generate candidate summaries and job descriptions

## 🎯 Accessibility Features

This application is built to meet **WCAG 2.1 AA** standards:

- ✅ **Keyboard Navigation** — All interactive elements accessible via keyboard
- ✅ **Focus Management** — Proper focus handling for modals and state changes
- ✅ **Screen Reader Support** — Semantic HTML, ARIA labels, and live regions
- ✅ **Color Contrast** — Minimum 4.5:1 ratio for text
- ✅ **Form Accessibility** — Associated labels, error announcements, and validation
- ✅ **Skip Links** — Bypass navigation for keyboard users
- ✅ **Reduced Motion** — Respects `prefers-reduced-motion`

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   cd Recruitment-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard pages
│   │   ├── candidates/     # All candidates list
│   │   ├── roles/          # Roles management
│   │   └── settings/       # Settings placeholder
│   ├── apply/[roleId]/     # Public application form
│   ├── careers/            # Public job listings
│   └── layout.tsx          # Root layout
├── components/
│   ├── pipeline/           # Pipeline/Kanban components
│   │   ├── pipeline-board.tsx
│   │   ├── candidate-card.tsx
│   │   ├── candidate-detail-modal.tsx
│   │   └── ...
│   └── ui/                 # Shadcn-style UI components
├── data/
│   ├── mock-data.ts        # Mock data store
│   └── data-service.ts     # CRUD operations
├── hooks/
│   └── use-toast.ts        # Toast notification hook
├── lib/
│   ├── utils.ts            # Utility functions
│   └── validation.ts       # Zod schemas
└── types/
    └── index.ts            # TypeScript interfaces
```

## 🎨 Design System

### Color Palette

The application uses a warm, earthy color palette with semantic colors for pipeline stages:

- **Applied** — Blue
- **Review** — Yellow/Amber
- **Interview** — Purple
- **Offer** — Green
- **Rejected** — Red

### Typography

- **Headings** — Crimson Pro (serif)
- **Body** — Source Sans 3 (sans-serif)

### Components

Built with [Shadcn UI](https://ui.shadcn.com/) patterns using Radix Primitives for accessibility:

- Button, Input, Label, Textarea
- Select, Dialog, DropdownMenu
- Toast, Tooltip, Badge, Card
- Tabs, Skeleton

## 📊 Data Layer

The application uses an in-memory mock data store (`src/data/mock-data.ts`) that can be easily swapped for a real database.

### Available Operations

```typescript
// Roles
getRoles()
getRoleById(id)
getOpenRoles()
createRole(data)
updateRole(id, updates)

// Candidates
getCandidates()
getCandidateById(id)
getCandidatesByRole(roleId)
updateCandidateStage(id, stage)
createCandidate(data)

// Notes & Scores
addNote(candidateId, content, type)
addScore(candidateId, categoryId, value, comment)

// AI Assistant (Simulated)
generateJobDescription(title, department)
summarizeCandidateNotes(candidateId)
```

## 🔌 Replacing Mock Data

To connect a real database:

1. Replace the functions in `src/data/data-service.ts`
2. Update to use Prisma, Drizzle, or your ORM of choice
3. Add environment variables for database connection
4. Implement proper error handling and caching

## ⌨️ Keyboard Shortcuts

| Action | Key |
|--------|-----|
| Skip to main content | `Tab` (first element) |
| Navigate pipeline columns | `Arrow keys` (when dragging) |
| Open candidate dropdown | `Enter` or `Space` |
| Close modal | `Escape` |
| Submit form | `Enter` (when focused on submit) |

## 🧪 Testing Accessibility

Recommended tools:

- **axe DevTools** — Browser extension for automated testing
- **WAVE** — Web accessibility evaluation tool
- **VoiceOver/NVDA** — Screen reader testing
- **Keyboard-only navigation** — Manual testing

## 📝 Environment Variables

No environment variables are required for the demo. When adding a database:

```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret (if adding auth)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## 📄 License

MIT License — feel free to use this as a starting point for your own recruitment tool.

---

Built with ❤️ and accessibility in mind.

