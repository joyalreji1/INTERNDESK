import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/common/Logo';
import { AlertCircle, User, Lock, CheckCircle2, Eye, EyeOff, ArrowRight, ShieldCheck, Building2, GraduationCap } from 'lucide-react';

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

  const performLogin = async (loginEmail: string, loginPassword: string) => {
    const cleanEmail = loginEmail.trim();
    if (!cleanEmail || !loginPassword) {
      setError('Please provide both Email Address / Username and Password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const loggedInUser = await login(cleanEmail, loginPassword);
      if (from) {
        navigate(from, { replace: true });
      } else {
        if (loggedInUser.role === 'STUDENT') navigate('/student/dashboard', { replace: true });
        else if (loggedInUser.role === 'COMPANY') navigate('/company/dashboard', { replace: true });
        else if (loggedInUser.role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
        else navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email/username or password. Default demo password is: Password@123');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  const fillDemoCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
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
              Enter your registered email/username and password to log in
            </p>
          </div>

          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{error}</p>
                  <p className="text-[11px] text-[#A82B2B] mt-1">
                    Tip: Click one of the 1-Click login buttons below to instantly sign in with pre-seeded accounts.
                  </p>
                </div>
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
                    type="text"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="e.g. admin, student, or registered email"
                    className="w-full px-3 py-2 text-sm text-[#333333] bg-white border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none focus:ring-1 focus:ring-[#4779B8]"
                  />
                </div>
                <p className="text-[11px] text-[#777777] mt-0.5">
                  Accepts email (e.g. <span className="font-mono">admin@interndesk.com</span>) or shortcut (<span className="font-mono">admin</span>, <span className="font-mono">student</span>, <span className="font-mono">company</span>)
                </p>
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
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 space-y-3 text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-[#D4DCE6] pb-1.5">
            <span className="font-bold text-[#356F9D] uppercase tracking-wide text-[11px]">
              Evaluation Quick Access (1-Click Login)
            </span>
            <span className="text-[10px] bg-[#EAF2FC] text-[#356F9D] px-2 py-0.5 rounded font-mono font-bold">
              Password: Password@123
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Student */}
            <div className="border border-[#B8C6D6] rounded-sm p-2.5 bg-[#FAFBFD] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-[#356F9D] mb-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student</span>
                </div>
                <p className="text-[11px] text-[#555] font-mono truncate" title="arjun.sharma@student.edu">
                  arjun.sharma@student.edu
                </p>
              </div>
              <div className="mt-2.5 flex flex-col gap-1">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => performLogin('arjun.sharma@student.edu', 'Password@123')}
                  className="w-full py-1 bg-[#4779B8] hover:bg-[#356F9D] text-white rounded text-[11px] font-bold transition-colors disabled:opacity-50"
                >
                  Direct Sign In
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('arjun.sharma@student.edu', 'Password@123')}
                  className="w-full py-0.5 text-[10px] text-[#4779B8] hover:underline"
                >
                  Fill Form
                </button>
              </div>
            </div>

            {/* Company */}
            <div className="border border-[#B8C6D6] rounded-sm p-2.5 bg-[#FAFBFD] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-[#356F9D] mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Company</span>
                </div>
                <p className="text-[11px] text-[#555] font-mono truncate" title="hr@technova.io">
                  hr@technova.io
                </p>
              </div>
              <div className="mt-2.5 flex flex-col gap-1">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => performLogin('hr@technova.io', 'Password@123')}
                  className="w-full py-1 bg-[#4779B8] hover:bg-[#356F9D] text-white rounded text-[11px] font-bold transition-colors disabled:opacity-50"
                >
                  Direct Sign In
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('hr@technova.io', 'Password@123')}
                  className="w-full py-0.5 text-[10px] text-[#4779B8] hover:underline"
                >
                  Fill Form
                </button>
              </div>
            </div>

            {/* Admin */}
            <div className="border border-[#B8C6D6] rounded-sm p-2.5 bg-[#FAFBFD] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-[#356F9D] mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Administrator</span>
                </div>
                <p className="text-[11px] text-[#555] font-mono truncate" title="admin@interndesk.com">
                  admin@interndesk.com
                </p>
              </div>
              <div className="mt-2.5 flex flex-col gap-1">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => performLogin('admin@interndesk.com', 'Password@123')}
                  className="w-full py-1 bg-[#4779B8] hover:bg-[#356F9D] text-white rounded text-[11px] font-bold transition-colors disabled:opacity-50"
                >
                  Direct Sign In
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin@interndesk.com', 'Password@123')}
                  className="w-full py-0.5 text-[10px] text-[#4779B8] hover:underline"
                >
                  Fill Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
