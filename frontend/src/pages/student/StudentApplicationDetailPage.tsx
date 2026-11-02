import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Application, ApplicationStatusHistory, PaymentReceiptResponse } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import { RazorpayCheckoutModal } from '@/components/common/RazorpayCheckoutModal';
import { ReceiptModal } from '@/components/common/ReceiptModal';
import {
  FileCheck,
  Building2,
  Calendar,
  FileText,
  Clock,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  History,
  Video,
  CreditCard,
  ShieldCheck,
  Printer,
  Info,
} from 'lucide-react';

export const StudentApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [history, setHistory] = useState<ApplicationStatusHistory[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Payment & Receipt Modals
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<PaymentReceiptResponse | null>(null);

  const fetchDetails = async () => {
    try {
      if (!id) return;
      const [appData, historyData, interviewData] = await Promise.all([
        api.getApplication(Number(id)),
        api.getApplicationHistory(Number(id)),
        api.getInterviews(Number(id)).catch(() => []),
      ]);
      setApp(appData);
      setHistory(Array.isArray(historyData) ? historyData : []);
      setInterviews(Array.isArray(interviewData) ? interviewData : []);

      // If enrolled, prefetch receipt
      if (appData.status === 'ENROLLED' || appData.paymentStatus === 'SUCCESS') {
        api.getPaymentReceiptByApplication(Number(id))
          .then((r) => setReceiptData(r))
          .catch(() => {});
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handlePaymentSuccess = (receipt: PaymentReceiptResponse) => {
    setReceiptData(receipt);
    setReceiptModalOpen(true);
    fetchDetails();
  };

  const handleOpenReceipt = async () => {
    if (receiptData) {
      setReceiptModalOpen(true);
      return;
    }
    if (!app) return;
    try {
      const receipt = await api.getPaymentReceiptByApplication(app.id);
      setReceiptData(receipt);
      setReceiptModalOpen(true);
    } catch (err: any) {
      alert(err.message || 'Payment receipt not found.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-xs text-[#666666]">Loading application records...</div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="p-4 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm">
          {error || 'Application records could not be retrieved.'}
        </div>
        <div className="mt-3">
          <Link to="/student/applications" className="text-xs text-[#4779B8] font-bold hover:underline">
            &larr; Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  const isPaidInternship = app.internshipType === 'PAID' || (app.internshipFee && app.internshipFee > 0);

  // Workflow steps based on internship type
  const steps = isPaidInternship
    ? [
        { key: 'APPLIED', label: '1. Applied' },
        { key: 'UNDER_REVIEW', label: '2. Under Review' },
        { key: 'SHORTLISTED', label: '3. Shortlisted' },
        { key: 'SELECTED', label: '4. Selected' },
        { key: 'PAYMENT_PENDING', label: '5. Payment' },
        { key: 'ENROLLED', label: '6. Enrolled' },
      ]
    : [
        { key: 'APPLIED', label: '1. Applied' },
        { key: 'UNDER_REVIEW', label: '2. Under Review' },
        { key: 'SHORTLISTED', label: '3. Shortlisted' },
        { key: 'SELECTED', label: '4. Selected' },
        { key: 'ENROLLED', label: '5. Enrolled' },
      ];

  const currentStepIdx = steps.findIndex((s) => s.key === app.status);
  const isTerminal = ['REJECTED', 'WITHDRAWN'].includes(app.status);
  const isSelectedOrPendingPayment =
    app.status === 'SELECTED' || app.status === 'PAYMENT_PENDING';
  const isEnrolled = app.status === 'ENROLLED' || app.paymentStatus === 'SUCCESS';

  return (
    <div className="space-y-4">
      <div>
        <Link
          to="/student/applications"
          className="text-xs text-[#4779B8] font-bold hover:underline inline-flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Applications</span>
        </Link>
      </div>

      {/* Header Strip */}
      <div className="bg-[#356F9D] text-white px-4 py-3 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-[11px] text-[#FFF0CE] font-mono flex items-center gap-2">
            <span>Application Docket: APP-{String(app.id).padStart(4, '0')}</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded text-[10px] uppercase font-bold">
              {isPaidInternship ? `PAID INTERNSHIP (₹${app.internshipFee})` : 'FREE INTERNSHIP'}
            </span>
          </div>
          <h1 className="text-base font-bold tracking-wide mt-0.5">
            {app.internshipTitle}
          </h1>
          <p className="text-xs text-[#EAF2FC] mt-0.5">
            Employer: <strong>{app.companyName}</strong> • Submitted:{' '}
            {new Date(app.appliedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={app.status} size="md" />
        </div>
      </div>

      {/* PAYMENT REQUIRED ACTION BANNER (When Candidate is Selected on Paid Internship) */}
      {isPaidInternship && isSelectedOrPendingPayment && (
        <div className="bg-[#FFF8E7] border-2 border-[#E6B800] rounded-sm p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E6D3A3] pb-2">
            <div className="flex items-center gap-2 text-[#855A00]">
              <CreditCard className="w-5 h-5 text-[#855A00]" />
              <h3 className="text-sm font-bold uppercase tracking-wide">
                Candidate Selected — Participation Fee Payment Required
              </h3>
            </div>
            <span className="font-mono font-bold text-sm text-[#285C2A]">
              Fee: ₹{app.internshipFee?.toLocaleString()} INR
            </span>
          </div>

          <p className="text-xs text-[#555555] leading-relaxed">
            Congratulations! <strong>{app.companyName}</strong> has reviewed your application and selected you for the <strong>{app.internshipTitle}</strong> position. To confirm and finalize your internship seat, please complete the enrollment payment via our secure Razorpay gateway.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="text-[11px] text-[#777777]">
              🛡️ Payment is 100% encrypted and backed by institutional verification.
            </div>

            <button
              type="button"
              onClick={() => setCheckoutModalOpen(true)}
              className="px-5 py-2 bg-[#285C2A] hover:bg-[#1E4620] text-white font-bold text-xs rounded-sm border border-[#1E4620] shadow-sm flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider"
            >
              <CreditCard className="w-4 h-4" />
              <span>Complete Payment (₹{app.internshipFee?.toLocaleString()}) via Razorpay</span>
            </button>
          </div>
        </div>
      )}

      {/* ENROLLMENT CONFIRMED BANNER */}
      {isEnrolled && (
        <div className="bg-[#EBF7EA] border border-[#BFDDB7] rounded-sm p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#285C2A] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-[#285C2A] uppercase tracking-wide">
                Internship Enrollment Confirmed
              </h3>
              <p className="text-xs text-[#555555] mt-0.5">
                Your admission is verified. Official payment has been recorded and authenticated on university servers.
              </p>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleOpenReceipt}
              className="px-4 py-2 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold text-xs rounded-sm border border-[#356F9D] flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Official Payment Receipt</span>
            </button>
          </div>
        </div>
      )}

      {/* REJECTION REASON BANNER */}
      {app.status === 'REJECTED' && (
        <div className="bg-[#FDE8E8] border border-[#F4B8B8] rounded-sm p-4 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-[#C94242] font-bold text-xs uppercase">
            <AlertCircle className="w-4 h-4" />
            <span>Application Evaluation Outcome: Not Selected</span>
          </div>
          <p className="text-xs text-[#555555]">
            Employer Feedback:{' '}
            <strong className="text-[#333333]">
              {app.rejectionReason || 'Candidate profile did not meet the specific cohort requirements for this cycle.'}
            </strong>
          </p>
        </div>
      )}

      {/* Recruitment Pipeline Progress */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm">
        <div className="text-xs font-bold text-[#356F9D] uppercase tracking-wide border-b border-[#D4DCE6] pb-2 mb-4">
          Recruitment & Enrollment Pipeline
        </div>

        {isTerminal ? (
          <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm">
            Current Application Status:{' '}
            <strong>{app.status === 'WITHDRAWN' ? 'Withdrawn by Student' : 'Application Not Selected'}</strong>
          </div>
        ) : (
          <div className={`grid grid-cols-${steps.length} gap-1 text-center`}>
            {steps.map((s, idx) => {
              const isPast = currentStepIdx > idx;
              const isCurrent = currentStepIdx === idx;
              return (
                <div
                  key={s.key}
                  className={`p-2 border rounded-sm text-xs ${
                    isCurrent
                      ? 'bg-[#356F9D] text-white border-[#28587E] font-bold shadow-sm'
                      : isPast
                      ? 'bg-[#DDEED8] text-[#285C2A] border-[#BFDDB7] font-semibold'
                      : 'bg-[#FAFCFF] text-[#888888] border-[#D4DCE6]'
                  }`}
                >
                  <div className="font-semibold">{s.label}</div>
                  <div className="text-[10px] mt-0.5">
                    {isCurrent ? 'Current Stage' : isPast ? 'Completed' : 'Pending'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Scheduled Interview Card (if any) */}
      {interviews.length > 0 && (
        <div className="bg-white border border-[#356F9D] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#356F9D] text-white px-4 py-2 text-xs font-bold uppercase flex items-center gap-1.5">
            <Video className="w-4 h-4 text-[#FFF0CE]" />
            <span>Scheduled Interview Session</span>
          </div>
          <div className="p-4 space-y-3">
            {interviews.map((iv) => (
              <div key={iv.id} className="p-3 bg-[#EAF2FC] border border-[#B8C6D6] rounded-sm space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-semibold text-[#356F9D]">
                  <span className="uppercase tracking-wide">
                    {iv.interviewType || 'Online Interview'}
                  </span>
                  <span className="font-mono text-[#333333]">
                    {iv.scheduledAt ? new Date(iv.scheduledAt).toLocaleString() : 'TBD'}
                  </span>
                </div>
                {iv.meetingLink && (
                  <div className="pt-1">
                    <span className="font-bold text-[#333333] mr-2">Meeting Link:</span>
                    <a
                      href={iv.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4779B8] font-bold hover:underline break-all"
                    >
                      {iv.meetingLink}
                    </a>
                  </div>
                )}
                {iv.interviewerNotes && (
                  <div className="text-[#555555] pt-1">
                    <span className="font-bold text-[#333333] mr-1">Instructions:</span>
                    {iv.interviewerNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Application Parameters */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
          Application Submission Dossier
        </div>
        <table className="portal-table">
          <tbody>
            <tr>
              <td className="w-1/4 font-bold bg-[#FAFCFF]">Student Candidate</td>
              <td className="w-1/4">{app.studentName || 'Student'}</td>
              <td className="w-1/4 font-bold bg-[#FAFCFF]">Candidate Email</td>
              <td className="w-1/4">{app.studentEmail || 'N/A'}</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">College / Institute</td>
              <td>{app.studentCollege || 'Engineering College'}</td>
              <td className="font-bold bg-[#FAFCFF]">Degree & Department</td>
              <td>{app.studentDegree || 'B.Tech'} ({app.studentDepartment || 'CSE'})</td>
            </tr>
            <tr>
              <td className="font-bold bg-[#FAFCFF]">Attached PDF Resume</td>
              <td>
                {app.resumeFilename ? (
                  <span className="font-mono text-xs text-[#356F9D] font-bold">
                    📄 {app.resumeFilename}
                  </span>
                ) : (
                  <span className="text-[#888888]">Standard Portal Profile</span>
                )}
              </td>
              <td className="font-bold bg-[#FAFCFF]">Eligibility Evaluation</td>
              <td>
                <span className="px-2 py-0.5 bg-[#DDEED8] text-[#285C2A] border border-[#BFDDB7] rounded-sm font-bold text-[10px]">
                  {app.eligibilityStatus || 'ELIGIBLE'}
                </span>
              </td>
            </tr>
            {isPaidInternship && (
              <tr>
                <td className="font-bold bg-[#FAFCFF]">Internship Fee</td>
                <td className="font-mono font-bold text-[#285C2A]">
                  ₹{app.internshipFee?.toLocaleString()} {app.currency || 'INR'}
                </td>
                <td className="font-bold bg-[#FAFCFF]">Payment Status</td>
                <td>
                  <StatusBadge status={app.paymentStatus || 'PENDING'} size="sm" />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {app.coverLetter && (
          <div className="p-4 border-t border-[#D4DCE6] text-xs">
            <strong className="block text-[#356F9D] font-bold uppercase mb-1">
              Candidate Statement / Cover Note:
            </strong>
            <p className="text-[#333333] whitespace-pre-line leading-relaxed bg-[#FAFCFF] p-3 border border-[#D4DCE6] rounded-sm">
              {app.coverLetter}
            </p>
          </div>
        )}
      </div>

      {/* Status Transition History */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#356F9D] text-white px-4 py-2 text-xs font-bold uppercase border-b border-[#28587E] flex items-center gap-1.5">
          <History className="w-3.5 h-3.5" />
          <span>Application State Transition Audit Log</span>
        </div>

        <table className="portal-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Previous Stage</th>
              <th>Updated Stage</th>
              <th>Official Remarks / Notes</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-[#666666]">
                  Initial application state recorded at submission.
                </td>
              </tr>
            ) : (
              history.map((h) => (
                <tr key={h.id}>
                  <td className="text-xs text-[#555555] whitespace-nowrap">
                    {new Date(h.changedAt).toLocaleString()}
                  </td>
                  <td>
                    {h.previousStatus ? <StatusBadge status={h.previousStatus} size="sm" /> : '-'}
                  </td>
                  <td>
                    <StatusBadge status={h.newStatus} size="sm" />
                  </td>
                  <td className="text-xs text-[#333333]">{h.remarks || 'Stage transitioned'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Razorpay Checkout Modal */}
      <RazorpayCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        application={app}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Official Receipt Modal */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receipt={receiptData}
      />
    </div>
  );
};
