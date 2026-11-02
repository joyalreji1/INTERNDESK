import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '@/services/api';
import { Application, ApplicationStatus } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  Users,
  Search,
  FileText,
  AlertCircle,
  Download,
  Calendar,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
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
  const [rejectionReason, setRejectionReason] = useState('');
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
    setRejectionReason('');
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
        rejectionReason: targetStatus === 'REJECTED' ? rejectionReason.trim() : undefined,
      });
      setModalOpen(false);
      fetchApplicants();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update application status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadResume = async (app: Application) => {
    try {
      await api.downloadApplicationResume(app.id, app.resumeFilename || `resume_student_${app.studentId}.pdf`);
    } catch (err: any) {
      alert(err.message || 'Failed to download resume file.');
    }
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      !searchTerm ||
      app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.internshipTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentDepartment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentRegistrationNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Applicant Review & Recruitment Pipeline
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Screen candidates, inspect academic eligibility, manage interviews, and select interns
          </p>
        </div>
        <div className="text-xs text-[#FFF0CE] font-mono">
          Total Candidates: <strong>{filtered.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm p-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-8">
            <input
              type="text"
              placeholder="Search by student name, roll number, department, or internship title..."
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
              <option value="PAYMENT_PENDING">Payment Pending</option>
              <option value="ENROLLED">Enrolled (Fee Settled)</option>
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
                <th>Department</th>
                <th>Sem</th>
                <th>CGPA</th>
                <th>Internship</th>
                <th>Eligibility</th>
                <th>Resume</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="text-center py-8 text-[#666666]">
                    Retrieving candidate applications...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-8 text-[#666666]">
                    No applicant records match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const isPaid = app.internshipType === 'PAID' || (app.internshipFee && app.internshipFee > 0);
                  return (
                    <tr key={app.id}>
                      <td className="font-mono text-xs text-[#666666]">
                        APP-{String(app.id).padStart(4, '0')}
                      </td>
                      <td className="font-bold text-[#356F9D]">
                        <Link to={`/company/applicants/${app.id}`} className="hover:underline">
                          {app.studentName}
                        </Link>
                        <div className="text-[10px] text-[#777777] font-normal">{app.studentEmail}</div>
                      </td>
                      <td>{app.studentDepartment || 'Computer Science'}</td>
                      <td className="text-center font-semibold">{app.studentCurrentSemester || 7}</td>
                      <td className="text-center font-bold text-[#285C2A]">
                        {app.studentCgpa ? Number(app.studentCgpa).toFixed(2) : '8.50'}
                      </td>
                      <td className="font-semibold text-[#333333] max-w-[140px] truncate" title={app.internshipTitle}>
                        {app.internshipTitle}
                      </td>
                      <td>
                        <span className="px-1.5 py-0.5 bg-[#DDEED8] text-[#285C2A] border border-[#BFDDB7] rounded font-bold text-[10px]">
                          {app.eligibilityStatus || 'ELIGIBLE'}
                        </span>
                      </td>
                      <td className="text-center whitespace-nowrap">
                        {app.resumeFilename ? (
                          <button
                            type="button"
                            onClick={() => handleDownloadResume(app)}
                            className="px-2 py-0.5 bg-[#EAF2FC] hover:bg-[#D4E5FA] text-[#356F9D] text-xs font-semibold rounded-sm border border-[#B8C6D6] inline-flex items-center gap-1 transition-colors"
                            title="Download Student PDF Resume"
                          >
                            <Download className="w-3 h-3" />
                            <span>PDF</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#888888]">Profile</span>
                        )}
                      </td>
                      <td>
                        {isPaid ? (
                          <StatusBadge status={app.paymentStatus || 'PENDING'} size="sm" />
                        ) : (
                          <span className="text-[10px] text-[#777777] uppercase font-mono">Free</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={app.status} size="sm" />
                      </td>
                      <td className="space-x-1 whitespace-nowrap">
                        <Link
                          to={`/company/applicants/${app.id}`}
                          className="px-2 py-0.5 bg-white hover:bg-[#EAF2FC] text-[#4779B8] text-xs font-semibold rounded-sm border border-[#D4DCE6] inline-block"
                        >
                          Review
                        </Link>

                        {app.status === 'APPLIED' && (
                          <button
                            type="button"
                            onClick={() => handleOpenActionModal(app, 'UNDER_REVIEW')}
                            className="px-2 py-0.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-semibold rounded-sm border border-[#356F9D]"
                          >
                            Review
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
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenActionModal(app, 'INTERVIEW')}
                              className="px-2 py-0.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-semibold rounded-sm border border-[#356F9D]"
                            >
                              Interview
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenActionModal(app, 'SELECTED')}
                              className="px-2 py-0.5 bg-[#285C2A] hover:bg-[#1E4820] text-white text-xs font-semibold rounded-sm border border-[#1E4820]"
                            >
                              Select
                            </button>
                          </>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Confirm Candidate Decision: ${targetStatus}`}
        description={`Applicant: ${selectedApp?.studentName || ''}`}
        maxWidth="sm"
      >
        <form onSubmit={handleConfirmStatusChange} className="space-y-3 text-xs">
          {actionError && (
            <div className="p-2 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{actionError}</span>
            </div>
          )}

          {targetStatus === 'SELECTED' &&
            (selectedApp?.internshipType === 'PAID' ||
              (selectedApp?.internshipFee && selectedApp?.internshipFee > 0)) && (
              <div className="p-3 bg-[#FAFCFF] border border-[#356F9D] rounded-sm space-y-1">
                <div className="font-bold text-[#356F9D] flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Selection of Candidate for Paid Internship</span>
                </div>
                <p className="text-[#555555]">
                  Selecting this candidate will notify the student and prompt them to pay the participation fee of ₹{selectedApp?.internshipFee} INR via Razorpay to confirm enrollment.
                </p>
              </div>
            )}

          {targetStatus === 'REJECTED' && (
            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Feedback / Reason for Rejection <span className="text-[#C94242]">*</span>
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="State the clear educational feedback or criteria that were not satisfied..."
                required
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#333333] mb-1">
              Internal Recruiter Notes / Remarks
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional administrative or committee notes..."
              className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#D4DCE6]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-3 py-1.5 bg-white border border-[#D4DCE6] text-[#333333] font-medium rounded-sm hover:bg-[#F5F7FA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-4 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold rounded-sm border border-[#356F9D] disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Confirm Decision'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
