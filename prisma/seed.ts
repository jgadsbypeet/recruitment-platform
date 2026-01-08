import "dotenv/config";
import { PrismaClient, Stage, RoleType, RoleStatus, NoteType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.score.deleteMany();
  await prisma.note.deleteMany();
  await prisma.questionAnswer.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.applicationQuestion.deleteMany();
  await prisma.scoreCategory.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();

  // Create score categories
  const categories = await Promise.all([
    prisma.scoreCategory.create({
      data: {
        id: "cat-technical",
        name: "Technical Skills",
        description: "Proficiency in required technical skills and tools",
        maxScore: 5,
        order: 1,
      },
    }),
    prisma.scoreCategory.create({
      data: {
        id: "cat-communication",
        name: "Communication",
        description: "Clarity, articulation, and interpersonal skills",
        maxScore: 5,
        order: 2,
      },
    }),
    prisma.scoreCategory.create({
      data: {
        id: "cat-culture",
        name: "Culture Fit",
        description: "Alignment with company values and team dynamics",
        maxScore: 5,
        order: 3,
      },
    }),
    prisma.scoreCategory.create({
      data: {
        id: "cat-problem",
        name: "Problem Solving",
        description: "Analytical thinking and approach to challenges",
        maxScore: 5,
        order: 4,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} score categories`);

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "user-1",
        name: "Sarah Chen",
        email: "sarah@company.com",
        role: "admin",
      },
    }),
    prisma.user.create({
      data: {
        id: "user-2",
        name: "Marcus Johnson",
        email: "marcus@company.com",
        role: "recruiter",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create roles
  const seniorEngineer = await prisma.role.create({
    data: {
      id: "role-1",
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Remote (US)",
      type: RoleType.full_time,
      status: RoleStatus.open,
      description: `We're looking for a Senior Software Engineer to join our growing team. You'll work on challenging problems, mentor junior developers, and help shape our technical direction.

This is a remote-first position with flexible hours. We value work-life balance and believe great work happens when people have the freedom to work how they work best.`,
      requirements: [
        "5+ years of professional software development experience",
        "Strong proficiency in TypeScript and React",
        "Experience with Node.js and SQL databases",
        "Excellent communication and collaboration skills",
        "Track record of mentoring and knowledge sharing",
      ],
      salaryMin: 150000,
      salaryMax: 200000,
      salaryCurrency: "USD",
    },
  });

  const productDesigner = await prisma.role.create({
    data: {
      id: "role-2",
      title: "Product Designer",
      department: "Design",
      location: "New York, NY (Hybrid)",
      type: RoleType.full_time,
      status: RoleStatus.open,
      description: `Join our design team to create beautiful, accessible, and user-centered experiences. You'll work closely with product and engineering to bring ideas from concept to launch.

We're passionate about inclusive design and believe great products should work for everyone.`,
      requirements: [
        "3+ years of product design experience",
        "Strong portfolio demonstrating UX process",
        "Proficiency in Figma and prototyping tools",
        "Understanding of accessibility standards (WCAG)",
        "Experience working in agile environments",
      ],
      salaryMin: 120000,
      salaryMax: 160000,
      salaryCurrency: "USD",
    },
  });

  const marketingIntern = await prisma.role.create({
    data: {
      id: "role-3",
      title: "Marketing Intern",
      department: "Marketing",
      location: "San Francisco, CA",
      type: RoleType.internship,
      status: RoleStatus.open,
      description: `A fantastic opportunity for students or recent graduates to gain hands-on marketing experience. You'll support campaigns, analyze data, and learn from experienced marketers.

This is a paid internship with potential for full-time conversion.`,
      requirements: [
        "Currently pursuing or recently completed a degree in Marketing, Communications, or related field",
        "Strong written and verbal communication skills",
        "Familiarity with social media platforms",
        "Eagerness to learn and take initiative",
      ],
      salaryMin: 25,
      salaryMax: 30,
      salaryCurrency: "USD",
    },
  });

  console.log("✅ Created 3 roles");

  // Create candidates
  const candidate1 = await prisma.candidate.create({
    data: {
      id: "cand-1",
      roleId: seniorEngineer.id,
      firstName: "Alex",
      lastName: "Thompson",
      email: "alex.thompson@email.com",
      phone: "+1 (555) 123-4567",
      linkedIn: "https://linkedin.com/in/alexthompson",
      portfolio: "https://alexthompson.dev",
      stage: Stage.interview,
      coverLetter: "I'm excited to apply for this role. With 7 years of experience building scalable applications...",
      tags: ["strong-candidate", "referred"],
      notes: {
        create: [
          {
            id: "note-1",
            authorId: "user-1",
            authorName: "Sarah Chen",
            content: "Strong technical background. Very clear communication in the phone screen.",
            type: NoteType.interview,
          },
        ],
      },
      scores: {
        create: [
          {
            categoryId: "cat-technical",
            value: 5,
            evaluatorId: "user-1",
            evaluatorName: "Sarah Chen",
            comment: "Excellent system design skills",
          },
          {
            categoryId: "cat-communication",
            value: 4,
            evaluatorId: "user-1",
            evaluatorName: "Sarah Chen",
          },
        ],
      },
    },
  });

  const candidate2 = await prisma.candidate.create({
    data: {
      id: "cand-2",
      roleId: seniorEngineer.id,
      firstName: "Jordan",
      lastName: "Rivera",
      email: "jordan.r@email.com",
      linkedIn: "https://linkedin.com/in/jordanrivera",
      stage: Stage.review,
      coverLetter: "As a passionate developer with expertise in modern web technologies...",
    },
  });

  const candidate3 = await prisma.candidate.create({
    data: {
      id: "cand-3",
      roleId: productDesigner.id,
      firstName: "Sam",
      lastName: "Patel",
      email: "sam.patel@email.com",
      portfolio: "https://sampatel.design",
      stage: Stage.applied,
      coverLetter: "I believe design is about solving problems for real people...",
    },
  });

  const candidate4 = await prisma.candidate.create({
    data: {
      id: "cand-4",
      roleId: seniorEngineer.id,
      firstName: "Morgan",
      lastName: "Kim",
      email: "morgan.kim@email.com",
      stage: Stage.offer,
      tags: ["top-candidate"],
      notes: {
        create: [
          {
            authorId: "user-2",
            authorName: "Marcus Johnson",
            content: "Exceptional candidate. Team unanimously wants to extend offer.",
            type: NoteType.internal,
          },
        ],
      },
    },
  });

  const candidate5 = await prisma.candidate.create({
    data: {
      id: "cand-5",
      roleId: marketingIntern.id,
      firstName: "Casey",
      lastName: "Williams",
      email: "casey.w@university.edu",
      stage: Stage.applied,
    },
  });

  console.log("✅ Created 5 candidates");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

