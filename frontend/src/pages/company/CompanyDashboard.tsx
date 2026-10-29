import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { CompanyDashboardData } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import {
  Briefcase,
  Users,
  PlusCircle,
  Building2,
  ChevronRight,
  Edit,
  Eye,
} from 'lucide-react';

export const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<CompanyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getCompanyDashboard();
        setData(res);
      } catch (err) {
        console.error('Failed to load company dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-xs text-[#666666]">Loading company recruiter dashboard...</div>
      </div>
    );
  }

  const recentApplicants = data?.recentApplicants || [];
  const activePostings = data?.myInternships || [];

  return (
    <div className="space-y-4">
      {/* 1. Header Strip */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Company Recruitment Dashboard
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Overview of company postings, active candidates, and recruitment funnel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/company/internships/create"
            className="px-3 py-1 bg-white hover:bg-[#EAF2FC] text-[#356F9D] text-xs font-bold rounded-sm border border-[#D4DCE6] flex items-center gap-1 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post New Internship</span>
          </Link>
        </div>
      </div>

      {/* 2. Company Profile Summary Panel */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Organization Profile Summary</span>
          </div>
          <Link
            to="/company/profile"
            className="text-xs font-semibold text-[#4779B8] hover:underline"
          >
            Edit Profile
          </Link>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="block text-[#666666] font-medium">Organization:</span>
            <span className="font-bold text-[#333333] text-sm">{user?.fullName || 'Company Employer'}</span>
          </div>

          <div>
            <span className="block text-[#666666] font-medium">Verification Status:</span>
            <div className="mt-0.5">
              <StatusBadge status="VERIFIED" size="sm" />
            </div>
          </div>

          <div>
            <span className="block text-[#666666] font-medium">Recruitment Scope:</span>
            <span className="font-semibold text-[#333333]">Campus Internships & Placements</span>
          </div>

          <div>
            <span className="block text-[#666666] font-medium">Portal Access:</span>
            <span className="font-semibold text-[#285C2A]">Authorized Recruiter</span>
          </div>
        </div>
      </div>

      {/* 3. 4 Rectangular KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#666666] uppercase">Total Postings</div>
          <div className="text-xl font-bold text-[#356F9D] mt-1">{data?.myInternships?.length || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Published Roles</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#285C2A] uppercase">Active Internships</div>
          <div className="text-xl font-bold text-[#285C2A] mt-1">{data?.totalActiveInternships || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Accepting Applications</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#333333] uppercase">Total Applicants</div>
          <div className="text-xl font-bold text-[#333333] mt-1">{data?.totalApplicants || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Candidate Submissions</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#855A00] uppercase">Awaiting Review</div>
          <div className="text-xl font-bold text-[#855A00] mt-1">{data?.pendingReviewCount || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Pending Initial Screening</div>
        </div>
      </div>

      {/* 4. Table of Internship Postings */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#356F9D] text-white px-4 py-2 text-xs font-bold uppercase flex items-center justify-between border-b border-[#28587E]">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Active Internship Listings</span>
          </div>
          <Link
            to="/company/internships"
            className="text-xs text-[#EAF2FC] hover:text-white hover:underline flex items-center gap-0.5 font-normal"
          >
            <span>Manage All Postings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Internship Title</th>
                <th>Location</th>
                <th>Work Mode</th>
                <th>Stipend</th>
                <th>Vacancies</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activePostings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-[#666666]">
                    No internship postings created yet.{' '}
                    <Link to="/company/internships/create" className="text-[#4779B8] font-bold hover:underline">
                      Create your first listing
                    </Link>
                  </td>
                </tr>
              ) : (
                activePostings.map((item) => (
                  <tr key={item.id}>
                    <td className="font-mono text-xs text-[#666666]">INT-{String(item.id).padStart(4, '0')}</td>
                    <td className="font-semibold text-[#356F9D]">
                      <Link to={`/internships/${item.id}`} className="hover:underline">
                        {item.title}
                      </Link>
                    </td>
                    <td>{item.location}</td>
                    <td>
                      <StatusBadge status={item.workMode} size="sm" />
                    </td>
                    <td className="font-semibold text-[#285C2A]">
                      {item.stipendMin ? `₹${item.stipendMin.toLocaleString()}/mo` : 'Unpaid'}
                    </td>
                    <td>{item.openings || 1}</td>
                    <td>
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="space-x-1.5 whitespace-nowrap">
                      <Link
                        to={`/company/internships/${item.id}/edit`}
                        className="px-2 py-0.5 bg-white hover:bg-[#EAF2FC] text-[#4779B8] text-xs font-semibold rounded-sm border border-[#D4DCE6] inline-block"
                      >
                        Edit
                      </Link>
                      <Link
                        to="/company/applicants"
                        className="px-2 py-0.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-semibold rounded-sm border border-[#356F9D] inline-block"
                      >
                        Applicants
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Table of Recent Applicants */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#356F9D] text-white px-4 py-2 text-xs font-bold uppercase flex items-center justify-between border-b border-[#28587E]">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Recent Student Applicants</span>
          </div>
          <Link
            to="/company/applicants"
            className="text-xs text-[#EAF2FC] hover:text-white hover:underline flex items-center gap-0.5 font-normal"
          >
            <span>View All Applicants</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Candidate Name</th>
                <th>Applied Position</th>
                <th>College & Degree</th>
                <th>Applied Date</th>
                <th>Current Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-[#666666]">
                    No applicant submissions recorded yet.
                  </td>
                </tr>
              ) : (
                recentApplicants.map((app) => (
                  <tr key={app.id}>
                    <td className="font-mono text-xs text-[#666666]">APP-{String(app.id).padStart(4, '0')}</td>
                    <td className="font-bold text-[#356F9D]">
                      <Link to={`/company/applicants/${app.id}`} className="hover:underline">
                        {app.studentName}
                      </Link>
                    </td>
                    <td>{app.internshipTitle}</td>
                    <td>{app.studentCollege || 'Engineering Student'} ({app.studentDegree || 'B.Tech'})</td>
                    <td className="text-xs text-[#555555]">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td>
                      <Link
                        to={`/company/applicants/${app.id}`}
                        className="px-2.5 py-0.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-semibold rounded-sm border border-[#356F9D] inline-block"
                      >
                        Review Dossier
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
