export interface CollegeItem {
  id: string;
  name: string;
  shortName: string;
  area: string;
  type: "Autonomous" | "University Dept" | "Engineering" | "Degree College" | "Other";
}

export const MUMBAI_COLLEGES: CollegeItem[] = [
  { id: "udcs", name: "University Department of Computer Science (UDCS, Kalina)", shortName: "UDCS Kalina", area: "Santacruz", type: "University Dept" },
  { id: "vjti", name: "Veermata Jijabai Technological Institute (VJTI)", shortName: "VJTI", area: "Matunga", type: "Autonomous" },
  { id: "spit", name: "Sardar Patel Institute of Technology (SPIT)", shortName: "SPIT", area: "Andheri", type: "Autonomous" },
  { id: "spce", name: "Sardar Patel College of Engineering (SPCE)", shortName: "SPCE", area: "Andheri", type: "Autonomous" },
  { id: "djsce", name: "D. J. Sanghvi College of Engineering (DJSCE)", shortName: "DJSCE", area: "Vile Parle", type: "Autonomous" },
  { id: "vesit", name: "Vivekanand Education Society's Institute of Tech (VESIT)", shortName: "VESIT", area: "Chembur", type: "Engineering" },
  { id: "kjsce", name: "K. J. Somaiya College of Engineering (KJSCE)", shortName: "KJSCE", area: "Vidyavihar", type: "Autonomous" },
  { id: "tsec", name: "Thadomal Shahani Engineering College (TSEC)", shortName: "TSEC", area: "Bandra", type: "Engineering" },
  { id: "crce", name: "Fr. Conceicao Rodrigues College of Engineering (CRCE)", shortName: "Fr. Agnel Bandra", area: "Bandra", type: "Engineering" },
  { id: "fcrit", name: "Fr. C. Rodrigues Institute of Technology (FCRIT)", shortName: "FCRIT Vashi", area: "Vashi, Navi Mumbai", type: "Engineering" },
  { id: "dbit", name: "Don Bosco Institute of Technology (DBIT)", shortName: "DBIT", area: "Kurla", type: "Engineering" },
  { id: "rait", name: "Ramrao Adik Institute of Technology (RAIT)", shortName: "RAIT Nerul", area: "Nerul, Navi Mumbai", type: "Engineering" },
  { id: "siesgst", name: "SIES Graduate School of Technology", shortName: "SIES GST", area: "Nerul, Navi Mumbai", type: "Engineering" },
  { id: "tcet", name: "Thakur College of Engineering and Technology (TCET)", shortName: "TCET", area: "Kandivali", type: "Autonomous" },
  { id: "sfit", name: "St. Francis Institute of Technology (SFIT)", shortName: "SFIT", area: "Borivali", type: "Engineering" },
  { id: "vit", name: "Vidyalankar Institute of Technology (VIT)", shortName: "VIT Wadala", area: "Wadala", type: "Autonomous" },
  { id: "sakec", name: "Shah & Anchor Kutchhi Engineering College (SAKEC)", shortName: "SAKEC", area: "Chembur", type: "Engineering" },
  { id: "atharva", name: "Atharva College of Engineering", shortName: "Atharva Malad", area: "Malad", type: "Engineering" },
  { id: "xie", name: "Xavier Institute of Engineering (XIE)", shortName: "XIE Mahim", area: "Mahim", type: "Engineering" },
  { id: "rizvi", name: "Rizvi College of Engineering", shortName: "Rizvi Bandra", area: "Bandra", type: "Engineering" },
  { id: "pillai", name: "Pillai College of Engineering (PCE)", shortName: "Pillai Panvel", area: "Panvel", type: "Autonomous" },
  { id: "terna", name: "Terna Engineering College", shortName: "Terna Nerul", area: "Nerul, Navi Mumbai", type: "Engineering" },
  { id: "dmce", name: "Datta Meghe College of Engineering (DMCE)", shortName: "DMCE Airoli", area: "Airoli, Navi Mumbai", type: "Engineering" },
  { id: "bvcoe", name: "Bharati Vidyapeeth College of Engineering", shortName: "BVCOE Kharghar", area: "Navi Mumbai", type: "Engineering" },
  { id: "saraswati", name: "Saraswati College of Engineering", shortName: "SCOE Kharghar", area: "Kharghar", type: "Engineering" },
  { id: "apsit", name: "A. P. Shah Institute of Technology (APSIT)", shortName: "APSIT", area: "Thane", type: "Engineering" },
  { id: "ucoep", name: "Universal College of Engineering", shortName: "Universal Vasai", area: "Vasai", type: "Engineering" },
  { id: "viva", name: "Viva Institute of Technology", shortName: "Viva Virar", area: "Virar", type: "Engineering" },
  { id: "mpstme", name: "Mukesh Patel School of Tech Mgmt (NMIMS MPSTME)", shortName: "MPSTME NMIMS", area: "Vile Parle", type: "Autonomous" },
  { id: "xaviers", name: "St. Xavier's College (Autonomous)", shortName: "St. Xavier's", area: "Fort", type: "Degree College" },
  { id: "mithibai", name: "Mithibai College of Arts, Chauhan Institute of Science", shortName: "Mithibai", area: "Vile Parle", type: "Autonomous" },
  { id: "nmcollege", name: "Narsee Monjee College of Commerce and Economics", shortName: "NM College", area: "Vile Parle", type: "Autonomous" },
  { id: "ruia", name: "Ramnarain Ruia Autonomous College", shortName: "Ruia College", area: "Matunga", type: "Autonomous" },
  { id: "podar", name: "R. A. Podar College of Commerce and Economics", shortName: "Podar Matunga", area: "Matunga", type: "Autonomous" },
  { id: "khalsa", name: "Guru Nanak Khalsa College of Arts, Science & Commerce", shortName: "Khalsa Matunga", area: "Matunga", type: "Degree College" },
  { id: "jaihind", name: "Jai Hind College (Autonomous)", shortName: "Jai Hind", area: "Churchgate", type: "Autonomous" },
  { id: "kccollege", name: "K. C. College (HSNC University)", shortName: "KC College", area: "Churchgate", type: "Degree College" },
  { id: "hrcollege", name: "H. R. College of Commerce and Economics", shortName: "HR College", area: "Churchgate", type: "Degree College" },
  { id: "siesscion", name: "SIES College of Arts, Science & Commerce", shortName: "SIES Sion", area: "Sion", type: "Degree College" },
  { id: "somaiyasc", name: "S. K. Somaiya College of Arts, Science and Commerce", shortName: "SK Somaiya", area: "Vidyavihar", type: "Degree College" },
  { id: "upg", name: "Usha Pravin Gandhi College of Arts, Science and Comm (UPG)", shortName: "UPG Vile Parle", area: "Vile Parle", type: "Degree College" },
  { id: "thakurdegree", name: "Thakur College of Science and Commerce (TCSC)", shortName: "Thakur Science", area: "Kandivali", type: "Autonomous" },
  { id: "bhavans", name: "Bhavan's College", shortName: "Bhavans Andheri", area: "Andheri", type: "Degree College" },
  { id: "patkar", name: "Patkar-Varde College", shortName: "Patkar Goregaon", area: "Goregaon", type: "Degree College" },
  { id: "sndt", name: "SNDT Women's University", shortName: "SNDT Mumbai", area: "Churchgate / Juhu", type: "University Dept" },
  { id: "iitb", name: "Indian Institute of Technology Bombay (IIT Bombay)", shortName: "IIT Bombay", area: "Powai", type: "Autonomous" },
  { id: "ict", name: "Institute of Chemical Technology (ICT Mumbai)", shortName: "ICT Matunga", area: "Matunga", type: "Autonomous" },
  { id: "tiss", name: "Tata Institute of Social Sciences (TISS)", shortName: "TISS Deonar", area: "Chembur", type: "Autonomous" },
  { id: "bkbirlacollege", name: "B. K. Birla College of Arts, Science & Commerce", shortName: "Birla Kalyan", area: "Kalyan", type: "Autonomous" },
  { id: "chm", name: "Smt. CHM College", shortName: "CHM Ulhasnagar", area: "Ulhasnagar", type: "Degree College" },
  { id: "other", name: "Other College / University (Outside MMR / Unlisted)", shortName: "Other College", area: "Other", type: "Other" }
];

export const STUDENT_COURSES = [
  "B.Tech / B.E. Computer Engineering",
  "B.Tech / B.E. Information Technology",
  "B.Tech / B.E. Artificial Intelligence & Data Science",
  "B.Tech / B.E. Cyber Security",
  "B.Tech / B.E. Electronics & Computer Science",
  "B.Tech / B.E. Mechanical / Other Engineering",
  "B.Sc Computer Science",
  "B.Sc Information Technology (B.Sc IT)",
  "B.Sc Data Science",
  "BCA (Bachelor of Computer Applications)",
  "MCA (Master of Computer Applications)",
  "M.Sc Computer Science",
  "M.Sc Information Technology",
  "M.Sc Data Science / Artificial Intelligence",
  "B.Com / BMS / BAF / Other Degree",
  "Other Course"
];

export const ACADEMIC_YEARS = [
  "1st Year (FE / FY)",
  "2nd Year (SE / SY)",
  "3rd Year (TE / TY)",
  "Final Year (BE / Final)",
  "Master's Part 1 (First Year)",
  "Master's Part 2 (Final Year)"
];
