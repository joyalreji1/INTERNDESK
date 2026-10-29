import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '@/services/api';
import {
  ChevronLeft,
  Save,
  AlertCircle,
} from 'lucide-react';

export const EditInternshipPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Software Development');
  const [workMode, setWorkMode] = useState('HYBRID');
  const [internshipType, setInternshipType] = useState('FULL_TIME');
  const [location, setLocation] = useState('');
  const [durationMonths, setDurationMonths] = useState<number | ''>(3);
  const [openings, setOpenings] = useState<number | ''>(1);
  const [isPaid, setIsPaid] = useState(true);
  const [stipendMin, setStipendMin] = useState<number | ''>(0);
  const [stipendMax, setStipendMax] = useState<number | ''>(0);
  const [minimumCgpa, setMinimumCgpa] = useState<number | ''>('');
  const [minimumSemester, setMinimumSemester] = useState<number | ''>('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [skillsInput, setSkillsInput] = useState('');

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        if (!id) return;
        const data = await api.getInternship(Number(id));
        setTitle(data.title || '');
        setCategory(data.category || 'Software Development');
        setWorkMode(data.workMode || 'HYBRID');
        setInternshipType(data.internshipType || 'FULL_TIME');
        setLocation(data.location || '');
        setDurationMonths(data.durationMonths || 3);
        setOpenings(data.openings || data.vacancies || 1);
        setIsPaid(data.isPaid ?? true);
        setStipendMin(data.stipendMin !== undefined ? data.stipendMin : (data.stipendAmount || 0));
        setStipendMax(data.stipendMax || 0);
        setMinimumCgpa(data.minimumCgpa || '');
        setMinimumSemester(data.minimumSemester || '');
        const deadlineVal = data.applicationDeadline || data.deadline || '';
        setApplicationDeadline(deadlineVal ? deadlineVal.split('T')[0] : '');
        setDescription(data.description || '');
        setResponsibilities(data.responsibilities || '');
        setEligibilityCriteria(data.eligibilityCriteria || data.requirements || '');

        if (Array.isArray(data.skills)) {
          const sText = data.skills
            .map((s: any) => typeof s === 'string' ? s : (s?.skillName || s?.name || ''))
            .filter(Boolean)
            .join(', ');
          setSkillsInput(sText);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load internship details');
      } finally {
        setLoading(false);
      }
    };
    fetchExisting();
  }, [id]);

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
      if (!id) return;
      await api.updateInternship(Number(id), {
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
      setErrorMsg(err.message || 'Failed to update internship posting.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-xs text-[#666666]">Loading internship details...</div>
      </div>
    );
  }

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
          Edit Internship Opportunity (INT-{String(id).padStart(4, '0')})
        </h1>
        <p className="text-xs text-[#EAF2FC]">
          Modify position parameters, requirements, stipend, or deadlines
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
                className="portal-input"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Duration & Compensation */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
            2. Duration, Compensation & Schedule
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
              <label className="portal-label">Vacancies *</label>
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
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Application Deadline</label>
              <input
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                className="portal-input"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Text Descriptions */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
            3. Job Description & Responsibilities
          </div>

          <div className="p-4 space-y-3">
            <div>
              <label className="portal-label">Role Description *</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Key Responsibilities</label>
              <textarea
                rows={3}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Eligibility Criteria</label>
              <textarea
                rows={3}
                value={eligibilityCriteria}
                onChange={(e) => setEligibilityCriteria(e.target.value)}
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Required Skills (Comma separated)</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. Java, Spring Boot, MySQL, React"
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
            <span>{submitting ? 'Updating...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
