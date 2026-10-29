import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { AdminDashboardData } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import {
  ShieldCheck,
  Users,
  Building2,
  Briefcase,
  FileCheck,
  AlertTriangle,
  ChevronRight,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [pendingCompanies, setPendingCompanies] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, compRes, appRes] = await Promise.all([
          api.getAdminDashboard(),
          api.getAdminCompanies(undefined, 'PENDING', 0, 5),
          api.getAdminApplications(undefined, 0, 5),
        ]);
        setData(dashRes);
        const list = compRes.content || compRes || [];
        setPendingCompanies(Array.isArray(list) ? list : []);
        const apps = appRes.content || appRes || [];
        setRecentApplications(Array.isArray(apps) ? apps : []);
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-xs text-[#666666]">Loading institutional administrator dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Institutional Administration & Governance
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            College-level monitoring, corporate verification desk, and compliance audit
          </p>
        </div>
        <div className="text-xs text-[#FFF0CE] font-mono">
          System Status: Operational
        </div>
      </div>

      {/* 2. Four Summary Count Boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#666666] uppercase">Registered Students</div>
          <div className="text-xl font-bold text-[#356F9D] mt-1">{data?.totalStudents || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Enrolled Candidates</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#666666] uppercase">Registered Companies</div>
          <div className="text-xl font-bold text-[#333333] mt-1">{data?.totalCompanies || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Corporate Employers</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#285C2A] uppercase">Active Internships</div>
          <div className="text-xl font-bold text-[#285C2A] mt-1">{data?.totalInternships || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Published Opportunities</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#855A00] uppercase">Total Applications</div>
          <div className="text-xl font-bold text-[#855A00] mt-1">{data?.totalApplications || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Recorded Across College</div>
        </div>
      </div>

      {/* 3. Pending Company Verifications Queue */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#356F9D] text-white px-4 py-2 text-xs font-bold uppercase flex items-center justify-between border-b border-[#28587E]">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Pending Employer Verifications</span>
          </div>
          <Link
            to="/admin/companies"
            className="text-xs text-[#EAF2FC] hover:text-white hover:underline flex items-center gap-0.5 font-normal"
          >
            <span>Open Verification Desk</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Reg. ID</th>
                <th>Company Name</th>
                <th>Industry Sector</th>
                <th>Location</th>
                <th>Current Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingCompanies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-[#285C2A] font-medium bg-[#FAFCFF]">
                    ✓ No pending company verification requests in the queue.
                  </td>
                </tr>
              ) : (
                pendingCompanies.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono text-xs text-[#666666]">CMP-{String(c.id).padStart(4, '0')}</td>
                    <td className="font-bold text-[#356F9D]">{c.companyName}</td>
                    <td>{c.industry}</td>
                    <td>{c.location}</td>
                    <td>
                      <StatusBadge status={c.verificationStatus} size="sm" />
                    </td>
                    <td>
                      <Link
                        to="/admin/companies"
                        className="px-2 py-0.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-semibold rounded-sm border border-[#356F9D] inline-block"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Platform-Wide Application Management Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#356F9D] text-white px-4 py-2 text-xs font-bold uppercase flex items-center justify-between border-b border-[#28587E]">
          <div className="flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Recent Platform Applications</span>
          </div>
          <Link
            to="/admin/applications"
            className="text-xs text-[#EAF2FC] hover:text-white hover:underline flex items-center gap-0.5 font-normal"
          >
            <span>View All Applications</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Student Candidate</th>
                <th>Position Title</th>
                <th>Hiring Company</th>
                <th>Applied Date</th>
                <th>Workflow Stage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-[#666666]">
                    No application activities recorded.
                  </td>
                </tr>
              ) : (
                recentApplications.map((app) => (
                  <tr key={app.id}>
                    <td className="font-mono text-xs text-[#666666]">APP-{String(app.id).padStart(4, '0')}</td>
                    <td className="font-bold text-[#333333]">{app.studentName}</td>
                    <td className="font-semibold text-[#356F9D]">{app.internshipTitle}</td>
                    <td>{app.companyName}</td>
                    <td className="text-xs text-[#555555]">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td>
                      <Link
                        to="/admin/applications"
                        className="px-2 py-0.5 bg-white hover:bg-[#EAF2FC] text-[#4779B8] text-xs font-semibold rounded-sm border border-[#D4DCE6] inline-block"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
