import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  ChevronRight,
  LogIn,
  UserPlus,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-[85vh] bg-[#F5F7FA]">
      {/* 1. Institutional Welcome Header */}
      <section className="bg-[#356F9D] text-white border-b border-[#28587E] py-10 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="flex justify-center mb-2">
            <Logo size="lg" lightText={true} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-normal">
            Centralized Internship Management System
          </h1>
          <p className="text-sm sm:text-base text-[#EAF2FC] max-w-2xl mx-auto leading-relaxed">
            An institutional platform connecting students, verified employers, and college administrators for structured internship discovery, applications, and recruitment governance.
          </p>
        </div>
      </section>

      {/* 2. Three Dedicated Stakeholder Portals */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 1 — STUDENT PORTAL */}
          <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#4779B8] transition-colors">
            <div>
              <div className="bg-[#356F9D] text-white px-5 py-3 border-b border-[#28587E] flex items-center gap-2.5">
                <GraduationCap className="w-5 h-5 text-[#FFF0CE]" />
                <h2 className="text-sm font-bold uppercase tracking-wide">Student Portal</h2>
              </div>
              <div className="p-6">
                <p className="text-xs text-[#555555] leading-relaxed">
                  Explore verified internship vacancies, maintain your academic profile dossier, upload PDF resumes, and track your application progress through each recruitment stage.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-2.5 border-t border-[#EDF2F7] mt-2">
              <Link
                to="/login"
                className="w-full py-2 px-4 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold text-xs rounded-sm border border-[#356F9D] flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Student Login</span>
              </Link>
              <Link
                to="/register"
                className="w-full py-2 px-4 bg-white hover:bg-[#F5F7FA] text-[#356F9D] font-bold text-xs rounded-sm border border-[#D4DCE6] flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Student Registration</span>
              </Link>
            </div>
          </div>

          {/* CARD 2 — COMPANY / EMPLOYER PORTAL */}
          <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#4779B8] transition-colors">
            <div>
              <div className="bg-[#356F9D] text-white px-5 py-3 border-b border-[#28587E] flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-[#FFF0CE]" />
                <h2 className="text-sm font-bold uppercase tracking-wide">Company / Employer Portal</h2>
              </div>
              <div className="p-6">
                <p className="text-xs text-[#555555] leading-relaxed">
                  Publish approved internship vacancies, review student candidate dossiers and resumes, advance applicants through selection stages, and schedule interview sessions.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-2.5 border-t border-[#EDF2F7] mt-2">
              <Link
                to="/login"
                className="w-full py-2 px-4 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold text-xs rounded-sm border border-[#356F9D] flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Company Login</span>
              </Link>
              <Link
                to="/register"
                className="w-full py-2 px-4 bg-white hover:bg-[#F5F7FA] text-[#356F9D] font-bold text-xs rounded-sm border border-[#D4DCE6] flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register Company</span>
              </Link>
            </div>
          </div>

          {/* CARD 3 — ADMINISTRATOR PORTAL */}
          <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#4779B8] transition-colors">
            <div>
              <div className="bg-[#356F9D] text-white px-5 py-3 border-b border-[#28587E] flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#FFF0CE]" />
                <h2 className="text-sm font-bold uppercase tracking-wide">Administrator Portal</h2>
              </div>
              <div className="p-6">
                <p className="text-xs text-[#555555] leading-relaxed">
                  Verify and accredit corporate partners, monitor campus internship metrics, manage student and company accounts, review audit logs, and export official placement reports.
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-2.5 border-t border-[#EDF2F7] mt-2">
              <Link
                to="/login"
                className="w-full py-2 px-4 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold text-xs rounded-sm border border-[#356F9D] flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Administrator Login</span>
              </Link>
              <div className="py-2 text-center text-[11px] text-[#777777] font-medium">
                Authorized Academic Staff Only
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
