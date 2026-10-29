import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import {
  User,
  GraduationCap,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [degree, setDegree] = useState('');
  const [department, setDepartment] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [currentSemester, setCurrentSemester] = useState<number | ''>('');
  const [graduationYear, setGraduationYear] = useState<number | ''>('');
  const [cgpa, setCgpa] = useState<number | ''>('');
  const [professionalSummary, setProfessionalSummary] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const loadProfile = async () => {
    try {
      const data = await api.getStudentProfile();
      setFullName(data.fullName || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setRegistrationNumber(data.registrationNumber || '');
      setCollegeName(data.collegeName || '');
      setUniversityName(data.universityName || '');
      setDegree(data.degree || '');
      setDepartment(data.department || '');
      setSpecialization(data.specialization || '');
      setCurrentSemester(data.currentSemester || '');
      setGraduationYear(data.graduationYear || '');
      setCgpa(data.cgpa || '');
      setProfessionalSummary(data.professionalSummary || '');
      setCity(data.city || '');
      setState(data.state || '');
      setCountry(data.country || 'India');
      setLinkedinUrl(data.linkedinUrl || '');
      setGithubUrl(data.githubUrl || '');
      setPortfolioUrl(data.portfolioUrl || '');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load student profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await api.updateStudentProfile({
        fullName,
        phone,
        registrationNumber,
        collegeName,
        universityName,
        degree,
        department,
        specialization,
        currentSemester: currentSemester !== '' ? Number(currentSemester) : undefined,
        graduationYear: graduationYear !== '' ? Number(graduationYear) : undefined,
        cgpa: cgpa !== '' ? Number(cgpa) : undefined,
        professionalSummary,
        city,
        state,
        country,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
      });
      setSuccessMsg('Profile records updated successfully in database.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile records.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-xs text-[#666666]">Loading student academic profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex items-center justify-between">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Student Profile Management
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Maintain your verified academic records, contact info, and career portfolio
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-[#DDEED8] border border-[#BFDDB7] text-[#285C2A] text-xs rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 1: Academic & University Credentials */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6] flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>1. Academic Enrollment & College Records</span>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="portal-label">University Reg. / Roll Number</label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. TRV22CS045"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">College / Institute Name</label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="College of Engineering"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Affiliated University</label>
              <input
                type="text"
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                placeholder="State Technological University"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Degree Program</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="B.Tech / B.E."
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Branch / Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Computer Science & Engineering"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Current Semester</label>
              <select
                value={currentSemester}
                onChange={(e) => setCurrentSemester(e.target.value ? Number(e.target.value) : '')}
                className="portal-input bg-white"
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="portal-label">Graduation Year</label>
              <input
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value ? Number(e.target.value) : '')}
                placeholder="2026"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Cumulative GPA (CGPA)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 8.65"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Specialization / Minor</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Artificial Intelligence"
                className="portal-input"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Personal & Contact Information */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6] flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>2. Personal & Contact Details</span>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="portal-label">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Registered Email (Read Only)</label>
              <input
                type="email"
                value={email}
                disabled
                className="portal-input bg-[#FAFCFF] text-[#888888] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="portal-label">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Thiruvananthapuram"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Kerala"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="portal-input"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Summary & Portfolio Links */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6] flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>3. Academic Summary & Online Portfolio Links</span>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <label className="portal-label">Career Statement / Summary</label>
              <textarea
                rows={3}
                value={professionalSummary}
                onChange={(e) => setProfessionalSummary(e.target.value)}
                placeholder="Brief summary of your technical interests, skills, and internship objectives..."
                className="portal-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="portal-label">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="portal-input"
                />
              </div>

              <div>
                <label className="portal-label">GitHub Profile URL</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="portal-input"
                />
              </div>

              <div>
                <label className="portal-label">Portfolio / Project URL</label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://portfolio.dev"
                  className="portal-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button Strip */}
        <div className="p-3 bg-white border border-[#D4DCE6] rounded-sm flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D] flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving Records...' : 'Save Profile Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
