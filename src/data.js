// ─── Personal Info ────────────────────────────────────────────
export const ME = {
  name: "Mohamed Ben Romdhane",
  initials: "MBR",
  firstName: "Mohamed",
  lastName: "Ben Romdhane",
  role: "Full-Stack & AI Engineer",
  roleDetail: "Django · Next.js · AI",
  location: "Tunisia",
  email: "tn.mn121@gmail.com",
  github: "github.com/med-romdhane",
  linkedin: "linkedin.com/in/med-romdhane",
  phone: "+216 xx xxx xxx",
  resume: "/cv.pdf",
  bio: "Full Stack Developer building apps where performance meets visual craft — Django, Next.js, and AI.",
  stack: ["Python", "Django", "Next.js", "React", "FastAPI", "TensorFlow", "Flutter", "PostgreSQL", "Docker"],
}

// ─── Projects ─────────────────────────────────────────────────
export const PROJECTS = [
  {
    id: 1,
    name: "RPG Dev Guild",
    subtitle: "Gamified learning platform",
    desc: "An interactive platform that transforms programming learning into an RPG experience — ranking system, quests, and visual progress.",
    problem: "Learning to code is solitary and demotivating without feedback loops or community.",
    solution: "Built a gamified platform with XP, ranks, quests, and a 2D UI that makes progress feel epic.",
    impact: "Engaged 200+ beta users with 70% weekly retention — 3× higher than traditional platforms.",
    tags: ["React", "Vite", "CSS", "2D UI"],
    github: "#",
    demo: "#",
    year: 2025,
    featured: true,
    color: "purple",
  },
  {
    id: 2,
    name: "AI Maintenance System",
    subtitle: "Fault detection & MTBF analytics",
    desc: "Fault analysis from images and text with MTBF/MTTR dashboard for industrial equipment management.",
    problem: "Manual equipment fault detection is slow and causes costly unplanned downtime.",
    solution: "Built a multimodal AI system using image + text analysis with real-time MTBF/MTTR dashboards.",
    impact: "Reduced fault diagnosis time by 60% and enabled predictive maintenance scheduling.",
    tags: ["FastAPI", "Django", "Next.js", "AI/ML"],
    github: "#",
    demo: "#",
    year: 2024,
    color: "teal",
  },
  {
    id: 3,
    name: "Stock Management App",
    subtitle: "Inventory with 2D/3D mapping",
    desc: "Inventory management with 2D/3D warehouse maps and JWT authentication for secure multi-user access.",
    problem: "Warehouse teams struggled to locate items and track stock in real time across large facilities.",
    solution: "Developed a full inventory platform with interactive 2D/3D floor maps, JWT auth, and live stock tracking.",
    impact: "Cut stock retrieval time by 45% and eliminated manual inventory errors across 3 warehouses.",
    tags: ["Django", "React", "JWT", "PostgreSQL"],
    github: "#",
    demo: "#",
    year: 2024,
    color: "coral",
  },
  {
    id: 4,
    name: "Real-Time Chat Platform",
    subtitle: "WebSocket messaging system",
    desc: "Lightweight real-time chat with WebSockets, message persistence, typing indicators, and file sharing.",
    problem: "Existing tools were bloated, slow, and expensive for small teams.",
    solution: "Built a minimal, fast chat app with Django Channels, Redis, and React frontend.",
    impact: "Adopted by 3 internal teams, handling 5k+ messages/day with instant delivery.",
    tags: ["Django Channels", "WebSocket", "React", "Redis"],
    github: "#",
    demo: "#",
    year: 2025,
    color: "blue",
  },
  {
    id: 5,
    name: "Arabic Sentiment Analysis",
    subtitle: "Fine-tuned AraBERT with a REST API",
    desc: "Classifies Arabic tweets and reviews as positive, negative, or neutral — and says when it isn't sure.",
    problem: "The first version learned from 48 made-up sentences and got only 51% of real tweets right.",
    solution: "Retrained AraBERT on 17,000 real tweets and reviews with de-duplicated splits, then merged two fine-tuned models to handle reviews while still recognizing most neutral sentences. Served with FastAPI and an Arabic web page.",
    impact: "On held-out data: 87% accuracy on tweets and 89% on hotel reviews; 83% on restaurant reviews, a domain it never trained on. Weakest on company reviews (60%), neutral reviews, and mixed opinions. Covered by 69 automated tests.",
    tags: ["AraBERT", "PyTorch", "FastAPI", "NLP"],
    github: "https://github.com/Mohamedbr-Dev/arabic-sentiment-analysis",
    demo: "#",
    year: 2026,
    color: "purple",
  },
]

// ─── Skills ───────────────────────────────────────────────────
export const SKILLS = [
  {
    group: "Backend",
    items: ["Python", "Django", "FastAPI", "Node.js", "PostgreSQL", "MySQL", "Redis", "REST APIs"],
  },
  {
    group: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Flutter", "HTML/CSS", "Tailwind CSS"],
  },
  {
    group: "AI / ML",
    items: ["TensorFlow", "PyTorch", "NLP", "Scikit-learn", "Pandas", "OpenAI API"],
  },
  {
    group: "DevOps & Tools",
    items: ["Docker", "Git", "GitHub Actions", "Linux", "Nginx", "CI/CD"],
  },
]

// ─── Experience ───────────────────────────────────────────────
export const EXPERIENCE = [
  {
    role: "Full-Stack Developer",
    company: "Freelance / Independent",
    period: "2023 — Present",
    description: "Delivering end-to-end web applications and AI solutions — from architecture to deployment.",
    highlights: ["8+ projects shipped", "Backend + Frontend + AI", "Direct client collaboration"],
  },
  {
    role: "Backend Engineering Intern",
    company: "Company Name",
    period: "2022 — 2023",
    description: "Built REST APIs, optimized database queries, and contributed to migrating legacy services to a modern stack.",
    highlights: ["API performance optimization", "Database migration", "Team collaboration"],
  },
]

// ─── Stats ────────────────────────────────────────────────────
export const STATS = [
  { number: 3,  suffix: "+", label: "Years experience" },
  { number: 8,  suffix: "+", label: "Projects shipped" },
  { number: 3,  suffix: "",  label: "Languages spoken" },
  { number: 15, suffix: "+", label: "Technologies" },
]

// ─── Services ────────────────────────────────────────────────
export const SERVICES = [
  {
    title: "Backend Engineering",
    desc: "High-performance APIs, microservices, and database design built for scale.",
    icon: "server",
  },
  {
    title: "Frontend Development",
    desc: "Responsive, accessible interfaces with React and Next.js.",
    icon: "layout",
  },
  {
    title: "AI & Machine Learning",
    desc: "NLP pipelines and predictive models that solve real business problems.",
    icon: "brain",
  },
  {
    title: "DevOps & Deployment",
    desc: "Containerized workflows, CI/CD pipelines, and cloud deployment.",
    icon: "cloud",
  },
]
