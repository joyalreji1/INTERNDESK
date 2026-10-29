import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/Badge';
import {
  Building2,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [headquartersAddress, setHeadquartersAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('PENDING');

  const fetchProfile = async () => {
    try {
      const data = await api.getCompanyProfile();
      setCompanyName(data.companyName || '');
      setIndustry(data.industry || '');
      setCompanySize(data.companySize || 'MEDIUM');
      setDescription(data.description || '');
      setWebsite(data.website || '');
      setContactEmail(data.contactEmail || '');
      setContactPhone(data.contactPhone || '');
      setHeadquartersAddress(data.headquartersAddress || '');
      setCity(data.city || '');
      setState(data.state || '');
      setCountry(data.country || 'India');
      setRegistrationNumber(data.registrationNumber || '');
      setVerificationStatus(data.verificationStatus || 'PENDING');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load company profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await api.updateCompanyProfile({
        companyName,
        industry,
        companySize,
        description,
        website,
        contactEmail,
        contactPhone,
        headquartersAddress,
        city,
        state,
        country,
        registrationNumber,
      });
      setSuccessMsg('Employer profile records updated successfully.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update company profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-xs text-[#666666]">Loading employer profile records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Employer Organization Profile
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Maintain corporate identification, contact information, and verification status
          </p>
        </div>
        <div>
          <StatusBadge status={verificationStatus} size="sm" />
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
        {/* Section 1: Corporate Details */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
            1. Corporate Identification & Industry Scope
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="portal-label">Company / Entity Name *</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Industry Domain *</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                placeholder="Information Technology"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Company Size</label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="portal-input bg-white"
              >
                <option value="STARTUP">Startup (1-20 employees)</option>
                <option value="SMALL">Small (21-100 employees)</option>
                <option value="MEDIUM">Medium (101-500 employees)</option>
                <option value="LARGE">Large (501-5000 employees)</option>
                <option value="ENTERPRISE">Enterprise (5000+ employees)</option>
              </select>
            </div>

            <div>
              <label className="portal-label">Corporate Registration No. (CIN / Reg)</label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="U72200KL2020PTC012345"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Official Website URL</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://company.com"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Verification Standing</label>
              <input
                type="text"
                value={verificationStatus}
                disabled
                className="portal-input bg-[#FAFCFF] text-[#666666] font-semibold cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Location */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
            2. Contact Coordinates & Head Office
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="portal-label">Recruiter / Official Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="hr@company.com"
                className="portal-input"
              />
            </div>

            <div>
              <label className="portal-label">Contact Telephone</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 471 2345678"
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
              <label className="portal-label">State / Province</label>
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

            <div className="sm:col-span-3">
              <label className="portal-label">Head Office Address</label>
              <input
                type="text"
                value={headquartersAddress}
                onChange={(e) => setHeadquartersAddress(e.target.value)}
                placeholder="Technopark Phase 1, Trivandrum"
                className="portal-input"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Overview Description */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
            3. Organization Overview & Campus Profile
          </div>

          <div className="p-4">
            <label className="portal-label">Company Description for Students</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive summary of your technology focus, products, and internship environment..."
              className="portal-input"
            />
          </div>
        </div>

        <div className="p-3 bg-white border border-[#D4DCE6] rounded-sm flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D] flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Update Employer Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
