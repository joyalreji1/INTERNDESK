import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '@/services/api';
import { Application, ApplicationStatus } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  Users,
  Search,
  AlertCircle,
} from 'lucide-react';

export const CompanyApplicantsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Status Action Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus>('SHORTLISTED');
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const internshipId = searchParams.get('internshipId')
    ? Number(searchParams.get('internshipId'))
    : undefined;

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await api.getCompanyApplications(internshipId, 0, 50);
      const list = res.content || res || [];
      setApplications(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load company applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [internshipId]);

  const handleOpenActionModal = (app: Application, nextStatus: ApplicationStatus) => {
    setSelectedApp(app);
    setTargetStatus(nextStatus);
    setRemarks('');
    setActionError(null);
    setModalOpen(true);
  };

  const handleConfirmStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    setUpdating(true);
    setActionError(null);

    try {
      await api.updateApplicationStatus(selectedApp.id, {
        newStatus: targetStatus,
        remarks: remarks.trim() || undefined,
      });
      setModalOpen(false);
      fetchApplicants();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update application status.');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      !searchTerm ||
      app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.internshipTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentCollege?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Student Applicants Review Pipeline
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Screen candidates, inspect academic dossiers, and update recruitment status
          </p>
        </div>
        <div className="text-xs text-[#FFF0CE] font-mono">
          Total Candidates: <strong>{applications.length}</strong>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm p-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <input
              type="text"
              placeholder="Search by student candidate name, college, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-[#D4DCE6] rounded-sm bg-white focus:border-[#4779B8] focus:outline-none"
            >
              <option value="">All Recruitment Stages</option>
              <option value="APPLIED">Applied (Awaiting Review)</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW">Interview Scheduled</option>
              <option value="SELECTED">Selected / Offered</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applicants Data Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Candidate Name</th>
                <th>Applied Role</th>
                <th>College / Department</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Recruiter Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#666666]">
                    Retrieving candidate applications...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#666666]">
                    No applicant applications match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id}>
                    <td className="font-mono text-xs text-[#666666]">APP-{String(app.id).padStart(4, '0')}</td>
                    <td className="font-bold text-[#356F9D]">
                      <Link to={`/company/applicants/${app.id}`} className="hover:underline">
                        {app.studentName}
                      </Link>
                    </td>
                    <td className="font-semibold text-[#333333]">{app.internshipTitle}</td>
                    <td>{app.studentCollege || 'Engineering College'} {app.studentDegree ? `(${app.studentDegree})` : ''}</td>
                    <td className="text-xs text-[#555555]">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="space-x-1 whitespace-nowrap">
                      <Link
                        to={`/company/applicants/${app.id}`}
                        className="px-2 py-0.5 bg-white hover:bg-[#EAF2FC] text-[#4779B8] text-xs font-semibold rounded-sm border border-[#D4DCE6] inline-block"
                      >
                        Dossier
                      </Link>

                      {app.status === 'APPLIED' && (
                        <button
                          type="button"
                          onClick={() => handleOpenActionModal(app, 'UNDER_REVIEW')}
                          className="px-2 py-0.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-semibold rounded-sm border border-[#356F9D]"
                        >
                          Start Review
                        </button>
                      )}

                      {app.status === 'UNDER_REVIEW' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenActionModal(app, 'SHORTLISTED')}
                            className="px-2 py-0.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-semibold rounded-sm border border-[#356F9D]"
                          >
                            Shortlist
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenActionModal(app, 'REJECTED')}
                            className="px-2 py-0.5 bg-white hover:bg-[#FDE8E8] text-[#C94242] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {app.status === 'SHORTLISTED' && (
                        <button
                          type="button"
                          onClick={() => handleOpenActionModal(app, 'INTERVIEW')}
                          className="px-2 py-0.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-semibold rounded-sm border border-[#356F9D]"
                        >
                          Interview
                        </button>
                      )}

                      {app.status === 'INTERVIEW' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenActionModal(app, 'SELECTED')}
                            className="px-2 py-0.5 bg-[#285C2A] hover:bg-[#1E4820] text-white text-xs font-semibold rounded-sm border border-[#1E4820]"
                          >
                            Select
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenActionModal(app, 'REJECTED')}
                            className="px-2 py-0.5 bg-white hover:bg-[#FDE8E8] text-[#C94242] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recruiter Action Modal */}
      {selectedApp && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Update Status: ${selectedApp.studentName}`}
          description={`Position: ${selectedApp.internshipTitle}`}
          maxWidth="sm"
        >
          <form onSubmit={handleConfirmStatusChange} className="space-y-3">
            {actionError && (
              <div className="p-2 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div>
              <label className="portal-label">Target Recruitment Stage</label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as ApplicationStatus)}
                className="portal-input bg-white font-semibold"
              >
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="INTERVIEW">Interview Round</option>
                <option value="SELECTED">Selected / Offer Extended</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div>
              <label className="portal-label">Official Reviewer Remarks / Notes</label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter feedback, interview schedule details, or selection remarks..."
                className="portal-input"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-[#D4DCE6]">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3 py-1.5 bg-white border border-[#D4DCE6] text-[#333333] text-xs font-medium rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D] disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Confirm Status Change'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
