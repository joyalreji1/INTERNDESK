import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Application } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  FileCheck,
  Search,
} from 'lucide-react';

export const AdminApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Details Modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminApplications(statusFilter || undefined, 0, 50);
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
  }, [statusFilter]);

  const filtered = applications.filter((app) => {
    const term = searchTerm.toLowerCase();
    return (
      !term ||
      app.studentName?.toLowerCase().includes(term) ||
      app.companyName?.toLowerCase().includes(term) ||
      app.internshipTitle?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Campus Internship Applications Ledger
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Complete institutional audit of all student applications submitted across departments
          </p>
        </div>
        <div className="text-xs text-[#FFF0CE] font-mono">
          Total Recorded: <strong>{applications.length}</strong>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm p-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <input
              type="text"
              placeholder="Search by student candidate name, hiring company, or position..."
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
              <option value="">All Application Stages</option>
              <option value="APPLIED">Applied</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW">Interview Round</option>
              <option value="SELECTED">Selected</option>
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
                <th>Student Candidate</th>
                <th>College / Department</th>
                <th>Internship Title</th>
                <th>Hiring Company</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#666666]">
                    Retrieving institutional application records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#666666]">
                    No application records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id}>
                    <td className="font-mono text-xs text-[#666666]">APP-{String(app.id).padStart(4, '0')}</td>
                    <td className="font-bold text-[#356F9D]">{app.studentName}</td>
                    <td>{app.studentCollege || 'Engineering College'} {app.studentDegree ? `(${app.studentDegree})` : ''}</td>
                    <td className="font-semibold text-[#333333]">{app.internshipTitle}</td>
                    <td>{app.companyName}</td>
                    <td className="text-xs text-[#555555]">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedApp(app)}
                        className="px-2 py-0.5 bg-white hover:bg-[#EAF2FC] text-[#4779B8] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Inspector Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application Docket: APP-${String(selectedApp.id).padStart(4, '0')}`}
          description={`Position: ${selectedApp.internshipTitle} (${selectedApp.companyName})`}
          maxWidth="md"
        >
          <div className="space-y-3">
            <table className="portal-table">
              <tbody>
                <tr>
                  <td className="w-1/3 font-bold bg-[#FAFCFF]">Candidate Name</td>
                  <td className="font-semibold text-[#356F9D]">{selectedApp.studentName}</td>
                </tr>
                <tr>
                  <td className="font-bold bg-[#FAFCFF]">Contact Email</td>
                  <td>{selectedApp.studentEmail}</td>
                </tr>
                <tr>
                  <td className="font-bold bg-[#FAFCFF]">College & Department</td>
                  <td>{selectedApp.studentCollege || 'Engineering College'} {selectedApp.studentDegree ? `(${selectedApp.studentDegree})` : ''}</td>
                </tr>
                <tr>
                  <td className="font-bold bg-[#FAFCFF]">Hiring Organization</td>
                  <td>{selectedApp.companyName}</td>
                </tr>
                <tr>
                  <td className="font-bold bg-[#FAFCFF]">Submission Date</td>
                  <td>{new Date(selectedApp.appliedAt).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="font-bold bg-[#FAFCFF]">Current Status</td>
                  <td>
                    <StatusBadge status={selectedApp.status} size="sm" />
                  </td>
                </tr>
                {selectedApp.resumeFilename && (
                  <tr>
                    <td className="font-bold bg-[#FAFCFF]">Attached PDF Resume</td>
                    <td className="font-mono text-xs text-[#356F9D] font-bold">
                      📄 {selectedApp.resumeFilename}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {selectedApp.coverLetter && (
              <div className="p-3 bg-[#FAFCFF] border border-[#D4DCE6] rounded-sm text-xs">
                <strong className="block text-[#356F9D] font-bold mb-1">
                  Applicant Statement:
                </strong>
                <p className="text-[#333333] whitespace-pre-line">{selectedApp.coverLetter}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D]"
              >
                Close Docket
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
