export type UserRole = 'STUDENT' | 'COMPANY' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
export type ApplicationStatus =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'SELECTED'
  | 'PAYMENT_PENDING'
  | 'ENROLLED'
  | 'REJECTED'
  | 'WITHDRAWN';
export type PaymentStatus =
  | 'NOT_APPLICABLE'
  | 'INITIATED'
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'CANCELLED';
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

export interface InternshipEligibility {
  id?: number;
  minimumCgpa?: number;
  minAcademicPercentage?: number;
  eligibleDegrees?: string;
  eligibleDepartments?: string;
  eligibleSemesters?: string;
  requiredSkills?: string;
  requiredCertifications?: string;
  resumePdfRequired?: boolean;
  academicDocumentsRequired?: boolean;
  minQualifications?: string;
  additionalConditions?: string;
}

export interface CriterionCheck {
  criterionName: string;
  requiredValue: string;
  studentValue: string;
  satisfied: boolean;
  mandatory: boolean;
  remarks: string;
}

export interface EligibilityEvaluationResult {
  eligible: boolean;
  status: 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'PROFILE_INCOMPLETE' | 'PENDING_VERIFICATION';
  summary: string;
  unmetCriteria: string[];
  criteriaChecks: CriterionCheck[];
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
  internshipType: 'FREE' | 'PAID' | string;
  internshipFee?: number;
  currency?: string;
  refundPolicy?: string;
  paymentDeadline?: string;
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
  eligibility?: InternshipEligibility;
  eligibilityEvaluation?: EligibilityEvaluationResult;
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
  studentDepartment?: string;
  studentRegistrationNumber?: string;
  studentCurrentSemester?: number;
  studentCgpa?: number;
  studentSkills?: string;
  resumeId?: number;
  resumeFilename?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  eligibilityStatus?: string;
  selectedAt?: string;
  paymentStatus?: PaymentStatus;
  enrolledAt?: string;
  rejectionReason?: string;
  internshipFee?: number;
  currency?: string;
  internshipType?: string;
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

export interface PaymentResponse {
  id: number;
  applicationId: number;
  internshipId: number;
  internshipTitle: string;
  companyId: number;
  companyName: string;
  studentId: number;
  studentName: string;
  studentEmail: string;
  transactionReference: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  paidAt?: string;
  refundStatus?: string;
  refundAmount?: number;
  createdAt: string;
}

export interface PaymentReceiptResponse {
  receiptNumber: string;
  transactionReference: string;
  paymentDate: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  companyName: string;
  internshipTitle: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  applicationId: number;
  internshipId: number;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  institutionName: string;
  verifiedStamp: string;
}

export interface CompanyPaymentMetrics {
  companyName: string;
  totalCollectedFees: number;
  totalEnrolledCandidates: number;
  pendingPaymentCount: number;
  refundCount: number;
}

export interface AdminPaymentSummary {
  totalRevenue: number;
  totalTransactions: number;
  successfulTransactions: number;
  pendingTransactions: number;
  refundedCount: number;
  refundedVolume: number;
}

export interface RefundResponse {
  id: number;
  paymentId: number;
  applicationId: number;
  transactionReference: string;
  studentName: string;
  companyName: string;
  internshipTitle: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  adminNotes?: string;
  requestedAt: string;
  processedAt?: string;
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
  paymentPendingCount?: number;
  enrolledCount?: number;
  freeInternshipCount?: number;
  paidInternshipCount?: number;
  totalCollectedFees?: number;
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
  freeInternshipCount?: number;
  paidInternshipCount?: number;
  paymentPendingCount?: number;
  enrolledCount?: number;
  totalPlatformRevenue?: number;
  internshipsByCategory: Record<string, number>;
  unreadNotifications: number;
}
