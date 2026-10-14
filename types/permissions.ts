export interface SharedPermissionRequest {
  id: string;
  student: string;
  roll: string;
  type: "On-Duty (OD)" | "Medical Leave" | "Industrial Visit" | "Lab Access";
  event: string;
  dateRange: string;
  submitted: string;
  status: "pending" | "approved" | "rejected";
  attendanceCredit: boolean;
  remarks?: string;
  letterText?: string;
  letterFileName?: string;
  letterFileSize?: string;
}

export const INITIAL_SHARED_PERMISSIONS: SharedPermissionRequest[] = [
  {
    id: "req-1",
    student: "Ananya V.",
    roll: "21BCE1089",
    type: "On-Duty (OD)",
    event: "Smart India Hackathon 2026 – Grand Finale",
    dateRange: "Oct 16 – Oct 18, 2026",
    submitted: "2h ago",
    status: "pending",
    attendanceCredit: true,
    letterText:
      "Respected HOD Dr. Srinivas Rao Sir,\n\nI am writing to formally request On-Duty sanction for participating in the Grand Finale of Smart India Hackathon 2026 at IIT Roorkee from Oct 16 to Oct 18. Please find attached the official ministry shortlist confirmation letter.\n\nI kindly request you to approve my OD and auto-credit attendance for the missed lab and lecture sessions.\n\nSincerely,\nAnanya V. (21BCE1089)",
    letterFileName: "SIH_2026_Finalist_Shortlist_Letter.pdf",
    letterFileSize: "248 KB",
    remarks: "Team Campus2Career finalist entry under AI/ML bucket.",
  },
  {
    id: "req-2",
    student: "Rohan Sharma",
    roll: "21BCE1042",
    type: "On-Duty (OD)",
    event: "ICPC Regional Qualifier 2026",
    dateRange: "Oct 20 – Oct 21, 2026",
    submitted: "4h ago",
    status: "pending",
    attendanceCredit: true,
    letterText:
      "To: HOD CSE Department.\nSubject: Request for On-Duty leave for ACM-ICPC Prelims.\n\nRequesting permission to represent our institution in the ICPC preliminary round on Oct 20–21.",
    letterFileName: "ICPC_Team_Admit_Card.pdf",
    letterFileSize: "185 KB",
  },
  {
    id: "req-3",
    student: "Karthik Raja",
    roll: "21BCE1012",
    type: "Medical Leave",
    event: "Medical Treatment – Clinic Certificate Verified",
    dateRange: "Oct 10 – Oct 11, 2026",
    submitted: "1d ago",
    status: "approved",
    attendanceCredit: true,
    letterText:
      "Certified outpatient medical rest advised by campus clinic due to acute seasonal viral illness.",
    letterFileName: "Apollo_Medical_Fitness_Certificate.pdf",
    letterFileSize: "512 KB",
    remarks: "Medical certificate endorsed by campus clinic",
  },
  {
    id: "req-4",
    student: "Ananya V.",
    roll: "21BCE1089",
    type: "On-Duty (OD)",
    event: "National AI Symposium Paper Presentation",
    dateRange: "Oct 05, 2026",
    submitted: "1w ago",
    status: "approved",
    attendanceCredit: true,
    letterText:
      "Respected Sir,\n\nFormal request to present our research paper 'Explainable AI in Graduate Employment Readiness' at IEEE National AI Symposium. The presentation slot was verified by Dr. Rao.",
    letterFileName: "IEEE_Paper_Acceptance_Letter.pdf",
    letterFileSize: "340 KB",
    remarks: "Attendance credited for 6 lecture sessions",
  },
  {
    id: "req-5",
    student: "Vikram Patel",
    roll: "21BCE1105",
    type: "Industrial Visit",
    event: "Personal Internship Interview - Off Campus",
    dateRange: "Oct 02, 2026",
    submitted: "1w ago",
    status: "rejected",
    attendanceCredit: false,
    letterText: "Interview call at Bangalore startup office.",
    letterFileName: "Interview_Email_Copy.pdf",
    letterFileSize: "120 KB",
    remarks: "Interview schedule unverified by T&P cell",
  },
];
