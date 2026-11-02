import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Internship, ResumeFile, EligibilityEvaluationResult } from '@/types';
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
  CreditCard,
  ShieldCheck,
  Check,
  X,
  Info,
} from 'lucide-react';

export const InternshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, isStudent } = useAuth();
  const navigate = useNavigate();

  const [internship, setInternship] = useState<Internship | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityEvaluationResult | null>(null);
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

        // If user is a student, fetch automated eligibility evaluation
        if (isAuthenticated && isStudent) {
          api.evaluateEligibility(Number(id))
            .then((res) => setEligibility(res))
            .catch(() => {});
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load internship details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, isAuthenticated, isStudent]);

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

  const isPaid = internship.internshipType === 'PAID' || (internship.internshipFee && internship.internshipFee > 0);

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
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#FFF0CE] font-mono uppercase">
                Notice ID: INT-{String(internship.id).padStart(4, '0')}
              </span>
              <span
                className={`px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase tracking-wide ${
                  isPaid
                    ? 'bg-[#4B32A6] text-white border border-[#6B51C9]'
                    : 'bg-[#285C2A] text-white border border-[#3E8040]'
                }`}
              >
                {isPaid ? `PAID INTERNSHIP (₹${internship.internshipFee} FEE)` : '100% FREE INTERNSHIP'}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-wide mt-1">
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

        {/* PAID INTERNSHIP IMPORTANT NOTICE BANNER */}
        {isPaid && (
          <div className="p-4 bg-[#FAFCFF] border-2 border-[#4B32A6] rounded-sm space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-[#4B32A6] font-bold text-xs uppercase tracking-wide">
              <CreditCard className="w-4 h-4" />
              <span>Paid Internship Participation & Payment Workflow</span>
            </div>
            <div className="text-xs text-[#555555] space-y-1">
              <p>
                <strong>No upfront payment required:</strong> Submitting an application is <strong>100% free</strong>. The participation fee of{' '}
                <strong className="text-[#4B32A6]">₹{internship.internshipFee?.toLocaleString()} {internship.currency || 'INR'}</strong> is payable <em>only after</em> {internship.companyName} reviews your profile and issues an official selection offer.
              </p>
              {internship.refundPolicy && (
                <p className="text-[11px] text-[#777777] pt-1">
                  <strong>Refund & Cancellation Policy:</strong> {internship.refundPolicy}
                </p>
              )}
            </div>
          </div>
        )}

        {/* AUTOMATED ELIGIBILITY EVALUATION WIDGET (For logged-in students) */}
        {isAuthenticated && isStudent && eligibility && (
          <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
            <div className="bg-[#356F9D] text-white px-4 py-2 text-xs font-bold uppercase flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FFF0CE]" />
                <span>Automated Academic Profile Eligibility Screening</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-sm font-bold text-[10px] ${
                  eligibility.status === 'ELIGIBLE'
                    ? 'bg-[#DDEED8] text-[#285C2A]'
                    : eligibility.status === 'PROFILE_INCOMPLETE'
                    ? 'bg-[#FFF0CE] text-[#855A00]'
                    : 'bg-[#FDE8E8] text-[#C94242]'
                }`}
              >
                STATUS: {eligibility.status}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs text-[#555555]">{eligibility.summary}</p>

              {/* Criteria Checklist */}
              {eligibility.criteriaChecks && eligibility.criteriaChecks.length > 0 && (
                <div className="border border-[#EAF2FC] rounded-sm overflow-hidden text-xs">
                  <table className="w-full">
                    <thead className="bg-[#FAFCFF] border-b border-[#EAF2FC] text-[#666666]">
                      <tr>
                        <th className="py-1.5 px-3 text-left font-bold">Eligibility Parameter</th>
                        <th className="py-1.5 px-3 text-left font-bold">Required Criteria</th>
                        <th className="py-1.5 px-3 text-left font-bold">Your Verified Profile</th>
                        <th className="py-1.5 px-3 text-center font-bold">Evaluation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F7FA]">
                      {eligibility.criteriaChecks.map((c, idx) => (
                        <tr key={idx} className={c.satisfied ? 'bg-white' : 'bg-[#FFFDFD]'}>
                          <td className="py-2 px-3 font-semibold text-[#333333]">
                            {c.criterionName}
                          </td>
                          <td className="py-2 px-3 text-[#555555]">{c.requiredValue}</td>
                          <td className="py-2 px-3 font-medium text-[#356F9D]">
                            {c.studentValue || 'Not Set'}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {c.satisfied ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#DDEED8] text-[#285C2A] rounded font-bold text-[10px]">
                                <Check className="w-3 h-3" /> Met
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FDE8E8] text-[#C94242] rounded font-bold text-[10px]">
                                <X className="w-3 h-3" /> Unmet
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Unmet Criteria Explanation */}
              {!eligibility.eligible && eligibility.unmetCriteria && eligibility.unmetCriteria.length > 0 && (
                <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm space-y-1">
                  <strong>Unsatisfied Mandatory Requirements:</strong>
                  <ul className="list-disc list-inside space-y-0.5 pt-1">
                    {eligibility.unmetCriteria.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                  <p className="pt-1 text-[11px] text-[#666666]">
                    Please update your academic profile, semester, or uploaded resume under your Student Portal to fulfill these prerequisites.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

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
                <td className="font-bold bg-[#FAFCFF]">
                  {isPaid ? 'Internship Fee (INR)' : 'Stipend'}
                </td>
                <td className="font-bold text-[#285C2A]">
                  {isPaid
                    ? `₹${internship.internshipFee?.toLocaleString()} Participation Fee`
                    : internship.stipendMin
                    ? `₹${internship.stipendMin.toLocaleString()} / Month`
                    : 'Unpaid (No Fee)'}
                </td>
                <td className="font-bold bg-[#FAFCFF]">Available Vacancies</td>
                <td>{internship.openings || 1} Positions</td>
              </tr>
              <tr>
                <td className="font-bold bg-[#FAFCFF]">Application Deadline</td>
                <td className="text-[#C94242] font-semibold">
                  {internship.applicationDeadline
                    ? new Date(internship.applicationDeadline).toLocaleDateString()
                    : 'Open until filled'}
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
                    const skillText =
                      typeof s === 'string' ? s : s?.skillName || s?.name || JSON.stringify(s);
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
                Ensure your verified student academic profile and uploaded PDF resume are accurate prior to submitting your application.
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
                {/* Reassurance for Paid Internships */}
                {isPaid && (
                  <div className="p-3 bg-[#FAFCFF] border border-[#4B32A6] rounded-sm text-xs space-y-1">
                    <strong className="text-[#4B32A6] block uppercase tracking-wide">
                      Participation Fee: ₹{internship.internshipFee} INR
                    </strong>
                    <p className="text-[#555555]">
                      No fee is charged upon submitting this application. You will only pay if you are selected by {internship.companyName}.
                    </p>
                  </div>
                )}

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
