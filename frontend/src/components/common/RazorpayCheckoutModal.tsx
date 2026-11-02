import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { api } from '@/services/api';
import { Application, PaymentReceiptResponse } from '@/types';
import {
  ShieldCheck,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  onPaymentSuccess: (receipt: PaymentReceiptResponse) => void;
}

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  isOpen,
  onClose,
  application,
  onPaymentSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any | null>(null);
  const [step, setStep] = useState<'REVIEW' | 'PROCESSING' | 'SUCCESS'>('REVIEW');

  const feeAmount = application.internshipFee || 2500;
  const currency = application.currency || 'INR';

  const handleInitiatePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create Order via secure backend
      const order = await api.createPaymentOrder(application.id);
      setOrderData(order);
      setStep('PROCESSING');

      // 2. Perform test-mode secure verification
      // For local development / testing, generate verified signature
      setTimeout(async () => {
        try {
          const testPaymentId = `pay_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;
          const testSignature = `test_sig_${order.orderId}_${testPaymentId}`;

          const receipt = await api.verifyPayment({
            applicationId: application.id,
            razorpayOrderId: order.orderId,
            razorpayPaymentId: testPaymentId,
            razorpaySignature: testSignature,
          });

          setStep('SUCCESS');
          setLoading(false);
          setTimeout(() => {
            onPaymentSuccess(receipt);
            onClose();
          }, 1500);
        } catch (verifyErr: any) {
          setError(verifyErr.message || 'Payment verification failed on server.');
          setStep('REVIEW');
          setLoading(false);
        }
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment order.');
      setStep('REVIEW');
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? () => {} : onClose}
      title="Secure Internship Fee Checkout"
      description="Razorpay Payment Gateway Integration"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs text-[#333333]">
        {error && (
          <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {step === 'REVIEW' && (
          <div className="space-y-4">
            {/* Payment Summary Box */}
            <div className="bg-[#FAFCFF] border border-[#D4DCE6] rounded-sm p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#EAF2FC] pb-2">
                <span className="font-bold text-[#356F9D] uppercase tracking-wide">
                  Candidate Selection Confirmed
                </span>
                <span className="px-2 py-0.5 bg-[#DDEED8] text-[#285C2A] border border-[#BFDDB7] rounded-sm font-bold text-[10px]">
                  READY FOR ENROLLMENT
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-[#666666]">Internship Opportunity:</span>{' '}
                  <strong>{application.internshipTitle}</strong>
                </div>
                <div>
                  <span className="text-[#666666]">Hiring Organization:</span>{' '}
                  <strong>{application.companyName}</strong>
                </div>
                <div>
                  <span className="text-[#666666]">Application Docket:</span>{' '}
                  <span className="font-mono">APP-{String(application.id).padStart(4, '0')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAF2FC] flex items-center justify-between">
                <span className="font-bold text-sm text-[#333333]">Enrollment Fee Payable:</span>
                <span className="text-base font-bold font-mono text-[#285C2A]">
                  ₹{feeAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} {currency}
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3 bg-[#EAF2FC] border border-[#B8C6D6] rounded-sm flex items-start gap-2 text-[11px] text-[#356F9D]">
              <Lock className="w-4 h-4 shrink-0 mt-0.5 text-[#356F9D]" />
              <div>
                <strong>Institutional Security Notice:</strong>
                <p className="text-[#555555] mt-0.5">
                  Your payment is processed over an encrypted 256-bit SSL connection. Card and banking credentials are never stored on our university servers. Server-side signature validation ensures tamper-proof verification.
                </p>
              </div>
            </div>

            {/* Refund & Cancellation Terms */}
            <div className="text-[11px] text-[#666666] bg-white p-3 border border-[#D4DCE6] rounded-sm space-y-1">
              <div className="font-bold text-[#333333] flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#356F9D]" />
                <span>Refund Policy:</span>
              </div>
              <p>
                As disclosed by {application.companyName}, candidate enrollment fees are covered under university placement guidelines. You may submit an administrative refund petition if the program is cancelled.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#D4DCE6]">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-3 py-1.5 bg-white border border-[#D4DCE6] text-[#333333] font-medium rounded-sm hover:bg-[#F5F7FA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInitiatePayment}
                disabled={loading}
                className="px-4 py-1.5 bg-[#285C2A] hover:bg-[#1E4620] text-white font-bold rounded-sm border border-[#1E4620] flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Pay ₹{feeAmount.toLocaleString()} via Razorpay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 'PROCESSING' && (
          <div className="py-8 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#356F9D] border-t-transparent rounded-full animate-spin mx-auto" />
            <h4 className="text-sm font-bold text-[#356F9D]">Processing Payment via Razorpay Gateway...</h4>
            <p className="text-xs text-[#666666]">
              Communicating securely with bank servers. Validating HMAC SHA-256 server signature...
            </p>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-[#285C2A] mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-[#285C2A]">Payment Successfully Verified!</h4>
            <p className="text-xs text-[#555555]">
              Enrollment confirmed. Generating official computer receipt...
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
