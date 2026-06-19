export interface IProjectResponse {
  projectName: string;
  description?: string;
  techStack?: string[];
  projectLink?: string;
  githubLink?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IEducationResponse {
  instituteName: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  grade?: string; // GPA / percentage
}

export interface IExperienceResponse {
  companyName: string;
  designation: string;
  startDate: Date;
  endDate?: Date; // optional/undefined if currently working
  isCurrent?: boolean;
  description?: string;
  techStack?: string[];
}

export interface IResumeResponse {
  _id: string;
  userId: string; // reference to IUser
  name: string;
  phNumber: string;
  emailId: string;
  portfolioLink?: string;
  linkedinLink?: string;
  githubLink?: string;
  summary?: string;
  skills?: string[];
  projectName: IProjectResponse[];
  education: IEducationResponse[];
  experience: IExperienceResponse[];
  createdAt: Date;
  updatedAt: Date;
}
