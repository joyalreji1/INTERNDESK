import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import {
  FileSpreadsheet,
  Download,
  Building2,
  Users,
  Briefcase,
  FileCheck,
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await api.getAdminReportsSummary();
        setReport(data);
      } catch (err) {
        console.error('Failed to load reports summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const handleExport = async (type: 'students' | 'companies' | 'internships' | 'applications') => {
    setDownloading(type);
    try {
      await api.exportCsv(type);
    } catch (err: any) {
      alert(err.message || 'Failed to export CSV report');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-xs text-[#666666]">Generating institutional reporting summaries...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Institutional Reports & Official CSV Data Exports
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Generate and export relational database archives for college academic audit and accreditation
          </p>
        </div>
      </div>

      {/* Summary KPI Boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#666666] uppercase">Enrolled Students</div>
          <div className="text-xl font-bold text-[#356F9D] mt-1">{report?.totalStudents || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Verified Profiles</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#666666] uppercase">Registered Companies</div>
          <div className="text-xl font-bold text-[#333333] mt-1">{report?.totalCompanies || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Corporate Partners</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#285C2A] uppercase">Active Internships</div>
          <div className="text-xl font-bold text-[#285C2A] mt-1">{report?.totalInternships || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Published Openings</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#855A00] uppercase">Total Applications</div>
          <div className="text-xl font-bold text-[#855A00] mt-1">{report?.totalApplications || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Workflow Submissions</div>
        </div>
      </div>

      {/* 4 CSV Export Action Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Report 1: Students */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#356F9D] uppercase">
              <Users className="w-4 h-4 text-[#4779B8]" />
              <span>Student Registry Export</span>
            </div>
            <p className="text-xs text-[#555555] leading-relaxed">
              Export complete register of students, university roll numbers, degrees, departments, graduation years, and CGPA scores.
            </p>
          </div>
          <div>
            <button
              onClick={() => handleExport('students')}
              disabled={downloading === 'students'}
              className="w-full py-2 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading === 'students' ? 'Exporting...' : 'Export Students CSV'}</span>
            </button>
          </div>
        </div>

        {/* Report 2: Companies */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#356F9D] uppercase">
              <Building2 className="w-4 h-4 text-[#4779B8]" />
              <span>Corporate Employer Directory Export</span>
            </div>
            <p className="text-xs text-[#555555] leading-relaxed">
              Export list of all registered corporate employers, contact coordinators, industry domains, headquarters, and verification standings.
            </p>
          </div>
          <div>
            <button
              onClick={() => handleExport('companies')}
              disabled={downloading === 'companies'}
              className="w-full py-2 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading === 'companies' ? 'Exporting...' : 'Export Companies CSV'}</span>
            </button>
          </div>
        </div>

        {/* Report 3: Internships */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#356F9D] uppercase">
              <Briefcase className="w-4 h-4 text-[#4779B8]" />
              <span>Internship Postings Ledger Export</span>
            </div>
            <p className="text-xs text-[#555555] leading-relaxed">
              Export comprehensive listings archive: job titles, stipends, duration, required skills, vacancies, and closing deadlines.
            </p>
          </div>
          <div>
            <button
              onClick={() => handleExport('internships')}
              disabled={downloading === 'internships'}
              className="w-full py-2 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading === 'internships' ? 'Exporting...' : 'Export Internships CSV'}</span>
            </button>
          </div>
        </div>

        {/* Report 4: Applications */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#356F9D] uppercase">
              <FileCheck className="w-4 h-4 text-[#4779B8]" />
              <span>Campus Applications Master Ledger</span>
            </div>
            <p className="text-xs text-[#555555] leading-relaxed">
              Export complete application tracking dataset: candidate mapping, applied roles, current workflow status, and decision timestamps.
            </p>
          </div>
          <div>
            <button
              onClick={() => handleExport('applications')}
              disabled={downloading === 'applications'}
              className="w-full py-2 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading === 'applications' ? 'Exporting...' : 'Export Applications CSV'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
