import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, normalizeRole } from '@/context/AuthContext';
import { Logo } from '@/components/common/Logo';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '@/types';

export const LoginPage: React.FC = () => {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname;

  // Helper: check if a target path is appropriate for the given role
  const isPathAllowedForRole = (path: string, role: UserRole): boolean => {
    if (role === 'STUDENT') {
      return path.startsWith('/student') || path.startsWith('/internships');
    }
    if (role === 'COMPANY') {
      return path.startsWith('/company');
    }
    if (role === 'ADMIN') {
      return path.startsWith('/admin');
    }
    return false;
  };

  // Helper: get destination dashboard for role
  const getDestinationForRole = (role: UserRole): string => {
    switch (role) {
      case 'STUDENT':
        return '/student/dashboard';
      case 'COMPANY':
        return '/company/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  // If already authenticated, redirect immediately to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const currentRole = normalizeRole(user.role);
      navigate(getDestinationForRole(currentRole), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please provide both Email Address / Username and Password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const loggedInUser = await login(cleanEmail, cleanPassword);
      const userRole = normalizeRole(loggedInUser.role);

      // Verify if 'from' is valid and permitted for this specific role
      if (from && isPathAllowedForRole(from, userRole)) {
        navigate(from, { replace: true });
      } else {
        navigate(getDestinationForRole(userRole), { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email/username or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 bg-[#F5F7FA]">
      <div className="w-full max-w-md space-y-4">
        {/* Portal Branding */}
        <div className="text-center pb-2">
          <Logo size="lg" lightText={false} className="justify-center" />
        </div>

        {/* Traditional University Sign In Panel */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          {/* Blue Section Header */}
          <div className="bg-[#356F9D] text-white px-5 py-3 border-b border-[#28587E]">
            <h2 className="text-sm font-bold tracking-wide uppercase">User Sign In</h2>
            <p className="text-xs text-[#EAF2FC] mt-0.5">
              Enter your registered email/username and password to access your portal
            </p>
          </div>

          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              {/* Dummy hidden inputs prevent Edge/Chrome from automatically injecting cached credentials */}
              <input type="text" name="fake_user_name" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
              <input type="password" name="fake_user_pass" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">
                  Email Address / Username <span className="text-[#C94242]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="user_login_email"
                    name="user_login_email"
                    type="text"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g. arjun.sharma@student.edu, hr@technova.io, or admin@interndesk.com"
                    className="w-full px-3 py-2 text-sm text-[#333333] bg-white border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none focus:ring-1 focus:ring-[#4779B8]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#333333]">
                    Password <span className="text-[#C94242]">*</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#4779B8] hover:text-[#356F9D] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="user_login_password"
                    name="user_login_password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 pr-10 text-sm text-[#333333] bg-white border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none focus:ring-1 focus:ring-[#4779B8]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#356F9D] p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold text-sm rounded-sm border border-[#356F9D] shadow-sm transition-colors disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="pt-3 border-t border-[#D4DCE6] text-center text-xs text-[#666666]">
              Do not have an account?{' '}
              <Link to="/register" className="text-[#4779B8] font-bold hover:underline">
                Register as Student or Company
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
