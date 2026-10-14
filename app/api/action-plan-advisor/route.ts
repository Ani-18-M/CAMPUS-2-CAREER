import { NextResponse } from "next/server";

export interface AiRecommendationResponse {
  id: string;
  category: "Academic" | "Placement" | "Attendance" | "LMS";
  title: string;
  detectedInsight: string;
  whyItMatters: string;
  recommendedAction: string;
  priority: "Critical" | "High" | "Medium";
  impact: string;
  evidence: {
    title: string;
    category: string;
    source: string;
    detectedDate: string;
    currentValue: string;
    threshold: string;
    insight: string;
    explainability: string;
    metrics: { label: string; value: string; benchmark: string; status: "risk" | "safe" }[];
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      mode = "generate_recommendations",
      query = "",
      studentName = "Ananya V.",
      attendance = 68.4,
      dbmsScore = 62,
      codingDiagnostic = 45,
      pendingAssignments = 2,
      successScore = 74,
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    const startTime = Date.now();

    // ─────────────────────────────────────────────────────────────
    // MODE 1: VOICE / ORB DIRECT QUERY
    // ─────────────────────────────────────────────────────────────
    if (mode === "ask_orb" || mode === "voice_query") {
      if (apiKey && apiKey.trim().length > 0) {
        try {
          const systemPrompt = `You are the Gemini Decision Intelligence Engine inside "Campus 2 Career", powering the student's Action Plan.
Student: ${studentName} (III B.Tech CSE)
Current Telemetry:
- Success Score: ${successScore}/100
- Attendance: ${attendance}% (Statutory Bar: 75.0%)
- Academic Benchmark: DBMS Continuous Evaluation ${dbmsScore}% (Target: 75%)
- Placement Diagnostic: Algorithmic Coding ${codingDiagnostic}/100 (Tier-1 SDE benchmark: 70+)
- LMS Status: ${pendingAssignments} assignments pending within 72 hrs

Instructions:
- Provide an inspiring, ultra-concise, razor-sharp response (max 65 words).
- Prioritize high-impact immediate actions that improve their Success Score.
- Directly reference actual numbers (e.g. 68.4%, 45/100, 62%).
- Conclude with a strong forward-looking prompt.`;

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [
                      { text: systemPrompt },
                      { text: `Student Question: "${query || "What is my top priority action to reach 85+ Success Score?"}"` },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.3,
                  maxOutputTokens: 1000,
                  thinkingConfig: {
                    thinkingBudget: 0,
                  },
                },
              }),
            }
          );

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (text) {
              return NextResponse.json({
                success: true,
                source: "gemini-flash-latest",
                latencyMs: Date.now() - startTime,
                answer: text,
              });
            }
          }
        } catch (err) {
          console.warn("Gemini voice query call failed, falling back to heuristics:", err);
        }
      }

      // Fallback response if offline
      return NextResponse.json({
        success: true,
        source: "telemetry-fallback",
        latencyMs: Date.now() - startTime,
        answer: `Ananya, prioritizing 2 Saturday make-up labs restores your attendance from ${attendance}% to 76.2%, while solving 5 Graph DFS/BFS modules raises your coding diagnostic from ${codingDiagnostic} to 65+, lifting your Success Score past 82 before placement drives.`,
      });
    }

    // ─────────────────────────────────────────────────────────────
    // MODE 2: GENERATE 4 STRUCTURED AI RECOMMENDATIONS
    // ─────────────────────────────────────────────────────────────
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const prompt = `You are the KPMG Smart Campus Analytics Decision Intelligence AI for "Campus 2 Career".
Generate exactly 4 personalized, data-backed action recommendations for:
Student: ${studentName}
- Biometric Attendance: ${attendance}% (Target: 75%)
- Academic: DBMS Mid-term score: ${dbmsScore}% (Target: 75%, Normalization deficit)
- Placement: Coding Diagnostic: ${codingDiagnostic}/100 (Tier-1 Cutoff: 70+)
- LMS: ${pendingAssignments} incomplete assignments (OS Lab 3 due in 72h)

Respond ONLY with a valid JSON array of 4 objects matching this EXACT schema:
[
  {
    "id": "rec-1",
    "category": "Attendance" | "Placement" | "Academic" | "LMS",
    "title": "short title",
    "detectedInsight": "specific metric detected",
    "whyItMatters": "explainability / impact on graduation or career",
    "recommendedAction": "concrete next step",
    "priority": "Critical" | "High" | "Medium",
    "impact": "+X pts",
    "evidence": {
      "title": "audit name",
      "category": "Academic" | "Placement" | "Attendance" | "LMS",
      "source": "official system name",
      "detectedDate": "Current Term",
      "currentValue": "current metric",
      "threshold": "target benchmark",
      "insight": "root cause insight",
      "explainability": "why this action creates measurable outcome",
      "metrics": [
        { "label": "metric name", "value": "x", "benchmark": "y", "status": "risk" | "safe" }
      ]
    }
  }
]
Do not enclose in markdown ticks if possible, or use standard json. Provide realistic metrics and razor-sharp academic precision.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json",
                maxOutputTokens: 3000,
                thinkingConfig: {
                  thinkingBudget: 0,
                },
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
          if (rawText) {
            const parsed = JSON.parse(rawText);
            if (Array.isArray(parsed) && parsed.length >= 4) {
              return NextResponse.json({
                success: true,
                source: "gemini-flash-latest",
                latencyMs: Date.now() - startTime,
                recommendations: parsed.slice(0, 4),
              });
            }
          }
        }
      } catch (err) {
        console.warn("Gemini generation failed, serving grounded baseline:", err);
      }
    }

    // Baseline Grounded Recommendations (if offline or rate-limited)
    return NextResponse.json({
      success: true,
      source: "telemetry-grounded",
      latencyMs: Date.now() - startTime,
      recommendations: [
        {
          id: "rec-attendance",
          category: "Attendance",
          title: "Improve DBMS & Lab Attendance",
          detectedInsight: `Attendance in DBMS is ${attendance}% (Statutory Requirement: 75.0%).`,
          whyItMatters: "Current shortfall risks semester detention and placement shortlisting bar.",
          recommendedAction: "Book 2 Saturday Make-up Lab sessions and file Hackathon OD regularization.",
          priority: "Critical",
          impact: "+7.8 pts",
          evidence: {
            title: "RFID Turnstile & Biometric Audit",
            category: "Attendance",
            source: "College Biometric Access Controller",
            detectedDate: "Today",
            currentValue: `${attendance}%`,
            threshold: "75.0% Mandatory",
            insight: "Missing 14 lecture periods caused cumulative attendance to drop 6.6% below requirement.",
            explainability: "Completing 2 make-up labs recovers 10 periods, raising attendance to 76.2% and removing risk flags.",
            metrics: [
              { label: "Theory Lectures", value: "32 / 48 hrs", benchmark: "75%", status: "risk" },
              { label: "Lab Practical Sessions", value: "14 / 22 hrs", benchmark: "80%", status: "risk" },
              { label: "Sanctioned OD Credits", value: "0 hrs (Pending)", benchmark: "12 hrs", status: "safe" },
            ],
          },
        },
        {
          id: "rec-placement",
          category: "Placement",
          title: "Strengthen Algorithmic Coding",
          detectedInsight: `Campus coding assessment diagnostic score is ${codingDiagnostic}/100.`,
          whyItMatters: "Tier-1 software engineering recruiters (e.g. JP Morgan, Google) require 70+.",
          recommendedAction: "Complete the 5 Graph Traversal modules and take the diagnostic re-test.",
          priority: "High",
          impact: "+17 pts",
          evidence: {
            title: "Campus Diagnostic Coding Evaluation",
            category: "Placement",
            source: "Placement Cell Code Judge",
            detectedDate: "Oct 10, 2026",
            currentValue: `${codingDiagnostic} / 100`,
            threshold: "70 / 100 Tier-1",
            insight: "Failed 7/10 automated test cases on Breadth-First & Depth-First Search algorithms.",
            explainability: "Raising coding score from 45 to 65 unlocks 18 additional tier-1 campus drives.",
            metrics: [
              { label: "Arrays Mastery", value: "92 / 100", benchmark: "80+", status: "safe" },
              { label: "Graph Traversal", value: "24 / 100", benchmark: "70+", status: "risk" },
              { label: "Dynamic Prog.", value: "35 / 100", benchmark: "65+", status: "risk" },
            ],
          },
        },
        {
          id: "rec-academic",
          category: "Academic",
          title: "Review DBMS Normalization",
          detectedInsight: `Mid-term assessment in DBMS is ${dbmsScore}% (Target: 75%). Weak in 3NF.`,
          whyItMatters: "Decomposition concepts account for 20% of end-semester exam weightage.",
          recommendedAction: "Access curated NPTEL revision modules and schedule faculty doubt clearing.",
          priority: "Medium",
          impact: "+5 pts",
          evidence: {
            title: "DBMS Mid-Term Paper Analysis",
            category: "Academic",
            source: "Controller of Examinations (CoE)",
            detectedDate: "Oct 05, 2026",
            currentValue: `${dbmsScore}%`,
            threshold: "75% Target",
            insight: "Normalization and indexing caused 16-mark drop.",
            explainability: "Remediating indexing concepts ensures readiness for end-semester university exams.",
            metrics: [
              { label: "SQL Queries Score", value: "85%", benchmark: "75%", status: "safe" },
              { label: "Normalization Score", value: "42%", benchmark: "70%", status: "risk" },
            ],
          },
        },
        {
          id: "rec-assignments",
          category: "LMS",
          title: "Complete 2 Pending Lab Reports",
          detectedInsight: `${pendingAssignments} continuous assignments due within 72 hours on Moodle.`,
          whyItMatters: "Unsubmitted lab assignments carry 15 internal marks and reduce semester SGPA.",
          recommendedAction: "Schedule a 45-minute study block tonight to submit OS Lab 3 Page Replacement.",
          priority: "High",
          impact: "+4 pts",
          evidence: {
            title: "Moodle LMS Submission Telemetry",
            category: "LMS",
            source: "Institutional Learning Management System",
            detectedDate: "Yesterday",
            currentValue: "2 Pending",
            threshold: "0 Pending",
            insight: "OS Lab 3 and DWDM Assignment 2 due within 72 hours.",
            explainability: "Submitting lab assignments on schedule guarantees full 15/15 continuous internal evaluation points.",
            metrics: [
              { label: "OS Lab 3", value: "Draft (60%)", benchmark: "Submitted", status: "risk" },
              { label: "DWDM Report", value: "Not Started", benchmark: "Submitted", status: "risk" },
            ],
          },
        },
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
