import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { CheckCircle2, ChevronLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 bg-[#F5F7FA]">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center pb-1">
          <Logo size="lg" lightText={false} className="justify-center" />
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#356F9D] text-white px-5 py-3 border-b border-[#28587E]">
            <h2 className="text-sm font-bold tracking-wide uppercase">Password Recovery Desk</h2>
            <p className="text-xs text-[#EAF2FC] mt-0.5">
              Reset your credentials via your registered email
            </p>
          </div>

          <div className="p-6">
            {submitted ? (
              <div className="text-center space-y-3 py-2">
                <CheckCircle2 className="w-10 h-10 text-[#285C2A] mx-auto" />
                <h3 className="text-sm font-bold text-[#333333]">Recovery Instructions Dispatched</h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  If an account exists for <strong className="text-[#356F9D]">{email}</strong>, a recovery link has been issued to your registered address.
                </p>
                <div className="pt-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#4779B8] hover:underline"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Return to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1">
                    Registered Email Address <span className="text-[#C94242]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu or hr@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
                  />
                  <p className="text-[11px] text-[#888888] mt-1">
                    Provide the email associated with your Intern Desk profile.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold text-xs rounded-sm border border-[#356F9D] transition-colors"
                  >
                    Send Recovery Instructions
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <Link to="/login" className="text-xs text-[#4779B8] hover:underline font-medium">
                    &larr; Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
