import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Internship, ResumeFile } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  Building2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  ChevronLeft,
} from 'lucide-react';

export const InternshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, isStudent } = useAuth();
  const navigate = useNavigate();

  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Application modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | undefined>(undefined);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!id) return;
        const data = await api.getInternship(Number(id));
        setInternship(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load internship details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleOpenApplyModal = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/internships/${id}` } });
      return;
    }
    if (!isStudent) {
      setSubmitError('Only registered student accounts can submit internship applications.');
      setIsApplyModalOpen(true);
      return;
    }

    setIsApplyModalOpen(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const userResumes = await api.getResumes();
      setResumes(userResumes || []);
      const primary = userResumes?.find((r: ResumeFile) => r.isPrimary);
      if (primary) {
        setSelectedResumeId(primary.id);
      } else if (userResumes && userResumes.length > 0) {
        setSelectedResumeId(userResumes[0].id);
      }
    } catch (err) {
      console.warn('Could not pre-fetch student resumes:', err);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!internship) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      await api.applyForInternship(internship.id, {
        resumeId: selectedResumeId,
        coverLetter: coverLetter.trim() || undefined,
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
        navigate('/student/applications');
      }, 1500);
    } catch (err: any) {
      setSubmitError(err.message || 'Application submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-sm font-medium text-[#666666]">Loading internship notification...</div>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-4 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-sm rounded-sm">
          {error || 'Internship not found.'}
        </div>
        <div className="mt-4">
          <Link to="/internships" className="text-xs text-[#4779B8] font-bold hover:underline">
            &larr; Back to Internship Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/internships"
            className="text-xs text-[#4779B8] font-semibold hover:underline inline-flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to All Internships</span>
          </Link>
        </div>

        {/* Blue Header Section */}
        <div className="bg-[#356F9D] text-white px-5 py-4 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-[11px] text-[#FFF0CE] font-mono uppercase">
              Notice ID: INT-{String(internship.id).padStart(4, '0')}
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-wide mt-0.5">
              {internship.title}
            </h1>
            <div className="text-xs text-[#EAF2FC] mt-1 flex items-center gap-3">
              <span>{internship.companyName}</span>
              <span>•</span>
              <span>{internship.location}</span>
            </div>
          </div>

          <div>
            <button
              onClick={handleOpenApplyModal}
              className="px-5 py-2 bg-white text-[#356F9D] hover:bg-[#EAF2FC] font-bold text-xs rounded-sm border border-[#D4DCE6] shadow-sm uppercase tracking-wide transition-colors"
            >
              Apply for Internship
            </button>
          </div>
        </div>

        {/* Structured Key Details Table */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
            Key Employment & Eligibility Parameters
          </div>
          <table className="portal-table">
            <tbody>
              <tr>
                <td className="w-1/4 font-bold bg-[#FAFCFF]">Hiring Organization</td>
                <td className="w-1/4 font-semibold text-[#356F9D]">{internship.companyName}</td>
                <td className="w-1/4 font-bold bg-[#FAFCFF]">Work Mode</td>
                <td className="w-1/4">
                  <StatusBadge status={internship.workMode} size="sm" />
                </td>
              </tr>
              <tr>
                <td className="font-bold bg-[#FAFCFF]">Job Location</td>
                <td>{internship.location}</td>
                <td className="font-bold bg-[#FAFCFF]">Internship Duration</td>
                <td>{internship.durationMonths} Months</td>
              </tr>
              <tr>
                <td className="font-bold bg-[#FAFCFF]">Monthly Stipend</td>
                <td className="font-bold text-[#285C2A]">
                  {internship.stipendMin ? `₹${internship.stipendMin.toLocaleString()} / Month` : 'Unpaid'}
                </td>
                <td className="font-bold bg-[#FAFCFF]">Available Vacancies</td>
                <td>{internship.openings || 1} Positions</td>
              </tr>
              <tr>
                <td className="font-bold bg-[#FAFCFF]">Application Deadline</td>
                <td className="text-[#C94242] font-semibold">
                  {internship.applicationDeadline ? new Date(internship.applicationDeadline).toLocaleDateString() : 'Open until filled'}
                </td>
                <td className="font-bold bg-[#FAFCFF]">Current Status</td>
                <td>
                  <StatusBadge status={internship.status} size="sm" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Description & Responsibilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            {/* Description */}
            <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 space-y-2">
              <h2 className="text-xs font-bold text-[#356F9D] uppercase tracking-wide border-b border-[#D4DCE6] pb-1">
                Internship Overview & Objectives
              </h2>
              <p className="text-xs text-[#333333] leading-relaxed whitespace-pre-line">
                {internship.description}
              </p>
            </div>

            {/* Responsibilities */}
            {internship.responsibilities && (
              <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 space-y-2">
                <h2 className="text-xs font-bold text-[#356F9D] uppercase tracking-wide border-b border-[#D4DCE6] pb-1">
                  Key Responsibilities & Deliverables
                </h2>
                <div className="text-xs text-[#333333] leading-relaxed whitespace-pre-line">
                  {internship.responsibilities}
                </div>
              </div>
            )}

            {/* Requirements & Eligibility */}
            {internship.eligibilityCriteria && (
              <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 space-y-2">
                <h2 className="text-xs font-bold text-[#356F9D] uppercase tracking-wide border-b border-[#D4DCE6] pb-1">
                  Eligibility & Candidate Requirements
                </h2>
                <div className="text-xs text-[#333333] leading-relaxed whitespace-pre-line">
                  {internship.eligibilityCriteria}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Skills & Company Profile */}
          <div className="space-y-4">
            {/* Required Skills */}
            <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 space-y-2">
              <h3 className="text-xs font-bold text-[#356F9D] uppercase tracking-wide border-b border-[#D4DCE6] pb-1">
                Required Technical Skills
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {internship.skills && internship.skills.length > 0 ? (
                  internship.skills.map((s: any, idx: number) => {
                    const skillText = typeof s === 'string' ? s : (s?.skillName || s?.name || JSON.stringify(s));
                    return (
                      <span
                        key={idx}
                        className="text-xs px-2 py-0.5 border rounded-sm bg-[#EAF2FC] text-[#356F9D] border-[#B8C6D6] font-semibold"
                      >
                        {skillText}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-[#666666]">General engineering skills required</span>
                )}
              </div>
            </div>

            {/* Action Box */}
            <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 space-y-3">
              <h3 className="text-xs font-bold text-[#356F9D] uppercase tracking-wide border-b border-[#D4DCE6] pb-1">
                Application Action
              </h3>
              <p className="text-xs text-[#555555] leading-relaxed">
                Ensure your student profile details and PDF resume are accurate prior to submitting your application.
              </p>
              <button
                onClick={handleOpenApplyModal}
                className="w-full py-2 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold text-xs rounded-sm border border-[#356F9D] transition-colors"
              >
                Submit Application Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply: ${internship.title}`}
        description={`Organization: ${internship.companyName}`}
        maxWidth="md"
      >
        {submitSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#285C2A] mx-auto" />
            <h4 className="text-sm font-bold text-[#285C2A]">Application Submitted Successfully</h4>
            <p className="text-xs text-[#555555]">
              Your application has been registered. Redirecting to application tracking...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitApplication} className="space-y-4">
            {submitError && (
              <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {!isStudent && isAuthenticated ? (
              <p className="text-xs text-[#C94242]">
                Your current account is registered as a {user?.role}. Only students can apply for internships.
              </p>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">
                    Select Uploaded PDF Resume
                  </label>
                  {resumes.length === 0 ? (
                    <div className="p-3 bg-[#FFF0CE] border border-[#E6D3A3] text-[#855A00] text-xs rounded-sm">
                      You have not uploaded any PDF resume yet.{' '}
                      <Link to="/student/resume" className="font-bold underline">
                        Upload Resume in Student Portal
                      </Link>{' '}
                      or proceed with standard profile application.
                    </div>
                  ) : (
                    <select
                      value={selectedResumeId || ''}
                      onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm bg-white focus:border-[#4779B8] focus:outline-none"
                    >
                      {resumes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.originalFilename} {r.isPrimary ? '(Primary Resume)' : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">
                    Candidate Statement / Cover Note (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly state your relevant academic coursework, semester, projects, and motivation for this internship..."
                    className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#D4DCE6]">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-3 py-1.5 bg-white border border-[#D4DCE6] text-[#333333] text-xs font-medium rounded-sm hover:bg-[#F5F7FA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D] transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Confirm & Apply'}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </Modal>
    </div>
  );
};
