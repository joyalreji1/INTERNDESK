import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Settings,
  User,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const StudentSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [statusNotifications, setStatusNotifications] = useState(true);

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
          Student Account & Preferences
        </h1>
        <p className="text-xs text-[#EAF2FC]">
          Manage account security, session credentials, and portal preferences
        </p>
      </div>

      {success && (
        <div className="p-3 bg-[#DDEED8] border border-[#BFDDB7] text-[#285C2A] text-xs rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Account preferences saved successfully.</span>
        </div>
      )}

      {/* Account Info Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
          Student Account Dossier
        </div>

        <table className="portal-table">
          <tbody>
            <tr>
              <td className="w-1/3 font-bold bg-[#FAFCFF]">Full Registered Name</td>
              <td className="font-semibold">{user?.fullName}</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Registered Email Address</td>
              <td>{user?.email}</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Portal System Role</td>
              <td>
                <span className="px-2 py-0.5 bg-[#EAF2FC] text-[#356F9D] font-bold text-xs rounded-sm border border-[#B8C6D6]">
                  {user?.role}
                </span>
              </td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Account Security Status</td>
              <td className="text-[#285C2A] font-semibold">Active & Verified</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm p-4 space-y-3">
        <div className="text-xs font-bold text-[#356F9D] uppercase border-b border-[#D4DCE6] pb-1">
          Notification Preferences
        </div>

        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded-sm text-[#4779B8] focus:ring-[#4779B8]"
            />
            <span className="text-[#333333]">Receive application review and interview updates</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={statusNotifications}
              onChange={(e) => setStatusNotifications(e.target.checked)}
              className="rounded-sm text-[#4779B8] focus:ring-[#4779B8]"
            />
            <span className="text-[#333333]">Receive announcements when new internships matching your department are posted</span>
          </label>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold text-xs rounded-sm border border-[#356F9D] transition-colors"
            >
              Update Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
