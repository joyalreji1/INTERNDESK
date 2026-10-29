import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '@/context/AuthContext';
import {
  Briefcase,
  Building2,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  Compass,
  Home,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isStudent, isCompany, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (isStudent) return '/student/dashboard';
    if (isCompany) return '/company/dashboard';
    if (isAdmin) return '/admin/dashboard';
    return '/';
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
      isActive
        ? 'bg-[#28587E] text-white border-amber-400 font-semibold'
        : 'text-[#EAF2FC] hover:bg-[#356F9D] hover:text-white border-transparent'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 text-sm font-medium rounded-sm ${
      isActive
        ? 'bg-[#28587E] text-white font-semibold'
        : 'text-[#EAF2FC] hover:bg-[#356F9D] hover:text-white'
    }`;

  return (
    <header className="w-full shadow-sm">
      {/* Top University Blue Header */}
      <div className="bg-[#356F9D] text-white border-b border-[#28587E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
          {/* Logo with Title */}
          <Logo size="md" lightText={true} />

          {/* Right Header: User Info / Quick Actions */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[#EAF2FC]">Logged in as:</div>
                  <div className="font-semibold text-white truncate max-w-[160px]">
                    {user?.fullName} <span className="text-[#FFF0CE]">({user?.role})</span>
                  </div>
                </div>

                <Link
                  to={getDashboardLink()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4779B8] hover:bg-[#28587E] text-white font-medium text-xs rounded-sm border border-[#28587E] transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white text-[#C94242] hover:bg-[#FDE8E8] font-medium text-xs rounded-sm border border-[#D4DCE6] transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 bg-white text-[#356F9D] hover:bg-[#EAF2FC] font-semibold text-xs rounded-sm border border-[#D4DCE6] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 bg-[#4779B8] text-white hover:bg-[#28587E] font-semibold text-xs rounded-sm border border-[#28587E] transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-white hover:bg-[#28587E] rounded-sm"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Traditional Navigation Tab Bar */}
      <div className="bg-[#4779B8] border-b border-[#356F9D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" />
                Home
              </span>
            </NavLink>
            <NavLink to="/internships" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Internships
              </span>
            </NavLink>
            <NavLink to="/companies" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Companies
              </span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#356F9D] border-b border-[#28587E] px-4 py-3 space-y-2">
          <NavLink to="/" end className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/internships" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
            Internships
          </NavLink>
          <NavLink to="/companies" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
            Companies
          </NavLink>

          <div className="pt-2 border-t border-[#28587E]">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="text-xs text-[#EAF2FC]">
                  Logged in as <strong className="text-white">{user?.fullName}</strong>
                </div>
                <Link
                  to={getDashboardLink()}
                  className="block w-full text-center px-3 py-1.5 bg-[#4779B8] text-white text-xs font-semibold rounded-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Open Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="block w-full text-center px-3 py-1.5 bg-white text-[#C94242] text-xs font-semibold rounded-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  className="text-center px-3 py-1.5 bg-white text-[#356F9D] text-xs font-semibold rounded-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-center px-3 py-1.5 bg-[#4779B8] text-white text-xs font-semibold rounded-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
