import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, Save } from 'lucide-react';

export const CompanySettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [applicantAlerts, setApplicantAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E]">
        <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
          Employer Recruiter Settings
        </h1>
        <p className="text-xs text-[#EAF2FC]">
          Manage recruiter access parameters, application notifications, and credentials
        </p>
      </div>

      {success && (
        <div className="p-3 bg-[#DDEED8] border border-[#BFDDB7] text-[#285C2A] text-xs rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      {/* Recruiter Account Dossier */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
          Authorized Recruiter Account Overview
        </div>

        <table className="portal-table">
          <tbody>
            <tr>
              <td className="w-1/3 font-bold bg-[#FAFCFF]">Recruiter Name</td>
              <td className="font-semibold">{user?.fullName}</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Official Contact Email</td>
              <td>{user?.email}</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Assigned System Role</td>
              <td>
                <span className="px-2 py-0.5 bg-[#EAF2FC] text-[#356F9D] font-bold text-xs rounded-sm border border-[#B8C6D6]">
                  {user?.role}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notification Controls */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm p-4 space-y-3">
        <div className="text-xs font-bold text-[#356F9D] uppercase border-b border-[#D4DCE6] pb-1">
          Notification Preferences
        </div>

        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={applicantAlerts}
              onChange={(e) => setApplicantAlerts(e.target.checked)}
              className="rounded-sm text-[#4779B8] focus:ring-[#4779B8]"
            />
            <span className="text-[#333333]">
              Send email alerts whenever a student candidate applies for your published internships
            </span>
          </label>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold text-xs rounded-sm border border-[#356F9D] transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
