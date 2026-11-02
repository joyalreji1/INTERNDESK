import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { PaymentResponse, CompanyPaymentMetrics, PaymentReceiptResponse } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import { ReceiptModal } from '@/components/common/ReceiptModal';
import {
  CreditCard,
  Users,
  Clock,
  RotateCcw,
  ShieldCheck,
  FileText,
  DollarSign,
} from 'lucide-react';

export const CompanyPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [metrics, setMetrics] = useState<CompanyPaymentMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceiptResponse | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const [historyRes, metricsRes] = await Promise.all([
        api.getCompanyPayments(0, 50),
        api.getCompanyPaymentMetrics().catch(() => null),
      ]);
      const list = historyRes.content || historyRes || [];
      setPayments(Array.isArray(list) ? list : []);
      setMetrics(metricsRes);
    } catch (err) {
      console.error('Failed to load company payment records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const handleViewReceipt = async (paymentId: number) => {
    try {
      const receipt = await api.getPaymentReceipt(paymentId);
      setSelectedReceipt(receipt);
      setReceiptModalOpen(true);
    } catch (err: any) {
      alert(err.message || 'Payment receipt not found.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-3 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Candidate Fee Remittances & Enrollment Payments
          </h1>
          <p className="text-xs text-[#EAF2FC] mt-0.5">
            Audit candidate enrollment fees collected via Razorpay for paid internship positions
          </p>
        </div>

        <div className="text-xs text-[#FFF0CE] font-mono">
          Settled Candidates: <strong>{metrics?.totalEnrolledCandidates || payments.length}</strong>
        </div>
      </div>

      {/* 4 Financial Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#555555]">
            <span className="text-[11px] font-bold uppercase">Total Collected Fees</span>
            <DollarSign className="w-4 h-4 text-[#285C2A]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#285C2A]">
            ₹{metrics?.totalCollectedFees?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
          </div>
          <div className="text-[10px] text-[#777777]">Net fee volume received</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#555555]">
            <span className="text-[11px] font-bold uppercase">Enrolled Candidates</span>
            <Users className="w-4 h-4 text-[#356F9D]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#356F9D]">
            {metrics?.totalEnrolledCandidates || 0}
          </div>
          <div className="text-[10px] text-[#777777]">Fee verified & seat confirmed</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#555555]">
            <span className="text-[11px] font-bold uppercase">Pending Payments</span>
            <Clock className="w-4 h-4 text-[#855A00]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#855A00]">
            {metrics?.pendingPaymentCount || 0}
          </div>
          <div className="text-[10px] text-[#777777]">Candidates selected awaiting payment</div>
        </div>

        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#555555]">
            <span className="text-[11px] font-bold uppercase">Refund Claims</span>
            <RotateCcw className="w-4 h-4 text-[#C94242]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#C94242]">
            {metrics?.refundCount || 0}
          </div>
          <div className="text-[10px] text-[#777777]">Processed / under review</div>
        </div>
      </div>

      {/* Candidate Transactions Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
          Candidate Remittance Ledger
        </div>
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Transaction Ref</th>
                <th>Candidate Name</th>
                <th>Candidate Email</th>
                <th>Internship Title</th>
                <th>Amount Paid</th>
                <th>Date Settled</th>
                <th>Gateway Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#666666]">
                    Loading candidate transactions...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#666666]">
                    No fee payments recorded from applicants yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs font-bold text-[#356F9D]">
                      {p.transactionReference}
                    </td>
                    <td className="font-semibold text-[#333333]">{p.studentName}</td>
                    <td className="text-xs text-[#555555]">{p.studentEmail}</td>
                    <td className="text-xs">{p.internshipTitle}</td>
                    <td className="font-mono font-bold text-[#285C2A]">
                      ₹{p.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="text-xs text-[#666666]">
                      {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : 'N/A'}
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

      {/* Official Receipt Modal */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receipt={selectedReceipt}
      />
    </div>
  );
};
