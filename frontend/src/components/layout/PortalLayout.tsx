import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { Logo } from '@/components/common/Logo';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  FileCheck,
  Bell,
  Settings,
  Building2,
  Users,
  FileSpreadsheet,
  History,
  LogOut,
  ChevronRight,
  Menu,
  X,
  PlusCircle,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const { user, logout, isStudent, isCompany, isAdmin } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const fetchUnread = async () => {
      try {
        const res = await api.getUnreadNotificationCount();
        if (isMounted) setUnreadCount(res.unreadCount || 0);
      } catch (err) {
        // Silently catch
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const studentLinks = [
    { to: '/student/dashboard', label: 'Home Dashboard', icon: LayoutDashboard },
    { to: '/student/internships', label: 'Internships', icon: Briefcase },
    { to: '/student/applications', label: 'Applications', icon: FileCheck },
    { to: '/student/profile', label: 'Profile', icon: User },
    { to: '/student/resume', label: 'Resume', icon: FileText },
    { to: '/student/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { to: '/student/settings', label: 'Settings', icon: Settings },
  ];

  const companyLinks = [
    { to: '/company/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/company/internships', label: 'Internship Postings', icon: Briefcase },
    { to: '/company/internships/create', label: 'Post New Internship', icon: PlusCircle },
    { to: '/company/applicants', label: 'Applicants Pipeline', icon: Users },
    { to: '/company/profile', label: 'Company Profile', icon: Building2 },
    { to: '/company/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/company/settings', label: 'Settings', icon: Settings },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Students', icon: User },
    { to: '/admin/companies', label: 'Companies', icon: Building2 },
    { to: '/admin/internships', label: 'Internship Management', icon: Briefcase },
    { to: '/admin/applications', label: 'Applications', icon: FileCheck },
    { to: '/admin/reports', label: 'Reports', icon: FileSpreadsheet },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: History },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  let currentLinks = studentLinks;
  let portalTitle = 'Student Portal';

  if (isCompany) {
    currentLinks = companyLinks;
    portalTitle = 'Company Portal';
  } else if (isAdmin) {
    currentLinks = adminLinks;
    portalTitle = 'Administrator Portal';
  }

  const activeBreadcrumb = currentLinks.find((l) =>
    location.pathname === l.to || (l.to !== '/student/dashboard' && l.to !== '/company/dashboard' && l.to !== '/admin/dashboard' && location.pathname.startsWith(l.to))
  )?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans">
      {/* 1. Top University Blue Header */}
      <header className="bg-[#356F9D] text-white border-b border-[#28587E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <Logo size="md" lightText={true} />

          {/* User profile & Sign Out area */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:block text-right">
              <span className="text-[#EAF2FC]">Welcome, </span>
              <span className="font-semibold text-white">{user?.fullName}</span>
              <span className="ml-1 px-1.5 py-0.2 bg-[#28587E] text-[#FFF0CE] rounded-sm text-[11px] font-medium border border-[#4779B8]">
                {user?.role}
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-[#C94242] hover:bg-[#FDE8E8] font-medium text-xs rounded-sm border border-[#D4DCE6] transition-colors"
              title="Logout from system"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-white hover:bg-[#28587E] rounded-sm"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Traditional Horizontal Navigation Tabs Bar */}
      <nav className="bg-[#4779B8] border-b border-[#356F9D] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center space-x-1 overflow-x-auto">
            {currentLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-[#28587E] text-white border-amber-400 font-bold'
                        : 'text-[#EAF2FC] hover:bg-[#356F9D] hover:text-white border-transparent'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-[#C94242] text-white text-[10px] font-bold rounded-full">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#356F9D] border-b border-[#28587E] px-4 py-3 space-y-1">
          <div className="text-xs text-[#EAF2FC] mb-2 font-semibold">
            {portalTitle} Navigation
          </div>
          {currentLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 text-xs rounded-sm ${
                    isActive
                      ? 'bg-[#28587E] text-white font-bold'
                      : 'text-[#EAF2FC] hover:bg-[#4779B8] hover:text-white'
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {link.label}
                </span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#C94242] text-white text-[10px] font-bold rounded-full">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      )}

      {/* 3. University Breadcrumbs Bar */}
      <div className="bg-white border-b border-[#D4DCE6] text-xs text-[#666666]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Link to="/" className="text-[#4779B8] hover:underline">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-[#B8C6D6]" />
            <span className="text-[#333333] font-medium">{portalTitle}</span>
            <ChevronRight className="w-3 h-3 text-[#B8C6D6]" />
            <span className="text-[#356F9D] font-bold">{activeBreadcrumb}</span>
          </div>

          <div className="text-[11px] text-[#666666] hidden sm:block">
            College Academic Session: 2026-2027
          </div>
        </div>
      </div>

      {/* 4. Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {children}
      </main>

      {/* 5. Clean Institutional Footer */}
      <footer className="bg-white border-t border-[#D4DCE6] py-3 text-center text-xs text-[#666666] mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>INTERN DESK — Internship Management System</span>
          <span className="text-[11px] text-[#888888]">
            B.Tech Computer Science & Engineering (S3 Java Mini Project)
          </span>
        </div>
      </footer>
    </div>
  );
};
