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
  console.log("🐾 Seeding RSPCA database...");

  // Clean existing data
  await prisma.score.deleteMany();
  await prisma.note.deleteMany();
  await prisma.questionAnswer.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.applicationQuestion.deleteMany();
  await prisma.scoreCategory.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();

  // Create score categories tailored for RSPCA
  const categories = await Promise.all([
    prisma.scoreCategory.create({
      data: {
        id: "cat-animal-welfare",
        name: "Animal Welfare Knowledge",
        description: "Understanding of animal behaviour, welfare needs, and care standards",
        maxScore: 5,
        order: 1,
      },
    }),
    prisma.scoreCategory.create({
      data: {
        id: "cat-communication",
        name: "Communication",
        description: "Clarity, empathy, and interpersonal skills with public and colleagues",
        maxScore: 5,
        order: 2,
      },
    }),
    prisma.scoreCategory.create({
      data: {
        id: "cat-values",
        name: "Values & Motivation",
        description: "Alignment with RSPCA mission and genuine passion for animal welfare",
        maxScore: 5,
        order: 3,
      },
    }),
    prisma.scoreCategory.create({
      data: {
        id: "cat-resilience",
        name: "Resilience & Composure",
        description: "Ability to handle challenging and emotional situations professionally",
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
        email: "sarah.chen@rspca.org.uk",
        role: "admin",
      },
    }),
    prisma.user.create({
      data: {
        id: "user-2",
        name: "James Mitchell",
        email: "james.mitchell@rspca.org.uk",
        role: "recruiter",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create RSPCA-specific roles
  const animalCareAssistant = await prisma.role.create({
    data: {
      id: "role-1",
      title: "Animal Care Assistant",
      department: "Animal Centres",
      location: "Birmingham Animal Centre",
      type: RoleType.full_time,
      status: RoleStatus.open,
      description: `Join our dedicated team at Birmingham Animal Centre caring for a variety of animals including dogs, cats, and small animals while they await their forever homes.

You'll be responsible for the daily care and welfare of animals in our centre, including feeding, cleaning, exercising, and monitoring health. You'll also help with behavioural assessments and enrichment activities to keep our animals happy and healthy.

This is a hands-on role perfect for someone who loves animals and wants to make a real difference to their lives every single day.`,
      requirements: [
        "Previous experience working with animals (paid or voluntary)",
        "Understanding of animal behaviour and welfare needs",
        "Ability to handle animals safely and confidently",
        "Good physical fitness - the role involves manual handling and being on your feet",
        "Excellent communication skills for dealing with adopters and visitors",
        "Flexibility to work weekends and bank holidays on a rota basis",
      ],
      salaryMin: 22000,
      salaryMax: 25000,
      salaryCurrency: "GBP",
    },
  });

  const vetNurse = await prisma.role.create({
    data: {
      id: "role-2",
      title: "Registered Veterinary Nurse",
      department: "Veterinary Services",
      location: "Greater Manchester Animal Hospital",
      type: RoleType.full_time,
      status: RoleStatus.open,
      description: `We're looking for a compassionate and skilled Registered Veterinary Nurse to join our busy animal hospital team. You'll provide high-quality nursing care to animals rescued by the RSPCA across the Greater Manchester area.

Working alongside our experienced veterinary surgeons, you'll assist with surgical procedures, provide post-operative care, administer medications, and support animal recovery. You'll also play a key role in client communication and education.

Our hospital sees a wide variety of cases from routine neutering to complex emergency surgeries, offering excellent opportunities for professional development.`,
      requirements: [
        "Registered Veterinary Nurse qualification (RVN) with current RCVS registration",
        "Minimum 2 years post-qualification experience in a clinical setting",
        "Experience with surgical nursing and anaesthesia monitoring",
        "Strong clinical and practical skills",
        "Compassionate approach to animal care and welfare",
        "Ability to work calmly under pressure in emergency situations",
        "Commitment to continuous professional development",
      ],
      salaryMin: 28000,
      salaryMax: 34000,
      salaryCurrency: "GBP",
    },
  });

  const inspector = await prisma.role.create({
    data: {
      id: "role-3",
      title: "RSPCA Inspector",
      department: "Inspectorate",
      location: "South West England",
      type: RoleType.full_time,
      status: RoleStatus.open,
      description: `As an RSPCA Inspector, you'll be on the frontline of animal welfare, responding to reports of animals in need and investigating cases of cruelty and neglect across the South West region.

This challenging and rewarding role involves rescuing animals from dangerous situations, providing on-scene first aid, gathering evidence for potential prosecutions, and educating pet owners on responsible animal care. You'll work closely with police, local authorities, and other agencies.

Successful candidates will complete our comprehensive 7-month training programme at our specialist training centre before being assigned to their region.`,
      requirements: [
        "Full UK driving licence (essential)",
        "Experience working with animals and understanding of animal welfare legislation",
        "Excellent communication and conflict resolution skills",
        "Physical fitness and ability to work in challenging environments",
        "Emotional resilience and ability to cope with distressing situations",
        "Strong report writing and evidence gathering skills",
        "Willingness to work unsocial hours and be on-call",
        "No unspent criminal convictions",
      ],
      salaryMin: 32000,
      salaryMax: 38000,
      salaryCurrency: "GBP",
    },
  });

  const fundraiser = await prisma.role.create({
    data: {
      id: "role-4",
      title: "Community Fundraising Manager",
      department: "Fundraising",
      location: "London (Hybrid)",
      type: RoleType.full_time,
      status: RoleStatus.open,
      description: `Help us raise vital funds to continue our life-saving work for animals! As Community Fundraising Manager, you'll develop and deliver innovative fundraising campaigns that engage supporters across London and the South East.

You'll build relationships with community groups, schools, and local businesses, coordinate fundraising events, and support our amazing volunteer fundraisers. Your work will directly enable us to rescue more animals and provide the care they desperately need.

This is an exciting opportunity to combine your passion for animal welfare with your fundraising expertise.`,
      requirements: [
        "Proven experience in community or events fundraising",
        "Track record of achieving fundraising targets",
        "Excellent relationship building and networking skills",
        "Strong project management and organisational abilities",
        "Creative approach to developing new fundraising initiatives",
        "Experience managing and motivating volunteers",
        "Full UK driving licence and willingness to travel within region",
        "Passionate about animal welfare",
      ],
      salaryMin: 35000,
      salaryMax: 42000,
      salaryCurrency: "GBP",
    },
  });

  const wildlifeOfficer = await prisma.role.create({
    data: {
      id: "role-5",
      title: "Wildlife Rehabilitation Officer",
      department: "Wildlife",
      location: "Stapeley Grange Wildlife Centre, Cheshire",
      type: RoleType.full_time,
      status: RoleStatus.open,
      description: `Join our specialist wildlife team at Stapeley Grange, one of the largest wildlife centres in Europe. You'll care for sick, injured, and orphaned wild animals with the goal of releasing them back into the wild.

From hedgehogs and foxes to swans and birds of prey, you'll provide expert care including feeding, medication administration, wound treatment, and rehabilitation exercises. You'll also assist with wildlife rescues and help educate the public about living alongside wildlife.

This role is perfect for someone with a genuine passion for British wildlife and conservation.`,
      requirements: [
        "Experience in wildlife rehabilitation or related field",
        "Knowledge of British wildlife species and their ecology",
        "Understanding of wildlife legislation and ethics of rehabilitation",
        "Ability to handle a variety of wildlife species safely",
        "Good practical skills for enclosure maintenance and enrichment",
        "Physical fitness for manual work including lifting",
        "Flexibility to work weekends and participate in on-call rota",
        "Commitment to the highest standards of animal welfare",
      ],
      salaryMin: 24000,
      salaryMax: 28000,
      salaryCurrency: "GBP",
    },
  });

  const volunteerCoordinator = await prisma.role.create({
    data: {
      id: "role-6",
      title: "Volunteer Coordinator",
      department: "People & Culture",
      location: "Bristol Animal Centre",
      type: RoleType.part_time,
      status: RoleStatus.open,
      description: `Our volunteers are the heart of everything we do! As Volunteer Coordinator, you'll recruit, train, and support volunteers at Bristol Animal Centre, ensuring they have a rewarding experience while contributing to animal welfare.

You'll develop volunteer programmes, coordinate rotas, deliver inductions and training sessions, and be the main point of contact for our volunteer team. You'll also work on retention strategies and volunteer recognition initiatives.

This part-time role (25 hours per week) offers flexibility and the chance to build a thriving volunteer community.`,
      requirements: [
        "Experience in volunteer management or coordination",
        "Excellent interpersonal and communication skills",
        "Ability to motivate and engage people from diverse backgrounds",
        "Strong organisational and administrative skills",
        "Experience delivering training or presentations",
        "Knowledge of volunteering best practices",
        "Proficient in Microsoft Office and database management",
        "Passion for animal welfare and the RSPCA's mission",
      ],
      salaryMin: 14000,
      salaryMax: 16000,
      salaryCurrency: "GBP",
    },
  });

  console.log("✅ Created 6 roles");

  // Create candidates with RSPCA-appropriate profiles
  const candidate1 = await prisma.candidate.create({
    data: {
      id: "cand-1",
      roleId: animalCareAssistant.id,
      firstName: "Emma",
      lastName: "Wilson",
      email: "emma.wilson@email.com",
      phone: "07700 900123",
      stage: Stage.interview,
      coverLetter: "Having volunteered at my local animal shelter for three years, I've developed a deep understanding of animal care and welfare. I'm now ready to turn my passion into a career and would love to join the RSPCA team at Birmingham...",
      tags: ["experienced-volunteer", "strong-candidate"],
      notes: {
        create: [
          {
            id: "note-1",
            authorId: "user-1",
            authorName: "Sarah Chen",
            content: "Excellent phone screen. 3 years volunteering experience at Cats Protection. Very knowledgeable about cat behaviour and handling. Scheduling for in-person interview.",
            type: NoteType.interview,
          },
        ],
      },
      scores: {
        create: [
          {
            categoryId: "cat-animal-welfare",
            value: 5,
            evaluatorId: "user-1",
            evaluatorName: "Sarah Chen",
            comment: "Demonstrated excellent knowledge of animal welfare and practical handling experience",
          },
          {
            categoryId: "cat-values",
            value: 5,
            evaluatorId: "user-1",
            evaluatorName: "Sarah Chen",
            comment: "Genuine passion for animal welfare - clearly aligned with our mission",
          },
        ],
      },
    },
  });

  const candidate2 = await prisma.candidate.create({
    data: {
      id: "cand-2",
      roleId: vetNurse.id,
      firstName: "David",
      lastName: "Okonkwo",
      email: "david.okonkwo@email.com",
      phone: "07700 900456",
      stage: Stage.review,
      coverLetter: "As a Registered Veterinary Nurse with 4 years experience in small animal practice, I'm looking to use my skills to make a difference for animals in need. The RSPCA's mission resonates deeply with me...",
    },
  });

  const candidate3 = await prisma.candidate.create({
    data: {
      id: "cand-3",
      roleId: inspector.id,
      firstName: "Rachel",
      lastName: "Thompson",
      email: "rachel.thompson@email.com",
      phone: "07700 900789",
      stage: Stage.applied,
      coverLetter: "I've worked in animal welfare enforcement for the local council for 5 years and am now ready for the next challenge. The role of RSPCA Inspector has always been my ultimate career goal...",
    },
  });

  const candidate4 = await prisma.candidate.create({
    data: {
      id: "cand-4",
      roleId: animalCareAssistant.id,
      firstName: "Michael",
      lastName: "Patel",
      email: "michael.patel@email.com",
      stage: Stage.offer,
      tags: ["top-candidate", "immediate-start"],
      notes: {
        create: [
          {
            authorId: "user-2",
            authorName: "James Mitchell",
            content: "Exceptional candidate. Panel unanimously recommends offer. Previous experience at Dogs Trust and excellent references. Can start within 2 weeks.",
            type: NoteType.internal,
          },
        ],
      },
    },
  });

  const candidate5 = await prisma.candidate.create({
    data: {
      id: "cand-5",
      roleId: fundraiser.id,
      firstName: "Sophie",
      lastName: "Chen",
      email: "sophie.chen@email.com",
      stage: Stage.interview,
      coverLetter: "With 6 years experience in charity fundraising, including 3 years at Cancer Research UK, I'm excited to bring my skills to the RSPCA. My passion for animals drives me to want to contribute to such important work...",
      notes: {
        create: [
          {
            authorId: "user-1",
            authorName: "Sarah Chen",
            content: "Strong fundraising background. Has exceeded targets consistently. Second interview scheduled with Head of Community Fundraising.",
            type: NoteType.interview,
          },
        ],
      },
    },
  });

  const candidate6 = await prisma.candidate.create({
    data: {
      id: "cand-6",
      roleId: wildlifeOfficer.id,
      firstName: "Tom",
      lastName: "Harrison",
      email: "tom.harrison@email.com",
      phone: "07700 900321",
      stage: Stage.review,
      coverLetter: "Having completed my degree in Wildlife Conservation and spent a year working at a wildlife rescue centre in Devon, I'm eager to continue my career at Stapeley Grange...",
    },
  });

  const candidate7 = await prisma.candidate.create({
    data: {
      id: "cand-7",
      roleId: vetNurse.id,
      firstName: "Aisha",
      lastName: "Rahman",
      email: "aisha.rahman@email.com",
      stage: Stage.rejected,
      notes: {
        create: [
          {
            authorId: "user-2",
            authorName: "James Mitchell",
            content: "Withdrew application - accepted position elsewhere. Asked to keep on file for future opportunities.",
            type: NoteType.internal,
          },
        ],
      },
    },
  });

  const candidate8 = await prisma.candidate.create({
    data: {
      id: "cand-8",
      roleId: volunteerCoordinator.id,
      firstName: "Lucy",
      lastName: "Martinez",
      email: "lucy.martinez@email.com",
      phone: "07700 900654",
      stage: Stage.applied,
      coverLetter: "As a former volunteer coordinator at Age UK, I understand the value volunteers bring to charitable organisations. I'd love to build and nurture a volunteer community dedicated to animal welfare...",
    },
  });

  console.log("✅ Created 8 candidates");

  console.log("🎉 Seeding complete! RSPCA recruitment platform ready.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
