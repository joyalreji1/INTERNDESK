import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { History } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.getAdminAuditLogs(0, 50);
        const list = res.content || res || [];
        setLogs(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Administrative Audit Trail & Security Ledger
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Traceable log of administrative actions, company verification decisions, and status overrides
          </p>
        </div>
        <div className="text-xs text-[#FFF0CE] font-mono">
          Audit Entries: <strong>{logs.length}</strong>
        </div>
      </div>

      {/* Audit Log Data Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Timestamp</th>
                <th>Administrator</th>
                <th>Action Code</th>
                <th>Target Entity</th>
                <th>Description & Remarks</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#666666]">
                    Retrieving institutional audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#666666]">
                    No audit records recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td className="font-mono text-xs text-[#666666]">LOG-{String(log.id).padStart(4, '0')}</td>
                    <td className="text-xs text-[#555555] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="font-semibold text-[#333333]">
                      {log.adminName || 'System Administrator'}
                    </td>
                    <td>
                      <span className="font-mono text-xs px-2 py-0.5 bg-[#EAF2FC] text-[#356F9D] rounded-sm border border-[#B8C6D6]">
                        {log.actionType}
                      </span>
                    </td>
                    <td className="text-xs text-[#666666]">{log.entityType || '-'}</td>
                    <td className="text-xs text-[#333333]">{log.description || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
