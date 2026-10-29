import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { ResumeFile } from '@/types';
import {
  FileText,
  Upload,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const StudentResumePage: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchResumes = async () => {
    try {
      const data = await api.getResumes();
      setResumes(data || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMsg('Invalid file format. Only PDF format resumes (.pdf) are permitted.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 5MB maximum limit.');
      return;
    }

    setUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await api.uploadResume(file);
      setSuccessMsg('PDF Resume document uploaded and registered successfully.');
      fetchResumes();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload resume file.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSetPrimary = async (id: number) => {
    try {
      await api.setPrimaryResume(id);
      setSuccessMsg('Primary resume designation updated.');
      fetchResumes();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to set primary resume.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you wish to delete this resume document?')) return;
    try {
      await api.deleteResume(id);
      setSuccessMsg('Resume document removed successfully.');
      fetchResumes();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete resume.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#356F9D] text-white px-4 py-2.5 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm sm:text-base font-bold uppercase tracking-wide">
            Student Resume Documents Manager
          </h1>
          <p className="text-xs text-[#EAF2FC]">
            Upload and manage verified PDF resumes attached to your internship applications
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-[#DDEED8] border border-[#BFDDB7] text-[#285C2A] text-xs rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-xs rounded-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm space-y-3">
        <div className="text-xs font-bold text-[#356F9D] uppercase border-b border-[#D4DCE6] pb-1">
          Upload New PDF Resume
        </div>

        <div className="border-2 border-dashed border-[#D4DCE6] bg-[#FAFCFF] rounded-sm p-5 text-center space-y-2">
          <FileText className="w-8 h-8 text-[#4779B8] mx-auto" />
          <div className="text-xs font-semibold text-[#333333]">
            Select a PDF document from your computer (Maximum file size: 5MB)
          </div>
          <div className="text-[11px] text-[#666666]">
            Ensure the document contains your updated contact details, academic qualifications, and technical skills.
          </div>
          <div className="pt-2">
            <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D] cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Uploading File...' : 'Choose PDF File'}</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Uploaded Documents Table */}
      <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
          Registered Resume Documents ({resumes.length})
        </div>

        <div className="overflow-x-auto">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>File Size</th>
                <th>Upload Date</th>
                <th>Primary Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-[#666666]">
                    Loading registered documents...
                  </td>
                </tr>
              ) : resumes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-[#666666]">
                    No resume files uploaded yet. Please upload a PDF resume using the section above.
                  </td>
                </tr>
              ) : (
                resumes.map((r) => (
                  <tr key={r.id}>
                    <td className="font-semibold text-[#356F9D] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#4779B8] shrink-0" />
                      <span>{r.originalFilename}</span>
                    </td>
                    <td className="text-xs text-[#555555]">
                      {r.fileSize ? `${(r.fileSize / 1024).toFixed(1)} KB` : 'PDF'}
                    </td>
                    <td className="text-xs text-[#555555]">
                      {r.uploadedAt ? new Date(r.uploadedAt).toLocaleDateString() : 'Active'}
                    </td>
                    <td>
                      {r.isPrimary ? (
                        <span className="px-2 py-0.5 bg-[#DDEED8] text-[#285C2A] border border-[#BFDDB7] text-[11px] font-bold rounded-sm">
                          Primary Resume
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#888888]">Secondary</span>
                      )}
                    </td>
                    <td className="space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => api.downloadResume(r.id, r.originalFilename)}
                        className="px-2 py-0.5 bg-white hover:bg-[#EAF2FC] text-[#356F9D] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
                      >
                        Download
                      </button>
                      {!r.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(r.id)}
                          className="px-2 py-0.5 bg-white hover:bg-[#EAF2FC] text-[#4779B8] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
                        >
                          Set Primary
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="px-2 py-0.5 bg-white hover:bg-[#FDE8E8] text-[#C94242] text-xs font-semibold rounded-sm border border-[#D4DCE6]"
                      >
                        Delete
                      </button>
                    </td>
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
