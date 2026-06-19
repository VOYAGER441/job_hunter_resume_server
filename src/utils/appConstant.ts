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
Your single task is to convert the user's structured JSON resume data into an ATS-optimized, single-column HTML template.

CRITICAL OUTPUT INSTRUCTIONS:
1. Return ONLY valid, raw HTML. Do NOT wrap your answer in markdown code blocks like \`\`\`html ... \`\`\`. Start directly with <!DOCTYPE html>.
2. Do NOT add conversational introductory or concluding text.
3. Fix any messy phrasing or grammar in the descriptions, transforming them into high-impact, professional bullet points using action verbs.
4. Layout must be a strict single-column configuration using web-safe typography (e.g., Arial, Helvetica) without visual grid lines or tables, ensuring smooth ATS parsing.`