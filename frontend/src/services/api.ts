import { ApiResponse } from '@/types';

const API_BASE = '/api';

class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem('intern_desk_token');
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem('intern_desk_token', token);
  } else {
    localStorage.removeItem('intern_desk_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  let data: any;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else if (contentType.includes('text/csv') || contentType.includes('application/pdf') || contentType.includes('application/octet-stream')) {
    data = await response.blob();
    return data as unknown as T;
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMsg = data?.message || data?.error || `HTTP error ${response.status}`;
    if (data?.errors && typeof data.errors === 'object') {
      const errorList = Object.entries(data.errors)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      if (errorList) {
        errorMsg = `${errorMsg} (${errorList})`;
      }
    }
    throw new ApiError(response.status, errorMsg, data);
  }

  return (data as ApiResponse<T>).data !== undefined ? (data as ApiResponse<T>).data : (data as T);
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<any>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  registerStudent: (payload: any) =>
    request<any>('/auth/register/student', { method: 'POST', body: JSON.stringify(payload) }),

  registerCompany: (payload: any) =>
    request<any>('/auth/register/company', { method: 'POST', body: JSON.stringify(payload) }),

  getMe: () =>
    request<any>('/auth/me'),

  // Public Internships
  getInternships: (params?: Record<string, string | number | boolean | undefined>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '' && v !== null) {
          query.append(k, String(v));
        }
      });
    }
    const qStr = query.toString();
    return request<any>(`/internships${qStr ? `?${qStr}` : ''}`);
  },

  getInternship: (id: number) =>
    request<any>(`/internships/${id}`),

  // Public Companies
  getCompanies: (params?: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') query.append(k, String(v));
      });
    }
    const qStr = query.toString();
    return request<any>(`/companies${qStr ? `?${qStr}` : ''}`);
  },

  getCompany: (id: number) =>
    request<any>(`/companies/${id}`),

  // Student Profile & Resumes
  getStudentProfile: () =>
    request<any>('/students/me'),

  updateStudentProfile: (payload: any) =>
    request<any>('/students/me', { method: 'PUT', body: JSON.stringify(payload) }),

  getResumes: () =>
    request<any[]>('/students/me/resumes'),

  uploadResume: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return request<any>('/students/me/resumes', { method: 'POST', body: fd });
  },

  setPrimaryResume: (id: number) =>
    request<void>(`/students/me/resumes/${id}/primary`, { method: 'PATCH' }),

  deleteResume: (id: number) =>
    request<void>(`/students/me/resumes/${id}`, { method: 'DELETE' }),

  // Applications
  applyForInternship: (internshipId: number, payload: { coverLetter?: string; resumeId?: number }) =>
    request<any>(`/internships/${internshipId}/applications`, { method: 'POST', body: JSON.stringify(payload) }),

  getMyApplications: (page = 0, size = 10) =>
    request<any>(`/applications/me?page=${page}&size=${size}`),

  getCompanyApplications: (internshipId?: number, page = 0, size = 10) => {
    const q = new URLSearchParams({ page: String(page), size: String(size) });
    if (internshipId) q.append('internshipId', String(internshipId));
    return request<any>(`/companies/me/applications?${q.toString()}`);
  },

  getApplication: (id: number) =>
    request<any>(`/applications/${id}`),

  getApplicationHistory: (id: number) =>
    request<any[]>(`/applications/${id}/history`),

  updateApplicationStatus: (id: number, payload: { newStatus: string; remarks?: string }) =>
    request<any>(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify(payload) }),

  scheduleInterview: (applicationId: number, payload: any) =>
    request<any>(`/applications/${applicationId}/interviews`, { method: 'POST', body: JSON.stringify(payload) }),

  getInterviews: (applicationId: number) =>
    request<any[]>(`/applications/${applicationId}/interviews`),

  // Company Postings
  getCompanyProfile: () =>
    request<any>('/companies/me'),

  updateCompanyProfile: (payload: any) =>
    request<any>('/companies/me', { method: 'PUT', body: JSON.stringify(payload) }),

  getMyCompanyInternships: (page = 0, size = 10) =>
    request<any>(`/companies/me/internships?page=${page}&size=${size}`),

  createInternship: (payload: any) =>
    request<any>('/internships', { method: 'POST', body: JSON.stringify(payload) }),

  updateInternship: (id: number, payload: any) =>
    request<any>(`/internships/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  deleteInternship: (id: number) =>
    request<void>(`/internships/${id}`, { method: 'DELETE' }),

  // Dashboards
  getStudentDashboard: () =>
    request<any>('/dashboard/student'),

  getCompanyDashboard: () =>
    request<any>('/dashboard/company'),

  getAdminDashboard: () =>
    request<any>('/dashboard/admin'),

  // Notifications
  getNotifications: (page = 0, size = 20) =>
    request<any>(`/notifications?page=${page}&size=${size}`),

  getUnreadNotificationCount: () =>
    request<{ unreadCount: number }>('/notifications/unread-count'),

  markNotificationRead: (id: number) =>
    request<void>(`/notifications/${id}/read`, { method: 'PATCH' }),

  markAllNotificationsRead: () =>
    request<void>('/notifications/read-all', { method: 'PATCH' }),

  // Admin
  getAdminStudents: (query?: string, page = 0, size = 15) => {
    const q = new URLSearchParams({ page: String(page), size: String(size) });
    if (query) q.append('query', query);
    return request<any>(`/admin/students?${q.toString()}`);
  },

  updateStudentUserStatus: (userId: number, status: string, remarks?: string) =>
    request<void>(`/admin/students/${userId}/status`, { method: 'PATCH', body: JSON.stringify({ status, remarks }) }),

  getAdminCompanies: (query?: string, status?: string, page = 0, size = 15) => {
    const q = new URLSearchParams({ page: String(page), size: String(size) });
    if (query) q.append('query', query);
    if (status) q.append('status', status);
    return request<any>(`/admin/companies?${q.toString()}`);
  },

  verifyCompany: (companyId: number, status: string, remarks?: string) =>
    request<void>(`/admin/companies/${companyId}/verify`, { method: 'PATCH', body: JSON.stringify({ status, remarks }) }),

  getAdminInternships: (query?: string, status?: string, page = 0, size = 15) => {
    const q = new URLSearchParams({ page: String(page), size: String(size) });
    if (query) q.append('query', query);
    if (status) q.append('status', status);
    return request<any>(`/admin/internships?${q.toString()}`);
  },

  updateInternshipStatusAdmin: (id: number, status: string) =>
    request<void>(`/admin/internships/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  deleteInternshipAdmin: (id: number) =>
    request<void>(`/admin/internships/${id}`, { method: 'DELETE' }),

  getAdminApplications: (status?: string, page = 0, size = 15) => {
    const q = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) q.append('status', status);
    return request<any>(`/admin/applications?${q.toString()}`);
  },

  getAdminAuditLogs: (page = 0, size = 20) =>
    request<any>(`/admin/audit-logs?page=${page}&size=${size}`),

  getAdminReportsSummary: () =>
    request<any>('/admin/reports/summary'),

  exportCsv: async (type: 'students' | 'companies' | 'internships' | 'applications') => {
    const blob = await request<Blob>(`/admin/reports/export/${type}`);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intern_desk_${type}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  downloadApplicationResume: async (applicationId: number, filename = 'candidate_resume.pdf') => {
    const blob = await request<Blob>(`/applications/${applicationId}/resume`);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  downloadResume: async (resumeId: number, filename = 'resume.pdf') => {
    const blob = await request<Blob>(`/students/me/resumes/${resumeId}/download`);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};

