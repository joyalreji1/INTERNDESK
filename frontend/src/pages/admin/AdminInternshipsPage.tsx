import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/Badge';
import {
  Briefcase,
  Search,
} from 'lucide-react';

export const AdminInternshipsPage: React.FC = () => {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminInternships(searchTerm || undefined, statusFilter || undefined, page, 50);
      const list = res.content || res || [];
      setInternships(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load internships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [statusFilter, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInternships();
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      await api.updateInternshipStatusAdmin(id, nextStatus);
      fetchInternships();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Permanently remove internship "${title}"?`)) return;
    try {
      await api.deleteInternshipAdmin(id);
      fetchInternships();
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
            Internship Listings Moderation Desk
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Institutional oversight of published openings, vacancies, and closing dates
          </p>
        </div>
        <div className="text-xs text-[#FFF0CE] font-mono">
          Total Postings: <strong>{internships.length}</strong>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm p-3 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 flex gap-2">
            <input
              type="text"
              placeholder="Search by title, hiring company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D]"
            >
              Search
            </button>
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-[#D4DCE6] rounded-sm bg-white focus:border-[#4779B8] focus:outline-none"
            >
              <option value="">All Moderation Statuses</option>
              <option value="ACTIVE">Active (Accepting Applications)</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </form>
      </div>

      {/* Internships Data Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Internship Title</th>
                <th>Hiring Company</th>
                <th>Location</th>
                <th>Work Mode</th>
                <th>Stipend</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#666666]">
                    Retrieving internship listings...
                  </td>
                </tr>
              ) : internships.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#666666]">
                    No internship records matched your query.
                  </td>
                </tr>
              ) : (
                internships.map((int) => (
                  <tr key={int.id}>
                    <td className="font-mono text-xs text-[#666666]">INT-{String(int.id).padStart(4, '0')}</td>
                    <td className="font-bold text-[#356F9D]">{int.title}</td>
                    <td className="font-medium text-[#333333]">{int.companyName}</td>
                    <td>{int.location}</td>
                    <td>
                      <StatusBadge status={int.workMode} size="sm" />
                    </td>
                    <td className="font-semibold text-[#285C2A]">
                      {(int.stipendMin || int.stipendAmount) ? `₹${(int.stipendMin ?? int.stipendAmount).toLocaleString()}/mo` : 'Unpaid'}
                    </td>
                    <td>
                      <StatusBadge status={int.status} size="sm" />
                    </td>
                    <td className="space-x-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(int.id, int.status)}
                        className="px-2 py-0.5 bg-white hover:bg-[#EAF2FC] text-[#4779B8] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
                      >
                        {int.status === 'ACTIVE' ? 'Close' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(int.id, int.title)}
                        className="px-2 py-0.5 bg-white hover:bg-[#FDE8E8] text-[#C94242] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
                      >
                        Delete
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
