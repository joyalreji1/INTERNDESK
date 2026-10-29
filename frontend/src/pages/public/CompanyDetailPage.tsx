import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/common/Badge';
import { Building2, MapPin, Globe, ChevronLeft } from 'lucide-react';

export const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (!id) return;
        const data = await api.getCompany(Number(id));
        setCompany(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load company profile');
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-sm text-[#666666]">Loading employer profile...</div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-4 bg-[#FDE8E8] border border-[#F4B8B8] text-[#C94242] text-sm rounded-sm">
          {error || 'Company not found.'}
        </div>
        <div className="mt-4">
          <Link to="/companies" className="text-xs text-[#4779B8] font-bold hover:underline">
            &larr; Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const internships: any[] = company.internships || [];

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
        <div>
          <Link
            to="/companies"
            className="text-xs text-[#4779B8] font-semibold hover:underline inline-flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Employer Directory</span>
          </Link>
        </div>

        {/* Company Header Strip */}
        <div className="bg-[#356F9D] text-white px-5 py-4 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-xs text-[#FFF0CE] font-mono">CMP-{String(company.id).padStart(4, '0')}</div>
            <h1 className="text-xl font-bold tracking-wide mt-0.5">{company.companyName}</h1>
            <p className="text-xs text-[#EAF2FC] mt-0.5">{company.tagline || company.industry}</p>
          </div>
          <div>
            <StatusBadge status={company.verificationStatus} size="md" />
          </div>
        </div>

        {/* Organization Facts Table */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#EAF2FC] text-[#356F9D] px-4 py-2 text-xs font-bold uppercase border-b border-[#D4DCE6]">
            Organization Profile & Information
          </div>
          <table className="portal-table">
            <tbody>
              <tr>
                <td className="w-1/4 font-bold bg-[#FAFCFF]">Industry Sector</td>
                <td className="w-1/4">{company.industry || 'Information Technology'}</td>
                <td className="w-1/4 font-bold bg-[#FAFCFF]">Location</td>
                <td className="w-1/4">{company.location || 'Not Specified'}</td>
              </tr>
              <tr>
                <td className="font-bold bg-[#FAFCFF]">Organization Size</td>
                <td>{company.companySize ? company.companySize.replace(/_/g, ' ') : 'Mid-Sized'}</td>
                <td className="font-bold bg-[#FAFCFF]">Official Website</td>
                <td>
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4779B8] hover:underline"
                    >
                      {company.website}
                    </a>
                  ) : (
                    'Not Provided'
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {company.description && (
            <div className="p-4 border-t border-[#D4DCE6] text-xs text-[#333333] leading-relaxed">
              <strong className="block text-xs font-bold text-[#356F9D] mb-1">Company Overview:</strong>
              {company.description}
            </div>
          )}
        </div>

        {/* Active Internship Postings by Company */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#356F9D] text-white px-4 py-2 text-xs font-bold uppercase border-b border-[#28587E]">
            Active Internship Postings ({internships.length})
          </div>

          <table className="portal-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Work Mode</th>
                <th>Stipend</th>
                <th>Duration</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {internships.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-[#666666]">
                    No active internship postings currently listed by this organization.
                  </td>
                </tr>
              ) : (
                internships.map((int: any) => (
                  <tr key={int.id}>
                    <td className="font-bold text-[#356F9D]">
                      <Link to={`/internships/${int.id}`} className="hover:underline">
                        {int.title}
                      </Link>
                    </td>
                    <td>{int.location}</td>
                    <td>
                      <StatusBadge status={int.workMode} size="sm" />
                    </td>
                    <td className="font-semibold text-[#285C2A]">
                      {int.stipendAmount ? `₹${int.stipendAmount.toLocaleString()}/mo` : 'Unpaid'}
                    </td>
                    <td>{int.durationMonths} Months</td>
                    <td>
                      <Link
                        to={`/internships/${int.id}`}
                        className="px-2 py-1 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-medium rounded-sm border border-[#356F9D] inline-block"
                      >
                        Details
                      </Link>
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
