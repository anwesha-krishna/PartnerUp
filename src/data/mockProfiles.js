/**
 * Mock Student Profiles Seed Data for ProjectMatch
 * Includes realistic tech stacks, availability constraints, experience levels, domain interests, spoken languages, department, academic year of study, and socials.
 */

export const mockProfiles = [
  {
    id: "user-1",
    name: "Alex Rivera",
    role: "Frontend Developer",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    university: "UC Berkeley",
    department: "Computer Science & Engineering",
    major: "Computer Science",
    yearOfStudy: "3rd Year B.Tech",
    bio: "Passionate UI/UX focused frontend engineer with strong React & Tailwind CSS skills. Love building interactive web apps and hackathon prototypes.",
    experience: "Intermediate",
    availability: "Weekends",
    skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "Next.js", "Figma", "Redux"],
    interests: ["EdTech", "AI / ML", "Developer Tools", "Social Impact"],
    languages: ["English", "Spanish"],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      portfolio: "https://devpost.com"
    },
    github: "https://github.com",
    portfolio: "https://alexrivera.dev",
    timeCommitment: "15-20 hrs/week"
  },
  {
    id: "user-2",
    name: "Priya Sharma",
    role: "ML Engineer",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    university: "Stanford University",
    department: "AI & Data Science",
    major: "Artificial Intelligence & Data",
    yearOfStudy: "4th Year B.Tech",
    bio: "Deep Learning & NLP researcher. Experienced in fine-tuning LLMs, PyTorch pipelines, Machine Learning algorithms, and deploying containerized AI endpoints.",
    experience: "Advanced",
    availability: "Evenings",
    skills: ["Python", "Machine Learning", "PyTorch", "TensorFlow", "FastAPI", "Docker", "NLP", "LangChain", "C++"],
    interests: ["AI / ML", "HealthTech", "Research", "FinTech"],
    languages: ["English", "Hindi", "Tamil"],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      portfolio: "https://devpost.com"
    },
    github: "https://github.com",
    portfolio: "https://priyasharma.ai",
    timeCommitment: "10-15 hrs/week"
  },
  {
    id: "user-3",
    name: "Marcus Chen",
    role: "Full-Stack Engineer",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    university: "Georgia Tech",
    department: "Information Technology",
    major: "Software Engineering",
    yearOfStudy: "4th Year B.Tech",
    bio: "Full stack builder who thrives in 48-hour hackathon crunches. Specialized in Node.js, GraphQL, PostgreSQL, and React frontends.",
    experience: "Advanced",
    availability: "Full-time",
    skills: ["React", "Node.js", "Express", "PostgreSQL", "GraphQL", "TypeScript", "Tailwind CSS", "Docker", "AWS"],
    interests: ["FinTech", "Developer Tools", "Web3", "Cybersecurity"],
    languages: ["English", "Mandarin"],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      portfolio: "https://devpost.com"
    },
    github: "https://github.com",
    portfolio: "https://marcuschen.dev",
    timeCommitment: "30+ hrs/week"
  },
  {
    id: "user-4",
    name: "Elena Rostova",
    role: "UI/UX Designer",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    university: "Rhode Island School of Design",
    department: "Human-Computer Interaction & Design",
    major: "Digital Media & HCI",
    yearOfStudy: "3rd Year B.Tech",
    bio: "Product designer crafting intuitive user journeys, wireframes, and design systems. Bridge between user psychology and clean design aesthetics.",
    experience: "Intermediate",
    availability: "Weekends",
    skills: ["Figma", "UI/UX Design", "Wireframing", "Design Systems", "User Research", "Tailwind CSS", "HTML/CSS"],
    interests: ["HealthTech", "Social Impact", "EdTech", "Design Systems"],
    languages: ["English", "Russian", "French"],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      portfolio: "https://devpost.com"
    },
    github: "https://github.com",
    portfolio: "https://elenarostova.design",
    timeCommitment: "12-18 hrs/week"
  },
  {
    id: "user-5",
    name: "Devon Washington",
    role: "Backend Architect",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    university: "University of Michigan",
    department: "Computer Science & Engineering",
    major: "Computer Systems",
    yearOfStudy: "4th Year B.Tech",
    bio: "Distributed systems enthusiast. Loves crafting resilient REST/gRPC APIs in Go and C++, database indexing, and caching strategies.",
    experience: "Advanced",
    availability: "Evenings",
    skills: ["Go", "C++", "Python", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "gRPC", "AWS"],
    interests: ["Developer Tools", "FinTech", "Cloud Infrastructure", "Cybersecurity"],
    languages: ["English", "German"],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      portfolio: "https://devpost.com"
    },
    github: "https://github.com",
    portfolio: "https://devonw.tech",
    timeCommitment: "15-20 hrs/week"
  },
  {
    id: "user-6",
    name: "Sophia Kim",
    role: "Data Scientist",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    university: "Carnegie Mellon University",
    department: "Data Science & Statistics",
    major: "Statistics & ML",
    yearOfStudy: "2nd Year B.Tech",
    bio: "Data storyteller passionate about predictive modeling, statistical testing, Machine Learning, and visualization dashboards.",
    experience: "Beginner",
    availability: "Weekends",
    skills: ["Python", "Machine Learning", "R", "Pandas", "NumPy", "SQL", "Tableau", "Scikit-Learn"],
    interests: ["HealthTech", "AI / ML", "Social Impact", "EdTech"],
    languages: ["English", "Korean"],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      portfolio: "https://devpost.com"
    },
    github: "https://github.com",
    portfolio: "https://sophiakim.data",
    timeCommitment: "10-12 hrs/week"
  },
  {
    id: "user-7",
    name: "Liam O'Connor",
    role: "Mobile App Developer",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    university: "University of Waterloo",
    department: "Software Engineering",
    major: "Computer Science",
    yearOfStudy: "3rd Year B.Tech",
    bio: "Cross-platform mobile engineer with a knack for smooth 60fps animations, offline-first sync, and native C++ / Swift module integration.",
    experience: "Intermediate",
    availability: "Full-time",
    skills: ["React Native", "Flutter", "Swift", "C++", "Firebase", "TypeScript", "Node.js"],
    interests: ["Gaming", "Social Impact", "FinTech", "EdTech"],
    languages: ["English", "French"],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      portfolio: "https://devpost.com"
    },
    github: "https://github.com",
    portfolio: "https://liamoconnor.app",
    timeCommitment: "25-30 hrs/week"
  },
  {
    id: "user-8",
    name: "Aaliyah Patel",
    role: "Frontend Developer",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    university: "UT Austin",
    department: "Information Technology",
    major: "Informatics",
    yearOfStudy: "1st Year B.Tech",
    bio: "Frontend apprentice eager to learn and contribute to open source and hackathon projects. Fast with Vue.js, Tailwind CSS, and React.",
    experience: "Beginner",
    availability: "Weekends",
    skills: ["HTML/CSS", "JavaScript", "React", "Vue.js", "Tailwind CSS", "Figma", "Git"],
    interests: ["EdTech", "Web3", "Social Impact", "Design Systems"],
    languages: ["English", "Hindi", "Gujarati"],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      portfolio: "https://devpost.com"
    },
    github: "https://github.com",
    portfolio: "https://aaliyahpatel.io",
    timeCommitment: "10-15 hrs/week"
  }
];

export const POPULAR_QUICK_SKILLS = [
  "React",
  "Python",
  "Figma",
  "Tailwind CSS",
  "Node.js",
  "Machine Learning",
  "C++",
  "TypeScript",
  "Docker",
  "PostgreSQL"
];

export const ALL_SKILLS = Array.from(
  new Set([...POPULAR_QUICK_SKILLS, ...mockProfiles.flatMap((p) => p.skills)])
).sort();

export const ALL_INTERESTS = Array.from(
  new Set(mockProfiles.flatMap((p) => p.interests || []))
).sort();

export const AVAILABILITY_OPTIONS = ["Any", "Weekends", "Evenings", "Full-time"];

export const EXPERIENCE_LEVELS = ["Any", "Beginner", "Intermediate", "Advanced"];
