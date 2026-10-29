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
} from 'lucide-react';

export const StudentInternshipsPage: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  // Apply Modal State
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | undefined>(undefined);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchInternships = async (search?: string) => {
    setLoading(true);
    try {
      const res = await api.getInternships({ query: search || undefined, size: 25 });
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
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInternships(query.trim());
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
            Browse Active Internships
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Discover campus-approved vacancies and apply directly
          </p>
        </div>
        <div className="text-xs text-[#FFF0CE] font-mono">
          Available Listings: <strong>{internships.length}</strong>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm p-3 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl">
          <input
            type="text"
            placeholder="Search by keywords, title, skills, or organization..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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

      {/* Internships Data Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Notice ID</th>
                <th>Internship Title</th>
                <th>Hiring Company</th>
                <th>Location</th>
                <th>Work Mode</th>
                <th>Duration</th>
                <th>Stipend</th>
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
                    No internship postings matched your query.
                  </td>
                </tr>
              ) : (
                internships.map((int) => (
                  <tr key={int.id}>
                    <td className="font-mono text-xs text-[#666666]">INT-{String(int.id).padStart(4, '0')}</td>
                    <td className="font-semibold text-[#356F9D]">
                      <Link to={`/internships/${int.id}`} className="hover:underline">
                        {int.title}
                      </Link>
                    </td>
                    <td className="font-medium">{int.companyName}</td>
                    <td>{int.location}</td>
                    <td>
                      <StatusBadge status={int.workMode} size="sm" />
                    </td>
                    <td>{int.durationMonths || 3} Months</td>
                    <td className="font-semibold text-[#285C2A]">
                      {int.stipendMin ? `₹${int.stipendMin.toLocaleString()}/mo` : 'Unpaid'}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Modal */}
      {selectedInternship && (
        <Modal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          title={`Submit Application: ${selectedInternship.title}`}
          description={`Employer: ${selectedInternship.companyName}`}
          maxWidth="md"
        >
          {submitSuccess ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#285C2A] mx-auto" />
              <h4 className="text-sm font-bold text-[#285C2A]">Application Successfully Submitted</h4>
              <p className="text-xs text-[#555555]">
                Your application has been registered with the hiring company.
              </p>
            </div>
          ) : (
            <form onSubmit={handleConfirmApply} className="space-y-3">
              {submitError && (
                <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <div>
                <label className="portal-label">Select Registered PDF Resume</label>
                {resumes.length === 0 ? (
                  <div className="p-3 bg-[#FFF0CE] border border-[#E6D3A3] text-[#855A00] text-xs rounded-sm">
                    No resume files uploaded.{' '}
                    <Link to="/student/resume" className="font-bold underline">
                      Upload in Resume Manager
                    </Link>{' '}
                    or submit with your default profile data.
                  </div>
                ) : (
                  <select
                    value={selectedResumeId || ''}
                    onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                    className="portal-input bg-white"
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
                <label className="portal-label">Applicant Statement (Optional)</label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Mention your relevant course projects, technical interests, and why you are applying..."
                  className="portal-input"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#D4DCE6]">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-3 py-1.5 bg-white border border-[#D4DCE6] text-[#333333] text-xs font-medium rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D] disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Confirm & Apply'}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
