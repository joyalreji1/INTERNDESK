import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  Building2,
  Search,
  AlertCircle,
} from 'lucide-react';

export const AdminCompaniesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const initialStatus = searchParams.get('status') || '';
  const initialQuery = searchParams.get('query') || '';

  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  // Verification Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [decisionStatus, setDecisionStatus] = useState<'VERIFIED' | 'REJECTED' | 'SUSPENDED'>('VERIFIED');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminCompanies(searchTerm || undefined, statusFilter || undefined, 0, 50);
      const list = res.content || res || [];
      setCompanies(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanies();
  };

  const handleOpenDecision = (company: any, decision: 'VERIFIED' | 'REJECTED' | 'SUSPENDED') => {
    setSelectedCompany(company);
    setDecisionStatus(decision);
    setRemarks('');
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleConfirmDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      await api.verifyCompany(
        selectedCompany.id,
        decisionStatus,
        remarks.trim() || undefined
      );
      setModalOpen(false);
      fetchCompanies();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update company verification status.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Employer Accreditation & Verification Desk
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Review corporate credentials, legal registration, and grant campus recruitment access
          </p>
        </div>
        <div className="text-xs text-[#FFF0CE] font-mono">
          Total Employers: <strong>{companies.length}</strong>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm p-3 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 flex gap-2">
            <input
              type="text"
              placeholder="Search by company name, industry, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D]"
            >
              Search
            </button>
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-[#D4DCE6] rounded-sm bg-white focus:border-[#4779B8] focus:outline-none"
            >
              <option value="">All Verification Statuses</option>
              <option value="PENDING">Pending Review (Action Required)</option>
              <option value="VERIFIED">Verified / Accredited</option>
              <option value="REJECTED">Rejected</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </form>
      </div>

      {/* Companies Data Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Company ID</th>
                <th>Organization Name</th>
                <th>Industry Sector</th>
                <th>Location</th>
                <th>Reg. / CIN</th>
                <th>Verification Status</th>
                <th>Accreditation Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#666666]">
                    Retrieving company verification records...
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#666666]">
                    No organization records match your filter criteria.
                  </td>
                </tr>
              ) : (
                companies.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono text-xs text-[#666666]">CMP-{String(c.id).padStart(4, '0')}</td>
                    <td className="font-bold text-[#356F9D]">{c.companyName}</td>
                    <td>{c.industry || 'Technology'}</td>
                    <td>{c.location || 'India'}</td>
                    <td className="font-mono text-xs">{c.registrationNumber || '-'}</td>
                    <td>
                      <StatusBadge status={c.verificationStatus} size="sm" />
                    </td>
                    <td className="space-x-1.5 whitespace-nowrap">
                      {c.verificationStatus !== 'VERIFIED' && (
                        <button
                          type="button"
                          onClick={() => handleOpenDecision(c, 'VERIFIED')}
                          className="px-2 py-0.5 bg-[#DDEED8] hover:bg-[#C9E4C2] text-[#285C2A] text-xs font-semibold rounded-sm border border-[#BFDDB7]"
                        >
                          Approve
                        </button>
                      )}

                      {c.verificationStatus === 'PENDING' && (
                        <button
                          type="button"
                          onClick={() => handleOpenDecision(c, 'REJECTED')}
                          className="px-2 py-0.5 bg-white hover:bg-[#FDE8E8] text-[#C94242] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
                        >
                          Reject
                        </button>
                      )}

                      {c.verificationStatus === 'VERIFIED' && (
                        <button
                          type="button"
                          onClick={() => handleOpenDecision(c, 'SUSPENDED')}
                          className="px-2 py-0.5 bg-white hover:bg-[#FDE8E8] text-[#C94242] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Modal */}
      {selectedCompany && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Accreditation Decision: ${selectedCompany.companyName}`}
          description={`Decision Action: ${decisionStatus}`}
          maxWidth="sm"
        >
          <form onSubmit={handleConfirmDecision} className="space-y-3">
            {errorMsg && (
              <div className="p-2 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="portal-label">Administrative Auditor Remarks</label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Document justification for approval, rejection, or suspension..."
                className="portal-input"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-[#D4DCE6]">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3 py-1.5 bg-white border border-[#D4DCE6] text-[#333333] text-xs font-medium rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-1.5 text-white text-xs font-bold rounded-sm disabled:opacity-50 ${
                  decisionStatus === 'VERIFIED'
                    ? 'bg-[#285C2A] hover:bg-[#1E4820] border border-[#1E4820]'
                    : 'bg-[#C94242] hover:bg-[#B33535] border border-[#A83232]'
                }`}
              >
                {submitting ? 'Recording...' : `Confirm ${decisionStatus}`}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
