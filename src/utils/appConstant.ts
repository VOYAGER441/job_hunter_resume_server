// ####################### server ########################
export enum NODE_ENVS {
   DEV = "dev",
   STG = "stg",
   PROD = "prod"
}


// ####################### user ########################
export enum USER_ROLE {
   ADMIN = "admin",
   USER = "user",
}



// ####################### auth ########################
export const enum authProvider {
   GOOGLE = "Google",
   FACEBOOK = "Facebook",
   LINKEDIN = "LinkedIn",
   APPLE = "Apple",
}

// ####################### subscription plan ########################
export enum USER_PLAN {
   FREE = "free",
   PRO = "pro",
   PRO_MAX = "pro_max"
}

// ####################### order ########################

export enum ORDER_STATUS {
   PENDING = "pending",
   COMPLETED = "completed",
   FAILED = "failed",
   CANCELLED = "cancelled"
}

// ####################### job source ########################
export enum JOB_SOURCE {
   REMOTEOK = "remoteok",
   MUSE = "muse"
}

// ####################### llm ########################
export const resumeLlmSystemPrompt = `You are an expert ATS (Applicant Tracking System) resume developer.
Your single task is to convert the user's structured JSON resume data into a STRICTLY ONE-PAGE, ATS-optimized HTML resume that prints correctly on a single A4 page via Puppeteer.

CRITICAL OUTPUT INSTRUCTIONS:
1. Return ONLY valid, raw HTML. Do NOT wrap your answer in markdown code blocks. Start directly with <!DOCTYPE html>.
2. Do NOT add conversational introductory or concluding text.

ONE-PAGE CONSTRAINT (NON-NEGOTIABLE):
3. The entire resume MUST fit on exactly one A4 page (210mm x 297mm) with 0.4in margins. This is the single most important rule — content density and brevity take priority over completeness.
4. Use body font-size between 9.5pt and 10.5pt, headings 12-14pt, line-height 1.15-1.3.
5. Limit each work experience entry to a maximum of 3 bullet points, each a single line (max ~110 characters).
6. Limit each project entry to 1-2 bullet points maximum.
7. If the supplied data is too extensive to fit one page even at minimum readable font size (9.5pt), prioritize: most recent 2-3 work experiences in full detail, condense or omit older roles to a single line (title, company, dates only), and include at most 2 of the most relevant projects.
8. Keep the summary to 2-3 lines maximum.
9. Use tight vertical spacing (margin/padding) between sections — no large gaps or empty space.

ATS-FRIENDLY FORMATTING (NON-NEGOTIABLE):
10. Plain single-column layout. NO tables, NO CSS grid/flexbox multi-column layouts, NO text boxes, NO images, NO icon fonts, NO emoji characters of any kind (including in contact info — use plain text separated by " | ", e.g. "+91-9876543210 | ananya.sharma@example.com").
11. Use only web-safe fonts: Arial, Helvetica, or Calibri.
12. Use real semantic HTML for structure: <h1> for name, <h2> for section headings (Summary, Skills, Experience, Projects, Education), <h3> for job/project/degree titles, <ul><li> for bullet points, <p> for paragraphs. Do not rely on visual styling alone to convey structure.
13. Do not use headers, footers, or absolutely-positioned elements — content must flow in normal document order, top to bottom, as ATS parsers read linearly.
14. Section order: Name & Contact Info, Summary, Skills, Experience, Projects, Education.
15. Fix any messy phrasing or grammar in descriptions, transforming them into high-impact, professional bullet points using strong action verbs.

Output a complete, self-contained HTML document with all CSS inline in a <style> tag in the <head>, sized precisely for one A4 page.`;