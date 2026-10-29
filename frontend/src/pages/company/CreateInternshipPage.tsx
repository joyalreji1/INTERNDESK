import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@/services/api';
import {
  ChevronLeft,
  Save,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

export const CreateInternshipPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Software Development');
  const [workMode, setWorkMode] = useState('HYBRID');
  const [internshipType, setInternshipType] = useState('FULL_TIME');
  const [location, setLocation] = useState('Thiruvananthapuram, Kerala');
  const [durationMonths, setDurationMonths] = useState<number | ''>(3);
  const [openings, setOpenings] = useState<number | ''>(2);
  const [isPaid, setIsPaid] = useState(true);
  const [stipendMin, setStipendMin] = useState<number | ''>(15000);
  const [stipendMax, setStipendMax] = useState<number | ''>(20000);
  const [minimumCgpa, setMinimumCgpa] = useState<number | ''>(7.0);
  const [minimumSemester, setMinimumSemester] = useState<number | ''>(5);
  const [applicationDeadline, setApplicationDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [skillsInput, setSkillsInput] = useState('Java, Spring Boot, React, MySQL');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Title and description are required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((skillName) => ({ skillName, isRequired: true }));

    try {
      await api.createInternship({
        title: title.trim(),
        category,
        workMode,
        internshipType,
        location: location.trim(),
        durationMonths: durationMonths !== '' ? Number(durationMonths) : 3,
        openings: openings !== '' ? Number(openings) : 1,
        isPaid,
        stipendMin: isPaid && stipendMin !== '' ? Number(stipendMin) : 0,
        stipendMax: isPaid && stipendMax !== '' ? Number(stipendMax) : 0,
        minimumCgpa: minimumCgpa !== '' ? Number(minimumCgpa) : undefined,
        minimumSemester: minimumSemester !== '' ? Number(minimumSemester) : undefined,
        applicationDeadline,
        description: description.trim(),
        responsibilities: responsibilities.trim(),
        eligibilityCriteria: eligibilityCriteria.trim(),
        skills,
      });

      navigate('/company/internships');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish internship vacancy.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Link
          to="/company/internships"
          className="text-xs text-[#4779B8] font-bold hover:underline inline-flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Manage Listings</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E]">
        <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
          Publish New Internship Opportunity
        </h1>
        <p className="text-xs text-[#EAF2FC]">
          Enter complete job parameters, eligibility requirements, and deadlines
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 1: Basic Role Classification */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
            1. Role Title & Classification
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="portal-label">Internship Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Java Backend Developer Intern"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Industry Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="portal-input bg-white"
              >
                <option value="Software Development">Software Development</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Engineering">Data Engineering</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Embedded & IoT">Embedded & IoT</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
              </select>
            </div>

            <div>
              <label className="portal-label">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="portal-input bg-white"
              >
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite</option>
              </select>
            </div>

            <div>
              <label className="portal-label">Engagement Type</label>
              <select
                value={internshipType}
                onChange={(e) => setInternshipType(e.target.value)}
                className="portal-input bg-white"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
              </select>
            </div>

            <div>
              <label className="portal-label">Job Location *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="Thiruvananthapuram, Kerala"
                className="portal-input"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Stipend, Duration & Criteria */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
            2. Duration, Compensation & Eligibility Criteria
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="portal-label">Duration (Months) *</label>
              <input
                type="number"
                min="1"
                max="12"
                value={durationMonths}
                onChange={(e) => setDurationMonths(e.target.value ? Number(e.target.value) : '')}
                required
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Vacancies / Openings *</label>
              <input
                type="number"
                min="1"
                value={openings}
                onChange={(e) => setOpenings(e.target.value ? Number(e.target.value) : '')}
                required
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Monthly Stipend (₹) *</label>
              <input
                type="number"
                min="0"
                value={stipendMin}
                onChange={(e) => setStipendMin(e.target.value ? Number(e.target.value) : '')}
                placeholder="15000"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Application Deadline *</label>
              <input
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                required
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Minimum CGPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={minimumCgpa}
                onChange={(e) => setMinimumCgpa(e.target.value ? Number(e.target.value) : '')}
                placeholder="7.0"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Minimum Semester</label>
              <input
                type="number"
                min="1"
                max="8"
                value={minimumSemester}
                onChange={(e) => setMinimumSemester(e.target.value ? Number(e.target.value) : '')}
                placeholder="5"
                className="portal-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="portal-label">Required Skills (Comma separated)</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Java, Spring Boot, React, MySQL"
                className="portal-input"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Text Descriptions */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
            3. Job Description, Responsibilities & Deliverables
          </div>

          <div className="p-4 space-y-3">
            <div>
              <label className="portal-label">Role Description *</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Detailed summary of the role, team environment, and internship goals..."
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Key Responsibilities</label>
              <textarea
                rows={3}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                placeholder="List day-to-day duties, feature development, bug fixes, or documentation tasks..."
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Eligibility Criteria & Coursework</label>
              <textarea
                rows={3}
                value={eligibilityCriteria}
                onChange={(e) => setEligibilityCriteria(e.target.value)}
                placeholder="Specific course requirements, degrees eligible, or prerequisite knowledge..."
                className="portal-input"
              />
            </div>
          </div>
        </div>

        <div className="p-3 bg-white border border-[#D4DCE6] rounded-sm flex justify-end gap-2">
          <Link
            to="/company/internships"
            className="px-4 py-1.5 bg-white border border-[#D4DCE6] text-[#333333] text-xs font-medium rounded-sm hover:bg-[#F5F7FA]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D] flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{submitting ? 'Publishing...' : 'Publish Internship Opportunity'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
