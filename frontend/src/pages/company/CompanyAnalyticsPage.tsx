import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { CompanyDashboardData } from '@/types';
import {
  BarChart3,
  Users,
  Briefcase,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const CompanyAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<CompanyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getCompanyDashboard();
        setData(res);
      } catch (err) {
        console.error('Failed to load company analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-xs text-[#666666]">Loading hiring analytics data...</div>
      </div>
    );
  }

  const pipelineData = data?.applicantsByStatus
    ? Object.entries(data.applicantsByStatus).map(([status, count]) => ({
        stage: status.replace(/_/g, ' '),
        candidates: count,
      }))
    : [];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Recruitment Funnel & Candidate Metrics
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Quantitative analysis of applicant screening, shortlisting, and selection ratios
          </p>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#666666] uppercase">Total Candidates</div>
          <div className="text-xl font-bold text-[#356F9D] mt-1">{data?.totalApplicants || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Application Volume</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#855A00] uppercase">Under Review</div>
          <div className="text-xl font-bold text-[#855A00] mt-1">{data?.pendingReviewCount || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Pending Action</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#285C2A] uppercase">Active Openings</div>
          <div className="text-xl font-bold text-[#285C2A] mt-1">{data?.totalActiveInternships || 0}</div>
          <div className="text-[11px] text-[#888888] mt-0.5">Published Roles</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-3.5 shadow-sm">
          <div className="text-[11px] font-bold text-[#333333] uppercase">Avg. per Listing</div>
          <div className="text-xl font-bold text-[#333333] mt-1">
            {data?.totalActiveInternships
              ? ((data?.totalApplicants || 0) / data.totalActiveInternships).toFixed(1)
              : '0'}
          </div>
          <div className="text-[11px] text-[#888888] mt-0.5">Candidates / Role</div>
        </div>
      </div>

      {/* Bar Chart & Breakdown Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm space-y-3">
          <div className="text-xs font-bold text-[#356F9D] uppercase border-b border-[#D4DCE6] pb-1">
            Recruitment Stage Distribution
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4DCE6" />
                <XAxis dataKey="stage" tick={{ fill: '#333333', fontSize: 11 }} />
                <YAxis tick={{ fill: '#333333', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#D4DCE6',
                    fontSize: 12,
                    color: '#333333',
                  }}
                />
                <Bar dataKey="candidates" fill="#4779B8" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabular Stage Breakdown */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
            Stage-wise Breakdown Table
          </div>
          <table className="portal-table">
            <thead>
              <tr>
                <th>Recruitment Stage</th>
                <th>Candidate Count</th>
                <th>Share of Total</th>
              </tr>
            </thead>
            <tbody>
              {pipelineData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-[#666666]">
                    No applicant data recorded.
                  </td>
                </tr>
              ) : (
                pipelineData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold text-[#356F9D]">{row.stage}</td>
                    <td className="font-bold">{row.candidates}</td>
                    <td className="text-xs text-[#555555]">
                      {data?.totalApplicants
                        ? `${Math.round((row.candidates / data.totalApplicants) * 100)}%`
                        : '0%'}
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
