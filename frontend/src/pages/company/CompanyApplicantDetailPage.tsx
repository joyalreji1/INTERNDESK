import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Application, ApplicationStatus, ApplicationStatusHistory } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  ChevronLeft,
  FileText,
  AlertCircle,
  History,
} from 'lucide-react';

export const CompanyApplicantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [history, setHistory] = useState<ApplicationStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus>('SHORTLISTED');
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchDetails = async () => {
    try {
      if (!id) return;
      const [appData, historyData] = await Promise.all([
        api.getApplication(Number(id)),
        api.getApplicationHistory(Number(id)),
      ]);
      setApp(appData);
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load applicant details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleOpenStatusModal = (status: ApplicationStatus) => {
    setTargetStatus(status);
    setRemarks('');
    setActionError(null);
    setModalOpen(true);
  };

  const handleConfirmStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!app) return;
    setUpdating(true);
    setActionError(null);

    try {
      await api.updateApplicationStatus(app.id, {
        newStatus: targetStatus,
        remarks: remarks.trim() || undefined,
      });
      setModalOpen(false);
      fetchDetails();
    } catch (err: any) {
      setActionError(err.message || 'Status transition failed.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-xs text-[#666666]">Loading applicant dossier...</div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="p-4 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm">
          {error || 'Applicant records not found.'}
        </div>
        <div className="mt-3">
          <Link to="/company/applicants" className="text-xs text-[#4779B8] font-bold hover:underline">
            &larr; Back to Applicants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Link
          to="/company/applicants"
          className="text-xs text-[#4779B8] font-bold hover:underline inline-flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Candidate Pipeline</span>
        </Link>
      </div>

      {/* Header Strip */}
      <div className="bg-[#356F9D] text-white px-4 py-3 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-[11px] text-[#FFF0CE] font-mono">
            Candidate Application Docket: APP-{String(app.id).padStart(4, '0')}
          </div>
          <h1 className="text-base font-bold tracking-wide mt-0.5">
            {app.studentName}
          </h1>
          <p className="text-xs text-[#EAF2FC] mt-0.5">
            Applied for: <strong>{app.internshipTitle}</strong> • Submitted:{' '}
            {new Date(app.appliedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={app.status} size="md" />
        </div>
      </div>

      {/* Quick Recruiter Decision Strip */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm p-3 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="font-bold text-[#356F9D] uppercase tracking-wide">
          Recruitment Stage Actions:
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {app.status === 'APPLIED' && (
            <button
              onClick={() => handleOpenStatusModal('UNDER_REVIEW')}
              className="px-3 py-1 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold rounded-sm border border-[#356F9D]"
            >
              Move to Under Review
            </button>
          )}

          {['APPLIED', 'UNDER_REVIEW'].includes(app.status) && (
            <button
              onClick={() => handleOpenStatusModal('SHORTLISTED')}
              className="px-3 py-1 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold rounded-sm border border-[#356F9D]"
            >
              Shortlist Candidate
            </button>
          )}

          {['UNDER_REVIEW', 'SHORTLISTED'].includes(app.status) && (
            <button
              onClick={() => handleOpenStatusModal('INTERVIEW')}
              className="px-3 py-1 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold rounded-sm border border-[#356F9D]"
            >
              Schedule Interview
            </button>
          )}

          {['SHORTLISTED', 'INTERVIEW'].includes(app.status) && (
            <button
              onClick={() => handleOpenStatusModal('SELECTED')}
              className="px-3 py-1 bg-[#285C2A] hover:bg-[#1E4820] text-white font-bold rounded-sm border border-[#1E4820]"
            >
              Select / Extend Offer
            </button>
          )}

          {!['SELECTED', 'REJECTED', 'WITHDRAWN'].includes(app.status) && (
            <button
              onClick={() => handleOpenStatusModal('REJECTED')}
              className="px-3 py-1 bg-white hover:bg-[#FDE8E8] text-[#C94242] font-semibold rounded-sm border border-[#D4DCE6]"
            >
              Reject Application
            </button>
          )}
        </div>
      </div>

      {/* Student Academic Dossier Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
          Candidate Academic & Profile Credentials
        </div>

        <table className="portal-table">
          <tbody>
            <tr>
              <td className="w-1/4 font-bold bg-[#FAFCFF]">Student Full Name</td>
              <td className="w-1/4 font-semibold text-[#356F9D]">{app.studentName}</td>
              <td className="w-1/4 font-bold bg-[#FAFCFF]">Contact Email</td>
              <td className="w-1/4">{app.studentEmail}</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">College / Institution</td>
              <td>{app.studentCollege || 'Engineering College'}</td>
              <td className="font-bold bg-[#FAFCFF]">Degree & Department</td>
              <td>{app.studentDegree || 'B.Tech - Computer Science'}</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Candidate CGPA</td>
              <td className="font-bold text-[#285C2A]">{app.studentCgpa ? `${app.studentCgpa} / 10.0` : 'N/A'}</td>
              <td className="font-bold bg-[#FAFCFF]">Application Date</td>
              <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Attached PDF Resume</td>
              <td colSpan={3}>
                {app.resumeFilename ? (
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#356F9D] font-bold">
                      📄 {app.resumeFilename}
                    </span>
                    <button
                      type="button"
                      onClick={() => api.downloadApplicationResume(app.id, app.resumeFilename || 'resume.pdf')}
                      className="px-2.5 py-0.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-semibold rounded-sm border border-[#356F9D] inline-flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Download Candidate Resume
                    </button>
                  </div>
                ) : (
                  <span className="text-[#888888]">Standard Portal Profile Provided (No Separate PDF Attached)</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {app.coverLetter && (
          <div className="p-4 border-t border-[#D4DCE6] text-xs">
            <strong className="block text-xs font-bold text-[#356F9D] uppercase mb-1">
              Applicant Statement / Cover Note:
            </strong>
            <div className="bg-[#FAFCFF] p-3 border border-[#D4DCE6] rounded-sm text-[#333333] whitespace-pre-line leading-relaxed">
              {app.coverLetter}
            </div>
          </div>
        )}
      </div>

      {/* Audit Log */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#356F9D] text-white px-4 py-2 text-xs font-bold uppercase border-b border-[#28587E] flex items-center gap-1.5">
          <History className="w-3.5 h-3.5" />
          <span>Stage Transition Audit Log</span>
        </div>

        <table className="portal-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Previous Stage</th>
              <th>Updated Stage</th>
              <th>Recruiter Remarks / Reason</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-[#666666]">
                  Initial application submitted by student.
                </td>
              </tr>
            ) : (
              history.map((h) => (
                <tr key={h.id}>
                  <td className="text-xs text-[#555555] whitespace-nowrap">
                    {new Date(h.changedAt).toLocaleString()}
                  </td>
                  <td>
                    {h.previousStatus ? <StatusBadge status={h.previousStatus} size="sm" /> : '-'}
                  </td>
                  <td>
                    <StatusBadge status={h.newStatus} size="sm" />
                  </td>
                  <td className="text-xs text-[#333333]">{h.remarks || 'Stage transitioned'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Decision Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Confirm Stage Transition: ${targetStatus}`}
        description={`Applicant: ${app.studentName}`}
        maxWidth="sm"
      >
        <form onSubmit={handleConfirmStatus} className="space-y-3">
          {actionError && (
            <div className="p-2 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm">
              {actionError}
            </div>
          )}

          <div>
            <label className="portal-label">Recruiter Remarks / Selection Notes</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter official notes or scheduling details..."
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
              {updating ? 'Recording...' : 'Confirm Update'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
