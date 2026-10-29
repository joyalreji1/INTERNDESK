import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/Badge';
import {
  Briefcase,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';

export const CompanyInternshipsPage: React.FC = () => {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchPostings = async () => {
    setLoading(true);
    try {
      const res = await api.getMyCompanyInternships(0, 50);
      const list = res.content || res || [];
      setInternships(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load company postings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostings();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to close / delete "${title}"?`)) return;
    try {
      await api.deleteInternship(id);
      setMsg(`Listing "${title}" closed successfully.`);
      fetchPostings();
    } catch (err: any) {
      alert(err.message || 'Failed to delete internship');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Company Internship Listings
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Create, update, and manage vacancies offered by your organization
          </p>
        </div>

        <Link
          to="/company/internships/create"
          className="px-3 py-1 bg-white hover:bg-[#EAF2FC] text-[#356F9D] text-xs font-bold rounded-sm border border-[#D4DCE6] flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Post New Opening</span>
        </Link>
      </div>

      {msg && (
        <div className="p-3 bg-[#DDEED8] border border-[#BFDDB7] text-[#285C2A] text-xs rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Postings Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Internship Title</th>
                <th>Location</th>
                <th>Work Mode</th>
                <th>Duration</th>
                <th>Stipend</th>
                <th>Positions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-[#666666]">
                    Loading company postings...
                  </td>
                </tr>
              ) : internships.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-[#666666]">
                    No internship postings created yet.{' '}
                    <Link to="/company/internships/create" className="text-[#4779B8] font-bold hover:underline">
                      Publish a new vacancy
                    </Link>
                  </td>
                </tr>
              ) : (
                internships.map((int) => (
                  <tr key={int.id}>
                    <td className="font-mono text-xs text-[#666666]">INT-{String(int.id).padStart(4, '0')}</td>
                    <td className="font-bold text-[#356F9D]">
                      <Link to={`/internships/${int.id}`} className="hover:underline">
                        {int.title}
                      </Link>
                    </td>
                    <td>{int.location}</td>
                    <td>
                      <StatusBadge status={int.workMode} size="sm" />
                    </td>
                    <td>{int.durationMonths || 3} Months</td>
                    <td className="font-semibold text-[#285C2A]">
                      {(int.stipendMin || int.stipendAmount) ? `₹${(int.stipendMin ?? int.stipendAmount).toLocaleString()}/mo` : 'Unpaid'}
                    </td>
                    <td>{int.openings ?? int.vacancies ?? 1}</td>
                    <td>
                      <StatusBadge status={int.status} size="sm" />
                    </td>
                    <td className="space-x-1.5 whitespace-nowrap">
                      <Link
                        to={`/company/internships/${int.id}/edit`}
                        className="px-2 py-0.5 bg-white hover:bg-[#EAF2FC] text-[#4779B8] text-xs font-semibold rounded-sm border border-[#D4DCE6] inline-block"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(int.id, int.title)}
                        className="px-2 py-0.5 bg-white hover:bg-[#FDE8E8] text-[#C94242] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
                      >
                        Close
                      </button>
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
