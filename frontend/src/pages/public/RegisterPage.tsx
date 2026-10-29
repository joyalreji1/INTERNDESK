import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/common/Logo';
import { GraduationCap, Building2, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { registerStudent, registerCompany } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'STUDENT' | 'COMPANY'>('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Company specific fields
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Information Technology');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long with letters and numbers.');
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'STUDENT') {
        await registerStudent({
          fullName,
          email,
          password,
          phone: phone || undefined,
        });
        navigate('/student/dashboard', { replace: true });
      } else {
        if (!companyName.trim()) {
          setError('Company name is required for employer registration.');
          setLoading(false);
          return;
        }
        await registerCompany({
          fullName,
          email,
          password,
          companyName,
          industry,
          phone: phone || undefined,
        });
        navigate('/company/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please verify your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 bg-[#F5F7FA]">
      <div className="w-full max-w-xl space-y-4">
        {/* Header */}
        <div className="text-center pb-1">
          <Logo size="lg" lightText={false} className="justify-center" />
        </div>

        {/* Traditional Portal Registration Box */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          {/* Blue Header Strip */}
          <div className="bg-[#356F9D] text-white px-5 py-3 border-b border-[#28587E]">
            <h2 className="text-sm font-bold tracking-wide uppercase">New User Registration</h2>
            <p className="text-xs text-[#EAF2FC] mt-0.5">
              Select your user category below to create your portal account
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex border-b border-[#D4DCE6] bg-[#F5F7FA]">
            <button
              type="button"
              onClick={() => setActiveTab('STUDENT')}
              className={`flex-1 py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 border-r border-[#D4DCE6] transition-colors ${
                activeTab === 'STUDENT'
                  ? 'bg-white text-[#356F9D] border-t-2 border-t-[#4779B8]'
                  : 'bg-[#EAF2FC] text-[#666666] hover:bg-[#DDEBFA]'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#4779B8]" />
              <span>Student Registration</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('COMPANY')}
              className={`flex-1 py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'COMPANY'
                  ? 'bg-white text-[#356F9D] border-t-2 border-t-[#4779B8]'
                  : 'bg-[#EAF2FC] text-[#666666] hover:bg-[#DDEBFA]'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#4779B8]" />
              <span>Company / Employer Registration</span>
            </button>
          </div>

          {/* Registration Form */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">
                    {activeTab === 'STUDENT' ? 'Student Full Name' : 'Contact Person Full Name'} <span className="text-[#C94242]">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder={activeTab === 'STUDENT' ? 'e.g. Arjun Sharma' : 'e.g. Priya Nair (HR)'}
                    className="w-full px-3 py-2 text-sm text-[#333333] bg-white border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none focus:ring-1 focus:ring-[#4779B8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">
                    Official Email Address <span className="text-[#C94242]">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={activeTab === 'STUDENT' ? 'student@college.edu' : 'hr@company.com'}
                    className="w-full px-3 py-2 text-sm text-[#333333] bg-white border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none focus:ring-1 focus:ring-[#4779B8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">
                    Password <span className="text-[#C94242]">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Min 8 characters"
                    className="w-full px-3 py-2 text-sm text-[#333333] bg-white border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none focus:ring-1 focus:ring-[#4779B8]"
                  />
                  <span className="text-[11px] text-[#888888]">Include letters and digits</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-sm text-[#333333] bg-white border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none focus:ring-1 focus:ring-[#4779B8]"
                  />
                </div>
              </div>

              {/* Company Specific Fields */}
              {activeTab === 'COMPANY' && (
                <div className="p-3 bg-[#EAF2FC] border border-[#B8C6D6] rounded-sm space-y-3">
                  <div className="text-xs font-bold text-[#356F9D] uppercase">Organization Details</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#333333] mb-1">
                        Company / Organization Name <span className="text-[#C94242]">*</span>
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required={activeTab === 'COMPANY'}
                        placeholder="e.g. TechNova Solutions"
                        className="w-full px-3 py-1.5 text-sm text-[#333333] bg-white border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#333333] mb-1">
                        Industry Domain
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm text-[#333333] bg-white border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
                      >
                        <option value="Information Technology">Information Technology</option>
                        <option value="Software Development">Software Development</option>
                        <option value="Data Analytics & AI">Data Analytics & AI</option>
                        <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
                        <option value="Financial Technology">Financial Technology</option>
                        <option value="Electronics & Embedded Systems">Electronics & Embedded Systems</option>
                        <option value="Core Engineering">Core Engineering</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold text-sm rounded-sm border border-[#356F9D] shadow-sm transition-colors disabled:opacity-50"
                >
                  {loading
                    ? 'Submitting Registration...'
                    : activeTab === 'STUDENT'
                    ? 'Register Student Account'
                    : 'Register Company Account'}
                </button>
              </div>
            </form>

            <div className="pt-3 border-t border-[#D4DCE6] text-center text-xs text-[#666666]">
              Already registered?{' '}
              <Link to="/login" className="text-[#4779B8] font-bold hover:underline">
                Sign In to Your Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
