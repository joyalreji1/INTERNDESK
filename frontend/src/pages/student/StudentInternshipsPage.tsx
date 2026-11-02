import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Internship, ResumeFile } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  Search,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Sparkles,
  Info,
} from 'lucide-react';

export const StudentInternshipsPage: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  // Apply Modal State
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | undefined>(undefined);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchInternships = async (search?: string, type?: 'ALL' | 'FREE' | 'PAID') => {
    setLoading(true);
    try {
      const activeType = type !== undefined ? type : typeFilter;
      const params: any = { size: 30 };
      if (search) params.query = search;
      if (activeType !== 'ALL') params.internshipType = activeType;

      const res = await api.getInternships(params);
      const list = res.content || res || [];
      setInternships(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load internships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships(query, typeFilter);
  }, [typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInternships(query.trim(), typeFilter);
  };

  const handleOpenApply = async (internship: Internship) => {
    setSelectedInternship(internship);
    setSubmitError(null);
    setSubmitSuccess(false);
    setCoverLetter('');
    setApplyModalOpen(true);

    try {
      const userResumes = await api.getResumes();
      setResumes(userResumes || []);
      const primary = userResumes?.find((r: ResumeFile) => r.isPrimary);
      if (primary) setSelectedResumeId(primary.id);
      else if (userResumes && userResumes.length > 0) setSelectedResumeId(userResumes[0].id);
    } catch (err) {
      // Ignored
    }
  };

  const handleConfirmApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInternship) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      await api.applyForInternship(selectedInternship.id, {
        resumeId: selectedResumeId,
        coverLetter: coverLetter.trim() || undefined,
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setApplyModalOpen(false);
      }, 1500);
    } catch (err: any) {
      setSubmitError(err.message || 'Application could not be processed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Browse Campus & Industry Internships
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Explore Free & Paid opportunities with automated eligibility screening
          </p>
        </div>
        <div className="text-xs text-[#FFF0CE] font-mono">
          Available Listings: <strong>{internships.length}</strong>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm p-3 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Free vs Paid Filter Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-sm border transition-colors ${
                typeFilter === 'ALL'
                  ? 'bg-[#356F9D] text-white border-[#28587E]'
                  : 'bg-white text-[#555555] border-[#D4DCE6] hover:bg-[#F5F7FA]'
              }`}
            >
              All Internships
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('FREE')}
              className={`px-3 py-1.5 text-xs font-bold rounded-sm border transition-colors flex items-center gap-1 ${
                typeFilter === 'FREE'
                  ? 'bg-[#285C2A] text-white border-[#1E4620]'
                  : 'bg-white text-[#285C2A] border-[#BFDDB7] hover:bg-[#EBF7EA]'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>100% Free Internships</span>
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('PAID')}
              className={`px-3 py-1.5 text-xs font-bold rounded-sm border transition-colors flex items-center gap-1 ${
                typeFilter === 'PAID'
                  ? 'bg-[#4B32A6] text-white border-[#382482]'
                  : 'bg-white text-[#4B32A6] border-[#D2CCEC] hover:bg-[#F3F0FA]'
              }`}
            >
              <CreditCard className="w-3 h-3" />
              <span>Paid Participation Internships</span>
            </button>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by keywords, title, skills..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 sm:w-64 px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
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
      </div>

      {/* Internships Data Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Notice ID</th>
                <th>Internship Title</th>
                <th>Category / Type</th>
                <th>Hiring Company</th>
                <th>Work Mode</th>
                <th>Duration</th>
                <th>Stipend / Fee</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-[#666666]">
                    Loading approved internship listings...
                  </td>
                </tr>
              ) : internships.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-[#666666]">
                    No internship postings matched your criteria.
                  </td>
                </tr>
              ) : (
                internships.map((int) => {
                  const isPaid = int.internshipType === 'PAID' || (int.internshipFee && int.internshipFee > 0);
                  return (
                    <tr key={int.id}>
                      <td className="font-mono text-xs text-[#666666]">
                        INT-{String(int.id).padStart(4, '0')}
                      </td>
                      <td className="font-semibold text-[#356F9D]">
                        <Link to={`/internships/${int.id}`} className="hover:underline">
                          {int.title}
                        </Link>
                      </td>
                      <td>
                        {isPaid ? (
                          <span className="px-2 py-0.5 bg-[#F3F0FA] text-[#4B32A6] border border-[#D2CCEC] font-bold text-[10px] rounded-sm uppercase tracking-wide">
                            PAID · ₹{int.internshipFee} FEE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-[#EBF7EA] text-[#285C2A] border border-[#BFDDB7] font-bold text-[10px] rounded-sm uppercase tracking-wide">
                            FREE
                          </span>
                        )}
                      </td>
                      <td className="font-medium">{int.companyName}</td>
                      <td>
                        <StatusBadge status={int.workMode} size="sm" />
                      </td>
                      <td>{int.durationMonths || 3} Months</td>
                      <td>
                        {isPaid ? (
                          <div className="font-mono text-xs">
                            <span className="text-[#4B32A6] font-bold">Fee: ₹{int.internshipFee}</span>
                            {int.stipendMin ? (
                              <div className="text-[10px] text-[#285C2A]">
                                Stipend: ₹{int.stipendMin}/mo
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <span className="font-mono font-bold text-[#285C2A]">
                            {int.stipendMin ? `₹${int.stipendMin.toLocaleString()}/mo` : 'No Fee (Free)'}
                          </span>
                        )}
                      </td>
                      <td className="text-xs text-[#555555]">
                        {int.applicationDeadline ? new Date(int.applicationDeadline).toLocaleDateString() : 'Rolling'}
                      </td>
                      <td className="space-x-1.5 whitespace-nowrap">
                        <Link
                          to={`/internships/${int.id}`}
                          className="px-2 py-0.5 bg-white hover:bg-[#F5F7FA] text-[#333333] text-xs font-medium rounded-sm border border-[#D4DCE6] inline-block"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenApply(int)}
                          className="px-2 py-0.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-semibold rounded-sm border border-[#356F9D]"
                        >
                          Apply
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={selectedInternship ? `Apply: ${selectedInternship.title}` : 'Submit Application'}
        description={`Organization: ${selectedInternship?.companyName}`}
        maxWidth="md"
      >
        {submitSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#285C2A] mx-auto" />
            <h4 className="text-sm font-bold text-[#285C2A]">Application Submitted Successfully</h4>
            <p className="text-xs text-[#555555]">
              Your application has been registered with {selectedInternship?.companyName}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmApply} className="space-y-4 text-xs">
            {submitError && (
              <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Paid Internship Notice */}
            {selectedInternship &&
              (selectedInternship.internshipType === 'PAID' ||
                (selectedInternship.internshipFee && selectedInternship.internshipFee > 0)) && (
                <div className="p-3 bg-[#FAFCFF] border border-[#356F9D] rounded-sm space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#356F9D]">
                    <Info className="w-4 h-4" />
                    <span>Important: Application is 100% Free</span>
                  </div>
                  <p className="text-[#555555]">
                    This is a paid internship opportunity (Enrollment Fee: ₹{selectedInternship.internshipFee} INR).{' '}
                    <strong>You do NOT pay anything now.</strong> Applications are free; fees are only payable after you are reviewed and selected by the company.
                  </p>
                </div>
              )}

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Select Uploaded PDF Resume
              </label>
              {resumes.length === 0 ? (
                <div className="p-3 bg-[#FFF0CE] border border-[#E6D3A3] text-[#855A00] text-xs rounded-sm">
                  No uploaded resume found in profile. Please upload one under{' '}
                  <Link to="/student/resume" className="font-bold underline">
                    Resume Manager
                  </Link>.
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
                Statement / Cover Note (Optional)
              </label>
              <textarea
                rows={3}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Mention coursework, semester, projects, and motivation..."
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#D4DCE6]">
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="px-3 py-1.5 bg-white border border-[#D4DCE6] text-[#333333] font-medium rounded-sm hover:bg-[#F5F7FA]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold rounded-sm border border-[#356F9D] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Confirm & Apply'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
