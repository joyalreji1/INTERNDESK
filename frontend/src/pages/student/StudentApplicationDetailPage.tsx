import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Application, ApplicationStatusHistory } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
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
} from 'lucide-react';

export const StudentApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [history, setHistory] = useState<ApplicationStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!id) return;
        const [appData, historyData] = await Promise.all([
          api.getApplication(Number(id)),
          api.getApplicationHistory(Number(id)),
        ]);
        setApp(appData);
        setHistory(Array.isArray(historyData) ? historyData : []);
      } catch (err: any) {
        setError(err.message || 'Failed to load application details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

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

  const steps = [
    { key: 'APPLIED', label: '1. Applied' },
    { key: 'UNDER_REVIEW', label: '2. Under Review' },
    { key: 'SHORTLISTED', label: '3. Shortlisted' },
    { key: 'INTERVIEW', label: '4. Interview' },
    { key: 'SELECTED', label: '5. Selected' },
  ];

  const currentStepIdx = steps.findIndex((s) => s.key === app.status);
  const isTerminal = ['REJECTED', 'WITHDRAWN'].includes(app.status);

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
          <div className="text-[11px] text-[#FFF0CE] font-mono">
            Application Docket: APP-{String(app.id).padStart(4, '0')}
          </div>
          <h1 className="text-base font-bold tracking-wide mt-0.5">
            {app.internshipTitle}
          </h1>
          <p className="text-xs text-[#EAF2FC] mt-0.5">
            Employer: <strong>{app.companyName}</strong> • Submitted:{' '}
            {new Date(app.appliedAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <StatusBadge status={app.status} size="md" />
        </div>
      </div>

      {/* 5-Stage Recruitment Progress Bar */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm">
        <div className="text-xs font-bold text-[#356F9D] uppercase tracking-wide border-b border-[#D4DCE6] pb-2 mb-4">
          Recruitment Workflow Pipeline
        </div>

        {isTerminal ? (
          <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm">
            Current Application Status:{' '}
            <strong>{app.status === 'WITHDRAWN' ? 'Withdrawn by Student' : 'Application Not Selected'}</strong>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-1 text-center">
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
              <td>{app.studentDegree || 'B.Tech'} (CSE)</td>
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
              <td className="font-bold bg-[#FAFCFF]">Current Status</td>
              <td>
                <StatusBadge status={app.status} size="sm" />
              </td>
            </tr>
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
    </div>
  );
};
