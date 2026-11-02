import React from 'react';
import { Modal } from '@/components/common/Modal';
import { PaymentReceiptResponse } from '@/types';
import { CheckCircle2, Printer, ShieldCheck, Download } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: PaymentReceiptResponse | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, receipt }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Payment Receipt" maxWidth="lg">
      <div className="space-y-4 text-xs text-[#333333]">
        {/* Printable Receipt Paper Container */}
        <div id="printable-receipt" className="p-6 bg-white border border-[#D4DCE6] rounded-sm shadow-sm space-y-4">
          {/* Header */}
          <div className="border-b-2 border-[#356F9D] pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="text-[10px] font-mono text-[#555555] uppercase tracking-wider">
                Autonomous University Internship Portal
              </div>
              <h2 className="text-base font-bold text-[#356F9D] tracking-wide">
                INTERN DESK
              </h2>
              <div className="text-[11px] text-[#666666]">
                Centralized Internship & Payment Management System
              </div>
            </div>

            <div className="sm:text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#DDEED8] text-[#285C2A] border border-[#BFDDB7] rounded-sm font-bold text-[11px] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFIED PAYMENT
              </span>
              <div className="font-mono text-[11px] text-[#555555] mt-1">
                Receipt #{receipt.receiptNumber}
              </div>
            </div>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAFCFF] p-3 border border-[#EAF2FC] rounded-sm">
            <div>
              <span className="block text-[10px] font-bold text-[#777777] uppercase">Transaction Ref</span>
              <span className="font-mono font-bold text-[#356F9D]">{receipt.transactionReference}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[#777777] uppercase">Date & Time</span>
              <span className="font-medium">{new Date(receipt.paymentDate).toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[#777777] uppercase">Payment Gateway</span>
              <span className="font-medium">{receipt.paymentMethod || 'Razorpay Gateway'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[#777777] uppercase">Status</span>
              <span className="font-bold text-[#285C2A]">{receipt.paymentStatus || 'SUCCESS'}</span>
            </div>
          </div>

          {/* Student & Internship Details */}
          <table className="portal-table">
            <tbody>
              <tr>
                <td className="w-1/4 font-bold bg-[#FAFCFF]">Student Candidate</td>
                <td className="w-1/4 font-medium">{receipt.studentName}</td>
                <td className="w-1/4 font-bold bg-[#FAFCFF]">Student Email</td>
                <td className="w-1/4">{receipt.studentEmail}</td>
              </tr>
              <tr>
                <td className="font-bold bg-[#FAFCFF]">Hiring Organization</td>
                <td className="font-semibold text-[#356F9D]">{receipt.companyName}</td>
                <td className="font-bold bg-[#FAFCFF]">Internship Program</td>
                <td className="font-semibold">{receipt.internshipTitle}</td>
              </tr>
              <tr>
                <td className="font-bold bg-[#FAFCFF]">Application Docket</td>
                <td className="font-mono">APP-{String(receipt.applicationId).padStart(4, '0')}</td>
                <td className="font-bold bg-[#FAFCFF]">Gateway Order ID</td>
                <td className="font-mono text-[11px]">{receipt.razorpayOrderId || 'N/A'}</td>
              </tr>
              <tr>
                <td className="font-bold bg-[#FAFCFF]">Gateway Payment ID</td>
                <td className="font-mono text-[11px]">{receipt.razorpayPaymentId || 'N/A'}</td>
                <td className="font-bold bg-[#FAFCFF]">Enrollment Status</td>
                <td className="font-bold text-[#285C2A]">CONFIRMED / ENROLLED</td>
              </tr>
            </tbody>
          </table>

          {/* Fee Breakdown Table */}
          <div className="border border-[#D4DCE6] rounded-sm overflow-hidden">
            <div className="bg-[#356F9D] text-white px-3 py-1.5 font-bold uppercase text-[11px]">
              Payment Breakdown
            </div>
            <table className="w-full text-xs">
              <thead className="bg-[#F5F7FA] border-b border-[#D4DCE6] text-[#555555]">
                <tr>
                  <th className="py-2 px-3 text-left font-bold">Fee Description</th>
                  <th className="py-2 px-3 text-right font-bold">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF2FC]">
                <tr>
                  <td className="py-2 px-3">Internship Participation & Enrollment Fee</td>
                  <td className="py-2 px-3 text-right font-mono">₹{receipt.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-[#666666]">Platform Processing & Verification Surcharge</td>
                  <td className="py-2 px-3 text-right font-mono text-[#285C2A]">₹0.00 (Waived)</td>
                </tr>
                <tr className="bg-[#FAFCFF] font-bold text-sm text-[#285C2A]">
                  <td className="py-2.5 px-3 uppercase tracking-wide">Total Amount Paid</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    ₹{receipt.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Institutional Stamp & Signature Section */}
          <div className="pt-3 border-t border-[#D4DCE6] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[11px] text-[#666666]">
            <div>
              <div className="font-bold text-[#356F9D]">{receipt.institutionName || 'Intern Desk Placement Cell'}</div>
              <div>Digitally Generated & Verified Computer Receipt</div>
              <div className="font-mono text-[10px] text-[#888888]">Stamp: {receipt.verifiedStamp || 'SHA256:VERIFIED'}</div>
            </div>

            <div className="text-right sm:border-l sm:border-[#D4DCE6] sm:pl-4">
              <div className="font-bold text-[#285C2A] flex items-center gap-1 sm:justify-end">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Authorized Financial Seal</span>
              </div>
              <div className="text-[10px] text-[#777777]">No physical signature required</div>
            </div>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D4DCE6]">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-[#D4DCE6] text-[#333333] font-medium rounded-sm hover:bg-[#F5F7FA]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white font-bold rounded-sm border border-[#356F9D] flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
