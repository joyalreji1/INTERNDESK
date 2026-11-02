import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { PaymentResponse, PaymentReceiptResponse } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import { ReceiptModal } from '@/components/common/ReceiptModal';
import { Modal } from '@/components/common/Modal';
import {
  CreditCard,
  FileText,
  ShieldCheck,
  AlertCircle,
  Clock,
  Printer,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export const StudentPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceiptResponse | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Refund Modal State
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentResponse | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [refundSuccess, setRefundSuccess] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.getStudentPayments(0, 50);
      const list = res.content || res || [];
      setPayments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load student payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleViewReceipt = async (paymentId: number) => {
    try {
      const receipt = await api.getPaymentReceipt(paymentId);
      setSelectedReceipt(receipt);
      setReceiptModalOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch payment receipt.');
    }
  };

  const handleOpenRefundModal = (payment: PaymentResponse) => {
    setSelectedPayment(payment);
    setRefundReason('');
    setRefundError(null);
    setRefundSuccess(false);
    setRefundModalOpen(true);
  };

  const handleSubmitRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;
    if (!refundReason.trim()) {
      setRefundError('Please specify the justification or reason for refund.');
      return;
    }

    setRefundSubmitting(true);
    setRefundError(null);
    try {
      await api.requestRefund({
        applicationId: selectedPayment.applicationId,
        reason: refundReason.trim(),
      });
      setRefundSuccess(true);
      setTimeout(() => {
        setRefundModalOpen(false);
        fetchPayments();
      }, 1500);
    } catch (err: any) {
      setRefundError(err.message || 'Failed to submit refund request.');
    } finally {
      setRefundSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-3 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Student Payment Records & Receipts
          </h1>
          <p className="text-xs text-[#EAF2FC] mt-0.5">
            Audit history of verified internship participation fees and downloadable official receipts
          </p>
        </div>

        <div className="text-xs text-[#FFF0CE] font-mono">
          Total Transactions: <strong>{payments.length}</strong>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#285C2A] shrink-0 mt-0.5" />
        <div className="text-xs text-[#555555] space-y-1">
          <span className="font-bold text-[#333333]">Institutional Guarantee & Verification:</span>
          <p>
            All fees paid through Intern Desk are verified using SHA-256 digital signatures with Razorpay Gateway. Official receipts serve as valid proof of enrollment for academic credit.
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
          Payment Ledger
        </div>
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Transaction Ref</th>
                <th>Internship Opportunity</th>
                <th>Company</th>
                <th>Fee Amount</th>
                <th>Payment Date</th>
                <th>Gateway Status</th>
                <th>Receipt & Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#666666]">
                    Loading payment records...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#666666]">
                    No payment transactions recorded on your student account.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs font-bold text-[#356F9D]">
                      {p.transactionReference}
                    </td>
                    <td className="font-semibold text-[#333333]">{p.internshipTitle}</td>
                    <td className="font-medium text-[#555555]">{p.companyName}</td>
                    <td className="font-mono font-bold text-[#285C2A]">
                      ₹{p.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })} {p.currency}
                    </td>
                    <td className="text-xs text-[#666666]">
                      {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="space-x-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleViewReceipt(p.id)}
                        className="px-2 py-0.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-semibold rounded-sm border border-[#356F9D] inline-flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>View Receipt</span>
                      </button>

                      {p.status === 'SUCCESS' && !p.refundStatus && (
                        <button
                          type="button"
                          onClick={() => handleOpenRefundModal(p)}
                          className="px-2 py-0.5 bg-white hover:bg-[#FDE8E8] text-[#C94242] text-xs font-medium rounded-sm border border-[#D4DCE6] inline-flex items-center gap-1"
                          title="Request Refund"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Request Refund</span>
                        </button>
                      )}

                      {p.refundStatus && (
                        <span className="text-[11px] font-mono text-[#855A00] font-semibold">
                          Refund: {p.refundStatus}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Receipt Modal */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receipt={selectedReceipt}
      />

      {/* Refund Request Modal */}
      <Modal
        isOpen={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        title="Request Fee Refund"
        description="Submit refund petition for administrative review"
        maxWidth="md"
      >
        {refundSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#285C2A] mx-auto" />
            <h4 className="text-sm font-bold text-[#285C2A]">Refund Petition Submitted</h4>
            <p className="text-xs text-[#555555]">
              Your refund request has been logged and sent to university administrators for verification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitRefund} className="space-y-4 text-xs">
            {refundError && (
              <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{refundError}</span>
              </div>
            )}

            <div className="p-3 bg-[#FAFCFF] border border-[#D4DCE6] rounded-sm space-y-1">
              <div>
                <strong>Internship:</strong> {selectedPayment?.internshipTitle}
              </div>
              <div>
                <strong>Company:</strong> {selectedPayment?.companyName}
              </div>
              <div>
                <strong>Amount:</strong> ₹{selectedPayment?.amount}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1">
                Reason for Refund Request <span className="text-[#C94242]">*</span>
              </label>
              <textarea
                rows={3}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Explain why you are requesting a refund (e.g., company cancelled program, schedule clash with exams)..."
                required
                className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#D4DCE6]">
              <button
                type="button"
                onClick={() => setRefundModalOpen(false)}
                className="px-3 py-1.5 bg-white border border-[#D4DCE6] text-[#333333] font-medium rounded-sm hover:bg-[#F5F7FA]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={refundSubmitting}
                className="px-4 py-1.5 bg-[#C94242] hover:bg-[#A83232] text-white font-bold rounded-sm border border-[#A83232] transition-colors disabled:opacity-50"
              >
                {refundSubmitting ? 'Submitting...' : 'Submit Refund Petition'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
