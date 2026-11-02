import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@/services/api';
import {
  ChevronLeft,
  Save,
  AlertCircle,
  Briefcase,
  Sparkles,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

export const CreateInternshipPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Software Development');
  const [workMode, setWorkMode] = useState('HYBRID');
  const [internshipType, setInternshipType] = useState<'FREE' | 'PAID'>('FREE');
  const [location, setLocation] = useState('Thiruvananthapuram, Kerala');
  const [durationMonths, setDurationMonths] = useState<number | ''>(3);
  const [openings, setOpenings] = useState<number | ''>(2);

  // Paid Parameters
  const [internshipFee, setInternshipFee] = useState<number | ''>(2500);
  const [currency, setCurrency] = useState('INR');
  const [refundPolicy, setRefundPolicy] = useState(
    'Full refund if cancelled before program commencement; 50% within first week; non-refundable thereafter.'
  );
  const [paymentDeadline, setPaymentDeadline] = useState(
    new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Stipend (if company offers stipend)
  const [hasStipend, setHasStipend] = useState(true);
  const [stipendMin, setStipendMin] = useState<number | ''>(15000);
  const [stipendMax, setStipendMax] = useState<number | ''>(20000);

  // Eligibility Parameters
  const [minimumCgpa, setMinimumCgpa] = useState<number | ''>(7.0);
  const [minimumPercentage, setMinimumPercentage] = useState<number | ''>(65);
  const [eligibleDegrees, setEligibleDegrees] = useState('B.Tech, M.Tech, MCA, BCA');
  const [eligibleDepartments, setEligibleDepartments] = useState('Computer Science, Information Technology, Electronics');
  const [eligibleSemesters, setEligibleSemesters] = useState('5, 6, 7, 8');
  const [requiredSkills, setRequiredSkills] = useState('Java, Spring Boot, React, MySQL');
  const [requiredCertifications, setRequiredCertifications] = useState('');
  const [resumeRequired, setResumeRequired] = useState(true);
  const [academicDocsRequired, setAcademicDocsRequired] = useState('College ID Card, Consolidated Grade Card');
  const [additionalConditions, setAdditionalConditions] = useState('No active backlogs allowed at the time of joining');

  const [applicationDeadline, setApplicationDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Title and description are required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const skills = requiredSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((skillName) => ({ skillName, isRequired: true }));

    const eligibilityPayload = {
      minimumCgpa: minimumCgpa !== '' ? Number(minimumCgpa) : undefined,
      minimumPercentage: minimumPercentage !== '' ? Number(minimumPercentage) : undefined,
      eligibleDegrees: eligibleDegrees.trim() || undefined,
      eligibleDepartments: eligibleDepartments.trim() || undefined,
      eligibleSemesters: eligibleSemesters.trim() || undefined,
      minimumSemester: 5,
      requiredSkills: requiredSkills.trim() || undefined,
      requiredCertifications: requiredCertifications.trim() || undefined,
      resumeRequired,
      academicDocumentRequirements: academicDocsRequired.trim() || undefined,
      additionalConditions: additionalConditions.trim() || undefined,
    };

    try {
      await api.createInternship({
        title: title.trim(),
        category,
        workMode,
        internshipType,
        location: location.trim(),
        durationMonths: durationMonths !== '' ? Number(durationMonths) : 3,
        openings: openings !== '' ? Number(openings) : 1,
        isPaid: hasStipend,
        stipendMin: hasStipend && stipendMin !== '' ? Number(stipendMin) : 0,
        stipendMax: hasStipend && stipendMax !== '' ? Number(stipendMax) : 0,
        internshipFee: internshipType === 'PAID' && internshipFee !== '' ? Number(internshipFee) : 0,
        currency: internshipType === 'PAID' ? currency : 'INR',
        refundPolicy: internshipType === 'PAID' ? refundPolicy.trim() : undefined,
        paymentDeadline: internshipType === 'PAID' ? paymentDeadline : undefined,
        minimumCgpa: minimumCgpa !== '' ? Number(minimumCgpa) : undefined,
        minimumSemester: 5,
        applicationDeadline,
        description: description.trim(),
        responsibilities: responsibilities.trim(),
        eligibilityCriteria: eligibilityCriteria.trim() || `${eligibleDegrees} | Min CGPA ${minimumCgpa}`,
        skills,
        eligibility: eligibilityPayload,
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
          Configure Free or Paid internship terms, automated student eligibility screening, and deadlines
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SECTION 1: INTERNSHIP TYPE (FREE vs PAID) */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm space-y-3">
          <div className="text-xs font-bold text-[#356F9D] uppercase tracking-wide border-b border-[#D4DCE6] pb-2">
            1. Select Internship Commercial Model
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label
              className={`p-3 border rounded-sm cursor-pointer flex items-start gap-3 transition-colors ${
                internshipType === 'FREE'
                  ? 'bg-[#EBF7EA] border-[#285C2A] text-[#285C2A]'
                  : 'bg-white border-[#D4DCE6] text-[#555555] hover:bg-[#FAFCFF]'
              }`}
            >
              <input
                type="radio"
                name="internshipType"
                value="FREE"
                checked={internshipType === 'FREE'}
                onChange={() => setInternshipType('FREE')}
                className="mt-1"
              />
              <div>
                <div className="font-bold text-xs uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Free Internship (No Student Fee)</span>
                </div>
                <p className="text-[11px] text-[#555555] mt-0.5 leading-relaxed">
                  Students do not pay any participation or registration fee. Candidate applications are evaluated strictly based on verified academic profile and skills.
                </p>
              </div>
            </label>

            <label
              className={`p-3 border rounded-sm cursor-pointer flex items-start gap-3 transition-colors ${
                internshipType === 'PAID'
                  ? 'bg-[#F3F0FA] border-[#4B32A6] text-[#4B32A6]'
                  : 'bg-white border-[#D4DCE6] text-[#555555] hover:bg-[#FAFCFF]'
              }`}
            >
              <input
                type="radio"
                name="internshipType"
                value="PAID"
                checked={internshipType === 'PAID'}
                onChange={() => setInternshipType('PAID')}
                className="mt-1"
              />
              <div>
                <div className="font-bold text-xs uppercase flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Paid Internship (Student Fee Required)</span>
                </div>
                <p className="text-[11px] text-[#555555] mt-0.5 leading-relaxed">
                  Students pay a clearly disclosed participation fee through our secure Razorpay gateway <em>only after selection</em>.
                </p>
              </div>
            </label>
          </div>

          {/* Conditional Paid Settings */}
          {internshipType === 'PAID' && (
            <div className="mt-3 p-3 bg-[#FAFCFF] border border-[#D2CCEC] rounded-sm space-y-3">
              <div className="font-bold text-xs text-[#4B32A6] uppercase tracking-wide">
                Paid Internship Commercial Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">
                    Internship Participation Fee (INR) <span className="text-[#C94242]">*</span>
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={internshipFee}
                    onChange={(e) => setInternshipFee(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">
                    Currency Code
                  </label>
                  <input
                    type="text"
                    value={currency}
                    disabled
                    className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm bg-[#F5F7FA] font-mono text-[#666666]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">
                    Student Payment Deadline
                  </label>
                  <input
                    type="date"
                    value={paymentDeadline}
                    onChange={(e) => setPaymentDeadline(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">
                  Refund & Cancellation Policy <span className="text-[#C94242]">*</span>
                </label>
                <textarea
                  rows={2}
                  value={refundPolicy}
                  onChange={(e) => setRefundPolicy(e.target.value)}
                  placeholder="Detail clear conditions for candidate cancellation or fee refund..."
                  required
                  className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: CORE VACANCY PARAMETERS */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm space-y-3">
          <div className="text-xs font-bold text-[#356F9D] uppercase tracking-wide border-b border-[#D4DCE6] pb-2">
            2. Vacancy Parameters
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Internship Title <span className="text-[#C94242]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Java Backend Engineering Intern"
                required
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Domain / Industry Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm bg-white"
              >
                <option value="Software Development">Software Development</option>
                <option value="Artificial Intelligence / ML">Artificial Intelligence / ML</option>
                <option value="Data Science & Analytics">Data Science & Analytics</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="UI/UX Design">UI/UX Design</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm bg-white"
              >
                <option value="HYBRID">Hybrid (Workplace & Remote)</option>
                <option value="REMOTE">Remote (100% Online)</option>
                <option value="ONSITE">Onsite (Office Presence)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">Office Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">Duration (Months)</label>
              <input
                type="number"
                min="1"
                max="24"
                value={durationMonths}
                onChange={(e) => setDurationMonths(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">Open Vacancies</label>
              <input
                type="number"
                min="1"
                value={openings}
                onChange={(e) => setOpenings(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">Monthly Stipend (INR)</label>
              <input
                type="number"
                value={stipendMin}
                onChange={(e) => setStipendMin(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0 if unpaid"
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">Application Deadline</label>
              <input
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: AUTOMATED ELIGIBILITY SPECIFICATION */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm space-y-3">
          <div className="text-xs font-bold text-[#356F9D] uppercase tracking-wide border-b border-[#D4DCE6] pb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#356F9D]" />
            <span>3. Academic Eligibility & Screening Rules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Minimum CGPA (Scale 0-10)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={minimumCgpa}
                onChange={(e) => setMinimumCgpa(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Minimum Academic Percentage (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={minimumPercentage}
                onChange={(e) => setMinimumPercentage(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Eligible Degrees (Comma separated)
              </label>
              <input
                type="text"
                value={eligibleDegrees}
                onChange={(e) => setEligibleDegrees(e.target.value)}
                placeholder="B.Tech, M.Tech, MCA, BCA"
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Eligible Departments / Branches
              </label>
              <input
                type="text"
                value={eligibleDepartments}
                onChange={(e) => setEligibleDepartments(e.target.value)}
                placeholder="Computer Science, Information Technology, Electronics"
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Eligible Semesters (e.g. 5, 6, 7, 8)
              </label>
              <input
                type="text"
                value={eligibleSemesters}
                onChange={(e) => setEligibleSemesters(e.target.value)}
                placeholder="5, 6, 7, 8"
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Mandatory PDF Resume
              </label>
              <div className="flex items-center gap-2 pt-1.5">
                <input
                  type="checkbox"
                  id="resumeReqCheck"
                  checked={resumeRequired}
                  onChange={(e) => setResumeRequired(e.target.checked)}
                />
                <label htmlFor="resumeReqCheck" className="text-xs text-[#555555]">
                  Require verified PDF resume upload before applying
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Required Technical Skills (Screened against student profile)
              </label>
              <input
                type="text"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                placeholder="Java, Spring Boot, React, MySQL"
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: DETAILED DESCRIPTIONS */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm space-y-3">
          <div className="text-xs font-bold text-[#356F9D] uppercase tracking-wide border-b border-[#D4DCE6] pb-2">
            4. Role Overview & Responsibilities
          </div>

          <div>
            <label className="block text-xs font-bold text-[#333333] mb-1">
              Internship Overview <span className="text-[#C94242]">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the team, technologies, and internship deliverables..."
              required
              className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#333333] mb-1">
              Key Responsibilities
            </label>
            <textarea
              rows={3}
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              placeholder="List daily tasks, coding expectations, code reviews, and meetings..."
              className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Link
            to="/company/internships"
            className="px-4 py-2 bg-white border border-[#D4DCE6] text-[#333333] font-medium text-xs rounded-sm hover:bg-[#F5F7FA]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold text-xs rounded-sm border border-[#356F9D] shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{submitting ? 'Publishing Vacancy...' : 'Publish Internship Opportunity'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
