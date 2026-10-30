import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Application, ApplicationStatus, ApplicationStatusHistory } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  FileText,
  User,
  GraduationCap,
  Calendar,
  Clock,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  History,
  Building2,
  Video,
  Download,
} from 'lucide-react';

export const CompanyApplicantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [history, setHistory] = useState<ApplicationStatusHistory[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status Action State
  const [modalOpen, setModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus>('SHORTLISTED');
  const [remarks, setRemarks] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [updating, setUpdating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchDetails = async () => {
    try {
      if (!id) return;
      const [appData, historyData, interviewData] = await Promise.all([
        api.getApplication(Number(id)),
        api.getApplicationHistory(Number(id)),
        api.getInterviews(Number(id)).catch(() => []),
      ]);
      setApp(appData);
      setHistory(Array.isArray(historyData) ? historyData : []);
      setInterviews(Array.isArray(interviewData) ? interviewData : []);
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
    setMeetingLink('');
    setScheduledAt('');
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

      if (targetStatus === 'INTERVIEW' && scheduledAt) {
        try {
          await api.scheduleInterview(app.id, {
            scheduledAt,
            meetingLink: meetingLink.trim() || undefined,
            interviewerNotes: remarks.trim() || undefined,
            interviewType: 'ONLINE',
          });
        } catch (e) {
          console.warn('Interview scheduling notice:', e);
        }
      }

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

          {/* Quick Actions based on current status */}
          {app.status === 'APPLIED' && (
            <button
              onClick={() => handleOpenStatusModal('UNDER_REVIEW')}
              className="px-3 py-1 bg-[#4779B8] hover:bg-[#28587E] text-white text-xs font-semibold rounded-sm border border-[#28587E]"
            >
              Start Review
            </button>
          )}

          {app.status === 'UNDER_REVIEW' && (
            <>
              <button
                onClick={() => handleOpenStatusModal('SHORTLISTED')}
                className="px-3 py-1 bg-[#4779B8] hover:bg-[#28587E] text-white text-xs font-semibold rounded-sm border border-[#28587E]"
              >
                Shortlist Candidate
              </button>
              <button
                onClick={() => handleOpenStatusModal('REJECTED')}
                className="px-3 py-1 bg-white hover:bg-[#FDE8E8] text-[#C94242] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
              >
                Reject
              </button>
            </>
          )}

          {app.status === 'SHORTLISTED' && (
            <>
              <button
                onClick={() => handleOpenStatusModal('INTERVIEW')}
                className="px-3 py-1 bg-[#4779B8] hover:bg-[#28587E] text-white text-xs font-semibold rounded-sm border border-[#28587E]"
              >
                Schedule Interview
              </button>
              <button
                onClick={() => handleOpenStatusModal('REJECTED')}
                className="px-3 py-1 bg-white hover:bg-[#FDE8E8] text-[#C94242] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
              >
                Reject
              </button>
            </>
          )}

          {app.status === 'INTERVIEW' && (
            <>
              <button
                onClick={() => handleOpenStatusModal('SELECTED')}
                className="px-3 py-1 bg-[#285C2A] hover:bg-[#1E4820] text-white text-xs font-semibold rounded-sm border border-[#1E4820]"
              >
                Extend Offer (Select)
              </button>
              <button
                onClick={() => handleOpenStatusModal('REJECTED')}
                className="px-3 py-1 bg-white hover:bg-[#FDE8E8] text-[#C94242] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      {/* Scheduled Interviews Section */}
      {interviews.length > 0 && (
        <div className="bg-white border border-[#356F9D] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#356F9D] text-white px-4 py-2 text-xs font-bold uppercase flex items-center gap-1.5">
            <Video className="w-4 h-4 text-[#FFF0CE]" />
            <span>Scheduled Interview Sessions</span>
          </div>
          <div className="p-4 space-y-3">
            {interviews.map((iv) => (
              <div key={iv.id} className="p-3 bg-[#EAF2FC] border border-[#B8C6D6] rounded-sm space-y-1.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-semibold text-[#356F9D]">
                  <span className="uppercase">{iv.interviewType || 'Online Interview'}</span>
                  <span className="font-mono text-[#333333]">
                    {iv.scheduledAt ? new Date(iv.scheduledAt).toLocaleString() : 'TBD'}
                  </span>
                </div>
                {iv.meetingLink && (
                  <div>
                    <span className="font-bold text-[#333333] mr-2">Meeting Link:</span>
                    <a
                      href={iv.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4779B8] font-bold hover:underline break-all"
                    >
                      {iv.meetingLink}
                    </a>
                  </div>
                )}
                {iv.interviewerNotes && (
                  <div className="text-[#555555]">
                    <span className="font-bold text-[#333333] mr-1">Notes:</span>
                    {iv.interviewerNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Academic Dossier */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
          Candidate Academic & Contact Profile
        </div>
        <table className="portal-table">
          <tbody>
            <tr>
              <td className="w-1/4 font-bold bg-[#FAFCFF]">Full Name</td>
              <td className="w-1/4">{app.studentName}</td>
              <td className="w-1/4 font-bold bg-[#FAFCFF]">Registered Email</td>
              <td className="w-1/4">
                <a href={`mailto:${app.studentEmail}`} className="text-[#4779B8] hover:underline font-mono">
                  {app.studentEmail}
                </a>
              </td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Registration Number</td>
              <td className="font-mono text-xs">{app.studentRegistrationNumber || 'KTU/2026/01'}</td>
              <td className="font-bold bg-[#FAFCFF]">College / Institution</td>
              <td>{app.studentCollege || 'Engineering College'}</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Degree & Department</td>
              <td>{app.studentDegree || 'B.Tech'} ({app.studentDepartment || 'Computer Science'})</td>
              <td className="font-bold bg-[#FAFCFF]">Semester & CGPA</td>
              <td>
                Semester {app.studentCurrentSemester || 7} •{' '}
                <strong className="text-[#285C2A]">
                  CGPA {app.studentCgpa ? Number(app.studentCgpa).toFixed(2) : '8.50'}
                </strong>
              </td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Technical Skills</td>
              <td colSpan={3}>
                <span className="text-xs text-[#333333]">
                  {app.studentSkills || 'Java, Spring Boot, MySQL, React, REST APIs'}
                </span>
              </td>
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
                      className="px-2.5 py-1 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-semibold rounded-sm border border-[#356F9D] inline-flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF Resume</span>
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
            <label className="portal-label">Recruiter Remarks / Notes</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter official evaluation notes..."
              className="portal-input"
            />
          </div>

          {targetStatus === 'INTERVIEW' && (
            <div className="space-y-2.5 p-3 bg-[#FAFCFF] border border-[#D4DCE6] rounded-sm text-xs">
              <div className="font-bold text-[#356F9D] uppercase tracking-wide">
                Schedule Interview Slot
              </div>
              <div>
                <label className="portal-label">Interview Date & Time *</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="portal-input"
                  required
                />
              </div>
              <div>
                <label className="portal-label">Meeting URL (Google Meet / Zoom / Teams)</label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xyz-abc-def"
                  className="portal-input"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2 border-t border-[#D4DCE6]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-3 py-1.5 bg-white border border-[#D4DCE6] text-[#333333] text-xs font-medium rounded-sm hover:bg-[#F5F7FA]"
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
