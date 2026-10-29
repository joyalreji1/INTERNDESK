import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { StudentDashboardData } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import {
  User,
  Briefcase,
  FileCheck,
  Clock,
  CheckCircle2,
  ChevronRight,
  Edit,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getStudentDashboard();
        setData(res);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-xs text-[#666666]">Loading student portal dashboard...</div>
      </div>
    );
  }

  const recentApps = data?.recentApplications || [];
  const recommended = data?.recommendedInternships || [];

  return (
    <div className="space-y-4">
      {/* 1. Page Header Strip */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold tracking-wide uppercase">
            Student Dashboard
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Welcome to the centralized internship application management workspace
          </p>
        </div>
        <div className="text-xs text-[#FFF0CE] font-mono">
          Academic Year: 2026-2027
        </div>
      </div>

      {/* 2. Welcome & Academic Profile Information Panel */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#356F9D]" />
            <span>Student Academic Profile Summary</span>
          </div>
          <Link
            to="/student/profile"
            className="text-xs font-semibold text-[#4779B8] hover:text-[#356F9D] hover:underline flex items-center gap-1"
          >
            <Edit className="w-3 h-3" />
            <span>View / Edit Profile</span>
          </Link>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="block text-[#666666] font-medium">Student Name:</span>
            <span className="font-bold text-[#333333] text-sm">
              {user?.fullName || 'Student Candidate'}
            </span>
          </div>

          <div>
            <span className="block text-[#666666] font-medium">College / Institution:</span>
            <span className="font-semibold text-[#333333]">
              College of Engineering
            </span>
          </div>

          <div>
            <span className="block text-[#666666] font-medium">Degree & Department:</span>
            <span className="font-semibold text-[#333333]">
              B.Tech - Computer Science & Engineering
            </span>
          </div>

          <div>
            <span className="block text-[#666666] font-medium">Profile Completion:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex-1 bg-[#EAF2FC] border border-[#D4DCE6] h-3 rounded-sm overflow-hidden">
                <div
                  className="bg-[#4779B8] h-full"
                  style={{ width: `${data?.profileCompletionPercent || 85}%` }}
                />
              </div>
              <span className="font-bold text-[#356F9D] text-xs">
                {data?.profileCompletionPercent || 85}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Internship Overview (4 rectangular metric boxes) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#666666] uppercase">Active Opportunities</div>
          <div className="text-xl font-bold text-[#356F9D] mt-1">10+</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Available on Portal</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#666666] uppercase">Total Applications</div>
          <div className="text-xl font-bold text-[#333333] mt-1">{data?.totalApplications || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Submitted by Student</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#855A00] uppercase">Under Review</div>
          <div className="text-xl font-bold text-[#855A00] mt-1">{data?.pendingApplications || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Awaiting Screening</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#285C2A] uppercase">Shortlisted / Selected</div>
          <div className="text-xl font-bold text-[#285C2A] mt-1">{data?.shortlistedApplications || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Cleared Stages</div>
        </div>
      </div>

      {/* 4. Recent Applications Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#356F9D] text-white px-4 py-2 text-xs font-bold uppercase flex items-center justify-between border-b border-[#28587E]">
          <div className="flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Recent Applications</span>
          </div>
          <Link
            to="/student/applications"
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
                <th>Internship Name</th>
                <th>Company Name</th>
                <th>Application Date</th>
                <th>Current Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-[#666666]">
                    You have not submitted any internship applications yet.{' '}
                    <Link to="/student/internships" className="text-[#4779B8] font-bold hover:underline">
                      Browse available openings
                    </Link>
                  </td>
                </tr>
              ) : (
                recentApps.map((app) => (
                  <tr key={app.id}>
                    <td className="font-mono text-xs text-[#666666]">APP-{String(app.id).padStart(4, '0')}</td>
                    <td className="font-semibold text-[#356F9D]">
                      <Link to={`/student/applications/${app.id}`} className="hover:underline">
                        {app.internshipTitle}
                      </Link>
                    </td>
                    <td className="font-medium">{app.companyName}</td>
                    <td className="text-xs text-[#555555]">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td>
                      <Link
                        to={`/student/applications/${app.id}`}
                        className="px-2 py-0.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-medium rounded-sm border border-[#356F9D] inline-block"
                      >
                        Track Status
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Available Internships Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#356F9D] text-white px-4 py-2 text-xs font-bold uppercase flex items-center justify-between border-b border-[#28587E]">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Available Internships for Application</span>
          </div>
          <Link
            to="/student/internships"
            className="text-xs text-[#EAF2FC] hover:text-white hover:underline flex items-center gap-0.5 font-normal"
          >
            <span>Explore All Internships</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Notice ID</th>
                <th>Internship Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Work Mode</th>
                <th>Stipend</th>
                <th>Deadline</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recommended.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-[#666666]">
                    No active internships available currently.
                  </td>
                </tr>
              ) : (
                recommended.map((item) => (
                  <tr key={item.id}>
                    <td className="font-mono text-xs text-[#666666]">INT-{String(item.id).padStart(4, '0')}</td>
                    <td className="font-semibold text-[#356F9D]">
                      <Link to={`/internships/${item.id}`} className="hover:underline">
                        {item.title}
                      </Link>
                    </td>
                    <td className="font-medium">{item.companyName}</td>
                    <td>{item.location}</td>
                    <td>
                      <StatusBadge status={item.workMode} size="sm" />
                    </td>
                    <td className="font-semibold text-[#285C2A]">
                      {item.stipendMin ? `₹${item.stipendMin.toLocaleString()}/mo` : 'Unpaid'}
                    </td>
                    <td className="text-xs text-[#555555]">
                      {item.applicationDeadline ? new Date(item.applicationDeadline).toLocaleDateString() : 'Rolling'}
                    </td>
                    <td>
                      <Link
                        to={`/internships/${item.id}`}
                        className="px-2 py-0.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-medium rounded-sm border border-[#356F9D] inline-block whitespace-nowrap"
                      >
                        View & Apply
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
