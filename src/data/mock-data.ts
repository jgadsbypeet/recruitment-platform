/**
 * Mock Data Store
 * ================
 * This file contains all mock data for the recruitment platform.
 * Easy to swap out for a real database later.
 */

import type {
  Role,
  Candidate,
  StageInfo,
  ScoreCategory,
  EmailTemplate,
  User,
  ApplicationQuestion,
} from "@/types";

/**
 * Stage definitions with metadata
 */
export const STAGES: StageInfo[] = [
  {
    id: "applied",
    label: "Applied",
    description: "New applications awaiting initial review",
    color: "bg-blue-500",
  },
  {
    id: "review",
    label: "Under Review",
    description: "Applications being evaluated by the hiring team",
    color: "bg-yellow-500",
  },
  {
    id: "interview",
    label: "Interview",
    description: "Candidates scheduled for or in the interview process",
    color: "bg-purple-500",
  },
  {
    id: "offer",
    label: "Offer",
    description: "Candidates who have received or accepted an offer",
    color: "bg-green-500",
  },
  {
    id: "rejected",
    label: "Rejected",
    description: "Candidates not moving forward in the process",
    color: "bg-red-500",
  },
];

/**
 * Email templates for candidate communications
 */
export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "template-1",
    name: "Application Received",
    subject: "Thank you for applying to {{role}}",
    body: `Dear {{firstName}},

Thank you for applying to the {{role}} position at our company. We have received your application and our team will review it carefully.

We appreciate your interest in joining our team and will be in touch soon with next steps.

Best regards,
The Hiring Team`,
    stage: "applied",
  },
  {
    id: "template-2",
    name: "Moving to Review",
    subject: "Your application is under review - {{role}}",
    body: `Dear {{firstName}},

Great news! Your application for the {{role}} position has moved to the review stage. Our hiring team is currently evaluating your qualifications.

We'll be in touch within the next few days with an update.

Best regards,
The Hiring Team`,
    stage: "review",
  },
  {
    id: "template-3",
    name: "Interview Invitation",
    subject: "Interview Invitation - {{role}}",
    body: `Dear {{firstName}},

We're excited to invite you to interview for the {{role}} position!

Please use the link below to schedule a time that works best for you:
[SCHEDULING LINK]

The interview will be approximately 45 minutes and will cover your background, technical skills, and what you're looking for in your next role.

If you have any questions, please don't hesitate to reach out.

Best regards,
The Hiring Team`,
    stage: "interview",
  },
  {
    id: "template-4",
    name: "Offer Letter",
    subject: "Offer Letter - {{role}}",
    body: `Dear {{firstName}},

Congratulations! We are thrilled to extend an offer for the {{role}} position.

Please find the attached offer letter with complete details about compensation, benefits, and start date.

We're excited about the possibility of you joining our team and look forward to your response.

Best regards,
The Hiring Team`,
    stage: "offer",
  },
  {
    id: "template-5",
    name: "Rejection - Generic",
    subject: "Update on your application - {{role}}",
    body: `Dear {{firstName}},

Thank you for your interest in the {{role}} position and for taking the time to apply.

After careful consideration, we have decided to move forward with other candidates whose experience more closely aligns with our current needs.

We encourage you to apply for future openings that match your skills and experience. We wish you the best in your job search.

Best regards,
The Hiring Team`,
    stage: "rejected",
  },
];

/**
 * Scoring categories for candidate evaluation
 */
export const SCORE_CATEGORIES: ScoreCategory[] = [
  {
    id: "cat-1",
    name: "Technical Skills",
    description: "Proficiency in required technologies and tools",
    maxScore: 5,
  },
  {
    id: "cat-2",
    name: "Communication",
    description: "Clarity, professionalism, and listening skills",
    maxScore: 5,
  },
  {
    id: "cat-3",
    name: "Problem Solving",
    description: "Analytical thinking and creative solutions",
    maxScore: 5,
  },
  {
    id: "cat-4",
    name: "Culture Fit",
    description: "Alignment with company values and team dynamics",
    maxScore: 5,
  },
  {
    id: "cat-5",
    name: "Experience",
    description: "Relevant work history and achievements",
    maxScore: 5,
  },
];

/**
 * Mock users (hiring team members)
 */
export const USERS: User[] = [
  {
    id: "user-1",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    role: "admin",
    avatar: undefined,
  },
  {
    id: "user-2",
    name: "Marcus Johnson",
    email: "marcus.j@company.com",
    role: "recruiter",
    avatar: undefined,
  },
  {
    id: "user-3",
    name: "Emily Rodriguez",
    email: "emily.r@company.com",
    role: "interviewer",
    avatar: undefined,
  },
];

/**
 * Mock roles/positions
 */
export const ROLES: Role[] = [
  {
    id: "role-1",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote (US)",
    type: "full-time",
    description: `We're looking for a Senior Frontend Engineer to join our growing team. You'll work on building beautiful, accessible, and performant user interfaces that delight our customers.

In this role, you'll collaborate closely with designers, product managers, and backend engineers to ship features that make a real impact.`,
    requirements: [
      "5+ years of experience with React and TypeScript",
      "Strong understanding of web accessibility (WCAG 2.1)",
      "Experience with modern CSS (Tailwind, CSS-in-JS)",
      "Familiarity with testing frameworks (Jest, Playwright)",
      "Excellent communication skills",
    ],
    salary: {
      min: 140000,
      max: 180000,
      currency: "USD",
    },
    status: "open",
    questions: [
      {
        id: "q1-1",
        question: "Describe a complex UI challenge you solved and your approach to accessibility.",
        type: "textarea",
        required: true,
        placeholder: "Tell us about a specific project...",
        maxLength: 2000,
      },
      {
        id: "q1-2",
        question: "What excites you most about frontend development right now?",
        type: "textarea",
        required: true,
        placeholder: "Share your thoughts...",
        maxLength: 1000,
      },
      {
        id: "q1-3",
        question: "What is your preferred work arrangement?",
        type: "select",
        required: true,
        options: ["Fully Remote", "Hybrid (2-3 days office)", "Office-based"],
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "role-2",
    title: "Product Designer",
    department: "Design",
    location: "New York, NY (Hybrid)",
    type: "full-time",
    description: `Join our design team to create intuitive and beautiful experiences. You'll own the end-to-end design process from research and ideation to final implementation.

We value designers who can balance aesthetics with usability and who are passionate about accessibility.`,
    requirements: [
      "3+ years of product design experience",
      "Strong portfolio demonstrating UX/UI work",
      "Proficiency in Figma",
      "Experience with design systems",
      "User research experience",
    ],
    salary: {
      min: 120000,
      max: 150000,
      currency: "USD",
    },
    status: "open",
    questions: [
      {
        id: "q2-1",
        question: "Share a link to your portfolio or case study you are most proud of.",
        type: "text",
        required: true,
        placeholder: "https://...",
      },
      {
        id: "q2-2",
        question: "How do you approach designing for accessibility?",
        type: "textarea",
        required: true,
        placeholder: "Describe your process...",
        maxLength: 1500,
      },
      {
        id: "q2-3",
        question: "What design tools do you use daily?",
        type: "textarea",
        required: false,
        placeholder: "List your tools and why you prefer them...",
        maxLength: 500,
      },
    ],
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "role-3",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote (Global)",
    type: "full-time",
    description: `We're seeking a DevOps Engineer to help us scale our infrastructure and improve our deployment pipelines. You'll work on making our systems more reliable, secure, and efficient.`,
    requirements: [
      "4+ years of DevOps/SRE experience",
      "Strong knowledge of AWS or GCP",
      "Experience with Kubernetes and Docker",
      "Infrastructure as Code (Terraform, Pulumi)",
      "CI/CD pipeline expertise",
    ],
    salary: {
      min: 130000,
      max: 170000,
      currency: "USD",
    },
    status: "open",
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-02-01T09:00:00Z",
  },
];

/**
 * Mock candidates
 */
export const CANDIDATES: Candidate[] = [
  {
    id: "cand-1",
    roleId: "role-1",
    firstName: "Alex",
    lastName: "Thompson",
    email: "alex.thompson@email.com",
    phone: "+1 (555) 123-4567",
    linkedIn: "https://linkedin.com/in/alexthompson",
    portfolio: "https://alexthompson.dev",
    coverLetter: "I am excited to apply for the Senior Frontend Engineer position. With over 6 years of experience building React applications, I believe I would be a great fit for your team...",
    stage: "interview",
    appliedAt: "2024-02-10T08:30:00Z",
    updatedAt: "2024-02-15T14:20:00Z",
    notes: [
      {
        id: "note-1",
        candidateId: "cand-1",
        authorId: "user-2",
        authorName: "Marcus Johnson",
        content: "Strong portfolio with impressive accessibility work. Recommended for technical interview.",
        type: "general",
        createdAt: "2024-02-12T10:00:00Z",
        updatedAt: "2024-02-12T10:00:00Z",
      },
      {
        id: "note-2",
        candidateId: "cand-1",
        authorId: "user-3",
        authorName: "Emily Rodriguez",
        content: "Phone screen went well. Great communication skills and deep React knowledge. Moving to technical round.",
        type: "interview",
        createdAt: "2024-02-14T16:30:00Z",
        updatedAt: "2024-02-14T16:30:00Z",
      },
    ],
    scores: [
      {
        id: "score-1",
        candidateId: "cand-1",
        categoryId: "cat-1",
        categoryName: "Technical Skills",
        value: 4,
        maxValue: 5,
        evaluatorId: "user-3",
        evaluatorName: "Emily Rodriguez",
        comment: "Strong React knowledge, demonstrated good TypeScript understanding",
        createdAt: "2024-02-14T16:30:00Z",
      },
      {
        id: "score-2",
        candidateId: "cand-1",
        categoryId: "cat-2",
        categoryName: "Communication",
        value: 5,
        maxValue: 5,
        evaluatorId: "user-3",
        evaluatorName: "Emily Rodriguez",
        comment: "Excellent communicator, explains technical concepts clearly",
        createdAt: "2024-02-14T16:30:00Z",
      },
    ],
    tags: ["senior", "remote-ok", "accessibility-expert"],
  },
  {
    id: "cand-2",
    roleId: "role-1",
    firstName: "Jordan",
    lastName: "Lee",
    email: "jordan.lee@email.com",
    linkedIn: "https://linkedin.com/in/jordanlee",
    stage: "review",
    appliedAt: "2024-02-18T11:45:00Z",
    updatedAt: "2024-02-18T11:45:00Z",
    notes: [],
    scores: [],
    tags: ["mid-level"],
  },
  {
    id: "cand-3",
    roleId: "role-1",
    firstName: "Casey",
    lastName: "Williams",
    email: "casey.w@email.com",
    phone: "+1 (555) 987-6543",
    portfolio: "https://caseywilliams.io",
    stage: "applied",
    appliedAt: "2024-02-20T09:15:00Z",
    updatedAt: "2024-02-20T09:15:00Z",
    notes: [],
    scores: [],
  },
  {
    id: "cand-4",
    roleId: "role-2",
    firstName: "Riley",
    lastName: "Martinez",
    email: "riley.martinez@email.com",
    linkedIn: "https://linkedin.com/in/rileymartinez",
    portfolio: "https://dribbble.com/rileym",
    coverLetter: "As a passionate product designer with 4 years of experience, I'm thrilled to apply for this position...",
    stage: "offer",
    appliedAt: "2024-01-25T13:00:00Z",
    updatedAt: "2024-02-19T10:00:00Z",
    notes: [
      {
        id: "note-3",
        candidateId: "cand-4",
        authorId: "user-1",
        authorName: "Sarah Chen",
        content: "Exceptional portfolio and design thinking. Team loved them. Extending offer.",
        type: "general",
        createdAt: "2024-02-19T10:00:00Z",
        updatedAt: "2024-02-19T10:00:00Z",
      },
    ],
    scores: [
      {
        id: "score-3",
        candidateId: "cand-4",
        categoryId: "cat-1",
        categoryName: "Technical Skills",
        value: 5,
        maxValue: 5,
        evaluatorId: "user-1",
        evaluatorName: "Sarah Chen",
        createdAt: "2024-02-18T14:00:00Z",
      },
      {
        id: "score-4",
        candidateId: "cand-4",
        categoryId: "cat-4",
        categoryName: "Culture Fit",
        value: 5,
        maxValue: 5,
        evaluatorId: "user-1",
        evaluatorName: "Sarah Chen",
        createdAt: "2024-02-18T14:00:00Z",
      },
    ],
    tags: ["design-systems", "figma-expert"],
  },
  {
    id: "cand-5",
    roleId: "role-2",
    firstName: "Morgan",
    lastName: "Patel",
    email: "morgan.p@email.com",
    stage: "rejected",
    appliedAt: "2024-01-28T16:20:00Z",
    updatedAt: "2024-02-05T09:30:00Z",
    notes: [
      {
        id: "note-4",
        candidateId: "cand-5",
        authorId: "user-2",
        authorName: "Marcus Johnson",
        content: "Portfolio shows mostly graphic design work, not enough product design experience for this role.",
        type: "general",
        createdAt: "2024-02-05T09:30:00Z",
        updatedAt: "2024-02-05T09:30:00Z",
      },
    ],
    scores: [],
  },
  {
    id: "cand-6",
    roleId: "role-3",
    firstName: "Taylor",
    lastName: "Nguyen",
    email: "taylor.nguyen@email.com",
    phone: "+1 (555) 456-7890",
    linkedIn: "https://linkedin.com/in/taylornguyen",
    stage: "interview",
    appliedAt: "2024-02-08T10:00:00Z",
    updatedAt: "2024-02-16T11:00:00Z",
    notes: [
      {
        id: "note-5",
        candidateId: "cand-6",
        authorId: "user-3",
        authorName: "Emily Rodriguez",
        content: "Strong AWS experience. Currently scheduling technical deep-dive.",
        type: "interview",
        createdAt: "2024-02-16T11:00:00Z",
        updatedAt: "2024-02-16T11:00:00Z",
      },
    ],
    scores: [],
    tags: ["aws-certified", "kubernetes"],
  },
  {
    id: "cand-7",
    roleId: "role-1",
    firstName: "Sam",
    lastName: "Garcia",
    email: "sam.garcia@email.com",
    stage: "applied",
    appliedAt: "2024-02-21T14:30:00Z",
    updatedAt: "2024-02-21T14:30:00Z",
    notes: [],
    scores: [],
  },
];

/**
 * Get current logged-in user (simulated)
 */
export const CURRENT_USER: User = USERS[0];

