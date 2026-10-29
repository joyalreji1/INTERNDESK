import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  CheckCircle2,
  Save,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);

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
          Institutional Platform Configuration
        </h1>
        <p className="text-xs text-[#EAF2FC]">
          Database specifications, authentication policies, and college system parameters
        </p>
      </div>

      {success && (
        <div className="p-3 bg-[#DDEED8] border border-[#BFDDB7] text-[#285C2A] text-xs rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Configuration parameters updated successfully.</span>
        </div>
      )}

      {/* Backend & DB Specifications Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
          Backend & Relational Database Specifications
        </div>

        <table className="portal-table">
          <tbody>
            <tr>
              <td className="w-1/3 font-bold bg-[#FAFCFF]">Database Engine</td>
              <td className="font-mono text-xs text-[#356F9D] font-bold">
                MySQL 8.0 (InnoDB, utf8mb4_unicode_ci)
              </td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Zero-Config Fallback Profile</td>
              <td className="font-mono text-xs">Embedded H2 In-Memory (MODE=MySQL)</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Database Migrations</td>
              <td className="font-mono text-xs">Flyway (V1__create_schema.sql, V2__seed_data.sql)</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Java Backend Stack</td>
              <td className="font-mono text-xs">Java 21 LTS + Spring Boot 3.2.5 + Spring Security</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Authentication Mechanism</td>
              <td className="font-mono text-xs">Stateless JWT (HMAC-SHA256) + BCrypt Password Hasher</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Academic Course Assignment</td>
              <td className="font-semibold text-[#285C2A]">
                B.Tech Computer Science & Engineering (S3 Java Mini Project)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Administrator Account Details */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
          Current Administrator Session
        </div>

        <table className="portal-table">
          <tbody>
            <tr>
              <td className="w-1/3 font-bold bg-[#FAFCFF]">Administrator Name</td>
              <td className="font-semibold">{user?.fullName}</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Registered Email</td>
              <td>{user?.email}</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">System Role</td>
              <td>
                <span className="px-2 py-0.5 bg-[#EAF2FC] text-[#356F9D] font-bold text-xs rounded-sm border border-[#B8C6D6]">
                  {user?.role}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* System Policy Form */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm p-4 space-y-3">
        <div className="text-xs font-bold text-[#356F9D] uppercase border-b border-[#D4DCE6] pb-1">
          Campus Recruitment Policies
        </div>

        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="rounded-sm text-[#4779B8] focus:ring-[#4779B8]"
            />
            <span className="text-[#333333]">
              Enforce corporate accreditation before publishing internship postings to students
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="rounded-sm text-[#4779B8] focus:ring-[#4779B8]"
            />
            <span className="text-[#333333]">
              Strict duplicate application prevention (One application per student per internship)
            </span>
          </label>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold text-xs rounded-sm border border-[#356F9D] transition-colors"
            >
              Update Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
