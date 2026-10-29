import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Internship } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import {
  Search,
  MapPin,
  Clock,
  Building2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Users,
  Briefcase,
  ChevronRight,
  Info,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [featuredInternships, setFeaturedInternships] = useState<Internship[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.getInternships({ size: 5, sort: 'newest' });
        const list = res.content || res || [];
        setFeaturedInternships(Array.isArray(list) ? list.slice(0, 5) : []);
      } catch (err) {
        console.error('Failed to load internships:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('query', searchQuery.trim());
    if (workMode) params.append('workMode', workMode);
    navigate(`/internships?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FA]">
      {/* 1. University Portal Welcome & Search Banner */}
      <section className="bg-[#356F9D] text-white border-b border-[#28587E] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-block px-2.5 py-1 bg-[#28587E] text-[#FFF0CE] text-xs font-semibold rounded-sm border border-[#4779B8]">
              Academic Mini-Project Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-normal">
              INTERN DESK — Centralized Internship Management System
            </h1>
            <p className="text-sm text-[#EAF2FC] leading-relaxed">
              A comprehensive campus recruitment portal connecting students, verified organizations, and academic administrators for seamless internship discovery, applications, and recruitment management.
            </p>
          </div>

          {/* Search Form Box */}
          <div className="mt-6 bg-white p-4 rounded-sm border border-[#D4DCE6] text-[#333333] shadow-sm">
            <div className="text-xs font-bold text-[#356F9D] uppercase tracking-wide mb-2">
              Search Available Opportunities
            </div>
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6 relative">
                <input
                  type="text"
                  placeholder="Enter internship title, skills (e.g. Java, Python, React)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none bg-white"
                >
                  <option value="">All Work Modes</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONSITE">Onsite</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold text-sm rounded-sm border border-[#356F9D] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Internships</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Campus Notice Bar */}
      <div className="bg-[#FFF0CE] border-b border-[#E6D3A3] text-[#855A00] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-[#855A00]" />
          <span>
            <strong>Notice:</strong> Internship applications for academic session 2026 are currently active. Students are advised to keep their academic profile and PDF resumes updated before applying.
          </span>
        </div>
      </div>

      {/* 3. Main Portal Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* Three Stakeholder Portals */}
        <div>
          <div className="text-sm font-bold text-[#356F9D] uppercase tracking-wide mb-3 flex items-center gap-2 border-b border-[#D4DCE6] pb-1">
            <Users className="w-4 h-4" />
            <span>Portal User Roles & Stakeholders</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Student Card */}
            <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden flex flex-col">
              <div className="bg-[#356F9D] text-white px-4 py-2 font-bold text-xs uppercase flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>Student Portal</span>
              </div>
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#555555] leading-relaxed">
                  Students can register, update academic credentials (CGPA, degree, skills), upload PDF resumes, browse company postings, and monitor application progress through a 5-stage workflow pipeline.
                </p>
                <div className="pt-2 border-t border-[#D4DCE6] flex items-center justify-between">
                  <Link
                    to="/login"
                    className="text-xs font-bold text-[#4779B8] hover:text-[#356F9D] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Student Login</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs text-[#666666] hover:underline"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>

            {/* Company Card */}
            <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden flex flex-col">
              <div className="bg-[#356F9D] text-white px-4 py-2 font-bold text-xs uppercase flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Company / Employer Portal</span>
              </div>
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#555555] leading-relaxed">
                  Registered employers can publish internship opportunities, specify requirements, view candidate resumes, and transition candidates through Under Review, Shortlisted, Interview, and Selection.
                </p>
                <div className="pt-2 border-t border-[#D4DCE6] flex items-center justify-between">
                  <Link
                    to="/login"
                    className="text-xs font-bold text-[#4779B8] hover:text-[#356F9D] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Employer Login</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs text-[#666666] hover:underline"
                  >
                    Register Company
                  </Link>
                </div>
              </div>
            </div>

            {/* Admin Card */}
            <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden flex flex-col">
              <div className="bg-[#356F9D] text-white px-4 py-2 font-bold text-xs uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Administrator Portal</span>
              </div>
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#555555] leading-relaxed">
                  College administrators oversee platform operations, verify and accredit hiring companies, moderate internship listings, audit user activities, and export official CSV reports.
                </p>
                <div className="pt-2 border-t border-[#D4DCE6] flex items-center justify-between">
                  <Link
                    to="/login"
                    className="text-xs font-bold text-[#4779B8] hover:text-[#356F9D] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Admin Login</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                  <span className="text-[11px] text-[#888888]">Staff Access Only</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Latest Internship Opportunities Table */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#356F9D] text-white px-4 py-2.5 flex items-center justify-between border-b border-[#28587E]">
            <div className="text-xs font-bold uppercase tracking-wide flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>Latest Internship Notifications</span>
            </div>
            <Link
              to="/internships"
              className="text-xs text-[#EAF2FC] hover:text-white hover:underline flex items-center gap-1"
            >
              <span>View All Internships</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Internship Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Work Mode</th>
                  <th>Stipend</th>
                  <th>Duration</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-[#666666]">
                      Loading active internship postings...
                    </td>
                  </tr>
                ) : featuredInternships.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-[#666666]">
                      No active internship postings found.
                    </td>
                  </tr>
                ) : (
                  featuredInternships.map((item) => (
                    <tr key={item.id}>
                      <td className="font-mono text-xs text-[#666666]">INT-{String(item.id).padStart(4, '0')}</td>
                      <td className="font-semibold text-[#356F9D]">
                        <Link to={`/internships/${item.id}`} className="hover:underline">
                          {item.title}
                        </Link>
                      </td>
                      <td className="font-medium">{item.companyName}</td>
                      <td>{item.location}</td>
                      <td>
                        <StatusBadge status={item.workMode} size="sm" />
                      </td>
                      <td className="font-semibold text-[#285C2A]">
                        {item.stipendMin ? `₹${item.stipendMin.toLocaleString()}/mo` : 'Unpaid'}
                      </td>
                      <td>{item.durationMonths || 3} Months</td>
                      <td>
                        <Link
                          to={`/internships/${item.id}`}
                          className="px-2.5 py-1 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-medium rounded-sm border border-[#356F9D] inline-block"
                        >
                          Details & Apply
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. System Architecture & Objectives (From Academic Synopsis) */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-5 space-y-4">
          <div className="text-sm font-bold text-[#356F9D] uppercase tracking-wide border-b border-[#D4DCE6] pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#4779B8]" />
            <span>Project Architecture & Objectives (B.Tech S3 Java Mini Project)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#444444] leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-bold text-[#333333] text-sm">System Overview</h3>
              <p>
                An Internship Management System (IMS) developed to simplify and automate the internship management process in colleges. The system provides a centralized platform where students can apply for internships, companies can post internship opportunities, and administrators can monitor and manage applications and records efficiently.
              </p>
              <p>
                Built using <strong>Java 21</strong> and <strong>Spring Boot 3</strong> with a relational <strong>MySQL</strong> backend database, ensuring ACID transactions, role-based security, and zero duplicate applications.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-[#333333] text-sm">Key Modules Implemented</h3>
              <ul className="space-y-1.5 list-disc list-inside text-[#555555]">
                <li><strong>Module 1: User Authentication & Role RBAC</strong> (Student, Company, Admin)</li>
                <li><strong>Module 2: Student Management</strong> (Profile, Resume upload, Applications)</li>
                <li><strong>Module 3: Company Management</strong> (Internship posting, Review, Decisions)</li>
                <li><strong>Module 4: Internship Management</strong> (Multi-attribute filtering & search)</li>
                <li><strong>Module 5: Administration & Reports</strong> (Audit logging, CSV export)</li>
                <li><strong>Module 6: Database Management</strong> (MySQL relational schema & migrations)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
