import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  Users,
  Search,
  AlertTriangle,
} from 'lucide-react';

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Status Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [targetStatus, setTargetStatus] = useState<'ACTIVE' | 'SUSPENDED'>('SUSPENDED');
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchStudents = async (query = '', p = 0) => {
    setLoading(true);
    try {
      const res = await api.getAdminStudents(query || undefined, p, 15);
      const list = res.content || res || [];
      setStudents(Array.isArray(list) ? list : []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(searchTerm, page);
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchStudents(searchTerm.trim(), 0);
  };

  const handleOpenStatusModal = (student: any, status: 'ACTIVE' | 'SUSPENDED') => {
    setSelectedStudent(student);
    setTargetStatus(status);
    setRemarks('');
    setErrorMsg(null);
    setStatusModalOpen(true);
  };

  const handleConfirmStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setUpdating(true);
    setErrorMsg(null);

    try {
      await api.updateStudentUserStatus(
        selectedStudent.userId,
        targetStatus,
        remarks.trim() || undefined
      );
      setStatusModalOpen(false);
      fetchStudents(searchTerm, page);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update student status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Student Candidate Registry
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Institutional directory of registered student candidates, CGPA records, and account statuses
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm p-3 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl">
          <input
            type="text"
            placeholder="Search by student candidate name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D] flex items-center gap-1 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Students Data Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Candidate ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>College / Department</th>
                <th>CGPA</th>
                <th>Grad. Year</th>
                <th>Account Status</th>
                <th>Moderation</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#666666]">
                    Loading registered student records...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#666666]">
                    No student candidate records found.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id || s.userId}>
                    <td className="font-mono text-xs text-[#666666]">
                      STU-{String(s.userId || s.id).padStart(4, '0')}
                    </td>
                    <td className="font-bold text-[#356F9D]">{s.fullName}</td>
                    <td>{s.email}</td>
                    <td>{s.collegeName || 'Engineering College'} ({s.department || 'CSE'})</td>
                    <td className="font-bold text-[#285C2A]">{s.cgpa || 'N/A'}</td>
                    <td>{s.graduationYear || '2026'}</td>
                    <td>
                      <StatusBadge status={s.accountStatus || 'ACTIVE'} size="sm" />
                    </td>
                    <td>
                      {s.accountStatus === 'SUSPENDED' ? (
                        <button
                          type="button"
                          onClick={() => handleOpenStatusModal(s, 'ACTIVE')}
                          className="px-2 py-0.5 bg-[#DDEED8] hover:bg-[#C9E4C2] text-[#285C2A] text-xs font-semibold rounded-sm border border-[#BFDDB7]"
                        >
                          Activate
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenStatusModal(s, 'SUSPENDED')}
                          className="px-2 py-0.5 bg-white hover:bg-[#FDE8E8] text-[#C94242] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 bg-[#FAFCFF] border-t border-[#D4DCE6] flex items-center justify-between text-xs">
            <button
              disabled={page <= 0}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-white border border-[#D4DCE6] rounded-sm disabled:opacity-40"
            >
              &larr; Previous Page
            </button>
            <span className="text-[#666666]">
              Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-white border border-[#D4DCE6] rounded-sm disabled:opacity-40"
            >
              Next Page &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Status Modal */}
      {selectedStudent && (
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title={`Update Account Status: ${selectedStudent.fullName}`}
          description={`Target Status: ${targetStatus}`}
          maxWidth="sm"
        >
          <form onSubmit={handleConfirmStatus} className="space-y-3">
            {errorMsg && (
              <div className="p-2 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="portal-label">Official Administrative Remarks</label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Reason for account status change..."
                className="portal-input"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-[#D4DCE6]">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="px-3 py-1.5 bg-white border border-[#D4DCE6] text-[#333333] text-xs font-medium rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D] disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Confirm Action'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
