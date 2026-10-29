import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Application } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  FileCheck,
  Search,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const StudentApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Withdraw Modal State
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.getMyApplications(0, 50);
      const list = res.content || res || [];
      setApplications(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdrawClick = (app: Application) => {
    setSelectedApp(app);
    setWithdrawReason('');
    setActionError(null);
    setWithdrawModalOpen(true);
  };

  const handleConfirmWithdraw = async () => {
    if (!selectedApp) return;
    setWithdrawing(true);
    setActionError(null);

    try {
      await api.updateApplicationStatus(selectedApp.id, {
        newStatus: 'WITHDRAWN',
        remarks: withdrawReason.trim() || 'Withdrawn by student candidate',
      });
      setWithdrawModalOpen(false);
      fetchApplications();
    } catch (err: any) {
      setActionError(err.message || 'Failed to withdraw application');
    } finally {
      setWithdrawing(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      !searchTerm ||
      app.internshipTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Submitted Internship Applications
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Track recruitment progress, employer review status, and decisions
          </p>
        </div>
        <div className="text-xs text-[#FFF0CE] font-mono">
          Total Applications: <strong>{applications.length}</strong>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm p-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <input
              type="text"
              placeholder="Search by internship title or company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-[#D4DCE6] rounded-sm bg-white focus:border-[#4779B8] focus:outline-none"
            >
              <option value="">All Application Statuses</option>
              <option value="APPLIED">Applied (Initial)</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW">Interview Round</option>
              <option value="SELECTED">Selected / Offered</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Internship Title</th>
                <th>Hiring Company</th>
                <th>Submission Date</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#666666]">
                    Loading application records...
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#666666]">
                    No application records match your filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id}>
                    <td className="font-mono text-xs text-[#666666]">APP-{String(app.id).padStart(4, '0')}</td>
                    <td className="font-semibold text-[#356F9D]">
                      <Link to={`/student/applications/${app.id}`} className="hover:underline">
                        {app.internshipTitle}
                      </Link>
                    </td>
                    <td className="font-medium">{app.companyName}</td>
                    <td className="text-xs text-[#555555]">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="space-x-2 whitespace-nowrap">
                      <Link
                        to={`/student/applications/${app.id}`}
                        className="px-2 py-0.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-medium rounded-sm border border-[#356F9D] inline-block"
                      >
                        Track Progress
                      </Link>

                      {app.status === 'APPLIED' && (
                        <button
                          type="button"
                          onClick={() => handleWithdrawClick(app)}
                          className="px-2 py-0.5 bg-white hover:bg-[#FDE8E8] text-[#C94242] text-xs font-medium rounded-sm border border-[#D4DCE6]"
                        >
                          Withdraw
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

      {/* Withdrawal Confirmation Modal */}
      <Modal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        title="Withdraw Internship Application"
        description={selectedApp ? `Application: ${selectedApp.internshipTitle} (${selectedApp.companyName})` : ''}
        maxWidth="sm"
      >
        <div className="space-y-3">
          <div className="p-3 bg-[#FFF0CE] border border-[#E6D3A3] text-[#855A00] text-xs rounded-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Are you sure you wish to withdraw this application? Once withdrawn, you cannot reopen this application.
            </span>
          </div>

          {actionError && (
            <div className="p-2 bg-[#FDE8E8] text-[#C94242] text-xs rounded-sm border border-[#F4B8B8]">
              {actionError}
            </div>
          )}

          <div>
            <label className="portal-label">Reason for Withdrawal (Optional)</label>
            <textarea
              rows={3}
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              placeholder="e.g. Accepted another offer, personal reasons..."
              className="portal-input"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#D4DCE6]">
            <button
              type="button"
              onClick={() => setWithdrawModalOpen(false)}
              className="px-3 py-1.5 bg-white border border-[#D4DCE6] text-[#333333] text-xs font-medium rounded-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmWithdraw}
              disabled={withdrawing}
              className="px-4 py-1.5 bg-[#C94242] hover:bg-[#B33535] text-white text-xs font-bold rounded-sm border border-[#A83232] disabled:opacity-50"
            >
              {withdrawing ? 'Withdrawing...' : 'Confirm Withdrawal'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
