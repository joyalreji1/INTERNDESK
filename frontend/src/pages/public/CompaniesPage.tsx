import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Company } from '@/types';
import { StatusBadge } from '@/components/common/Badge';
import { Building2, Search, MapPin, Globe, ChevronRight } from 'lucide-react';

export const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async (query?: string) => {
    setLoading(true);
    try {
      const res = await api.getCompanies({ query, size: 25 });
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
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanies(searchQuery.trim());
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Blue Header Strip */}
        <div className="bg-[#356F9D] text-white px-5 py-3 rounded-sm border-b border-[#28587E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-wide uppercase">
              Registered Employer Directory
            </h1>
            <p className="text-xs text-[#EAF2FC] mt-0.5">
              Verified corporate recruitment partners and industrial training providers
            </p>
          </div>
          <div className="text-xs text-[#FFF0CE] font-medium bg-[#28587E] px-2.5 py-1 rounded-sm border border-[#4779B8] self-start sm:self-auto">
            Total Organizations: <strong>{companies.length}</strong>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm p-4 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl">
            <input
              type="text"
              placeholder="Search companies by organization name, industry, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-[#D4DCE6] rounded-sm focus:border-[#4779B8] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-bold rounded-sm border border-[#356F9D] flex items-center gap-1 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Companies Table */}
        <div className="bg-white border border-[#D4DCE6] rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Reg. ID</th>
                  <th>Organization Name</th>
                  <th>Industry Sector</th>
                  <th>Headquarters / Location</th>
                  <th>Verification</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-[#666666]">
                      Loading employer directory...
                    </td>
                  </tr>
                ) : companies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-[#666666]">
                      No companies match your search criteria.
                    </td>
                  </tr>
                ) : (
                  companies.map((c) => (
                    <tr key={c.id}>
                      <td className="font-mono text-xs text-[#666666]">CMP-{String(c.id).padStart(4, '0')}</td>
                      <td className="font-bold text-[#356F9D]">
                        <Link to={`/companies/${c.id}`} className="hover:underline">
                          {c.companyName}
                        </Link>
                      </td>
                      <td>{c.industry || 'Technology'}</td>
                      <td>{c.city ? `${c.city}${c.state ? `, ${c.state}` : ''}` : 'Multiple Locations'}</td>
                      <td>
                        <StatusBadge status={c.verificationStatus} size="sm" />
                      </td>
                      <td>
                        <Link
                          to={`/companies/${c.id}`}
                          className="px-2.5 py-1 bg-[#4779B8] hover:bg-[#356F9D] text-white text-xs font-semibold rounded-sm border border-[#356F9D] inline-block"
                        >
                          View Profile
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
    </div>
  );
};
