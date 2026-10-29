export type UserRole = 'STUDENT' | 'COMPANY' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
export type ApplicationStatus = 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'REJECTED' | 'WITHDRAWN';
export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type InternshipStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'CANCELLED';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  accountStatus: AccountStatus;
  createdAt?: string;
}

export interface StudentProfile {
  id: number;
  user?: User;
  userId?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  registrationNumber?: string;
  collegeName?: string;
  universityName?: string;
  department?: string;
  degree?: string;
  specialization?: string;
  currentSemester?: number;
  admissionYear?: number;
  graduationYear?: number;
  cgpa?: number;
  backlogsCount?: number;
  professionalSummary?: string;
  city?: string;
  state?: string;
  country?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  createdAt?: string;
}

export interface Company {
  id: number;
  userId?: number;
  companyName: string;
  registrationNumber?: string;
  industry?: string;
  companySize?: string;
  description?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  headquartersAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  logoPath?: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  activePostings?: number;
  totalApplicants?: number;
  createdAt?: string;
}

export interface SkillItem {
  skillName: string;
  isRequired?: boolean;
}

export interface Internship {
  id: number;
  companyId: number;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  responsibilities?: string;
  eligibilityCriteria?: string;
  category: string;
  internshipType: string;
  workMode: WorkMode;
  location?: string;
  durationMonths?: number;
  stipendMin: number;
  stipendMax: number;
  stipendAmount?: number;
  isPaid: boolean;
  openings: number;
  vacancies?: number;
  applicationDeadline?: string;
  deadline?: string;
  minimumCgpa?: number;
  minimumSemester?: number;
  status: InternshipStatus;
  skills?: (string | SkillItem)[];
  viewsCount?: number;
  hasApplied?: boolean;
  isSaved?: boolean;
  createdAt: string;
}

export interface ResumeFile {
  id: number;
  originalFilename: string;
  fileSize: number;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface Application {
  id: number;
  internshipId: number;
  internshipTitle: string;
  companyId: number;
  companyName: string;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  studentCollege?: string;
  studentDegree?: string;
  studentCgpa?: number;
  resumeId?: number;
  resumeFilename?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt?: string;
  withdrawnAt?: string;
}

export interface ApplicationStatusHistory {
  id: number;
  previousStatus?: ApplicationStatus;
  newStatus: ApplicationStatus;
  changedByName: string;
  changedByRole: string;
  remarks?: string;
  changedAt: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  notificationType: string;
  relatedEntityId?: number;
  relatedEntityType?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface StudentDashboardData {
  welcomeMessage: string;
  totalApplications: number;
  pendingApplications: number;
  shortlistedApplications: number;
  selectedApplications: number;
  rejectedApplications: number;
  profileCompletionPercent: number;
  applicationsByStatus: Record<string, number>;
  recentApplications: Application[];
  recommendedInternships: Internship[];
  unreadNotifications: number;
}

export interface CompanyDashboardData {
  totalActiveInternships: number;
  totalApplicants: number;
  pendingReviewCount: number;
  shortlistedCount: number;
  selectedCount: number;
  applicantsByStatus: Record<string, number>;
  recentApplicants: Application[];
  myInternships: Internship[];
  unreadNotifications: number;
}

export interface AdminDashboardData {
  totalStudents: number;
  totalCompanies: number;
  totalInternships: number;
  totalApplications: number;
  pendingCompanyVerifications: number;
  activeInternships: number;
  internshipsByCategory: Record<string, number>;
  unreadNotifications: number;
}

