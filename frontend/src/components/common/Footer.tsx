import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#356F9D] text-white border-t border-[#28587E] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Col 1: System Info */}
          <div className="md:col-span-2 space-y-2">
            <Logo size="md" lightText={true} />
            <p className="text-xs text-[#EAF2FC] leading-relaxed max-w-md pt-1">
              A centralized university-level Internship Management System connecting students, hiring companies, and college administrators to streamline applications, selection workflows, and academic tracking.
            </p>
            <div className="text-[11px] text-[#FFF0CE] pt-1">
              Developed as a College Mini-Project using Java, Spring Boot, MySQL, and React.
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#EAF2FC] mb-2 border-b border-[#4779B8] pb-1">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-white">
              <li>
                <Link to="/" className="hover:underline">Home Portal</Link>
              </li>
              <li>
                <Link to="/internships" className="hover:underline">Browse Internships</Link>
              </li>
              <li>
                <Link to="/companies" className="hover:underline">Registered Companies</Link>
              </li>
              <li>
                <Link to="/login" className="hover:underline">Portal Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:underline">User Registration</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Project Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#EAF2FC] mb-2 border-b border-[#4779B8] pb-1">
              System Modules
            </h4>
            <ul className="space-y-1.5 text-xs text-[#EAF2FC]">
              <li>Module 1: User Authentication & Role RBAC</li>
              <li>Module 2: Student Profile & Resume Manager</li>
              <li>Module 3: Company Posting & Recruitment</li>
              <li>Module 4: Workflow State Machine</li>
              <li>Module 5: Administrator Governance & Reports</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-4 border-t border-[#4779B8] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#EAF2FC]">
          <div>
            &copy; {new Date().getFullYear()} INTERN DESK — Internship Management System. All rights reserved.
          </div>
          <div className="mt-2 sm:mt-0">
            For academic demonstration & project viva evaluation.
          </div>
        </div>
      </div>
    </footer>
  );
};
