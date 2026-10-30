export interface Enigma2Event {
  id: string;
  title: string;
  day: string;
  date: string;
  category: "Coding" | "Problem Solving" | "Gaming" | "Innovation";
  badge: "Solo" | "Team" | "Solo / Team";
  fee: string;
  prizePool: string;
  shortDescription: string;
  fullDescription: string;
  cyberTheme: string;
  accentColor: "cyan" | "magenta" | "blue" | "green" | "violet";
  rules: string[];
  venue: string;
  schedule: string;
  maxTeamSize: number;
  minTeamSize: number;
  coordinators: Array<{ name: string; phone: string; role: string }>;
}

export const ENIGMA2_EVENTS: Enigma2Event[] = [
  {
    id: "compile-vibes",
    title: "Compile The Vibes",
    day: "16 Jan 2027",
    date: "16 January 2027",
    category: "Coding",
    badge: "Solo / Team",
    fee: "₹99 solo / ₹149 team",
    prizePool: "₹6,000",
    shortDescription: "Turn an idea into a working prototype with AI tools. Bring your creativity, coding skills and a clear pitch.",
    fullDescription: "Build a working prototype in 2.5 hours using AI tools such as ChatGPT, Gemini, Claude or Cursor. Enter solo or with a team of up to three, then present your solution in a three-minute pitch.",
    cyberTheme: "NEURAL_SYNTHESIS_V2",
    accentColor: "cyan",
    rules: [
      "Permitted Toolchains: AI models (ChatGPT, Gemini, Claude), Low-code / No-code tools, any modern framework / language, open-source libraries.",
      "Plagiarizing 1:1 existing open products is strictly prohibited; original architecture is required.",
      "Duration: 2.5 Hours sprint followed by 3-minute pitch.",
      "Participation: Solo or Team of up to 3 hackers. Bring your own laptops/chargers.",
      "Final Deliverable: Working prototype running locally or hosted on live URL."
    ],
    venue: "Department of Computer Science, University of Mumbai",
    schedule: "10:00 AM - 01:00 PM",
    minTeamSize: 1,
    maxTeamSize: 3,
    coordinators: [
      { name: "Ankita Goyal", phone: "+91 93233 88342", role: "Event Lead" },
      { name: "Mahesh Khairnar", phone: "+91 75885 52573", role: "Technical Proctor" }
    ]
  },
  {
    id: "blind-dates",
    title: "Blind Date with Code",
    day: "16 Jan 2027",
    date: "16 January 2027",
    category: "Coding",
    badge: "Solo",
    fee: "₹99",
    prizePool: "₹4,500",
    shortDescription: "Screen off. Logic on. Test your coding accuracy without seeing your code.",
    fullDescription: "Solve coding challenges with your monitor switched off. This solo competition tests your logic, syntax and accuracy across three rounds.",
    cyberTheme: "OPTICAL_BLACKOUT_ZERO",
    accentColor: "magenta",
    rules: [
      "Solo entry only.",
      "Monitors will be powered off / blacked out during each coding challenge phase.",
      "3 progressive rounds of increasing algorithmic complexity.",
      "Syntax errors, missed semicolons/indentation, and failing test cases will cause deductions.",
      "Total Challenge Duration: 90 Minutes."
    ],
    venue: "Department of Computer Science, University of Mumbai",
    schedule: "01:00 PM - 02:00 PM",
    minTeamSize: 1,
    maxTeamSize: 1,
    coordinators: [
      { name: "Mahesh Khairnar", phone: "+91 75885 52573", role: "Event Lead" },
      { name: "Kunal Mahale", phone: "+91 93708 00040", role: "Proctor" }
    ]
  },
  {
    id: "decode-hunt",
    title: "Decode The Hunt",
    day: "16 Jan 2027",
    date: "16 January 2027",
    category: "Problem Solving",
    badge: "Team",
    fee: "₹149 per team",
    prizePool: "₹6,000",
    shortDescription: "Crack the clues. Find the next checkpoint. Race across campus with your team.",
    fullDescription: "Team up with two or three students to solve ciphers and riddles across campus. Each clue leads to the next checkpoint. The fastest team to finish wins.",
    cyberTheme: "CRYPTIC_MATRIX_RECON",
    accentColor: "violet",
    rules: [
      "Team size: 2–3 students.",
      "Linear & branching cryptic clues: each decoded anomaly reveals coordinates to the next node.",
      "Use of smartphones and cyber decoding utilities permitted.",
      "The fastest team to reach the final checkpoint wins.",
      "Duration: 75 Minutes."
    ],
    venue: "Department of Computer Science, University of Mumbai",
    schedule: "03:00 PM - 04:15 PM",
    minTeamSize: 2,
    maxTeamSize: 3,
    coordinators: [
      { name: "Aryan Palekar", phone: "+91 89282 21297", role: "Crypt Lead" },
      { name: "Utkarsha Patil", phone: "+91 79721 34987", role: "Field Coordinator" }
    ]
  },
  {
    id: "fifa-addicts",
    title: "FIFA Addicts",
    day: "16 Jan 2027",
    date: "16 January 2027",
    category: "Gaming",
    badge: "Solo",
    fee: "₹99",
    prizePool: "₹4,500",
    shortDescription: "Take the pitch in a FIFA Mobile knockout tournament. Win your match to advance.",
    fullDescription: "Compete solo in head-to-head FIFA Mobile matches. Each knockout win takes you closer to the final.",
    cyberTheme: "CYBER_ARENA_KNOCKOUT",
    accentColor: "green",
    rules: [
      "Solo entry only; Head-to-Head (H2H) competitive mode.",
      "5-minute real-time regulation matches.",
      "Direct single-elimination knockout format — winner advances.",
      "Ties decided by extra time or possession statistics per referee discretion.",
      "Unsportsmanlike play, backpassing or stalling will trigger instantaneous DQ.",
      "Total Arena Duration: 90 Minutes."
    ],
    venue: "Department of Computer Science, University of Mumbai",
    schedule: "02:00 PM - 03:00 PM",
    minTeamSize: 1,
    maxTeamSize: 1,
    coordinators: [
      { name: "Rawket (Om)", phone: "+91 99677 03018", role: "Tournament Admin" },
      { name: "Vansh Lad", phone: "+91 90282 80757", role: "Bracket Marshall" }
    ]
  },
  {
    id: "the-arcade",
    title: "The Arcade: Innovation Nexus",
    day: "16 Jan 2027",
    date: "16 January 2027",
    category: "Innovation",
    badge: "Solo / Team",
    fee: "Free Entry",
    prizePool: "₹44,000 Total Rewards",
    shortDescription: "The exhibition floor of Enigma 2.0. Cutting-edge hardware/software project showcases, research posters, and interactive stalls.",
    fullDescription: "The open creative pavilion of Enigma 2.0 featuring three dynamic tracks: Project Showcase (AI/ML, IoT, Web3, robotics), Visual Poster Presentations, and energetic Food & Fun student-run stalls.",
    cyberTheme: "QUANTUM_EXPO_PAVILION",
    accentColor: "blue",
    rules: [
      "Project booths must complete electrical and hardware setup 1 hour prior to gate opening.",
      "Working live demos and prototypes are given highest judging weights.",
      "Standard academic and technical integrity guidelines apply.",
      "Stall allotments are managed on first-come-first-approved protocol."
    ],
    venue: "UDCS Campus Ground & Exhibition Halls",
    schedule: "Full Day Exhibition",
    minTeamSize: 1,
    maxTeamSize: 4,
    coordinators: [
      { name: "Pranav More", phone: "+91 81085 44239", role: "Expo Lead" },
      { name: "Mayur Shewale", phone: "+91 88280 69553", role: "Operations Lead" }
    ]
  }
];

export const ARCADE_TRACKS = [
  {
    id: "project-showcase",
    title: "Project Showcase",
    tagline: "Deploy & Demo",
    description: "Display your cutting-edge technical projects. From IoT innovations and robotics to AI/ML neural models and SaaS platforms.",
    highlights: ["Live Hardware Demos", "Industry Jury Critique", "Networking with Founders"],
    color: "neon-cyan"
  },
  {
    id: "poster-presentation",
    title: "Poster Presentation",
    tagline: "Visual Research",
    description: "Present your novel academic research or disruptive ideas visually. A high-visibility stage for sharing breakthroughs.",
    highlights: ["Academic Peer Review", "Printed & Digital Displays", "Certificate of Merit"],
    color: "neon-magenta"
  },
  {
    id: "food-fun-stalls",
    title: "Food & Fun Stalls",
    tagline: "Campus Carnival",
    description: "Run your own booth. Energize the crowd with gourmet delights, carnival mini-games, retro arcade setups, or merch.",
    highlights: ["High Footfall Zone", "Student Entrepreneur Hub", "Best Stall Accolades"],
    color: "neon-green"
  }
];
