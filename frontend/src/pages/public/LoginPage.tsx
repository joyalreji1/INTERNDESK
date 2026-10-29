import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/common/Logo';
import { AlertCircle, User, Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both Email Address and Password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else {
        if (loggedInUser.role === 'STUDENT') navigate('/student/dashboard', { replace: true });
        else if (loggedInUser.role === 'COMPANY') navigate('/company/dashboard', { replace: true });
        else if (loggedInUser.role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
        else navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 bg-[#F5F7FA]">
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
              Enter your registered email and password to log in
            </p>
          </div>

          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              {/* Dummy hidden inputs prevent Edge/Chrome from automatically injecting cached localhost credentials */}
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
                    type="email"
                    autoComplete="new-password"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter registered email"
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
                    autoComplete="new-password"
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
                  className="w-full py-2 px-4 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold text-sm rounded-sm border border-[#356F9D] shadow-sm transition-colors disabled:opacity-50"
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

        {/* Demo Fast-Switch Buttons for Examiners / Evaluators */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 space-y-2 text-xs">
          <div className="font-bold text-[#356F9D] border-b border-[#D4DCE6] pb-1">
            <span>Project Evaluation: 1-Click Credentials</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => fillDemoCredentials('arjun.sharma@student.edu', 'Password@123')}
              className="px-2 py-1.5 bg-[#EAF2FC] hover:bg-[#D4E5FA] text-[#356F9D] border border-[#B8C6D6] rounded-sm font-semibold text-center transition-colors"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('hr@technova.io', 'Password@123')}
              className="px-2 py-1.5 bg-[#EAF2FC] hover:bg-[#D4E5FA] text-[#356F9D] border border-[#B8C6D6] rounded-sm font-semibold text-center transition-colors"
            >
              Company
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin@interndesk.com', 'Password@123')}
              className="px-2 py-1.5 bg-[#EAF2FC] hover:bg-[#D4E5FA] text-[#356F9D] border border-[#B8C6D6] rounded-sm font-semibold text-center transition-colors"
            >
              Administrator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
