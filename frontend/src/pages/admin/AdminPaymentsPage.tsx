import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { PaymentResponse, AdminPaymentSummary, RefundResponse, PaymentReceiptResponse } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import { ReceiptModal } from '@/components/common/ReceiptModal';
import { Modal } from '@/components/common/Modal';
import {
  CreditCard,
  DollarSign,
  Download,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  FileText,
  Filter,
} from 'lucide-react';

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [refunds, setRefunds] = useState<RefundResponse[]>([]);
  const [summary, setSummary] = useState<AdminPaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'TRANSACTIONS' | 'REFUNDS'>('TRANSACTIONS');

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceiptResponse | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Refund Action Modal State
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<RefundResponse | null>(null);
  const [refundAction, setRefundAction] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [adminNotes, setAdminNotes] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [payRes, refRes, sumRes] = await Promise.all([
        api.getAdminPayments(0, 50),
        api.getAdminRefunds(0, 50).catch(() => []),
        api.getAdminPaymentSummary().catch(() => null),
      ]);
      const payList = payRes.content || payRes || [];
      const refList = refRes.content || refRes || [];
      setPayments(Array.isArray(payList) ? payList : []);
      setRefunds(Array.isArray(refList) ? refList : []);
      setSummary(sumRes);
    } catch (err) {
      console.error('Failed to load admin payment records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleExportCsv = async () => {
    try {
      await api.exportPaymentCsv();
    } catch (err: any) {
      alert(err.message || 'Failed to export payment CSV.');
    }
  };

  const handleViewReceipt = async (paymentId: number) => {
    try {
      const receipt = await api.getPaymentReceipt(paymentId);
      setSelectedReceipt(receipt);
      setReceiptModalOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to retrieve receipt.');
    }
  };

  const handleOpenRefundAction = (refund: RefundResponse, action: 'APPROVE' | 'REJECT') => {
    setSelectedRefund(refund);
    setRefundAction(action);
    setAdminNotes('');
    setActionError(null);
    setActionModalOpen(true);
  };

  const handleSubmitRefundAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRefund) return;

    setSubmittingAction(true);
    setActionError(null);
    try {
      await api.actionAdminRefund(selectedRefund.id, {
        action: refundAction,
        adminNotes: adminNotes.trim() || undefined,
      });
      setActionModalOpen(false);
      fetchAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to process refund decision.');
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-3 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Platform Financial Oversight & Payment Gateway Administration
          </h1>
          <p className="text-xs text-[#EAF2FC] mt-0.5">
            Audit candidate enrollment fees, Razorpay signature verifications, and manage student refund claims
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-white text-[#356F9D] hover:bg-[#EAF2FC] font-bold text-xs rounded-sm border border-[#D4DCE6] flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Payments CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#555555]">
            <span className="text-[11px] font-bold uppercase">Total Platform Volume</span>
            <DollarSign className="w-4 h-4 text-[#285C2A]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#285C2A]">
            ₹{summary?.totalRevenue?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
          </div>
          <div className="text-[10px] text-[#777777]">Net gross fees processed</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#555555]">
            <span className="text-[11px] font-bold uppercase">Successful Payments</span>
            <CreditCard className="w-4 h-4 text-[#356F9D]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#356F9D]">
            {summary?.successfulTransactions || payments.length}
          </div>
          <div className="text-[10px] text-[#777777]">HMAC signature verified</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#555555]">
            <span className="text-[11px] font-bold uppercase">Pending Transactions</span>
            <span className="w-2 h-2 rounded-full bg-[#E6B800]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#855A00]">
            {summary?.pendingTransactions || 0}
          </div>
          <div className="text-[10px] text-[#777777]">Awaiting checkout completion</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#555555]">
            <span className="text-[11px] font-bold uppercase">Refund Petitions</span>
            <RotateCcw className="w-4 h-4 text-[#C94242]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#C94242]">
            {summary?.refundedCount || refunds.length}
          </div>
          <div className="text-[10px] text-[#777777]">Under review / processed</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D4DCE6]">
        <button
          type="button"
          onClick={() => setActiveTab('TRANSACTIONS')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'TRANSACTIONS'
              ? 'border-[#356F9D] text-[#356F9D] bg-white'
              : 'border-transparent text-[#666666] hover:text-[#333333]'
          }`}
        >
          Payment Transactions ({payments.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('REFUNDS')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'REFUNDS'
              ? 'border-[#356F9D] text-[#356F9D] bg-white'
              : 'border-transparent text-[#666666] hover:text-[#333333]'
          }`}
        >
          Refund Review Board ({refunds.length})
        </button>
      </div>

      {/* TAB 1: ALL TRANSACTIONS */}
      {activeTab === 'TRANSACTIONS' && (
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Transaction Ref</th>
                  <th>Student Candidate</th>
                  <th>Hiring Company</th>
                  <th>Internship Title</th>
                  <th>Amount (INR)</th>
                  <th>Razorpay Order ID</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-[#666666]">
                      Loading transaction records...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-[#666666]">
                      No platform payments recorded.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id}>
                      <td className="font-mono text-xs font-bold text-[#356F9D]">
                        {p.transactionReference}
                      </td>
                      <td className="font-semibold text-[#333333]">
                        {p.studentName}
                        <div className="text-[10px] text-[#777777] font-normal">{p.studentEmail}</div>
                      </td>
                      <td className="font-medium text-[#555555]">{p.companyName}</td>
                      <td className="text-xs">{p.internshipTitle}</td>
                      <td className="font-mono font-bold text-[#285C2A]">
                        ₹{p.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="font-mono text-[11px] text-[#666666]">
                        {p.razorpayOrderId || 'N/A'}
                      </td>
                      <td>
                        <StatusBadge status={p.status} size="sm" />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleViewReceipt(p.id)}
                          className="px-2 py-0.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-semibold rounded-sm border border-[#356F9D] inline-flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REFUND REVIEW BOARD */}
      {activeTab === 'REFUNDS' && (
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Refund Docket</th>
                  <th>Transaction Ref</th>
                  <th>Candidate</th>
                  <th>Company</th>
                  <th>Amount</th>
                  <th>Reason for Claim</th>
                  <th>Requested Date</th>
                  <th>Review Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-[#666666]">
                      Loading refund claims...
                    </td>
                  </tr>
                ) : refunds.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-[#666666]">
                      No active refund petitions pending administrative review.
                    </td>
                  </tr>
                ) : (
                  refunds.map((r) => (
                    <tr key={r.id}>
                      <td className="font-mono text-xs font-bold text-[#C94242]">
                        REF-{String(r.id).padStart(4, '0')}
                      </td>
                      <td className="font-mono text-xs text-[#356F9D] font-bold">
                        {r.transactionReference}
                      </td>
                      <td className="font-semibold text-[#333333]">{r.studentName}</td>
                      <td className="font-medium text-[#555555]">{r.companyName}</td>
                      <td className="font-mono font-bold text-[#C94242]">
                        ₹{r.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-xs text-[#555555] max-w-[200px]" title={r.reason}>
                        {r.reason}
                      </td>
                      <td className="text-xs text-[#666666] whitespace-nowrap">
                        {new Date(r.requestedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <StatusBadge status={r.status} size="sm" />
                      </td>
                      <td className="space-x-1 whitespace-nowrap">
                        {r.status === 'PENDING' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenRefundAction(r, 'APPROVE')}
                              className="px-2 py-0.5 bg-[#285C2A] hover:bg-[#1E4820] text-white text-xs font-semibold rounded-sm border border-[#1E4820]"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenRefundAction(r, 'REJECT')}
                              className="px-2 py-0.5 bg-white hover:bg-[#FDE8E8] text-[#C94242] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {r.status !== 'PENDING' && (
                          <span className="text-[11px] text-[#777777]">Decided</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receipt={selectedReceipt}
      />

      {/* Refund Review Action Modal */}
      <Modal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title={`Confirm Refund Decision: ${refundAction}`}
        description={`Transaction: ${selectedRefund?.transactionReference}`}
        maxWidth="sm"
      >
        <form onSubmit={handleSubmitRefundAction} className="space-y-3 text-xs">
          {actionError && (
            <div className="p-2 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{actionError}</span>
            </div>
          )}

          <div className="p-3 bg-[#FAFCFF] border border-[#D4DCE6] rounded-sm space-y-1">
            <div>
              <strong>Candidate:</strong> {selectedRefund?.studentName}
            </div>
            <div>
              <strong>Amount to Refund:</strong> ₹{selectedRefund?.amount}
            </div>
            <div>
              <strong>Student Justification:</strong> {selectedRefund?.reason}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#333333] mb-1">
              Administrative Review Notes / Remarks
            </label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Provide reason for approval/rejection under university placement policies..."
              className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#D4DCE6]">
            <button
              type="button"
              onClick={() => setActionModalOpen(false)}
              className="px-3 py-1.5 bg-white border border-[#D4DCE6] text-[#333333] font-medium rounded-sm hover:bg-[#F5F7FA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingAction}
              className={`px-4 py-1.5 text-white font-bold rounded-sm border disabled:opacity-50 ${
                refundAction === 'APPROVE'
                  ? 'bg-[#285C2A] hover:bg-[#1E4820] border-[#1E4820]'
                  : 'bg-[#C94242] hover:bg-[#A83232] border-[#A83232]'
              }`}
            >
              {submittingAction ? 'Processing...' : `Confirm ${refundAction}`}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
